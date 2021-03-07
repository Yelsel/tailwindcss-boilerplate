const { src, dest, task, watch, series, parallel } = require('gulp');
const del = require('del');
const options = require('./gulp.config');
const browserSync = require('browser-sync').create();

const sass = require('gulp-sass');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');

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


// Production tasks
function prodClean(){
    console.log("Cleaning dist folder for fresh start.");
    return del([options.paths.build.base]);
}



function watchFiles() {
    watch(`${options.paths.src.base}/**/*.html`,series(devHTML, previewReload));
}

exports.dev = series(
    devClean,
    parallel(devHTML, devStyles, devScripts, devImages),
    livePreview,
    watchFiles
);


exports.prod = series(
    prodClean
);