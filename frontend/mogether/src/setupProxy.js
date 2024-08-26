const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', 
    createProxyMiddleware({
      target: 'https://api.mo-gether.site', 
      changeOrigin: true, 
      secure: true, 
    })
  );
};
