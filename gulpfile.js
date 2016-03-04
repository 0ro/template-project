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
    jade: './build/',
    js: './build/js/',
    css: './build/css',
    less: './src/css/',
    img: './build/img/',
    fonts: './build/fonts/'
  },
  src: {
    jade: './src/*.jade',
    js: './src/js/main.js',
    css: './src/css/lib/main-style/main.css',
    less: './src/**/*.less',
    img: './src/img/**/*.*',
    fonts: './src/fonts/**/*.*'
  },
  watch: {
    jade: './src/**/*.jade',
    js: './src/js/**/*.js',
    css: './src/css/lib/**/*.css',
    less: './src/**/*.less',
    img: './src/img/**/*.*',
    fonts: './src/fonts/**/*.*'
  },
  maps: './maps'
};

gulp.task('webserver', function () {
  browserSync({
    server: {
        baseDir: "./"
    },
    tunnel: true,
    host: 'localhost',
    port: 8888,
    logPrefix: 'frontend-db'
  });
});

gulp.task('jade', function() {
  var fs = require('fs'),
    paths = __dirname+'/src/css/lib',
    cssIgnore = paths+'/'+'main-style',
    cssDir = [],
    cssList = [];
  fs.readdir(paths, function(err, items) {
    for (var i=0; i<items.length; i++) {
      var subPaths = paths+'/'+items[i];
      if(subPaths !== cssIgnore) {
        cssDir.push(items[i])
        // fs.readdir(subPaths, function(err, subItems){
        //   for (var j=0; j<subItems.length; j++) {
        //     cssList.push(subItems[j])
        //   }
        // })
      }
    }
  })
  return gulp.src(path.src.jade)
    .pipe(jade(
      {
        locals: {
          'cssDir': cssDir,
          'cssList': cssList,
        }
      }
    ))
    .pipe(gulp.dest(path.build.jade))
    .pipe(reload({stream: true}));
});

gulp.task('less', function() {
  gulp.src(path.src.less)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write(path.maps))
    .pipe(gulp.dest(path.build.less))
    .pipe(reload({stream: true}));
})

gulp.task('css', function(){
  gulp.src(path.src.css)
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer({ browsers: ['last 20 versions'] }) ]))
    // .pipe(csscomb('src/css/config-csscomb.json'))
    .pipe(concat.header('/* ============================= START <%= file.relative %> ============================= */\n'))
    .pipe(concat.footer('\n/* ============================= END <%= file.relative %> ============================= */\n'))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.build.css))
    .pipe(cssmin())
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
})
gulp.task('img', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()],
          interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('js', function(){
  return gulp.src(path.src.js)
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('watch', function () {
  gulp.watch(path.watch.js, ['js']);
  gulp.watch(path.watch.less, ['less']);
  gulp.watch(path.watch.css, ['css']);
  gulp.watch(path.watch.img, ['img']);
  gulp.watch(path.watch.fonts, ['fonts']);
  gulp.watch(path.watch.jade, ['jade']);
});

gulp.task('default', ['webserver', 'jade', 'less', 'css', 'img', 'fonts', 'js', 'watch']);