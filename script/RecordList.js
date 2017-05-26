const React = require('react');
const ReactRouterDom = require('react-router-dom');
const { Component } = React;
const { Link } = ReactRouterDom;
const store = require('./store');
const process = require('./modules/process');

// map转换成list
function map2list(map){
  const arr = [];

  map.forEach(function(value, key){
    arr.push(value);
  });

  return arr;
}

class RecordList extends Component{
  constructor(props){
    super(props);

    this.state = {
      recordList: map2list(store.getState().recordList),
      console: null
    };

    this.callback = function(){
      this.setState({
        recordList: map2list(store.getState().recordList)
      });
    };
    window._shareData.recordListCallBack = this.callback.bind(this);
  }

  // 停止录制
  onStopRecord(item, event){
    store.dispatch({
      type: 'DEL_RELOADLIST',
      liveId: item.item.liveId,
      item: item
    });
  }

  // 渲染当前正在录制的列表
  recordListView(){
    const _this = this;
    return this.state.recordList.map(function(item, index){
      return (
        <tr key={ index }>
          <td>{ item.item.liveId }</td>
          <td>{ item.path }</td>
          <td>
            <button className="btn btn-danger btn-sm index-mLeft" type="button"
                    onClick={ _this.onStopRecord.bind(_this, item) }>
              <span className="glyphicon glyphicon-stop index-icon" />
              <span>停止</span>
            </button>
          </td>
        </tr>
      );
    });
  }

  onCloseConsole(event){
    this.setState({
      console: null
    });
  }

  render() {
    return (
      <div className="index-recordTable">
        <div className="bg-warning index-recordTable-tools clearfix">
          <div className="pull-left">
            <h4 className="index-recordTable-title">正在录制</h4>
          </div>
          <div className="pull-right">
            <Link className="btn btn-danger" to="/">
              <span className="glyphicon glyphicon-off index-icon" />
              <span>关闭</span>
            </Link>
          </div>
        </div>
        <div className="index-recordTable-data">
          <table className="table table-bordered table-hover table-condensed index-table">
            <thead>
              <tr className="info">
                <th className="index-recordTable-td0">直播ID</th>
                <th className="index-recordTable-td1">储存文件名</th>
                <th className="index-recordTable-td2">操作</th>
              </tr>
            </thead>
            <tbody>{ this.recordListView() }</tbody>
          </table>
        </div>
      </div>
    );
  }
}

module.exports = RecordList;