/* 获取数据 */
const nodegrass = node_require('nodegrass');

const url = 'https://plive.48.cn/livesystem/api/live/v1/memberLivePage';
const headers = {
    'os': 'android',
    'User-Agent': 'Mobile_Pocket',
    'IMEI': '864394020228161',
    'token': '0',
    'version': '4.0.4',
    'Content-Type': 'application/json;charset=utf-8',
    'Host': 'plive.48.cn',
    'Connection': 'Keep-Alive',
    'Accept-Encoding': 'gzip'
};

/* post数据 */
function postData(number = 0){
    return `{"lastTime":${ number },"limit":20,"groupId":0,"memberId":0,"type":0,"giftUpdTime":1490857731000}`;
}

/* post请求 */
function post(number, callback){
    nodegrass.post(url, (data, status, headers)=>{

        callback(data, status, headers);

    }, headers, postData(number));
}

module.exports = post;