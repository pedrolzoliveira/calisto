// server-esbuild.config.js

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
        { in: './src/commands/run-server.ts', out: './run-server' }
      ],
      platform: 'node',
      outdir: './dist/server',
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
  });
});
