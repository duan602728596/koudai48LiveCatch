const Redux = require('redux');
const { createStore } = Redux;

const shareData = window._shareData;

// 刷新列表
function reloadLivelist(state, action){
    state.liveList = action.data.content.liveList || [];
    action.callback();
}
// 添加到录制列表
function addReloadList(state, action){
    state.recordList.set(action.item.liveId, {
        child: action.child,
        text: action.text,
        item: action.item,
        path: action.path
    });

    if(shareData.liveListCallBack) {
        shareData.liveListCallBack();
    }
    if(shareData.recordListCallBack){
        shareData.recordListCallBack();
    }
}
// 从录制列表中删除
function delReloadList(state, action){
    const m = state.recordList.get(action.liveId);
    m.child.kill('SIGTERM');
    state.recordList.delete(action.liveId);
    if(shareData.recordListCallBack){
        shareData.recordListCallBack();
    }
}
// 从录制列表中删除2，及时删除
function delReloadList2(state, action){
    const m = state.recordList.get(action.liveId);
    state.recordList.delete(action.liveId);
    action.callback();
}
// 修改自动录制间隔
function changeRecordTime(state, action){
    state.timer.minute = action.minute;
    action.callback();
}

/* reducer */
function reducer(state, action){
    switch(action.type){
        case 'RELOAD_LIVELIST':
            reloadLivelist(state, action);
            break;
        case 'ADD_RELOADLIST':
            addReloadList(state, action);
            break;
        case 'DEL_RELOADLIST':
            delReloadList(state, action);
            break;
        case 'DEL_RELOADLIST2':
            delReloadList2(state, action);
            break;
        case 'STD_ERR':
            stdErr(state, action);
            break;
        case 'CHANGE_RECORD_TIME':
            changeRecordTime(state, action);
            break;
        default:
            break;
    }

    return state;
}

const store = createStore(reducer, window._shareData);

module.exports = store;