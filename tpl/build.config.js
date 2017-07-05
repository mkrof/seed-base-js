import webpack from 'webpack';

const paths = {
  styles: {
    src: 'Styles/src/main.scss',
    dist: 'content/Styles/',
    all: 'Styles/src/**/*.scss',
    sitecore: 'Styles/src/sitecore/main.scss'
  },
  scripts: {
    root: 'Scripts/src/',
    components: 'Scripts/src/components',
    src: 'Scripts/src/main.js',
    dist: 'content/Scripts/',
    all: 'Scripts/src/**/**/*.js',
    specs: 'Scripts/**/*.spec.js'
  },
  templates: {
    all: 'ui/src/**/*.html',
    root: 'ui/src',
    pages: 'ui/src/pages/**/*.html',
    components: 'ui/src/components/**/*.html'
  },
  server: {
    root: 'ui/build',
    pages: 'ui/build/pages',
    components: 'ui/build/components'
  }
};

const webpackConfig = {
  entry: {
    common: [
      'babel-polyfill', 
      'jquery',
      'jquery-validation',
      'jquery-validation-unobtrusive'
    ],
    main: `./${paths.scripts.src}`,
    locationFinder: `./${paths.scripts.components}/location/`
  },
  output: {
    path: paths.scripts.dist,
    filename: 'cb.[name].js',
    sourceMapFilename: '[file].json'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: { presets: ['env']}
      }]
    }]
  },
  resolve: {
    alias: {
      jquery: 'jquery/src/jquery'
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'common' })
  ],
  devtool: 'source-map'
};

const definePlugin = new webpack.DefinePlugin({
  'process.env': {
     NODE_ENV: JSON.stringify('production')
   }
})

const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
    properties: true,
    sequences: true,
    dead_code: true,
    conditionals: true,
    comparisons: true,
    evaluate: true,
    booleans: true,
    unused: true,
    loops: true,
    hoist_funs: true,
    cascade: true,
    if_return: true,
    join_vars: true,
    drop_console: true,
    drop_debugger: true,
    unsafe: true,
    hoist_vars: true,
    negate_iife: true,
    side_effects: true
  },
  mangle: {
    toplevel: true,
    sort: true,
    eval: true,
    properties: true
  },
  output: {
    space_colon: false,
    comments: function (node, comment) {
      return false;
    }
  },
  comments: function (node, comment) {
    return false;
  }
});

export default { paths, webpack: webpackConfig, uglifyJsPlugin, definePlugin };
