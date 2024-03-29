const webpack = require('webpack')
const WebpackZipPlugin = require('webpack-zip-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const path = require('path')
const IS_PROD = process.env.NODE_ENV === 'production'
const productionGzipExtensions = ['html', 'js', 'css']

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    devServer: {
        host: '0.0.0.0',
        https: false, //false关闭https，true为开启
        open: true, //自动打开浏览器
        port: 8080,
        /* proxy: {
            '/static': {
                target: 'http://47.92.151.165:8080/',
                changeOrigin: true,  //允许跨域
                pathRewrite: {   //重写路径，这种是没有我们定义的前缀
                    '^/static': '/' 
                }
            }
        } */
    },

    outputDir: 'app/matrix/' + process.env.VUE_APP_M3_APP,
    productionSourceMap: false,

    configureWebpack: config => {
        // 生产环境
        if (IS_PROD) {

            return {
                
                plugins: [
                    
                    new CompressionPlugin({
                        test: new RegExp(
                            '\\.(' + productionGzipExtensions.join('|') + ')$'
                        ),
                        threshold:10240,
                        minRatio: 1,
                        deleteOriginalAssets:false
                    }),
                    new WebpackZipPlugin({
                        initialFile: 'app',
                        endPath: './',
                        zipName: process.env.VUE_APP_M3_APP+'.zip',
                        //frontShell: 'sed -i \'\' \'s/src="/src="\\/static\\/app\\/matrix\\/m3event/g\; s/href="/href="\\/static\\/app\\/matrix\\/m3event/g\' ./app/matrix/m3event/index.html',
                        //frontShell: 'sed -i \'\' \'s/src="/src="\\/static\\/app\\/matrix\\/m3event/g\; s/href="/href="\\/static\\/app\\/matrix\\/m3event/g\' ./app/matrix/m3event/index.html',
                        behindShell: './deploy.sh ' + process.env.VUE_APP_M3_HOST + ' ' + process.env.VUE_APP_M3_COMPANY + ' ' + process.env.VUE_APP_M3_USERNAME + ' "' + process.env.VUE_APP_M3_PASSWORD + '" ' + process.env.VUE_APP_M3_APP + ' ' + process.env.VUE_APP_M3_TITLE
                    })
                ]
            }
        }
      },

    chainWebpack(config) {
      
      // ============压缩图片 start============
      config.module
          .rule('images')
          .use('image-webpack-loader')
          .loader('image-webpack-loader')
          .options({ bypassOnDebug: true })
          .end()
      // ============压缩图片 end============

      // set svg-sprite-loader
      config.module
        .rule('svg')
        .exclude.add(resolve('src/icons'))
        .end()
      config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
        .end()
  },

  publicPath: process.env.NODE_ENV === 'production'?'/static/app/matrix/'+process.env.VUE_APP_M3_APP:''

}