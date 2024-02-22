const esbuild = require('esbuild');

esbuild.build({
  entryPoints: [
    { in: './src/commands/run-consumer.ts', out: './run-consumer' }
  ],
  platform: 'node',
  outdir: './dist/consumer',
  bundle: true,
  loader: {
    '.ts': 'ts',
    '.d.ts': 'ts'
  }
}).catch(() => process.exit(1));
