const { src, dest, task, watch, series, parallel } = require('gulp');
const del = require('del');
const options = require('./gulp.config');
const browserSync = require('browser-sync').create();

const sass = require('gulp-sass');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
const purgecss = require('gulp-purgecss');
const uglify = require('gulp-terser');

function livePreview(done) {
    browserSync.init({
        server: {
            baseDir: options.paths.dist.base
        },
        port: options.config.port || 8080
    });
    done();
}

function previewReload(done){
    console.log("Reloading Browser Preview.");
    browserSync.reload();
    done();
}


// Development tasks
function devClean(){
    console.log("Cleaning dist folder for fresh start.");
    return del([options.paths.dist.base]);
}

function devHTML(){
    return src(`${options.paths.src.base}/**/*.html`).pipe(dest(options.paths.dist.base));
}

function devStyles(){
    const tailwindcss = require('tailwindcss'); 
    return src(`${options.paths.src.css}/**/*`).pipe(sass().on('error', sass.logError))
      .pipe(postcss([
        tailwindcss(options.config.tailwindjs),
        require('autoprefixer'),
      ]))
      .pipe(concat({ path: 'style.css'}))
      .pipe(dest(options.paths.dist.css));
}

function devImages(){
    return src(`${options.paths.src.img}/**/*`).pipe(dest(options.paths.dist.img));
}

function devScripts(){
    return src([
      `${options.paths.src.js}/**/*.js`,
    ]).pipe(concat({ path: 'scripts.js'})).pipe(dest(options.paths.dist.js));
}

function watchFiles() {
    watch(`${options.paths.src.base}/**/*.html`,series(devHTML, previewReload));
    watch(`${options.paths.src.css}/**/*`,series(devStyles, previewReload));  
    watch(`${options.paths.src.js}/**/*.js`,series(devScripts, previewReload));
    watch(`${options.paths.src.img}/**/*`,series(devImages, previewReload));
}


// Production tasks
function prodClean(){
    console.log("Cleaning dist folder for fresh start.");
    return del([options.paths.build.base]);
}

function prodHTML(){
    return src(`${options.paths.src.base}/**/*.html`).pipe(dest(options.paths.build.base));
}

function prodStyles(){
    return src(`${options.paths.dist.css}/**/*`).pipe(purgecss({
      content: ['src/**/*.{html,js}'],
      defaultExtractor: content => {
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
        const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
        return broadMatches.concat(innerMatches)
      }
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest(options.paths.build.css));
}

function prodScripts(){
    return src([
      `${options.paths.src.js}/**/*.js`
    ])
    .pipe(concat({ path: 'scripts.js'}))
    .pipe(uglify())
    .pipe(dest(options.paths.build.js));
}

function prodImages(){
    return src(options.paths.src.img + '/**/*').pipe(imagemin()).pipe(dest(options.paths.build.img));
  }


function buildFinish(done){
    console.log(`Production build is complete. Files are located at ${options.paths.build.base}\n`);
    done();
}

exports.dev = series(
    devClean,
    parallel(devHTML, devStyles, devScripts, devImages),
    livePreview,
    watchFiles
);

exports.dist = series(
    devClean,
    parallel(devHTML, devStyles, devScripts, devImages),
);

exports.prod = series(
    prodClean,
    parallel(prodHTML, prodStyles, prodScripts, prodImages),
    buildFinish
);

exports.clean = series(
    devClean,
    prodClean
)