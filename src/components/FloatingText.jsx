import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** Build a regular 6-point star polygon (12 vertices: outer/inner alternating) in a 0..100 space */
function buildStarVertices({
  cx = 50,
  cy = 50,
  outerR = 42,
  innerR = 18,
  points = 6,
  startAngle = -Math.PI / 2,
}) {
  const verts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = startAngle + (i * Math.PI) / points;
    verts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  return verts;
}

/** Evenly sample N points along a closed polyline (polygon) */
function sampleAlongClosedPolyline(vertices, count) {
  if (!vertices?.length || count <= 0) return [];

  const segs = [];
  let total = 0;
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % vertices.length];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    segs.push({ a, b, len });
    total += len;
  }
  if (total === 0) return Array.from({ length: count }, () => ({ x: 50, y: 50 }));

  const step = total / count;
  const pts = [];

  let segIndex = 0;
  let segStartDist = 0;

  for (let k = 0; k < count; k++) {
    const target = k * step;

    while (segStartDist + segs[segIndex].len < target) {
      segStartDist += segs[segIndex].len;
      segIndex = (segIndex + 1) % segs.length;
    }

    const seg = segs[segIndex];
    const t = seg.len === 0 ? 0 : (target - segStartDist) / seg.len;

    pts.push({
      x: seg.a.x + (seg.b.x - seg.a.x) * t,
      y: seg.a.y + (seg.b.y - seg.a.y) * t,
    });
  }

  return pts;
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const FloatingText = () => {
  const [spinning, setSpinning] = useState({});
  const [globalSpin, setGlobalSpin] = useState(false);

  const [revealed, setRevealed] = useState({});
  const [revealOrder, setRevealOrder] = useState([]);
  const [hovered, setHovered] = useState({});

  const [rollTick, setRollTick] = useState({});
  const [mapping, setMapping] = useState(false);
  const [cosmicBurst, setCosmicBurst] = useState(false);

  // layout toggle (orbit <-> star)
  const [aligned, setAligned] = useState(false);

  // ✅ Black hole physics mode flags
  const [holeMode, setHoleMode] = useState(false);        // currently sucked in / held in hole
  const [holeEjecting, setHoleEjecting] = useState(false); // spring-ejecting back to layout

  // internal refs
  const containerRef = useRef(null);
  const timeoutsRef = useRef([]);
  const mappingRef = useRef(false);
  const clickTimerRef = useRef(null);

  // RAF physics
  const rafRef = useRef(null);
  const lastTsRef = useRef(0);
  const wheelLockRef = useRef(false);

  // physics state in ref (avoid huge state churn)
  const physRef = useRef({}); // { [text]: {x,y,vx,vy, opacity, scale, sx, sy, rotDeg, r} }
  const ejectTargetsRef = useRef(null); // { [text]: {x,y} }
  const [physFrame, setPhysFrame] = useState(0);
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    const onResize = () => {
      setViewport({
        width: window.innerWidth || 1280,
        height: window.innerHeight || 720,
      });
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  const bumpRoll = (text) => {
    setRollTick((prev) => ({ ...prev, [text]: (prev[text] || 0) + 1 }));
  };

  const tokenCodes = useMemo(
    () => ({
      ABSOL_X: [194, 1019, 205],
      "User ID: 1234 | Danushka": [2329, 4071, 3902, 2667],
      Sripadaha: [11460, 1007],
      Wallet: [3776, 3665],
      Fortis: [7911, 8121],
      "10/10/2025": [11306, 12208, 11295],
      "Lord Buddha": [2891, 3389, 3255, 3634],
      Soul: [10427],
      "12345678": [1499, 1924],
      Hella: [11225],
      "Quantum Bayesianism": [6168, 7112, 6918, 7466],
      Intentionality: [24, 3460, 200],
      "User ID: 1234": [1976, 2685],
      "f1=f2": [5093],
      Singularity: [10724, 11004, 10116],
      "Event Horizon": [4023, 7215, 3529],
      Spacetime: [10146, 9155, 9633],
      "Gravity Well": [4145, 5141],
    }),
    []
  );

  const allTexts = useMemo(() => Object.keys(tokenCodes), [tokenCodes]);

  const layoutConfig = useMemo(() => {
    const w = viewport.width;
    const h = viewport.height;
    const shortH = h < 700;

    if (w < 420) {
      return {
        orbitRadiusX: 20,
        orbitRadiusY: shortH ? 23 : 25,
        starOuterR: 28,
        starInnerR: 10,
        edgeX: 24,
        edgeYTop: 12,
        edgeYBottom: 10,
      };
    }

    if (w < 640) {
      return {
        orbitRadiusX: 25,
        orbitRadiusY: shortH ? 28 : 30,
        starOuterR: 31,
        starInnerR: 12,
        edgeX: 18,
        edgeYTop: 11,
        edgeYBottom: 9,
      };
    }

    if (w < 1024) {
      return {
        orbitRadiusX: 30,
        orbitRadiusY: 33,
        starOuterR: 37,
        starInnerR: 16,
        edgeX: 13,
        edgeYTop: 9,
        edgeYBottom: 8,
      };
    }

    return {
      orbitRadiusX: 35,
      orbitRadiusY: 35,
      starOuterR: 42,
      starInnerR: 18,
      edgeX: 10,
      edgeYTop: 8,
      edgeYBottom: 7,
    };
  }, [viewport.width, viewport.height]);

  const clampLayoutPositions = useCallback(
    (positions) => {
      const minX = layoutConfig.edgeX;
      const maxX = 100 - layoutConfig.edgeX;
      const minY = layoutConfig.edgeYTop;
      const maxY = 100 - layoutConfig.edgeYBottom;

      return positions.map((item) => {
        const x = clamp(parseFloat(item.left), minX, maxX);
        const y = clamp(parseFloat(item.top), minY, maxY);
        return {
          ...item,
          left: `${x}%`,
          top: `${y}%`,
        };
      });
    },
    [layoutConfig]
  );

  // ---------------------------
  // LAYOUTS
  // ---------------------------

  // Orbit layout (circle)
  const orbitPositions = useMemo(() => {
    const points = allTexts.map((text, index) => {
      const angle = (index / allTexts.length) * Math.PI * 2 - Math.PI / 2;
      const x = 50 + layoutConfig.orbitRadiusX * Math.cos(angle);
      const y = 50 + layoutConfig.orbitRadiusY * Math.sin(angle);
      return { text, left: `${x}%`, top: `${y}%`, delay: `${index * 0.01}s` };
    });
    return clampLayoutPositions(points);
  }, [allTexts, clampLayoutPositions, layoutConfig.orbitRadiusX, layoutConfig.orbitRadiusY]);

  const starVertices = useMemo(() => {
    return buildStarVertices({
      cx: 50,
      cy: 50,
      outerR: layoutConfig.starOuterR,
      innerR: layoutConfig.starInnerR,
      points: 6,
      startAngle: -Math.PI / 2,
    });
  }, [layoutConfig.starInnerR, layoutConfig.starOuterR]);

  const starPositions = useMemo(() => {
    const pts = sampleAlongClosedPolyline(starVertices, allTexts.length);
    const points = allTexts.map((text, i) => ({
      text,
      left: `${pts[i].x}%`,
      top: `${pts[i].y}%`,
      delay: `${i * 0.01}s`,
    }));
    return clampLayoutPositions(points);
  }, [allTexts, clampLayoutPositions, starVertices]);

  // Active *layout* (not physics)
  const layoutPositions = useMemo(
    () => (aligned ? starPositions : orbitPositions),
    [aligned, starPositions, orbitPositions]
  );

  // Star polygon points for clickable hit area
  const starPointsStr = useMemo(
    () => starVertices.map((p) => `${p.x},${p.y}`).join(" "),
    [starVertices]
  );

  const allRevealed = useMemo(() => {
    const keys = Object.keys(tokenCodes);
    return keys.every((k) => revealed[k]);
  }, [revealed, tokenCodes]);

  const labelFor = useCallback(
    (text) => {
      const hasToken = !!tokenCodes[text];
      if (!hasToken) return text;
      if (revealed[text] || hovered[text]) return text;
      return tokenCodes[text].join(", ");
    },
    [hovered, revealed, tokenCodes]
  );

  // ---------------------------
  // REVEAL LINES ITEMS (use layout positions only)
  // ---------------------------
  const revealedItems = useMemo(() => {
    const map = new Map(layoutPositions.map((s) => [s.text, s]));
    return revealOrder
      .filter((t) => revealed[t])
      .map((t) => map.get(t))
      .filter(Boolean);
  }, [revealOrder, revealed, layoutPositions]);

  // ---------------------------
  // CLICK mapping logic (unchanged, but uses layoutPositions)
  // ---------------------------
  const startConstellationMapping = useCallback(() => {
    if (mappingRef.current) return;
    if (allRevealed) return;

    // avoid mixing mapping with hole physics
    if (holeMode || holeEjecting) return;

    mappingRef.current = true;
    setMapping(true);
    setCosmicBurst(true);
    setGlobalSpin(true);

    timeoutsRef.current.push(setTimeout(() => setGlobalSpin(false), 650));
    timeoutsRef.current.push(setTimeout(() => setCosmicBurst(false), 5200));

    const totalMs = 5000;
    const stepMs = Math.max(70, Math.floor(totalMs / layoutPositions.length));

    layoutPositions.forEach((item, idx) => {
      timeoutsRef.current.push(
        setTimeout(() => {
          setRevealed((prev) => ({ ...prev, [item.text]: true }));
          setRevealOrder((prev) => (prev.includes(item.text) ? prev : [...prev, item.text]));
          bumpRoll(item.text);

          const k = `pulse-${item.text}`;
          setSpinning((prev) => ({ ...prev, [k]: true }));
          timeoutsRef.current.push(
            setTimeout(() => setSpinning((prev) => ({ ...prev, [k]: false })), 460)
          );
        }, idx * stepMs)
      );
    });

    timeoutsRef.current.push(
      setTimeout(() => {
        setMapping(false);
        mappingRef.current = false;
      }, totalMs + 600)
    );
  }, [allRevealed, layoutPositions, holeMode, holeEjecting]);

  const reverseToNormal = useCallback(() => {
    if (mappingRef.current) return;
    if (holeMode || holeEjecting) return;

    mappingRef.current = true;

    clearAllTimeouts();

    setMapping(true);
    setCosmicBurst(true);

    const totalMs = 1400;
    const order = [...revealOrder].reverse();
    const stepMs = Math.max(50, Math.floor(totalMs / Math.max(1, order.length)));

    order.forEach((text, idx) => {
      timeoutsRef.current.push(
        setTimeout(() => {
          setRevealed((prev) => ({ ...prev, [text]: false }));
          bumpRoll(text);
        }, idx * stepMs)
      );
    });

    timeoutsRef.current.push(
      setTimeout(() => {
        setRevealOrder([]);
        setHovered({});
        setSpinning({});
        setGlobalSpin(false);
        setCosmicBurst(false);
        setMapping(false);
        mappingRef.current = false;
      }, totalMs + 500)
    );
  }, [revealOrder, holeMode, holeEjecting]);

  // Single click aligns to star + maps
  const handleSingleClick = () => {
    if (holeMode || holeEjecting) return;

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    setAligned(true);

    clickTimerRef.current = setTimeout(() => {
      startConstellationMapping();
      clickTimerRef.current = null;
    }, 220);
  };

  // Double click returns to orbit + reverse
  const handleDoubleClick = (e) => {
    if (holeMode || holeEjecting) return;

    e.preventDefault();
    e.stopPropagation();
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    setAligned(false);
    reverseToNormal();
  };

  // ---------------------------
  // PHYSICS: helpers
  // ---------------------------

  const parseLayoutToNumeric = useCallback((arr) => {
    // arr: [{text,left:"45%",top:"55%"}]
    const m = {};
    arr.forEach((it) => {
      m[it.text] = { x: parseFloat(it.left), y: parseFloat(it.top) };
    });
    return m;
  }, []);

  const stopRaf = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTsRef.current = 0;
  }, []);

  const physicsActive = holeMode || holeEjecting;

  // render positions from physics ref (updates each frame)
  const physicsPositions = useMemo(() => {
    const m = physRef.current;
    return allTexts.map((text, i) => {
      const p = m[text] || {
        x: 50,
        y: 50,
        r: 0,
        opacity: 0,
        scale: 0.12,
        sx: 0.12,
        sy: 0.12,
        rotDeg: 0,
      };
      return {
        text,
        left: `${p.x}%`,
        top: `${p.y}%`,
        delay: `${i * 0.01}s`,
        _r: p.r,
        _opacity: p.opacity,
        _scale: p.scale,
        _sx: p.sx,
        _sy: p.sy,
        _rotDeg: p.rotDeg,
      };
    });
  }, [allTexts, physFrame]);

  // final positions used for rendering nodes
  const displayPositions = useMemo(() => {
    return physicsActive ? physicsPositions : layoutPositions;
  }, [physicsActive, physicsPositions, layoutPositions]);

  // ---------------------------
  // PHYSICS: "BLACK HOLE" MODEL
  // ---------------------------

  /**
   * We'll treat the center (50,50) as the black hole.
   * - Gravity: a = mu / r^2 towards center
   * - Swirl: tiny tangential acceleration to get a spiral (angular momentum)
   * - Damping: prevents infinite oscillations
   * - Event horizon: r < Rs -> clamp to center, fade out, "captured"
   */

  const enterHole = useCallback(() => {
    if (mappingRef.current) return;
    if (holeMode) return;

    // stop any eject and restart
    setHoleEjecting(false);
    stopRaf();

    // show black hole VFX
    setCosmicBurst(true);

    // init physics positions from CURRENT layout positions
    const layoutMap = parseLayoutToNumeric(layoutPositions);
    const m = {};
    const cx = 50;
    const cy = 50;

    allTexts.forEach((text, i) => {
      const pos = layoutMap[text] || { x: 50, y: 50 };
      const dx = pos.x - cx;
      const dy = pos.y - cy;
      const r = Math.hypot(dx, dy) + 0.0001;

      // initial tangential velocity for spiral:
      // v is perpendicular to radius vector -> (-dy, dx)
      const tnx = -dy / r;
      const tny = dx / r;

      const v0 = 24 + i * 0.6; // base speed (tweak)
      const dir = i % 2 === 0 ? 1 : -1; // alternate swirl direction slightly
      const vx = tnx * v0 * dir;
      const vy = tny * v0 * dir;

      m[text] = {
        x: pos.x,
        y: pos.y,
        vx,
        vy,
        r,
        opacity: 1,
        scale: 1,
        sx: 1,
        sy: 1,
        rotDeg: 0,
      };
    });

    physRef.current = m;

    setHoleMode(true);

    // start RAF loop in "suck" mode
    const Rs = 2.7;      // event horizon radius (0..100 coords)
    const mu = 1400;     // gravity strength (bigger = stronger pull)
    const swirl = 90;    // tangential acceleration factor
    const damping = 1.35; // velocity damping

    const step = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = clamp((ts - lastTsRef.current) / 1000, 0.001, 0.03); // seconds
      lastTsRef.current = ts;

      const map = physRef.current;
      let capturedCount = 0;

      for (const text of allTexts) {
        const p = map[text];
        if (!p) continue;

        const dx = cx - p.x;
        const dy = cy - p.y;
        const r = Math.hypot(dx, dy) + 0.0001;

        // inside event horizon => captured
        if (r < Rs) {
          p.x = cx;
          p.y = cy;
          p.vx = 0;
          p.vy = 0;
          p.r = r;
          p.opacity = 0;
          p.scale = 0.12;
          p.sx = 0.08;
          p.sy = 0.18;
          p.rotDeg = 0;
          capturedCount++;
          continue;
        }

        const nx = dx / r;
        const ny = dy / r;

        // gravity acceleration
        const a = mu / (r * r);

        // tangential (swirl) acceleration (perpendicular)
        const tx = -ny;
        const ty = nx;

        // apply accelerations
        const ax = a * nx + (swirl / (r + 6)) * tx;
        const ay = a * ny + (swirl / (r + 6)) * ty;

        p.vx += ax * dt;
        p.vy += ay * dt;

        // damping (like accretion disk drag)
        const damp = Math.exp(-damping * dt);
        p.vx *= damp;
        p.vy *= damp;

        // integrate
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // visuals: spaghettification near horizon
        p.r = r;
        const fade = clamp((r - Rs) / 7.5, 0, 1);
        const scale = clamp(0.12 + (r / 35) * 0.95, 0.12, 1);
        const stretch = clamp(1 + (Rs + 2.2 - r) / 6, 1, 1.32);

        // rotate text so stretch axis feels radial
        const angle = Math.atan2(p.y - cy, p.x - cx);
        p.rotDeg = (angle * 180) / Math.PI + 90;

        p.opacity = fade;
        p.scale = scale * 0.92;

        // stretch along "radial" axis (after rotate)
        p.sx = p.scale * (1 / stretch);
        p.sy = p.scale * stretch;
      }

      // rerender
      setPhysFrame((f) => f + 1);

      // stop once all captured (optional)
      if (capturedCount === allTexts.length) {
        stopRaf();
        // hold the blackhole visible while in holeMode (user can scroll up)
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [allTexts, holeMode, layoutPositions, parseLayoutToNumeric, stopRaf]);

  const exitHole = useCallback(() => {
    if (mappingRef.current) return;
    if (!holeMode && !holeEjecting) return;

    // stop suck loop if running
    stopRaf();

    setHoleMode(false);
    setHoleEjecting(true);

    // compute targets from CURRENT layout (star or orbit)
    ejectTargetsRef.current = parseLayoutToNumeric(layoutPositions);

    const cx = 50;
    const cy = 50;

    // if physics map empty, init from center
    const map = physRef.current || {};
    if (!Object.keys(map).length) {
      const init = {};
      allTexts.forEach((t) => {
        init[t] = { x: cx, y: cy, vx: 0, vy: 0, r: 0, opacity: 0, scale: 0.12, sx: 0.12, sy: 0.12, rotDeg: 0 };
      });
      physRef.current = init;
    }

    // spring parameters (ejection)
    const k = 42;       // spring stiffness
    const c = 10.5;     // damping
    const boost = 26;   // outward impulse

    // give a little initial outward impulse so it "pops" out of hole
    const cur = physRef.current;
    for (const text of allTexts) {
      const p = cur[text];
      const target = ejectTargetsRef.current?.[text] || { x: cx, y: cy };
      const dx = target.x - cx;
      const dy = target.y - cy;
      const r = Math.hypot(dx, dy) + 0.0001;
      const nx = dx / r;
      const ny = dy / r;
      p.vx += nx * boost;
      p.vy += ny * boost;
      p.opacity = 0;
    }

    const step = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = clamp((ts - lastTsRef.current) / 1000, 0.001, 0.03);
      lastTsRef.current = ts;

      const targets = ejectTargetsRef.current || {};
      const map2 = physRef.current;

      let maxDist = 0;
      let maxSpeed = 0;

      for (const text of allTexts) {
        const p = map2[text];
        if (!p) continue;

        const t = targets[text] || { x: cx, y: cy };

        const dx = t.x - p.x;
        const dy = t.y - p.y;

        // spring force + velocity damping
        const ax = k * dx - c * p.vx;
        const ay = k * dy - c * p.vy;

        p.vx += ax * dt;
        p.vy += ay * dt;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const r = Math.hypot(cx - p.x, cy - p.y);
        p.r = r;

        // fade in quickly as it leaves horizon
        const Rs = 2.7;
        const fade = clamp((r - Rs) / 6.5, 0, 1);
        p.opacity = fade;

        // scale back to normal
        const scale = clamp(0.12 + (Math.hypot(dx, dy) / 35) * 0.95, 0.12, 1);
        p.scale = scale;
        p.sx = scale;
        p.sy = scale;
        p.rotDeg = 0;

        maxDist = Math.max(maxDist, Math.hypot(dx, dy));
        maxSpeed = Math.max(maxSpeed, Math.hypot(p.vx, p.vy));
      }

      setPhysFrame((f) => f + 1);

      // stop when settled
      if (maxDist < 0.22 && maxSpeed < 0.25) {
        stopRaf();
        setHoleEjecting(false);

        // fade out blackhole VFX after eject finished (unless mapping starts)
        timeoutsRef.current.push(
          setTimeout(() => {
            if (!mappingRef.current) setCosmicBurst(false);
          }, 250)
        );

        return;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [allTexts, holeMode, holeEjecting, layoutPositions, parseLayoutToNumeric, stopRaf]);

  // ---------------------------
  // Wheel listener (mouse scroll effect) - disabled
  // ---------------------------
  /*
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      // block page scroll while interacting with this layer
      if (e.ctrlKey) return; // allow pinch-zoom
      e.preventDefault();
      e.stopPropagation();

      if (mappingRef.current) return;

      // small cooldown to avoid trackpad jitter toggling repeatedly
      if (wheelLockRef.current) return;
      wheelLockRef.current = true;
      timeoutsRef.current.push(setTimeout(() => (wheelLockRef.current = false), 160));

      if (e.deltaY > 0) {
        // scroll down -> enter hole
        enterHole();
      } else if (e.deltaY < 0) {
        // scroll up -> exit hole
        exitHole();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [enterHole, exitHole]);
  */

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRaf();
      clearAllTimeouts();
    };
  }, [stopRaf]);

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 font-elios pointer-events-auto floating-root"
      style={{ userSelect: "none", overscrollBehavior: "none" }}
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Blackhole VFX */}
      {(cosmicBurst || mapping || holeMode || holeEjecting) && (
        <div className={`blackhole-wrap ${holeMode ? "hold" : ""}`}>
          <div className="blackhole" />
          <div className="orbit-dots">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="dot" style={{ "--i": i }} />
            ))}
          </div>
        </div>
      )}

      <div className={`heaven-rays ${(cosmicBurst || mapping || holeMode || holeEjecting) ? "on" : ""}`} />

      {/* Clickable star hit area */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        style={{ pointerEvents: "none" }}
      >
        <polygon
          points={starPointsStr}
          fill="transparent"
          stroke="transparent"
          strokeWidth="10"
          style={{ pointerEvents: "stroke", cursor: holeMode || holeEjecting ? "default" : "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            handleSingleClick();
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            handleDoubleClick(e);
          }}
        />
      </svg>

      {/* Lines: hide while physics is active (looks cleaner) */}
      {!physicsActive && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="heavenStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.72)" />
              <stop offset="60%" stopColor="rgba(210,225,255,0.62)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.86)" />
            </linearGradient>

            <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {revealedItems.map((item, idx) => (
            <line
              key={`line-${item.text}`}
              x1="50%"
              y1="50%"
              x2={item.left}
              y2={item.top}
              className="connection-line"
              style={{ animationDelay: `${idx * 0.08}s` }}
              stroke="url(#heavenStroke)"
              filter="url(#softGlow)"
            />
          ))}

          {(cosmicBurst || mapping) && <circle cx="50%" cy="50%" r="2.2" className="center-spark" />}
        </svg>
      )}

      {/* Text nodes */}
      {displayPositions.map((item) => {
        const pulseKey = `pulse-${item.text}`;
        const hasToken = !!tokenCodes[item.text];
        const isBright = !!revealed[item.text] || !!hovered[item.text];
        const label = labelFor(item.text);

        // physics visuals (if active)
        const physOpacity = item._opacity ?? 1;
        const sx = item._sx ?? 1;
        const sy = item._sy ?? 1;
        const rotDeg = item._rotDeg ?? 0;

        const disableInteractions = physicsActive || holeMode || holeEjecting;

        const animation =
          physicsActive
            ? "none"
            : `starFloat 3.2s ease-in-out infinite${
                spinning[pulseKey] || globalSpin ? ", clickSpin 0.6s ease" : ""
              }`;

        const transform = physicsActive
          ? `translate(-50%, -50%) rotate(${rotDeg}deg) scaleX(${sx}) scaleY(${sy})`
          : "translate(-50%, -50%)";

        return (
          <div
            key={item.text}
            className="absolute pointer-events-auto cursor-pointer select-none"
            style={{
              left: item.left,
              top: item.top,
              transform,

              // layout snap motion (only when not physics)
              transition: physicsActive
                ? "none"
                : "left 900ms cubic-bezier(.2,.8,.2,1), top 900ms cubic-bezier(.2,.8,.2,1)",

              fontSize: "var(--label-size)",
              color: isBright ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)",
              textShadow: isBright
                ? "0 0 10px rgba(220,230,255,0.45)"
                : "0 0 4px rgba(120,160,255,0.18)",

              animation,
              animationDelay: item.delay,
              letterSpacing: hasToken && !isBright ? "var(--label-letter-wide)" : "var(--label-letter)",
              wordSpacing: hasToken && !isBright ? "var(--label-word-wide)" : "var(--label-word)",
              padding: "var(--label-pad-y) var(--label-pad-x)",
              whiteSpace: "nowrap",
              borderRadius: "999px",
              background: isBright ? "rgba(255,255,255,0.06)" : "transparent",
              boxShadow: isBright ? "0 0 18px rgba(220,230,255,0.10)" : "none",
              backdropFilter: isBright ? "blur(2px)" : "none",

              // physics fade
              opacity: physicsActive ? physOpacity : undefined,

              // disable pointer while physics active (so scroll interaction stays clean)
              pointerEvents: disableInteractions ? "none" : "auto",
            }}
            onMouseEnter={(e) => {
              e.stopPropagation();
              if (tokenCodes[item.text]) {
                setHovered((prev) => ({ ...prev, [item.text]: true }));
                bumpRoll(item.text);
              }
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              if (tokenCodes[item.text]) {
                setHovered((prev) => ({ ...prev, [item.text]: false }));
                bumpRoll(item.text);
              }
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();

              setRevealed((prev) => ({ ...prev, [item.text]: true }));
              setRevealOrder((prev) => (prev.includes(item.text) ? prev : [...prev, item.text]));
              bumpRoll(item.text);

              setCosmicBurst(true);
              setSpinning((prev) => ({ ...prev, [pulseKey]: true }));
              timeoutsRef.current.push(
                setTimeout(() => setSpinning((prev) => ({ ...prev, [pulseKey]: false })), 460)
              );
              timeoutsRef.current.push(setTimeout(() => setCosmicBurst(false), 900));
            }}
            role="button"
            aria-pressed={!!revealed[item.text]}
            aria-label={item.text}
          >
            <span
              key={`${item.text}-${rollTick[item.text] || 0}`}
              className={`clickable-text roll ${spinning[pulseKey] ? "spinning" : ""}`}
            >
              {label}
            </span>
          </div>
        );
      })}

      <style>{`
        .floating-root{
          --bh-size: clamp(240px, 54vw, 520px);
          --dot-size: clamp(2px, 0.45vw, 3px);
          --orbit-start: clamp(24px, 4.2vw, 38px);
          --orbit-end: clamp(120px, 22vw, 220px);
          --label-size: clamp(7px, 1.1vw, 9px);
          --label-pad-x: clamp(4px, 1.2vw, 8px);
          --label-pad-y: clamp(2px, 0.8vw, 4px);
          --label-letter: clamp(0.24em, 0.32vw, 0.32em);
          --label-letter-wide: clamp(0.36em, 0.5vw, 0.48em);
          --label-word: clamp(0.35em, 0.55vw, 0.45em);
          --label-word-wide: clamp(0.55em, 0.8vw, 0.7em);
          --line-width: clamp(1px, 0.2vw, 1.65px);
        }

        @media (max-width: 640px) {
          .floating-root{
            --bh-size: clamp(200px, 70vw, 420px);
            --orbit-end: clamp(90px, 26vw, 180px);
            --label-size: clamp(6px, 1.9vw, 8px);
            --label-pad-x: clamp(3px, 0.95vw, 6px);
            --label-pad-y: clamp(2px, 0.6vw, 3px);
            --label-letter: clamp(0.12em, 0.24vw, 0.2em);
            --label-letter-wide: clamp(0.2em, 0.34vw, 0.3em);
            --label-word: clamp(0.16em, 0.28vw, 0.24em);
            --label-word-wide: clamp(0.26em, 0.42vw, 0.36em);
          }
        }

        @media (max-width: 420px) {
          .floating-root{
            --label-size: clamp(5px, 1.7vw, 7px);
            --label-pad-x: clamp(2px, 0.8vw, 4px);
            --label-letter: clamp(0.1em, 0.2vw, 0.16em);
            --label-letter-wide: clamp(0.16em, 0.28vw, 0.24em);
            --label-word: clamp(0.14em, 0.24vw, 0.2em);
            --label-word-wide: clamp(0.22em, 0.34vw, 0.3em);
          }
        }

        .roll{
          display:inline-block;
          animation: rollSwap 420ms cubic-bezier(.2,.8,.2,1) both;
          transform-origin: 50% 50%;
        }
        @keyframes rollSwap{
          0%   { opacity:0; transform: translateY(6px) rotateX(-70deg); filter: blur(0.6px); }
          55%  { opacity:1; transform: translateY(0px) rotateX(0deg);  filter: blur(0px); }
          100% { opacity:1; transform: translateY(0px) rotateX(0deg); }
        }

        .blackhole-wrap{
          position:absolute;
          left:50%;
          top:50%;
          transform:translate(-50%,-50%);
          width:var(--bh-size);
          height:var(--bh-size);
          pointer-events:none;
          mix-blend-mode: screen;
          animation: bhFade 1.7s ease-out forwards;
        }
        .blackhole-wrap.hold{
          animation: none;
          opacity: 1;
          transform: translate(-50%,-50%) scale(1);
        }
        .blackhole{
          position:absolute;
          inset:0;
          border-radius:999px;
          background:
            radial-gradient(circle at 50% 50%,
              rgba(0,0,0,0.95) 0%,
              rgba(0,0,0,0.95) 22%,
              rgba(255,255,255,0.18) 26%,
              rgba(210,225,255,0.20) 30%,
              rgba(255,255,255,0.10) 38%,
              rgba(255,255,255,0.00) 64%
            );
        }
        .orbit-dots{
          position:absolute;
          inset:0;
          border-radius:999px;
        }
        .orbit-dots .dot{
          position:absolute;
          left:50%;
          top:50%;
          width:var(--dot-size);
          height:var(--dot-size);
          border-radius:999px;
          background: rgba(255,255,255,0.92);
          filter: drop-shadow(0 0 8px rgba(220,230,255,0.65));
          opacity: 0;
          transform-origin: 0 0;
          animation: dotOrbit 1.35s ease-out forwards;
          animation-delay: calc(var(--i) * 0.03s);
        }
        @keyframes dotOrbit{
          0%{ opacity:0; transform: rotate(calc(var(--i) * 25deg)) translateX(var(--orbit-start)); }
          30%{ opacity:1; }
          100%{ opacity:0; transform: rotate(calc(var(--i) * 25deg + 240deg)) translateX(var(--orbit-end)); }
        }
        @keyframes bhFade{
          0%{ opacity:0; transform:translate(-50%,-50%) scale(0.88); }
          25%{ opacity:1; }
          100%{ opacity:0; transform:translate(-50%,-50%) scale(1.08); }
        }

        .heaven-rays{
          position:absolute;
          inset:-25%;
          pointer-events:none;
          opacity:0;
          transition: opacity 300ms ease;
          filter: blur(18px);
          mix-blend-mode: screen;
          background:
            conic-gradient(from 180deg,
              rgba(255,255,255,0.00) 0deg,
              rgba(220,230,255,0.09) 35deg,
              rgba(255,255,255,0.00) 80deg,
              rgba(220,230,255,0.07) 120deg,
              rgba(255,255,255,0.00) 175deg,
              rgba(230,240,255,0.08) 215deg,
              rgba(255,255,255,0.00) 265deg,
              rgba(220,230,255,0.07) 320deg,
              rgba(255,255,255,0.00) 360deg
            );
          animation: raysRotate 7s linear infinite;
        }
        .heaven-rays.on{ opacity:0.5; }

        .connection-line{
          stroke-width: var(--line-width);
          stroke-linecap: round;
          opacity: 0;
          animation: lineAppear 0.7s ease-out forwards;
        }
        @keyframes lineAppear{
          0% { opacity: 0; stroke-dasharray: 1200; stroke-dashoffset: 1200; }
          100% { opacity: 0.92; stroke-dasharray: 1200; stroke-dashoffset: 0; }
        }

        .center-spark{
          fill: rgba(255,255,255,0.95);
          filter: drop-shadow(0 0 10px rgba(220,230,255,0.75));
          opacity: 0.9;
          animation: centerSpark 1.1s ease-in-out infinite;
        }
        @keyframes centerSpark{
          0%,100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.55); opacity: 1; }
        }

        @keyframes starFloat{
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); opacity: 0.75; }
          50% { transform: translate(-50%, -50%) translateY(-6px); opacity: 1; }
        }
        @keyframes clickSpin{
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(360deg); }
        }
        @keyframes raysRotate{
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .clickable-text{ font-family: "Elios", sans-serif; }
        .clickable-text.spinning{ color: #C7D65A; }
      `}</style>
    </div>
  );
};

export default FloatingText;
