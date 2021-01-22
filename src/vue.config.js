const webpack = require('webpack')

const WebpackZipPlugin = require('webpack-zip-plugin')

module.exports = {

    devServer: {
        proxy: 'http://47.92.151.165:8080'
    },

    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                
            }),
            new WebpackZipPlugin({
                initialFile: './app',
                endPath: './',
                zipName: 'app.zip',
                //frontShell: 'sed -i "s/src="/src="\/app\/matrix\/m3event/g ./app/matrix/m3event/index.html && sed -i "s/href="/href="\/app\/matrix\/m3event/g ./app/matrix/m3event/index.html',
                frontShell: 'ls -lsa && ls',
                behindShell: 'echo ********** && ls -lsa ./app.zip'
            })
        ]
    },

    outputDir: 'app/matrix/m3graph',
    productionSourceMap: false
}