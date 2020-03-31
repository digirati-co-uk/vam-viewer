export default function getCurrentScrollX(el = null) {
  if (el) {
    return el.scrollLeft;
  }

  return window.pageXOffset !== undefined
    ? window.pageXOffset
    : (document.documentElement || document.body.parentNode || document.body)
        .scrollLeft;
}
