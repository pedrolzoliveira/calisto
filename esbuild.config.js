// esbuild.config.js
const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['./src/infra/http/www/entrypoint.ts'], // Your application's entry point
  bundle: true, // Enable bundling
  outfile: './src/infra/http/www/dist/bundle.js', // Output bundle file
  loader: {
    '.ts': 'ts'
  }
}).catch(() => process.exit(1))
