import React, { Component } from 'react'
import style from './style.sass'

TableThead = (props)->
  return `(
    <thead>
      <tr className="table-primary">
        <th className={ style.th1 }>直播间</th>
        <th className={ style.th2 }>直播标题</th>
        <th className={ style.th3 }>直播地址</th>
        <th className={ style.th4 }>开始时间</th>
        <th className={ style.th5 }>操作</th>
      </tr>
    </thead>
  )`

export default TableThead