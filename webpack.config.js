module.exports = {
    entry: [
        "./src/index.ts",
        "./src/events.ts",
        "./src/dom.ts",
        "./src/service_management.ts"
    ],
    output: {
        filename: "dist/owlonweb.js"
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
}
