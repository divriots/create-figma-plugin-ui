import { promises as fsp } from 'fs'
import * as path from 'path'
import rimraf from 'rimraf'
import { promisify } from 'util'

const rmrf = promisify(rimraf)
const input = path.resolve(process.argv[2])
const output = process.cwd()

await copyFiles(path.join(input, 'src'), path.join(output, 'src'))
async function copyFiles(folder, out) {
  await rmrf(out)
  await fsp.mkdir(out)
  /** @type {import('fs').Dirent[]} */
  const items = await fsp.readdir(folder, { withFileTypes: true })
  for (const item of items) {
    const itemIn = path.join(folder, item.name)
    let itemOut = path.join(out, item.name)
    if (item.isDirectory()) {
      await copyFiles(itemIn, itemOut)
    } else {
      let content = await (/\.([jt]sx?|css)$/.test(item.name)
        ? fsp.readFile(itemIn, { encoding: 'utf-8' })
        : fsp.readFile(itemIn))
      if (item.name.endsWith('.css') && item.name !== 'base.css') {
        itemOut = path.join(out, item.name.replace('.css', '.module.css'))
      }
      if (/\.([jt]sx?|css)$/.test(item.name)) {
        content = content.replaceAll(
          /(['"]\.\.?\/[\w\d._/\-]*)(\.css['"])/g,
          (_, a, b) => (a.endsWith('/base') ? `${a}${b}` : `${a}.module${b}`)
        )
        content = content.replace(
          `export { render } from './utilities/render.js'`,
          ''
        )
      }
      if (item.name !== 'render.tsx') {
        await fsp.writeFile(itemOut, content)
      }
    }
  }
}
let previewJs = await fsp.readFile(path.join(input, '.storybook/preview.js'), {
  encoding: 'utf-8'
})
previewJs = previewJs.replaceAll('../src', './src')
previewJs = previewJs.replace(
  'decorators = [',
  `decorators = [\n  (Story) => (<div className='theme-figma'><Story /></div>),`
)
await fsp.writeFile(path.join(output, 'stories.preview.jsx'), previewJs)
