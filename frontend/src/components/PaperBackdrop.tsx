import "./PaperBackdrop.css"

const SCATTERED_LETTERS = ["a", "N", "e", "r", "t", "S", "o"]

export default function PaperBackdrop() {
  return (
    <div className="paper-backdrop" aria-hidden="true">
      {SCATTERED_LETTERS.map((letter, i) => (
        <span key={i} className={`paper-backdrop__letter paper-backdrop__letter--${i + 1}`}>
          {letter}
        </span>
      ))}
      <div className="pencil">
        <div className="pencil__point" />
        <div className="pencil__wood" />
        <div className="pencil__shaft" />
        <div className="pencil__ferrule" />
        <div className="pencil__eraser" />
      </div>
    </div>
  )
}
