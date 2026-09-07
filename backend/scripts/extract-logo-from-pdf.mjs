import fs from 'node:fs/promises'
import path from 'node:path'
import { createCanvas, DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import sharp from 'sharp'

globalThis.DOMMatrix = DOMMatrix
globalThis.ImageData = ImageData
globalThis.Path2D = Path2D

const input = 'C:/Users/Lenovo/Downloads/Zivara_Design_Studio_Logo_High_Resolution.pdf'
const output = path.resolve(import.meta.dirname, '../../frontend/public/zivara-official-logo.webp')
const data = new Uint8Array(await fs.readFile(input))
const document = await pdfjs.getDocument({ data, useSystemFonts: true }).promise
const page = await document.getPage(1)
const viewport = page.getViewport({ scale: 4 })
const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height))
const context = canvas.getContext('2d')
await page.render({ canvasContext: context, viewport }).promise
await sharp(canvas.toBuffer('image/png')).resize(1200, 1200).webp({ quality: 90 }).toFile(output)
console.log(`Official logo rendered: ${output} (${canvas.width}x${canvas.height})`)
