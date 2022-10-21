
const Agent = require('agentkeepalive');

module.exports = {
	lintOnSave: false,
	devServer: {
		disableHostCheck: true,
		port: 4848,
		hot: true, // enable HMR on the server
		historyApiFallback: true,
		proxy: {
			'^/api/': {
				target: 'http://localhost:5000',
				changeOrigin: true,
				agent: new Agent({
					maxSockets: 100,
					keepAlive: true,
					maxFreeSockets: 10,
					keepAliveMsecs: 100000,
					timeout: 6000000,
					keepAliveTimeout: 90000 // free socket keepalive for 90 seconds
				}),
				onProxyRes: (proxyRes) => {
					let key = 'www-authenticate';
					proxyRes.headers[key] = proxyRes.headers[key] && proxyRes.headers[key].split(',');
				},
			}
		}
	}
};
