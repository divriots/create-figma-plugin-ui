import fs from 'fs-extra'
import { globby } from 'globby'
import ts from 'typescript'

async function main() {
  const globPatterns = process.argv.slice(2)
  try {
    await generateIndexTs(globPatterns, 'src/index.ts')
  } catch (error) {
    console.error(error.message) // eslint-disable-line no-console
    process.exit(1)
  }
}
main()

async function generateIndexTs(globPatterns, outputFilePath) {
  const filePaths = await globby([
    ...globPatterns,
    `!${outputFilePath}`,
    '!**/*.d.ts',
    '!**/*.stories.tsx'
  ])
  const result = [] // Array of export declaration strings
  const usedExportNames = {} // Track the names of exports that were already used
  const program = ts.createProgram(filePaths, { allowJs: true })
  for (const filePath of filePaths) {
    const sourceFile = program.getSourceFile(filePath)
    if (typeof sourceFile === 'undefined') {
      throw new Error(`\`sourceFile\` is \`undefined\`: ${filePath}`)
    }
    const exportNames = []
    const exportTypes = []
    function addExport(exportName, isType) {
      if (usedExportNames[exportName] === true) {
        throw new Error(`Export name clash \`${exportName}\`: ${filePath}`)
      }
      usedExportNames[exportName] = true
      ;(isType ? exportTypes : exportNames).push(exportName)
    }
    ts.forEachChild(sourceFile, function (node) {
      if (
        ts.isTypeAliasDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isFunctionDeclaration(node)
      ) {
        if (
          typeof node.modifiers !== 'undefined' &&
          node.modifiers[0].kind === ts.SyntaxKind.ExportKeyword &&
          typeof node.name !== 'undefined'
        ) {
          if (
            node.modifiers.length > 1 &&
            node.modifiers[1].kind === ts.SyntaxKind.DefaultKeyword
          ) {
            throw new Error(`Use of \`default\` export detected: ${filePath}`)
          }
          addExport(
            node.name.text,
            ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)
          )
        }
      }
      if (ts.isVariableStatement(node)) {
        if (
          typeof node.modifiers !== 'undefined' &&
          node.modifiers[0].kind === ts.SyntaxKind.ExportKeyword
        ) {
          const identifier = node.declarationList.declarations[0].name
          if (ts.isIdentifier(identifier)) {
            addExport(identifier.text, false)
          }
        }
      }
    })
    const normalizedFilePath = filePath
      .replace(/^(?:\.\/)?src\//, './') // Relace `./src/` with `./`
      .replace(/\.tsx?/, '')
    if (exportNames.length) {
      result.push(
        `export { ${exportNames
          .sort()
          .join(', ')} } from '${normalizedFilePath}'`
      )
    }
    if (exportTypes.length) {
      result.push(
        `export type { ${exportTypes
          .sort()
          .join(', ')} } from '${normalizedFilePath}'`
      )
    }
  }
  await fs.outputFile(
    outputFilePath,
    `// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.\n${result.join(
      '\n'
    )}`
  )
}