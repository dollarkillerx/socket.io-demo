import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const targetUrl = 'http://127.0.0.1:6060'; // 你的后端服务器地址

// 设置 CORS 头部
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // 允许所有来源跨域访问
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// 全局代理设置，支持 WebSocket
app.use(
    '*',  // 使用 '*' 代理所有路径
    createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,  // 改变请求头中的 Origin
        ws: true,  // 启用 WebSocket 支持
        // onProxyReq: (proxyReq, req, res) => {
        //     // 可选：在请求代理前进行处理
        // },
        // onProxyRes: (proxyRes, req, res) => {
        //     // 可选：在响应返回时进行处理
        // },
        // onError: (err, req, res) => {
        //     // 处理代理错误
        //     res.status(500).send('Proxy error');
        // }
    })
);

// 启动服务器
const port = 6061;
app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});