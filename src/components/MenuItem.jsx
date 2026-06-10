export default function MenuItem({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`
        uppercase transition-all
        ${active ? "text-[#C7D65A]" : "text-white"}
        hover:text-[#C7D65A]
      `}
    >
      {children}
    </button>
  );
}
