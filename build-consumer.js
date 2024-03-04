const esbuild = require('esbuild');
const { default: copy } = require('esbuild-plugin-copy');

esbuild.build({
  entryPoints: [
    { in: './src/commands/run-consumer.ts', out: './run-consumer' }
  ],
  platform: 'node',
  outdir: './dist/consumer',
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
    '.ts': 'ts',
    '.d.ts': 'ts'
  }
}).catch(() => process.exit(1));
