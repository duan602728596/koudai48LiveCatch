# 获取直播列表
request = global.require('request')

# 请求头
HEADERS = {
  'os': 'android',
  'User-Agent': 'Mobile_Pocket',
  'IMEI': '864394020228161',
  'token': '0',
  'version': '4.0.4',
  'Content-Type': 'application/json;charset=utf-8',
  'Host': 'plive.48.cn',
  'Connection': 'Keep-Alive',
  'Accept-Encoding': 'gzip',
}

# 地址
URL = 'https://plive.48.cn/livesystem/api/live/v1/memberLivePage'

# 参数
DATA = '{"lastTime":0,"limit":20,"groupId":0,"memberId":0,"type":0,"giftUpdTime":1490857731000}'

getLiveList = ()->
  return new Promise((resolve, reject)=>
    request({
      'url': URL,
      'method': 'POST',
      'headers': HEADERS,
      'body': DATA,
      'encoding': 'utf8',
    }, (err, res, data)=>
      if err
        reject(err)
      else
        resolve(JSON.parse(data))
    )
  ).catch((err)=>
    console.error(err)
  )

export default getLiveList