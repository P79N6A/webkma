var concat = require('gulp-concat');
var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var htmlMin = require('gulp-htmlmin');
var rename = require('gulp-rename');

function resolve(file) {
    return path.resolve(`./MidWay/public/bower_components/${file}`);
}
function static(file) {
    return path.resolve(`./static/${file}`);
}
var dist = './MidWay/public/dist/';
gulp.task('scripts', function () {
    return gulp.src([resolve('polyfill/polyfill.min.js'),
    resolve('zepto/zepto.min.js'),
    resolve('layer.mobile-v2.0/layer_mobile/layer.js'),
    resolve('swiper-4.3.5/dist/js/swiper.min.js'),
    resolve('swiper-4.3.5/dist/js/swiper.animate1.0.3.min.js'),
    resolve('qrcodejs/qrcode.min.js'),
    resolve('pubsub/pubsub.min.js'),
    resolve('zepto.mdate/zepto.mdate.min.js')
    ]).pipe(concat('vendor.js')).pipe(gulp.dest(dist));
});
gulp.task('styles', function () {
    return gulp.src([resolve('animate.css/animate.min.css'),
    resolve('swiper-4.3.5/dist/css/swiper.min.css'),
    resolve('layer.mobile-v2.0/layer_mobile/need/layer-rem.min.css'),
    resolve('zepto.mdate/zepto.mdate.min.css')
    ]).pipe(concat('vendor.css')).pipe(gulp.dest(dist));
});
gulp.task('styles-custom', function () {
    return gulp.src([static('h5-framework.css'),
    ]).pipe(concat('h5-framework.css')).pipe(gulp.dest(dist));
});
gulp.task('copy', function () {
    return gulp.src([resolve('qrcodejs/qrcode.min.js')]).pipe(gulp.dest(dist))
})
gulp.task('compress:js', function (cb) {
    pump([
        gulp.src([static('h5-framework.js')]),
        concat('h5-framework.js'),
        uglify(),
        gulp.dest(dist)
    ], cb);
})
gulp.task('compress:h5', function (cb) {
    pump([
        gulp.src(static('h5-page-master.src.html')),
        htmlMin({
            minifyCSS: true,
            minifyJS: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeComments: true,
            ignoreCustomComments: [/\s*DataConfig\s*[\s\S]*\s*/],
            customAttrAssign: [/\{\{[\s\S]*\}\}/g]
        }),
        rename('h5-page-master.html'),
        gulp.dest('./static/')
    ], cb);
})
gulp.task('default', ['scripts', 'styles', 'styles-custom', 'copy', 'compress:js', 'compress:h5']);

