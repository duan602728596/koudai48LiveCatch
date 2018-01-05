import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import QueueAnim from 'rc-queue-anim'
import TableThead from './TableThead.coffee'
import style from './style.sass'
import getLiveList from './getLiveList.coffee'
import option from '../../../public/option.coffee'
gui = global.require('nw.gui')
child_process = global.require('child_process')
querystring = global.require('querystring')

alertSuccessElement = document.getElementById('alert-success-element')
alertFailElement = document.getElementById('alert-fail-element')

class App extends Component
  constructor: ()->
    super(`...arguments`)
    @state = {
      'liveList': [],          # 直播列表
      'recordingList': {},     # 录制列表
      'loading': false,        # 加载中
      'successAlert': false,   # 加载成功的alert
      'failAlert': false,      # 加载时报的alert
    }

  # 加载列表
  onLoadingList: ()->
    @setState({
      'loading': true,
    })
    try
      data = await getLiveList()
      list = if data.content.liveList then data.content.liveList else []
      @setState({
        'successAlert': true,
        'liveList': list,
        'loading': false,
      })
      setTimeout(()=>
        @setState({
          'successAlert': false,
        })
      , 2500)
    catch err
      console.error(err)
      @setState({
        'failAlert': true,
        'loading': false,
      })
      setTimeout(()=>
        @setState({
          'failAlert': false,
        })
      , 2500)

  # 列表渲染
  listView: ()->
    return @state.liveList.map((item, index)=>
      return `(
        <tr key={ item.liveId }>
          <td>{ item.title }</td>
          <td>{ item.subTitle }</td>
          <td>{ item.streamPath }</td>
          <td>{ moment(item.startTime).format('YYYY-MM-DD hh:mm:ss') }</td>
          <td>
            {
              this.state.recordingList[item.liveId] ? (
                <button className="btn btn-sm btn-danger" onClick={ this.onStopRecording.bind(this, item) }>停止</button>
              ) : (
                <button className="btn btn-sm btn-success" onClick={ this.onRecordingVideo.bind(this, item) }>录制</button>
              )
            }
            <button className={ 'btn btn-sm btn-warning ' + style.ml10 } onClick={ this.onOpenVideo.bind(this, item) }>新窗口打开直播</button>
          </td>
        </tr>
      )`
    )

  # 新窗口打开直播
  onOpenVideo: (item, event)->
    o = {
      'streamPath': item.streamPath,
      'title': item.title,
      'subTitle': item.subTitle,
      'startTime': item.startTime,
    }
    u = './build/video.html?' + querystring.stringify(o)
    wins = gui.Window.open(u, {
      'position': 'center',
      'width': 400,
      'height': 600,
      'focus': true,
      'title': item.title,
    })

  # 停止录制
  onStopRecording: (item, event)->
    @state.recordingList[item.liveId].kill()

  # 录制视频
  onRecordingVideo: (item, event)->
    title = item.liveId + '_' + item.title + '_' + moment(item.startTime).format('YYYY.MM.DD.hh.mm.ss')
    child = child_process.spawn(option.ffmpeg, [
      '-i',
      item.streamPath,
      '-c',
      'copy',
      option.output + '/' + title + '.flv',
    ])
    child.stdout.on('data', @child_process_stdout.bind(@, item.liveId))
    child.stderr.on('data', @child_process_stderr.bind(@, item.liveId))
    child.on('close', @child_process_exit.bind(@, item.liveId))
    child.on('error', @child_process_error.bind(@, item.liveId))
    @state.recordingList[item.liveId] = child
    @setState({
      'recordingLis': Object.assign({}, @state.recordingList),
    })

  # 子进程监听
  child_process_stdout: (liveId, data)->
    # console.log(data.toString())
    return

  child_process_stderr: (liveId, data)->
    # console.log(data.toString())
    return

  child_process_exit: (liveId, code, data)->
    # console.log('exit: ' + code + ' ' + data)
    @child_process_cb(liveId)

  child_process_error: (liveId, err)->
    # console.error('error: \n' + err)
    @child_process_cb(liveId)

  child_process_cb: (liveId)->
    delete @state.recordingList[liveId]
    @setState({
      'recordingLis': Object.assign({}, @state.recordingList),
    })

  render: ()->
    return `[
      <Fragment key={ 0 }>
        {/* 顶部工具 */}
        <div className={ style.tools + ' bg-dark clearfix' }>
          <div className="float-right">
            {
              this.state.loading ? (
                <button className={ 'btn btn-sm btn-primary ' + style.loadingBtn } type="button" disabled={ true }>加载中...</button>
              ) : (
                <button className={ 'btn btn-sm btn-primary ' + style.loadingBtn } type="button" onClick={ this.onLoadingList.bind(this) }>刷新直播列表</button>
              )
            }
          </div>
        </div>
        <div className={ style.list }>
          <table className="table table-bordered table-hover">
            <TableThead />
            <tbody>
              {
                this.state.liveList.length === 0 ? (
                  <tr>
                    <td className="text-center" colSpan={ 5 }>暂无数据</td>
                  </tr>
                ) : this.listView()
              }
            </tbody>
          </table>
        </div>
      </Fragment>,
      ReactDOM.createPortal(
        <QueueAnim type={ ['top', 'alpha'] }>
          {
            this.state.successAlert ? (
              <div key="alertSuccess" className={ 'alert alert-success ' + style.alertInfor } role="alert">口袋直播列表加载成功！</div>
            ) : null
          }
        </QueueAnim>,
        alertSuccessElement,
      ),
      ReactDOM.createPortal(
        <QueueAnim type={ ['top', 'alpha'] }>
          {
            this.state.failAlert ? (
              <div key="alertFail" className={ 'alert alert-danger ' + style.alertInfor } role="alert">口袋直播列表加载失败！</div>
            ) : null
          }
        </QueueAnim>,
        alertFailElement,
      ),
    ]`

export default App