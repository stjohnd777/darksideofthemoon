module.exports = {

    entry : __dirname + '/src/client/App.js',

    output: {
        path: __dirname + '/public/dist/',
        filename : 'bundle.js'
    },

    devtool: 'source-map',

    module : {
        loaders :[
            // es6 -> es5 and react
            // todo type script
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader : 'babel-loader',
                query :{
                    presets : ['es2015','react']
                }
            },
            // images
            {
                test:/\.(png|jpg|jpeg)$/,
                loader:'url-loader?limit=4000000000'
            },
            // css and scss
            {
                test: /\.scss/,
                loader:'style-loader!css-loader!sass-loader'
            }
        ]
    }
}