import Splitting from 'splitting';
import { randomNumber } from '../utils/utils';

// EFFECT KEYS: fx1, fx2, fx3, fx4, fx5, fx6, fx7

/**
 * Class representing one line
 */
class Line {
    constructor(linePosition) {
        this.position = linePosition;
        this.cells = [];
    }
}

/**
 * Class representing one cell/char
 */
class Cell {
    constructor(DOM_el, options = {}) {
        this.DOM = { el: DOM_el };

        this.position = options.position ?? -1;
        this.previousCellPosition = options.previousCellPosition ?? -1;

        this.original = this.DOM.el.innerHTML;
        this.state = this.original;

        this.color =
            this.originalColor =
            getComputedStyle(document.documentElement).getPropertyValue('--color-text');

        this.cache = null;
    }

    set(value) {
        this.state = value;
        if (this.DOM.el) {
            this.DOM.el.innerHTML = this.state;
        }
    }
}

/**
 * Class representing the TypeShuffle object
 */
export class TypeShuffle {
    constructor(DOM_el) {
        this.DOM = { el: DOM_el };
        this.lines = [];
        this.lettersAndSymbols = [
            'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
            '!','@','#','$','&','*','(',')','-','_','+','=','/','[',']','{','}',';',':','<','>',',',
            '0','1','2','3','4','5','6','7','8','9'
        ];
        this.effects = {
            fx1: () => this.fx1(),
            fx2: () => this.fx2(),
            fx3: () => this.fx3(),
            fx4: () => this.fx4(),
            fx5: () => this.fx5(),
            fx6: () => this.fx6(),
            fx7: () => this.fx7(),
        };
        
        this.totalChars = 0;
        this.isAnimating = false;

        // Guard for Next.js SSR
        if (typeof window === 'undefined' || typeof document === 'undefined') return;

        // Apply Splitting
        const results = Splitting({
            target: this.DOM.el,
            by: 'lines'
        });

        results.forEach(s => Splitting({ target: s.words }));

        const first = results[0];
        if (!first || !first.lines) return;

        // Build lines + cells
        for (const [linePosition, lineArr] of first.lines.entries()) {
            const line = new Line(linePosition);
            const cells = [];
            let charCount = 0;

            for (const word of lineArr) {
                for (const char of [...word.querySelectorAll('.char')]) {
                    cells.push(
                        new Cell(char, {
                            position: charCount,
                            previousCellPosition: charCount === 0 ? -1 : charCount - 1
                        })
                    );
                    charCount++;
                }
            }

            line.cells = cells;
            this.lines.push(line);
            this.totalChars += charCount;
        }
    }

    /** clear all cells chars */
    clearCells() {
        for (const line of this.lines) {
            for (const cell of line.cells) {
                cell.set('&nbsp;');
            }
        }
    }

    /** return random character */
    getRandomChar() {
        return this.lettersAndSymbols[
            Math.floor(Math.random() * this.lettersAndSymbols.length)
        ];
    }

    // ============================================================
    // FX1 - FIXED VERSION
    // ============================================================
    fx1() {
        const MAX_CELL_ITERATIONS = 45;
        let finished = 0;

        // DON'T clear cells - let them start visible
        // this.clearCells(); // REMOVED THIS LINE

        const ITERATION_DELAY = 50;
        const LINE_DELAY = 150; // Reduced from 600ms to 150ms for faster start

        const loop = (line, cell, iteration = 0) => {
            cell.cache = { state: cell.state };

            if (iteration === MAX_CELL_ITERATIONS - 1) {
                cell.set(cell.original);
                finished++;
                if (finished === this.totalChars) this.isAnimating = false;
            } else if (cell.position === 0) {
                cell.set(
                    iteration < 9
                        ? ['*', '-', "'", '"'][Math.floor(Math.random() * 4)]
                        : this.getRandomChar()
                );
            } else {
                const prevCache = line.cells[cell.previousCellPosition].cache;
                cell.set(prevCache ? prevCache.state : '&nbsp;');
            }

            if (cell.cache && cell.cache.state !== '&nbsp;') iteration++;

            if (iteration < MAX_CELL_ITERATIONS) {
                setTimeout(() => loop(line, cell, iteration), ITERATION_DELAY);
            }
        };

        for (const line of this.lines) {
            for (const cell of line.cells) {
                setTimeout(
                    () => loop(line, cell),
                    (line.position + 1) * LINE_DELAY
                );
            }
        }
    }

    // ============================================================
    // FX2
    // ============================================================
    fx2() {
        const MAX_CELL_ITERATIONS = 20;
        let finished = 0;

        const loop = (line, cell, iteration = 0) => {
            if (iteration === MAX_CELL_ITERATIONS - 1) {
                cell.set(cell.original);

                if (cell.DOM.el) {
                    cell.DOM.el.style.opacity = '0';
                    setTimeout(() => {
                        if (cell.DOM.el) cell.DOM.el.style.opacity = '1';
                    }, 300);
                }

                finished++;
                if (finished === this.totalChars) this.isAnimating = false;
            } else {
                cell.set(this.getRandomChar());
            }

            iteration++;
            if (iteration < MAX_CELL_ITERATIONS) {
                setTimeout(() => loop(line, cell, iteration), 40);
            }
        };

        for (const line of this.lines) {
            for (const cell of line.cells) {
                setTimeout(() => loop(line, cell), (cell.position + 1) * 30);
            }
        }
    }

    // ============================================================
    // FX3 - FIXED VERSION
    // ============================================================
    fx3() {
        const MAX_CELL_ITERATIONS = 10;
        let finished = 0;

        // DON'T clear cells - start with visible text
        // this.clearCells(); // REMOVED

        const loop = (line, cell, iteration = 0) => {
            if (iteration === MAX_CELL_ITERATIONS - 1) {
                cell.set(cell.original);
                finished++;
                if (finished === this.totalChars) this.isAnimating = false;
            } else {
                cell.set(this.getRandomChar());
            }

            iteration++;
            if (iteration < MAX_CELL_ITERATIONS) {
                setTimeout(() => loop(line, cell, iteration), 80);
            }
        };

        for (const line of this.lines) {
            for (const cell of line.cells) {
                // Reduced max delay from 2000ms to 500ms for faster, tighter animation
                setTimeout(() => loop(line, cell), randomNumber(0, 500));
            }
        }
    }

    // ============================================================
    // FX4
    // ============================================================
    fx4() {
        const MAX_CELL_ITERATIONS = 30;
        let finished = 0;

        this.clearCells();

        const loop = (line, cell, iteration = 0) => {
            cell.cache = { state: cell.state };

            if (iteration === MAX_CELL_ITERATIONS - 1) {
                cell.set(cell.original);
                finished++;
                if (finished === this.totalChars) this.isAnimating = false;
            } else if (cell.position === 0) {
                cell.set(['*', ':'][Math.floor(Math.random() * 2)]);
            } else {
                const prevCache = line.cells[cell.previousCellPosition].cache;
                cell.set(prevCache ? prevCache.state : '&nbsp;');
            }

            if (cell.cache && cell.cache.state !== '&nbsp;') iteration++;

            if (iteration < MAX_CELL_ITERATIONS) {
                setTimeout(() => loop(line, cell, iteration), 15);
            }
        };

        for (const line of this.lines) {
            for (const cell of line.cells) {
                setTimeout(
                    () => loop(line, cell),
                    Math.abs(this.lines.length / 2 - line.position) * 400
                );
            }
        }
    }

    // ============================================================
    // FX5
    // ============================================================
    fx5() {
        const MAX_CELL_ITERATIONS = 30;
        let finished = 0;

        this.clearCells();

        const loop = (line, cell, iteration = 0) => {
            cell.cache = { state: cell.state, color: cell.color };

            if (iteration === MAX_CELL_ITERATIONS - 1) {
                cell.color = cell.originalColor;
                if (cell.DOM.el) cell.DOM.el.style.color = cell.color;

                cell.set(cell.original);
                finished++;
                if (finished === this.totalChars) this.isAnimating = false;
            } else if (cell.position === 0) {
                cell.color = ['#3e775d', '#61dca3', '#61b3dc'][Math.floor(Math.random() * 3)];
                if (cell.DOM.el) cell.DOM.el.style.color = cell.color;

                cell.set(
                    iteration < 9
                        ? ['*', '-', "'", '"'][Math.floor(Math.random() * 4)]
                        : this.getRandomChar()
                );
            } else {
                const prev = line.cells[cell.previousCellPosition].cache;

                const prevState = prev ? prev.state : '&nbsp;';
                const prevColor = prev?.color ?? cell.color;

                cell.set(prevState);

                cell.color = prevColor;
                if (cell.DOM.el) cell.DOM.el.style.color = cell.color;
            }

            if (cell.cache.state !== '&nbsp;') iteration++;

            if (iteration < MAX_CELL_ITERATIONS) {
                setTimeout(() => loop(line, cell, iteration), 10);
            }
        };

        for (const line of this.lines) {
            for (const cell of line.cells) {
                setTimeout(() => loop(line, cell), (line.position + 1) * 200);
            }
        }
    }

    // ============================================================
    // FX6
    // ============================================================
    fx6() {
        const MAX_CELL_ITERATIONS = 15;
        let finished = 0;

        const loop = (line, cell, iteration = 0) => {
            cell.cache = { state: cell.state, color: cell.color };

            if (iteration === MAX_CELL_ITERATIONS - 1) {
                cell.set(cell.original);

                cell.color = cell.originalColor;
                if (cell.DOM.el) cell.DOM.el.style.color = cell.color;

                finished++;
                if (finished === this.totalChars) this.isAnimating = false;
            } else {
                cell.set(this.getRandomChar());
                cell.color = ['#2b4539', '#61dca3', '#61b3dc'][Math.floor(Math.random() * 3)];
                if (cell.DOM.el) cell.DOM.el.style.color = cell.color;
            }

            iteration++;
            if (iteration < MAX_CELL_ITERATIONS) {
                setTimeout(
                    () => loop(line, cell, iteration),
                    randomNumber(30, 110)
                );
            }
        };

        for (const line of this.lines) {
            for (const cell of line.cells) {
                setTimeout(() => loop(line, cell), (line.position + 1) * 80);
            }
        }
    }

    // ============================================================
    // FX7 - UPDATED: INSTANT START, NO DELAY
    // ============================================================
    fx7() {
        const MAX_ITER = 20;
        let finished = 0;

        // Mapping table
        const map = {
            "S": "2", "T": "9", "A": "7", "B": "3", "L": "3",
            "E": "3", "O": "9", "M": "9", "N": "7", "I": "7",
            "U": "1", "V": "1", "R": "1", " ": " "
        };

        // 🔥 KEY FIX: Start all cells as random characters immediately
        for (const line of this.lines) {
            for (const cell of line.cells) {
                const real = cell.original.toUpperCase();
                if (real === " ") {
                    cell.set(" ");
                } else {
                    const code = map[real] || "?";
                    const rnd = code[Math.floor(Math.random() * code.length)];
                    cell.set(rnd);
                }
            }
        }

        const loop = (cell, iteration = 0) => {
            const real = cell.original.toUpperCase();
            const code = map[real] || "?";

            if (iteration >= MAX_ITER - 1) {
                // Final real letter
                cell.set(real);
                finished++;
                if (finished === this.totalChars) this.isAnimating = false;
                return;
            }

            // Shuffle character
            if (real === " ") {
                cell.set(" ");
            } else {
                const rnd = code[Math.floor(Math.random() * code.length)];
                cell.set(rnd);
            }

            setTimeout(() => loop(cell, iteration + 1), 50);
        };

        // Start all cells shuffling immediately - NO DELAY
        for (const line of this.lines) {
            for (const cell of line.cells) {
                loop(cell, 1); // Start at iteration 1 since we already set initial state
            }
        }
    }

    /** trigger an effect */
    trigger(effect = 'fx1') {
        if (!this.effects[effect] || this.isAnimating) return;
        this.isAnimating = true;
        this.effects[effect]();
    }
}
