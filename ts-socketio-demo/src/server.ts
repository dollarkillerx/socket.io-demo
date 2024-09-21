import Koa from 'koa';
import Router from 'koa-router';
import http from 'http';
import { Server, Socket} from 'socket.io';
import {DefaultEventsMap} from 'socket.io/dist/typed-events';
import utils from "./utils";

// 创建 Koa 应用实例
const app = new Koa();
const router = new Router();  // 创建 Router 实例
const server = http.createServer(app.callback());
const io = new Server(server, {
    cors: {
        origin: "*", // 允许所有来源跨域
        methods: ["GET", "POST"],
        credentials: true
    }
});

const key = "9f28ea03827fa036";

// 添加 `/key` 路由
router.get("/key", async (ctx) => {
    ctx.body = key;
});

// 添加 `/message` 路由，返回 "helloworld"
router.get("/message", async (ctx) => {
    ctx.body = "helloworld";
    if (mySocket) {
        mySocket.emit('receive_message', {
            handshake: key,
            data: utils.encryp(key, respData)
        });
    }
});

// 使用 router 中间件
app.use(router.routes()).use(router.allowedMethods());


let mySocket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
// Socket.IO 连接处理
io.on('connection', (socket) => {
    console.log('a user connected');
    mySocket = socket;

    // 处理客户端发送的消息
    socket.on('message', (msg) => {
        console.log('message received:', msg);
        io.emit('receive_message', msg);  // 广播消息给所有客户端
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('login', (msg) => {
        console.error('socket login:', msg);
    });
});

// 监听端口
const PORT = 6060;
server.listen(PORT, () => {
    console.log(`Koa server listening on port ${PORT}`);
});


const respData = `
{
    "id": "66eb6e33a5bb5555110b4122",
    "socket": true,
    "forced": false,
    "type": "UserEarningsNotification",
    "title": "收益到賬通知",
    "data": {
        "id": 131129,
        "bill_type": "income",
        "wallet_type": "points_balance",
        "wallet_slug": "interest",
        "action_type": "DepositProductInterest",
        "fee": 8.33,
        "user_id": 6820393,
        "target_id": "675507675349385216",
        "params": {
            "sub_title": "Облигации с гарантированной доходностью",
            "username": "Hana Nuraini",
            "amount": "20000",
            "is_discount_buy": false,
            "pay_type": "balance",
            "pay_amount": "20000",
            "org_price_points": "0.00",
            "org_price_balance": "20000.00",
            "rate": "1.00"
        },
        "created_at": "2024-09-19 08:20:03"
    },
    "params": {
        "created_at": "19/09/2024 08:20",
        "day_cycle": 5,
        "interest": 8.33,
        "mg_title": {
            "CN": "保证收益债券",
            "DE": null,
            "EN": "Guaranteed return bonds",
            "ES": null,
            "IN": null,
            "JP": null,
            "KO": null,
            "PL": null,
            "PO": null,
            "RU": "Облигации с гарантированной доходностью",
            "SE": null,
            "TR": null,
            "TW": "保證收益債券"
        },
        "name": "Облигации с гарантированной доходностью",
        "amount": 20000,
        "rate": "1.00",
        "wallet_type": "points_balance",
        "action_type_lang": "DepositProductInterest"
    },
    "read": false,
    "created_at": "2024-09-19 08:20:03"
}`;