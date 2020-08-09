const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        main: ['babel-polyfill', './src/index.js'],
        vendor: './src/vendor.js'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js'
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/template.html",
            favicon: "./src/images/favicon.png"
        }),
        // new FaviconsWebpackPlugin({
        //         logo: "./src/images/favicon.png",
        //         publicPath: './public',
        //         outputPath: '/icons',
        //         // prefix: 'icons/',
        //         inject: true,
        //         //  favicons: {
        //         //     background: '#ddd',
        //         //     theme_color: '#333',
        //         //  }
        //     }

        // ) //   https://www.npmjs.com/package/favicons-webpack-plugin
    ],

    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },

            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [{
                        loader: "style-loader",
                        options: {
                            injectType: 'styleTag'
                        }
                    },

                    {
                        loader: 'css-loader'
                    },

                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('tailwindcss'),
                                require('autoprefixer'),
                                require('@fullhuman/postcss-purgecss')({

                                    // Specify the paths to all of the template files in your project
                                    content: [
                                        './src/**/*.html'
                                    ],

                                    // This is the function used to extract class names from your templates
                                    defaultExtractor: content => {
                                        // Capture as liberally as possible, including things like `h-(screen-1.5)`
                                        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []

                                        // Capture classes within other delimiters like .block(class="w-1/2") in Pug
                                        const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []

                                        return broadMatches.concat(innerMatches)
                                    }
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.html$/i,
                exclude: /node_modules/,
                loader: 'html-loader',
            },

            {
                test: /\.(svg|png|jpg|gif)$/, // expression "img-optimize" /\.(png|jpe?g|webp|git|svg|)$/i,
                exclude: /node_modules/,
                loader: "file-loader", // do not compress image
                options: {
                    name: "[name].[ext]", // file-loader options
                    outputPath: "img"
                }
            }
        ]
    },
    // devServer: {
    //     contentBase: path.resolve(__dirname, 'dist'),
    //     publicPath: '/dist/'
    // },
    devtool: 'source-map'
}