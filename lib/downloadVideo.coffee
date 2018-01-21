# 下载视频
path = require('path')
fs = require('fs')
child_process = require('child_process')
moment = require('moment')

LOG = path.join(__dirname, '../log/end.txt')

# 判断该视频是否下载完成
isEnding = (item)->
  return new Promise((resolve, reject)=>
    if !fs.existsSync(LOG)
      resolve(false)
    else
      fs.readFile(LOG, (err, data)=>
        if err
          reject(err)
        else
          # 判断日志中有没有id
          idList = data.toString().split('\n')
          resolve(idList.includes(item.liveId))
      )
  ).catch((err)=>
    console.error(err)
  )

# 追加日志
writeLog = (item)->
  return new Promise((resolve, reject)=>
    fs.writeFile(LOG, '\n' + '#' + moment(item.startTime).format('YYYY-MM-DD HH:mm:ss') + ' ' + item.title + '\n' + item.liveId + '\n', {
      'encoding': 'utf8',
      'flag': 'a',
    }, (err)=>
      if err
        reject(err)
      else
        resolve()
    )
  ).catch((err)=>
    console.error(err)
  )

downloadVideo = (item)->
  # 获取时间
  time = moment(item.startTime)
  timeStr = time.format('YYYY.MM.DD')
  # 直播类型
  type = if item.liveType == 1 then '直播' else '电台'
  # 直播标题
  title = '../output/' + timeStr + '_' + type
  i = 1
  while true
    hasFile = fs.existsSync(path.join(__dirname, title + (if i == 1 then '' else ('_' + i)) + '.mp4'))
    if hasFile
      i += 1
    else
      break
  title = path.join(__dirname, title + (if i == 1 then '' else ('_' + i)) + '.mp4')

  return new Promise((resolve, reject)=>
    console.log('开始下载：' + title)
    child = child_process.spawn('ffmpeg', [
      '-i',
      item.streamPath,
      '-c',
      'copy',
      '-y'
      title
    ])
    child.stdout.on('data', (data)=>)
    child.stderr.on('data', (data)=>)
    child.on('close', (code, data)=>
      console.log('下载完成：' + title)
      resolve('success')
    )
    child.on('error', (err)=>
      console.error(err)
      reject(err)
    )
  ).catch((err)=>
    console.error(err)
  )

module.exports = {
  isEnding,
  writeLog,
  downloadVideo,
}