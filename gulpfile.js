var gulp = require('gulp'),
    watch = require('gulp-watch')
    csscomb = require('gulp-csscomb'),
    postcss = require('gulp-postcss'),
    less = require('gulp-less'),
    jade = require('gulp-jade'),
    wrap = require('gulp-wrap-amd'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    concat = require('gulp-concat-util');

var path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/main.js',
    style: 'src/style/main.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: './build'
};

gulp.task('webserver', function () {
  browserSync({
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 8888
  });
});

gulp.task('jade', function() {
  gulp.src('./src/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./build/'))
    .pipe(reload({stream: true}));
});

gulp.task('less', function() {
  gulp.src('src/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      cleancss: false
      }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('src/css/'))
    .pipe(reload({stream: true}));

  // gulp.src('src/less/**/*.less')
  //   .pipe(sourcemaps.init())
  //   .pipe(less())
  //   .pipe(sourcemaps.write('./maps'))
  //   .pipe(gulp.dest('src/css/main/'))
  //   .pipe(reload({stream: true}));

  
})

gulp.task('css', function(){
  gulp.src('src/css/lib/main-style/main.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer({ browsers: ['last 20 versions'] }) ]))
    // .pipe(csscomb('src/css/config-csscomb.json'))
    .pipe(concat.header('/* ============================= START <%= file.relative %> ============================= */\n'))
    .pipe(concat.footer('\n/* ============================= END <%= file.relative %> ============================= */\n'))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css'))
    .pipe(cssmin())
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(reload({stream: true}));
})
gulp.task('img', function () {
    gulp.src('src/img/**/*.*')
        .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()],
          interlaced: true
        }))
        .pipe(gulp.dest('build/img'))
        .pipe(reload({stream: true}));
});

gulp.task('fonts', function() {
    gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'))
});

gulp.task('js', function(){
  return gulp.src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(reload({stream: true}));
});

gulp.task('watch', function () {
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch(['src/**/*.less'], ['less']);
  gulp.watch('src/css/lib/**/*.css', ['css']);
  gulp.watch('src/img/**/*.*', ['img']);
  gulp.watch('src/fonts/**/*.*', ['fonts']);
  gulp.watch('src/**/*.jade', ['jade']);
});

gulp.task('default', ['webserver', 'jade', 'less', 'css', 'img', 'fonts', 'js', 'watch']);