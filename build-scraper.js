const esbuild = require('esbuild');

esbuild.build({
  entryPoints: [
    { in: './src/commands/run-scraper.ts', out: './run-scraper' }
  ],
  platform: 'node',
  outdir: './dist/scraper',
  bundle: true,
  loader: {
    '.ts': 'ts'
  }
}).catch(() => process.exit(1));
