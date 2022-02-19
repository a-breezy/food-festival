const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
	require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackPwaManifest = require("webpack-pwa-manifest");

module.exports = {
	entry: {
		app: "./assets/js/script.js",
		events: "./assets/js/events.js",
		schedule: "./assets/js/schedule.js",
		tickets: "./assets/js/tickets.js",
	},
	output: {
		filename: "[name].bundle.js",
		path: __dirname + "/dist",
	},
	module: {
		rules: [
			{
				test: /\.jpg$/i,
				use: [
					{
						loader: "file-loader",
						options: {
							esModule: false,
							name(file) {
								return "[path][name].[ext]";
							},
							publicPath: function (url) {
								return url.replace("../", "/assets/");
							},
						},
					},
					{
						loader: "image-webpack-loader",
					},
				],
			},
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
		}),
		// new BundleAnalyzerPlugin({
		// 	analyzerMode: "static", // report outputs an HTML file (report.html) to dist folder
		// }),
		new WebpackPwaManifest({
			name: "Food Event",
			short_name: "Foodies",
			description: "An app that allows you to view the upcoming food events.",
			start_url: "../index.html",
			background_color: "#01579b",
			theme_color: "#ffffff",
			// tells webpack not to create new fingerprints every time manifest is created
			fingerprints: false,
			// determines whether or not to add manifest.json to html
			inject: false,
			// provides an icon to user's homepage
			icons: [
				{
					src: path.resolve("assets/img/icons/icon-512x512.png"),
					sizes: [96, 128, 192, 256, 384, 512],
					// designates where icons are sent after creation of manifest
					destination: path.join("assets", "icons"),
				},
			],
		}),
	],
	devServer: {
		static: {
			directory: path.join(__dirname, "./"),
		},
		compress: true,
		port: 8080,
	},
	mode: "development",
};
