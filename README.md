# Simple TailwindCSS boilerplate
A simple customizable tailwindcss boilerplate with Gulp that helps you automate development and production tasks

## Installation

1. Clone repository
```bash
git clone https://github.com/Yelsel/tailwindcss-boilerplate.git
```

2. Install dependencies
```bash
npm install
```
3. Run development environment
```bash
npm run dev
```
> This will build your website from ./src to ./dist and serve it with Browser-Sync.

4. To build your website for production run
```bash
npm run build
```
> Output will be in ./build folder.

## Configuration
You can configure ***gulp.config.js*** and ***tailwind.config.js*** to your own needs.

### Gulpfile config
To change paths of files and destination/build folder, edit ***gulp.config.js***
``` bash
module.exports = {
    config: {
        tailwindjs: "./tailwind.config.js",
        port: 8080,
    },
    paths: {
        root: "./",
        src: {
            base: './src',
            css: './src/assets/css',
            js: './src/assets/js',
            img: './src/assets/img'
        },
        dist: {
            base: './dist',
            css: './dist/assets/css',
            js: './dist/assets/js',
            img: './dist/assets/img'
        },
        build: {
            base: './build',
            css: './build/assets/css',
            js: './build/assets/js',
            img: './build/assets/img'
        }
    }
}
```

### TailwindCSS config
```bash
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```

## License
[MIT](https://choosealicense.com/licenses/mit/)