import utils from "./utils";
import { io, Socket } from "socket.io-client";

// 此处路径应根据服务器进行设置
// const listenUrl = 'http://154.204.57.157:19977';
const listenUrl = 'http://127.0.0.1:6060';

const socket: Socket = io(listenUrl, {
    reconnectionAttempts: 10,     // 限制对于 socket 服务器的重连次数为10次
});

interface Body {
    handshake: string;
    data: string;
}

const body: Body = {
    handshake: '',
    data: '',
};

const tokenId = "b2343103bbe43213a8c9f51b48fd0cb0512e1";
const equipment = "h5"; //"h5","ios","安卓"
const userId = "2034538";

// 接收到连接时
socket.on('connect', () => {
    const data = {
        userId,
        socketId: socket.id,
        equipment,
        tokenId
    };

    body.handshake = utils.guid();
    body.handshake = "9f28ea03827fa036";
    body.data = utils.encryp(body.handshake, data) || '';

    dump("###登陆-加密请求");
    dump('文明:' + JSON.stringify(data));
    dump('handshake:' + body.handshake);
    dump('data:' + body.data);

    socket.emit('login', body);
});

// 监听接收到消息时
socket.on('receive_message', (responded: { handshake: string; data: string }) => {
    const decryptedData = utils.decrypt(responded.handshake, responded.data) || '';

    dump("###推送-加密响应");
    dump('handshake:' + responded.handshake);
    dump('data:' + responded.data);
    dump('明文:' + decryptedData);

    try {
        const parsedData = JSON.parse(decryptedData);
        console.log("响应对象->", parsedData);
        // 你可以在这里处理解密后的消息
    } catch (error) {
        console.error("解密后的数据无法解析为 JSON:", error);
    }
});

function dump(_cxt: string): void {
    console.log(_cxt);
}
