/* 开启子进程录制视频 */
const child_process = node_require('child_process');
const path = node_require('path');
const process= node_require('process');
const __dirname = path.dirname(process.execPath).replace(/\\/g, '/');
const date = require('./date');
const store = require('../store');
const panduan = require('./panduan');


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
    const title = item.liveId + '_' + item.title + '_starttime-' + date(item.startTime).replace(/\:/g, '-') + '_recordtime-' + date().replace(/\:/g, '-');
    const child = child_process.spawn(__dirname + '/ffmpeg.exe', [
        '-i',
        `${ item.streamPath }`,
        '-c',
        'copy',
        `${ __dirname }/output/${ title }.flv`
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
