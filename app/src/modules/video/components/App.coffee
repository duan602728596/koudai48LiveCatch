import React, { Component, Fragment } from 'react'
import moment from 'moment'
import style from './style.sass'
querystring = global.require('querystring')
path = global.require('path')

class Video extends Component
  constructor: ()->
    super(`...arguments`)
    search = location.search.replace(/^\?{1}/, '')
    @item = querystring.parse(search)

  componentDidMount: ()->
    type = path.parse(@item.streamPath).ext.replace(/^\.{1}/, '')
    if flvjs.isSupported()
      videoElement = document.getElementById('video-element')
      flvPlayer = flvjs.createPlayer({
        'type': type,
        'url': @item.streamPath,
      })
      flvPlayer.attachMediaElement(videoElement)
      flvPlayer.load()

  render: ()->
    { title, subTitle, streamPath, startTime } = @item
    return `(
      <Fragment>
        <div className={ style.information + ' bg-dark' }>{ subTitle }</div>
        <div className={ style.videoBox }>
          <video className={ style.video } id="video-element" controls={ true } />
        </div>
      </Fragment>
    )`

export default Video