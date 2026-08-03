import { TextEncoder, TextDecoder } from "node:util"

Object.assign(global, { TextEncoder, TextDecoder })

import "@testing-library/jest-dom"
