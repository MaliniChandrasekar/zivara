const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')
const sharp = require('sharp')

const source = path.resolve(__dirname, '../../print/print')
const output = path.resolve(__dirname, '../public/designs')
const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp'])

// Category print pages are a 2x2 grid of 4 individual designs on an A4-ratio
// sheet, measured as fractions of page width/height from sample pages.
const GRID = {
  marginX: 102 / 2480,
  photoW: 1085 / 2480,
  marginYTop: 158 / 3508,
  photoH: 1478 / 3508,
  marginYBottom: 192 / 3508,
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async entry => {
    const full = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  }))
  return files.flat()
}

function quadrantBoxes(width, height) {
  const insetX = Math.round(0.028 * GRID.photoW * width)
  const insetY = Math.round(0.028 * GRID.photoH * height)
  const w = Math.round(GRID.photoW * width) - insetX * 2
  const h = Math.round(GRID.photoH * height) - insetY * 2
  const leftX = Math.round(GRID.marginX * width) + insetX
  const rightX = Math.round((1 - GRID.marginX) * width) - w - insetX
  const topY = Math.round(GRID.marginYTop * height) + insetY
  const bottomY = Math.round((1 - GRID.marginYBottom) * height) - h - insetY
  return [
    { left: leftX, top: topY, width: w, height: h },
    { left: rightX, top: topY, width: w, height: h },
    { left: leftX, top: bottomY, width: w, height: h },
    { left: rightX, top: bottomY, width: w, height: h },
  ]
}

// Filenames are built only from the deterministic id plus a content hash —
// no directory-scan-order counter — so they never shift when unrelated files
// are added elsewhere, and a source photo swap naturally busts the cache by
// producing a new URL instead of silently serving the stale image.
async function writeImage(pipeline, idBase) {
  const buffer = await pipeline.webp({ quality: 78 }).toBuffer()
  const hash = crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 8)
  const id = idBase.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const filename = `${id}-${hash}.webp`
  await fs.writeFile(path.join(output, filename), buffer)
  return filename
}

async function run() {
  await fs.rm(output, { recursive: true, force: true })
  await fs.mkdir(output, { recursive: true })
  const files = (await walk(source)).filter(file => allowed.has(path.extname(file).toLowerCase()))

  const withMeta = files.map(file => {
    const relative = path.relative(source, file)
    const parts = relative.split(path.sep)
    const category = parts.length > 1 ? parts[0] : 'Studio Edit'
    const pageNumber = parseInt(path.parse(file).name, 10)
    return { file, category, pageNumber }
  })
  const firstPageByCategory = withMeta.reduce((min, item) => {
    if (item.category === 'Studio Edit') return min
    if (!(item.category in min) || item.pageNumber < min[item.category]) min[item.category] = item.pageNumber
    return min
  }, {})

  const manifest = []
  let counter = 0
  for (const { file, category, pageNumber } of withMeta) {
    const isStudioEdit = category === 'Studio Edit'
    const isCover = !isStudioEdit && pageNumber === firstPageByCategory[category]
    const baseName = path.parse(file).name

    if (isCover) continue // category title/branding page, not a design

    if (isStudioEdit) {
      counter += 1
      const idBase = `${category}-${baseName}`
      const pipeline = sharp(file).rotate().resize(900, 1200, { fit: 'inside', withoutEnlargement: true })
      const filename = await writeImage(pipeline, idBase)
      manifest.push({ id: idBase.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: `${category} Design ${baseName}`, category, imageUrl: `/api/design-assets/${filename}` })
      continue
    }

    const { width, height } = await sharp(file).rotate().metadata()
    const boxes = quadrantBoxes(width, height)
    for (const [quadrant, box] of boxes.entries()) {
      counter += 1
      const idBase = `${category}-${baseName}-${quadrant + 1}`
      const pipeline = sharp(file).rotate().extract(box).resize(900, 1200, { fit: 'inside', withoutEnlargement: true })
      const filename = await writeImage(pipeline, idBase)
      manifest.push({ id: idBase.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: `${category} Design ${baseName}-${quadrant + 1}`, category, imageUrl: `/api/design-assets/${filename}` })
    }
    process.stdout.write(`\rOptimized ${counter} designs`)
  }
  manifest.sort((a, b) => a.id.localeCompare(b.id))
  await fs.writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2))
  process.stdout.write(`\nCreated ${manifest.length} showcase designs.\n`)
}

run().catch(error => { console.error(error); process.exit(1) })
