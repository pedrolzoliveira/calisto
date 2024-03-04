const esbuild = require('esbuild');
const { default: copy } = require('esbuild-plugin-copy');

esbuild.build({
  entryPoints: [
    { in: './src/commands/run-scraper.ts', out: './run-scraper' }
  ],
  platform: 'node',
  outdir: './dist/scraper',
  bundle: true,
  plugins: [
    copy({
      assets: [
        {
          from: ['./src/infra/database/prisma/schema.prisma'],
          to: ['./schema.prisma']
        }
      ]
    })
  ],
  loader: {
    '.ts': 'ts'
  }
}).catch(() => process.exit(1));
