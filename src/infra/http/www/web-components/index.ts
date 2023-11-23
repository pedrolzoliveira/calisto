import { glob } from 'glob'

glob.sync('**/*.ts', { cwd: __dirname, ignore: '**/index.ts' }).forEach(file => {
  import(`./${file}`)
})
