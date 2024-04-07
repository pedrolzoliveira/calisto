// build-app.js

const esbuild = require('esbuild');
const { copy } = require('esbuild-plugin-copy');
const { exec } = require('child_process');

exec('yarn tailwindcss -i ./src/infra/http/www/tailwind.css -o ./src/infra/http/www/dist/tailwind.css --minify', (err) => {
  if (err) {
    throw err;
  }

  return esbuild.build({
    entryPoints: ['./src/infra/http/www/entrypoint.ts'],
    bundle: true,
    outfile: './src/infra/http/www/dist/bundle.js',
    loader: {
      '.ts': 'ts'
    }
  }).then(() => {
    return esbuild.build({
      entryPoints: [
        { in: './src/commands/run-server.ts', out: './run-server' },
        { in: './src/commands/run-scraper.ts', out: './run-scraper' },
        { in: './src/commands/run-consumer.ts', out: './run-consumer' }
      ],
      platform: 'node',
      outdir: './dist',
      bundle: true,
      plugins: [
        copy({
          assets: [
            {
              from: ['./src/infra/http/www/assets/**'],
              to: ['./www/assets']
            },
            {
              from: ['./src/infra/http/www/dist/*'],
              to: ['./www/dist']
            },
            // pg-listen users pg-format as a dependency, but it doesn't work with esbuild - it uses dynamic imports
            {
              from: ['./node_modules/pg-format/lib/reserved.js'],
              to: ['./reserved.js']
            },
            {
              from: ['./node_modules/.prisma/client/libquery_engine*'],
              to: ['./']
            },
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
    });
  }).catch((err) => { throw err; });
});
