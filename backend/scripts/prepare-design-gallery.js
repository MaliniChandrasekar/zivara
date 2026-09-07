const fs = require('fs/promises')
const path = require('path')
const sharp = require('sharp')

const source = path.resolve(__dirname, '../../print/print')
const output = path.resolve(__dirname, '../public/designs')
const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp'])

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async entry => {
    const full = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  }))
  return files.flat()
}

async function run() {
  await fs.mkdir(output, { recursive: true })
  const files = (await walk(source)).filter(file => allowed.has(path.extname(file).toLowerCase()))
  const manifest = []
  for (const [index, file] of files.entries()) {
    const relative = path.relative(source, file)
    const parts = relative.split(path.sep)
    const category = parts.length > 1 ? parts[0] : 'Studio Edit'
    const id = `${category}-${path.parse(file).name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const filename = `${String(index + 1).padStart(3, '0')}-${id}.webp`
    await sharp(file).rotate().resize(900, 1200, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(output, filename))
    manifest.push({ id, name: `${category} Design ${path.parse(file).name}`, category, imageUrl: `/api/design-assets/${filename}` })
    process.stdout.write(`\rOptimized ${index + 1}/${files.length}`)
  }
  await fs.writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2))
  process.stdout.write(`\nCreated ${manifest.length} showcase designs.\n`)
}

run().catch(error => { console.error(error); process.exit(1) })
