const React = require('react');
const ReactRouterDom = require('react-router-dom');
const { Component } = React;
const { Link } = ReactRouterDom;
const store = require('./store');
const date = require('./modules/date');
const post = require('./modules/post');
const process = require('./modules/process');
const panduan = require('./modules/panduan');


class Alert extends Component {
  render() {
    const item = this.props.alert || null;
    if(item !== null){
      return (
        <div className="alert alert-success index-alert" role="alert">
          <button className="close" type="button" aria-label="Close" onClick={ this.props.onCloseAlert }>
            <span aria-hidden="true">&times;</span>
          </button>
          <h4>开始捕捉视频：</h4>
          <p>
            <b>liveId：</b>
            <span>{ item.liveId }</span>
          </p>
          <p>
            <b>title：</b>
            <span>{ item.title }</span>
          </p>
          <p>
            <b>subTitle：</b>
            <span>{ item.subTitle }</span>
          </p>
          <p>
            <b>streamPath：</b>
            <span>{ item.streamPath }</span>
          </p>
          <p>
            <b>startTime：</b>
            <span>{ item.startTime }</span>
          </p>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'none' }} />
      );
    }
  }
}

class Loading extends Component{
  render(){
    if(this.props.loadingAnimation){
      return (
        <div className="index-layout">
          <div className="text-center index-loadingText">
            <svg className="index-loadingIcon" viewBox="0 0 32 32">
              <path d="M32 16c-0.040-2.089-0.493-4.172-1.331-6.077-0.834-1.906-2.046-3.633-3.533-5.060-1.486-1.428-3.248-2.557-5.156-3.302-1.906-0.748-3.956-1.105-5.981-1.061-2.025 0.040-4.042 0.48-5.885 1.292-1.845 0.809-3.517 1.983-4.898 3.424s-2.474 3.147-3.193 4.994c-0.722 1.846-1.067 3.829-1.023 5.79 0.040 1.961 0.468 3.911 1.254 5.694 0.784 1.784 1.921 3.401 3.316 4.736 1.394 1.336 3.046 2.391 4.832 3.085 1.785 0.697 3.701 1.028 5.598 0.985 1.897-0.040 3.78-0.455 5.502-1.216 1.723-0.759 3.285-1.859 4.574-3.208 1.29-1.348 2.308-2.945 2.977-4.67 0.407-1.046 0.684-2.137 0.829-3.244 0.039 0.002 0.078 0.004 0.118 0.004 1.105 0 2-0.895 2-2 0-0.056-0.003-0.112-0.007-0.167h0.007zM28.822 21.311c-0.733 1.663-1.796 3.169-3.099 4.412s-2.844 2.225-4.508 2.868c-1.663 0.646-3.447 0.952-5.215 0.909-1.769-0.041-3.519-0.429-5.119-1.14-1.602-0.708-3.053-1.734-4.25-2.991s-2.141-2.743-2.76-4.346c-0.621-1.603-0.913-3.319-0.871-5.024 0.041-1.705 0.417-3.388 1.102-4.928 0.683-1.541 1.672-2.937 2.883-4.088s2.642-2.058 4.184-2.652c1.542-0.596 3.192-0.875 4.832-0.833 1.641 0.041 3.257 0.404 4.736 1.064 1.48 0.658 2.82 1.609 3.926 2.774s1.975 2.54 2.543 4.021c0.57 1.481 0.837 3.064 0.794 4.641h0.007c-0.005 0.055-0.007 0.11-0.007 0.167 0 1.032 0.781 1.88 1.784 1.988-0.195 1.088-0.517 2.151-0.962 3.156z" />
            </svg>
            <span className="index-tishi">正在获取数据，请稍后...</span>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'none' }} />
      );
    }
  }
}

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingAnimation: false,
      liveList: store.getState().liveList,
      alert: null,     // 弹出层
      time: store.getState().timer.minute,
      timer: false
    };

    this.callback = function(){
      this.setState({
        liveList: store.getState().liveList
      });
    };
    this.autoRecordFun = this._autoRecordFun.bind(this);
    window._shareData.liveListCallBack = this.callback.bind(this);
  }

  // 刷新列表
  onReloadLiveList(event){
    const _this = this;
    this.setState({
      loadingAnimation: true
    });
    post(0, function(data, status, headers){
      const jsonData = JSON.parse(data, null, 2);
      store.dispatch({
        type: 'RELOAD_LIVELIST',
        data: jsonData,
        callback: function(){
          _this.setState({
            loadingAnimation: false,
            liveList: store.getState().liveList
          });
        }
      });
    });
  }

  // 渲染是否在录制中
  recording(item) {
    if(store.getState().recordList.get(item.liveId)){
      return (
        <span>正在录制中...</span>
      );
    }else{
      return (
        <button className="btn btn-default btn-sm" type="button" onClick={ this.onRecord.bind(this, item) }>
          <span className="glyphicon glyphicon-play index-icon" />
          <span>录制</span>
        </button>
      );
    }
  }

  // 列表数据显示
  liveListView() {
    if(this.state.liveList.length === 0){
      return (
        <tr>
          <td className="text-center" colSpan="5">暂无数据</td>
        </tr>
      );
    }else{
      const _this = this;

      return this.state.liveList.map(function(item, index){
        return (
          <tr key={ index }>
            <td>{ item.liveId }</td>
            <td>{ item.title }</td>
            <td>{ item.subTitle }</td>
            <td>{ date(item.startTime) }</td>
            <td>{ _this.recording.call(_this, item) }</td>
          </tr>
        );
      });
    }
  }

  // 录制
  onRecord(item, event) {
    if(!store.getState().recordList.get(item.liveId)){
      process(item);
      this.setState({
        alert: item
      });
    }
  }

  // 关闭alert
  onCloseAlert(event){
    this.setState({
      alert: null
    });
  }

  // 修改时间
  onChangeTime(event){
    const _this = this;
    const value = Number(this.refs.recordTime.value);
    const time = value < 1 ? 1 : value;
    store.dispatch({
      type: 'CHANGE_RECORD_TIME',
      minute: time,
      callback: function () {
        _this.setState({
          time: store.getState().timer.minute
        });
      }
    });
  }

  // 自动录制渲染的按钮
  autoButton(){
    if(this.state.timer === false){
      return (
        <button className="btn btn-danger index-mLeft" type="button" onClick={ this.onAutoRecord.bind(this) }>
          <span className="glyphicon glyphicon-facetime-video index-icon" />
          <span>开始自动录制</span>
        </button>
      );
    }else{
      return (
        <button className="btn btn-danger index-mLeft" type="button" onClick={ this.onStopAutoRecord.bind(this) }>
          <span className="glyphicon glyphicon-resize-full index-icon" />
          <span>停止自动录制</span>
        </button>
      );
    }
  }

  // 自动录制渲染
  autoRecordView(){
    return (
      <div className="pull-left form-inline">
        <label htmlFor="recordTime">
          <span>自动录制的请求间隔时间</span>
          <span className="index-time">{ this.state.time }</span>
          <span>（分钟）：</span>
        </label>
        <input className="form-control index-auto-input" id="recordTime" ref="recordTime" type="text"
               disabled={ this.state.timer }/>
        <button className="btn btn-default index-mLeft" type="button" onClick={ this.onChangeTime.bind(this) }
                disabled={ this.state.timer }>
          <span className="glyphicon glyphicon-cog index-icon" />
          <span>确认修改</span>
        </button>
        { this.autoButton() }
      </div>
    );
  }

  // 自动录制定时
  _autoRecordFun(){
    console.log('自动录制：' + date());
    panduan();
    const _this = this;
    this.setState({
      loadingAnimation: true
    });

    function promise(item){
      return new Promise((resolve, reject) => {
        console.log(item);
        process(item);
        resolve();
      });
    }

    post(0, function (data, status, headers){
      const jsonData = JSON.parse(data, null, 4);
      store.dispatch({
        type: 'RELOAD_LIVELIST',
        data: jsonData,
        callback: function () {
          _this.setState({
            loadingAnimation: false,
            liveList: store.getState().liveList
          });
        }
      });


      const liveList = store.getState().liveList;
      const p = [];
      for(let i = 0, j = liveList.length; i < j; i++){
        if(!store.getState().recordList.get(liveList[i].liveId)){
          p.push(promise(liveList[i]));
        }
      }

      Promise.all(p);
    });
  }

  // 开始自动录制
  onAutoRecord(event){
    this.setState({
      timer: true
    });
    window._shareData.timer.timer = setInterval(this.autoRecordFun, window._shareData.timer.minute * 60 * 1000);
    this.autoRecordFun();
  }

  // 停止自动录制
  onStopAutoRecord(event){
    clearInterval(window._shareData.timer.timer);
    this.setState({
      timer: false
    });
  }

  render(){
    return (
      <div>
        { /* 工具栏 */ }
        <div className="bg-warning index-tools">
          { this.autoRecordView() }
          <div className="pull-right">
            <Link className="btn btn-default index-mLeft" to="/recordList">
              <span className="glyphicon glyphicon-th-list index-icon" />
              <span>正在录制</span>
            </Link>
            <button className="btn btn-primary index-mLeft" type="button" onClick={ this.onReloadLiveList.bind(this) }>
              <span className="glyphicon glyphicon-refresh index-icon" />
              <span>刷新列表</span>
            </button>
          </div>
        </div>
        { /* 数据显示 */ }
        <div className="index-dataBox">
          <table className="table table-bordered table-hover table-condensed index-table">
            <thead>
            <tr className="info">
              <th className="index-table-td0">直播ID</th>
              <th className="index-table-td1">直播间</th>
              <th className="index-table-td2">直播标题</th>
              <th className="index-table-td3">开始时间</th>
              <th className="index-table-td4">操作</th>
            </tr>
            </thead>
            <tbody>{ this.liveListView() }</tbody>
          </table>
        </div>
        { /* 加载动画 */ }
        <Loading loadingAnimation={ this.state.loadingAnimation } />
        { /* 弹出层 */ }
        <Alert alert={ this.state.alert } onCloseAlert={ this.onCloseAlert.bind(this) } />
      </div>
    );
  }
}

module.exports = Index;