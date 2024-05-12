/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/infra/http/www/web-components/**/*.ts', './src/infra/http/www/server-components/**/*.ts', './src/infra/http/www/templates/**/*.ts', './src/application/**/forms/**/*.ts'],
  theme: {
    extend: {}
  },
  plugins: []
};
