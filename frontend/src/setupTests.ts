import { TextEncoder, TextDecoder } from "node:util"

Object.assign(global, { TextEncoder, TextDecoder })

import "@testing-library/jest-dom"

// jsdom doesn't implement layout-dependent Range/Element APIs (no real
// rendering engine). Quill (used by the note editor) calls these when
// moving the selection, so they need a harmless stand-in for tests.
const dummyRect: DOMRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  toJSON: () => ({}),
}
const dummyRectList = {
  length: 0,
  item: () => null,
  [Symbol.iterator]: function* (): Generator<DOMRect> {},
} as unknown as DOMRectList

Range.prototype.getBoundingClientRect = () => dummyRect
Range.prototype.getClientRects = () => dummyRectList
Element.prototype.getClientRects = Element.prototype.getClientRects || (() => dummyRectList)
