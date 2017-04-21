/* 开启子进程录制视频 */
const child_process = node_require('child_process');
const path = node_require('path');
const process= node_require('process');
const __dirname = path.dirname(process.execPath).replace(/\\/g, '/');
const date = require('./date');
const store = require('../store');

const shareData = window._shareData;

// 当前的直播列表
function rIndex(key){
    const liveList = store.getState().liveList;
    let res = null;
    for(let i = 0, j = liveList.length; i < j; i++){
        if(key === liveList[i].liveId){
            res = i;
            break;
        }
    }
    return res;
}
// 当结束时判断列表内的录制信息，及时清除已完成的项目
function panduan(){
    store.getState().recordList.forEach(function(value, key){
        // 没有当前直播了
        if(rIndex(key) === null){
            store.dispatch({
                type: 'DEL_RELOADLIST2',
                liveId: key,
                callback: function(){
                    if(shareData.recordListCallBack){
                        shareData.recordListCallBack();
                    }
                }
            });
        }
    });
}

function stdout(data){
    console.log('stdout：\n' + data);
}

function stderr(data){
    // console.log('stderr：\n' + data);
}

function exit(code, data){
    panduan();
    console.log('exit：\n' + code + '\n' + data);
}

function error(err){
    panduan();
    console.log('error：\n' + err);
}

function process2(item, index){
    const title = item.liveId + '_' + item.title + '_starttime-' + date(item.startTime).replace(/\:/g, '-') + '_recordtime-' + date(item.startTime).replace(/\:/g, '-');
    const child = child_process.spawn(__dirname + '/ffmpeg.exe', [
        '-i',
        `${ item.streamPath }`,
        '-acodec',
        'copy',
        '-vcodec',
        'copy',
        '-f',
        'mp4',
        `${ __dirname }/output/${ title }.mp4`
    ]);

    child.stdout.on('data', stdout);
    child.stderr.on('data', stderr);
    child.on('exit', exit);
    child.on('error', error);

    store.dispatch({
        type: 'ADD_RELOADLIST',
        child: child,
        text: '',
        item: item,
        path: title + '.mp4'
    });
}

module.exports = process2;
