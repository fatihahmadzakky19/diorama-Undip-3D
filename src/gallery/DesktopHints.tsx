/** Subtle keyboard hints for desktop visitors. */
export function DesktopHints() {
  return (
    <div className="gr-hints" aria-hidden="true">
      <span>
        <kbd>W</kbd>
        <kbd>↑</kbd> forward
      </span>
      <span>
        <kbd>S</kbd>
        <kbd>↓</kbd> backward
      </span>
      <span>mouse to look</span>
      <span>click a portrait</span>
      <span>
        <kbd>ESC</kbd> release cursor
      </span>
    </div>
  )
}
