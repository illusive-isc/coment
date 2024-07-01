const axios = require('axios');

const bouyomiSend = (message) => {
    // axios.get(`http://localhost:50080/talk?text=${encodeURIComponent(message)}`)
    //     .then(response => {

    //     })
    //     .catch(error => {
    //         console.error('HTTPリクエストエラー:', error);
    //     });
    console.log(`棒読みへ送信:${message}`);
};

module.exports = { bouyomiSend, axios };
