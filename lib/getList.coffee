# 获取当前成员的视频链接
request = require('request')

# 请求头
HEADERS = {
  'Content-Type': 'application/json',
  'os': 'android',
  'version': '4.1.0',
}

getList = (memberId)->
  # 请求数据
  data = '{"lastTime":0,"limit":1000,"groupId":0,"memberId":' + memberId + ',"type":1,"giftUpdTime":0}'

  return new Promise((resolve, reject)=>
    request({
      'uri': 'https://plive.48.cn/livesystem/api/live/v1/memberLivePage',
      'method': 'POST',
      'headers': HEADERS,
      'body': data,
      'encoding': 'utf8',
    }, (err, res, body)=>
      if err
        reject(err)
      else
        resolve(JSON.parse(body))
    )
  ).catch((err)=>
    console.error(err)
  )

module.exports = getList