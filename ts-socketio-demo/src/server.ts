import Koa from 'koa';
import http from 'http';
import { Server } from 'socket.io';

// 创建 Koa 应用实例
const app = new Koa();
const server = http.createServer(app.callback());
const io = new Server(server);

// 简单的 Koa 中间件
app.use(async (ctx) => {
    ctx.body = '<h1>Socket.IO with Koa Server</h1>';
});

// Socket.IO 连接处理
io.on('connection', (socket) => {
    console.log('a user connected');

    // 处理客户端发送的消息
    socket.on('message', (msg) => {
        console.log('message received:', msg);
        io.emit('receive_message', msg);  // 广播消息给所有客户端
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// 监听端口
const PORT = 6060;
server.listen(PORT, () => {
    console.log(`Koa server listening on port ${PORT}`);
});
