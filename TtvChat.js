const { ApiClient } = require('@twurple/api');
const { AppTokenAuthProvider } = require('@twurple/auth');
const { bouyomiSend } = require('./httpRequest.js');
const Secret = require('./conf/Secret.js');


let helixClient = new ApiClient({
	authProvider: new AppTokenAuthProvider(Secret.ttv.CLIENT_ID, Secret.ttv.SECRET)
});
let comfyJS;


const ttvMode = async (channelId, WsSend) => {
	if (!channelId) {
		bouyomiSend('チャンネルIDを指定してください');
		return;
	} else {
		bouyomiSend(`チャンネルID ${channelId}へ　接続します`);
	}
	let comfy = require('comfy.js');

	comfy.onChat = async (user, message, flags, self, extra) => {
		let sendData = {
			userName: extra.username, data: {
				message: message,
				flags: flags,
				self: self,
				extra: extra,
				profilePictureUrl: null
			}
		};
		sendData.data.profilePictureUrl = await getProfilePictureUrl(extra.username);
		bouyomiSend(`${user}さん${message}`);
		WsSend(JSON.stringify(sendData));

	};
	comfy.onConnected = (address, port) => {
		console.log(`ComfyJS Connected to ${address}:${port}`);
	};


	// comfy.onCommand = async (user, command, message, flags, extra) => {
	// 	userList[extra.username] = { ...userList[extra.username] };
	// 	await setHelixUser(extra.username);
	// 	userList[extra.username].command = [
	// 		...userList[extra.username].command,
	// 		{ command: command, message: message }
	// 	];
	// 	userList[extra.username].flags = flags;
	// 	userList[extra.username].self = self;
	// 	userList[extra.username].extra = extra;
	// };


	if (!comfyJS) {
		comfy.Init(channelId, null, channelId);
		comfyJS = comfy;
	}

};

const getProfilePictureUrl = async (user) => {
	try {
		const helixUser = await helixClient.users.getUserByName({
			name: user
		});

		console.log(`${helixUser.displayName}のデータを取得しました`);
		return helixUser.profilePictureUrl;

	} catch (error) {
		bouyomiSend('ユーザデータの取得に失敗しました');
	}
};

module.exports = { ttvMode };