var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    nano = require('gulp-cssnano'),
    precss = require('precss'),
    notify = require('gulp-notify'),
    gulpStylelint = require('gulp-stylelint'),
    browserSync = require('browser-sync'),
    sprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    htmlmin = require('gulp-htmlmin');

// SVG tasks
gulp.task('svgSprite', function () {
    var configSprite = {
      dest: './app/assets/images/icons',
      shape: {
        dimension: {
            maxWidth: 32,
            maxHeight: 32
        },
        spacing: {
            padding: 0, // Padding around all shapes
            box: 'content'
        },
        dest: '.'    // Keep the intermediate files
      },
      mode: {
        inline: true,
        symbol: {
          dest: '.',
          sprite: '../icons.svg'
        }
      }
    };

    return gulp.src('./src/assets/images/icons/*.svg')
      .pipe(sprite(configSprite))
      .pipe(gulp.dest(configSprite.dest));
});

gulp.task('svg', function () {
    return gulp.src('./src/assets/images/**/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('./app/assets/images'));
});

// Html minify
gulp.task('html', function() {
  return gulp.src('./src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./app/'));
});

// CSS processors
gulp.task('css', function() {
    var processors = [
        precss,
        autoprefixer({
          browsers: ['last 2 versions']
        })
    ];
    var configNano = {
      discardComments: { removeAll: true },
      safe: true,
      sourcemap: true,
      discardUnused: false,
      zindex: false,
      autoprefixer: false
    };
    return gulp.src('./src/assets/styles/*.css')
        .pipe(gulpStylelint({
          reporters: [
            {formatter: 'string', console: true}
          ]
        }))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dest'))
        .pipe(nano(configNano))
        .pipe(gulp.dest('./app/assets/styles'))
        .pipe( browserSync.stream() )
        .pipe(notify({ message: 'CSS compiled !!' }));
});


// Static server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './app/'
        }
    });
});

// Watch
gulp.task('watch', function() {
    gulp.watch('src/**/*.css', ['css']);
    gulp.watch('src/assets/images/**/*.*', ['svg']);
    gulp.watch('src/*.html', ['html']);
});

// Default
gulp.task('default', ['html', 'svgSprite' , 'svg', 'css', 'browser-sync', 'watch']);
