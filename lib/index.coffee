getList = require('./getList')
{ downloadVideo, isEnding, writeLog } = require('./downloadVideo')

# 成员ID（SNH48-黄彤扬）
MEMBER_ID = 286976
# ffmpeg命令
FFMPEG = 'ffmpeg'

start = ()->
  try
    # 获取列表
    #   liveId
    #   title
    #   startTime
    #   streamPath
    data = await getList(MEMBER_ID)
    list = data.content.reviewList
    list2 = list.reverse()
    # 循环下载
    for item, index in list2
      if not await isEnding(item)
        d = await downloadVideo(item)
        # 下载完毕，写入日志
        if d == 'success'
          await writeLog(item)
  catch err
    console.error(err)

start()