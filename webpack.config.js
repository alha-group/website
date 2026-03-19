const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

// Custom Sass importer to resolve glob patterns like 'functions/**/*'
function globImporter(url, prev) {
  if (!url.includes('*')) return null;
  const basePath = prev === 'stdin' ? path.join(__dirname, 'source/stylesheets') : path.dirname(prev);
  const pattern = url.includes('.') ? url : url + '.+(sass|scss)';
  const files = glob.sync(pattern, { cwd: basePath, nodir: true });
  if (files.length === 0) return null;
  const contents = files.map(f => `@import '${path.join(basePath, f)}';`).join('\n');
  return { contents };
}

module.exports = {
  entry: {
    application: './source/javascripts/index.js',
    styles: './source/stylesheets/_application.sass',
    svg: './source/fonts/svg/svg_icons.js'
  },
  resolve: {
    modules: [
      path.join(__dirname, 'source/stylesheets'),
      path.join(__dirname, 'source/javascripts'),
      'node_modules'
    ],
    alias: {
      modernizr$: path.resolve(__dirname, '.modernizrrc.js')
    }
  },
  output: {
    path: path.resolve(__dirname, '.tmp/dist'),
    filename: 'javascripts/[name].js',
  },
  module: {
    rules: [
      {
        loader: 'webpack-modernizr-loader',
        test: /\.modernizrrc\.js$/
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false } },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer()]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              api: 'legacy',
              sassOptions: {
                importer: [globImporter],
                includePaths: [path.join(__dirname, 'source/stylesheets'), 'node_modules']
              }
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: 'fonts/svg/sprite.svg'
            }
          },
          {
            loader: 'svgo-loader',
            options: {
              multipass: true,
              plugins: [
                'cleanupAttrs',
                'cleanupEnableBackground',
                'cleanupIds',
                'cleanupListOfValues',
                'cleanupNumericValues',
                'collapseGroups',
                'convertColors',
                'convertPathData',
                'convertShapeToPath',
                'convertStyleToAttrs',
                'convertTransform',
                'mergePaths',
                'moveElemsAttrsToGroup',
                'moveGroupAttrsToElems',
                'removeComments',
                { name: 'removeDesc', params: { removeAny: false } },
                'removeDimensions',
                'removeDoctype',
                'removeEditorsNSData',
                'removeEmptyAttrs',
                'removeEmptyContainers',
                'removeEmptyText',
                'removeHiddenElems',
                'removeMetadata',
                'removeNonInheritableGroupAttrs',
                'removeRasterImages',
                'removeScriptElement',
                { name: 'removeTitle', params: { removeAny: false } },
                'removeUnknownsAndDefaults',
                'removeUnusedNS',
                'removeUselessDefs',
                'removeUselessStrokeAndFill',
                { name: 'removeViewBox', active: false },
                'removeXMLProcInst',
                'sortAttrs'
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].css'
    }),
    new SpriteLoaderPlugin({
      plainSprite: true,
      spriteAttrs: {
        id: 'svg-sprite-inline'
      }
    })
  ]
};
