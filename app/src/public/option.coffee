# 配置文件
path = global.require('path')
process = global.require('process')
execPath = path.dirname(process.execPath).replace(/\\/g, '/')

option = {
  'ffmpeg': execPath + '/dependent/ffmpeg/ffmpeg.exe',  # ffmpeg
  'output': execPath + '/output',                       # 输出目录
}

export default option