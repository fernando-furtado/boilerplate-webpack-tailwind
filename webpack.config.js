const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const purgecss = require('@fullhuman/postcss-purgecss');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    mode: "production",
    entry: {
        main: ['babel-polyfill', './src/index.js'],
        vendor: './src/vendor.js'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name]-[contenthash:8].js'
    },

    // optimization: {
    //     minimizer: new 
    // },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "styles-[contenthash:8].css"
        }), 
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/template.html",
            favicon: "./src/images/favicon.png"
             // enable this option to inject favicon. It's an simpler alternative to FaviconsWebpackPlugin().
            //  minify: {
            //      removeAttributeQuotes: true,
            //      collapseWhitespace: true,
            //      removeComments: true
            //  }
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

    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin()
        ]
    },

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
                        loader: MiniCssExtractPlugin.loader,
                        // loader: "style-loader",
                        //  options: {
                        //      injectType: 'styleTag'
                        //  }
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
                                purgecss({

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
                test: /\.(png|jpe?g|webp|git|svg|)$/i, // expression "img-optimize" /\.(png|jpe?g|webp|git|svg|)$/i,
                exclude: /node_modules/,
                loader: "img-optimize-loader", // "file-loader" do not compress image | expression /\.(svg|png|jpg|gif)$/
                options: {
                    compress: {
                        // This will transform your png/jpg into webp.
                        mode: 'lossless', // lossless, low, high
                        // webp: true,
                        // disableOnDevelopment: true
                    }
                }
                // options: {
                //     name: "[name].[hash].[ext]",    // file-loader options
                //      outputPath: "img"
                // }
            }
        ]
    },
    // devServer: {
    //     contentBase: path.resolve(__dirname, 'public'),
    //     // publicPath: '/scripts/'
    // },
    // devtool: 'source-map'
}