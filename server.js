const { ttvMode } = require('./TtvChat.js');
const WebSocket = require('ws');
const args = process.argv.slice(2);
const port = args[0];
const url = args[1];

const wss = new WebSocket.Server({ port: port });
console.log(`WebSocket鯖 開始: port ${port}`);

wss.on('connection', (ws) => {
	console.log('\n\n' + ('-'.repeat(80)));
	console.log('クライアント接続');
	console.log(`接続数：${wss.clients.size}`);

	ws.on('message', (reqStr) => {
		console.log('Received: %s', reqStr);
		const req = JSON.parse(reqStr.toString());
		if (req.mode == 'ttv') ttvMode(req.channelId, (message) => { ws.send(message) });
		if (req.method && req.method == "getUrl") {
			ws.send(JSON.stringify({ url: url }))
		}
	});

	// クライアントが接続を閉じたときの処理
	ws.on('close', () => {
		console.log('クライアント切断');
	});
});