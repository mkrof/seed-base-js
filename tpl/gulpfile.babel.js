//import path from 'path';
//import del from 'del';
//import clor from 'clor';
import webpack from 'webpack';
//import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
//import karma from 'karma';
import browserSync from 'browser-sync';
import gulp from 'gulp';
//import sass from 'gulp-sass';
//import rename from 'gulp-rename';
//import nunjucks from 'gulp-nunjucks-render';
//import autoprefixer from 'gulp-autoprefixer';
//import merge from 'merge-stream';
//import config from './build.config.js';
//import api from './ui/api';

// npm run build -- --env=prod
const argv = require('minimist')(process.argv.slice(2));
const ENV = argv.env && argv.env.toLowerCase() === 'prod' ? 'PROD' : 'DEV';

console.log(`
  ${clor.gray('==========================')}
  ${clor.green('    Running ' + ENV + ' build')}
  ${clor.gray('==========================')}
`);

const webpackConfig = Object.assign({}, config.webpack)
if (ENV === 'PROD') {
  webpackConfig.plugins.push(config.definePlugin);
  webpackConfig.plugins.push(config.uglifyJsPlugin);
}

gulp.task('clean-scripts', () => del.sync([config.paths.scripts.dist]));
gulp.task('clean-styles', () => del.sync([config.paths.styles.dist]));
gulp.task('clean', ['clean-scripts', 'clean-styles']);

gulp.task('run-tests', function (done) {
  new karma.Server({
    configFile: path.join(__dirname, 'karma.conf.js'),
    singleRun: true
  }, done).start();
});

const compileStyles = (src, name) => (
  gulp.src(src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions']})) 
    .pipe(rename(name))
    .pipe(gulp.dest(config.paths.styles.dist))
);

gulp.task('build-styles', ['clean-styles'], () => (
  merge(
    compileStyles(config.paths.styles.src, 'cb.css'),
    compileStyles(config.paths.styles.sitecore, 'cb-sitecore.css')
  )
));

gulp.task('build-scripts', ['clean-scripts'], done => {
  webpack(webpackConfig, (err, stats) => {
    console.log(err ? err : stats.toString());
    done();
  });
});

gulp.task('build-template-pages', () => {
  return gulp.src(config.paths.templates.pages)
    .pipe(nunjucks({ path: [config.paths.templates.root] }))
    .pipe(gulp.dest(config.paths.server.pages));
});

gulp.task('build-template-components', () => {
  return gulp.src(config.paths.templates.components)
    .pipe(nunjucks({ path: [config.paths.templates.root] }))
    .pipe(gulp.dest(config.paths.server.components));
});

gulp.task('build-templates', ['build-template-pages', 'build-template-components']);

gulp.task('build', ['run-tests', 'build-styles', 'build-scripts', 'build-templates'])
gulp.task('build-skip-tests', ['build-styles', 'build-scripts', 'build-templates'])

gulp.task('default', ['build']);

gulp.task('watch-styles', ['build-styles'], browserSync.reload);
gulp.task('watch-scripts', ['run-tests', 'build-scripts'], browserSync.reload);
gulp.task('watch-templates', ['build-templates'], browserSync.reload);

gulp.task('serve', ['build'], () => {
  browserSync.init({
    startPath: 'UI/build/pages',
    server: {
      baseDir: './',
      directory: true,
      middleware: function (req, res, next) {
        if(api[req.url]) {
          api[req.url](req, res);
        }
        next();
      }
    },
    notify: false
  });
  gulp.watch(config.paths.styles.all, ['watch-styles']);
  gulp.watch(config.paths.scripts.all, ['watch-scripts']);
  gulp.watch(config.paths.templates.all, ['watch-templates']);
});

