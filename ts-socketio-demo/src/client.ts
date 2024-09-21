import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:6060');

socket.on('connect', () => {
    console.log('connected to server');
});

socket.on('receive_message', (msg) => {
    console.log('new message:', msg);
});

async function sendMessage() {
    for (let i = 0; i < 10; i++) {
        // 向服务器发送消息
        socket.emit('message', 'Hello from Koa client!');

        console.log("hello world");
        // 休眠 1 秒
        await new Promise((resolve) => setTimeout(resolve, 1000)); //
    }
}

async function main() {
    await sendMessage();
}

main().then(r => {
    console.log('done');});
