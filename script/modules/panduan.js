const store = require('../store');
const shareData = window._shareData;


// 当结束时判断列表内的录制信息，及时清除已完成的项目
function panduan(){
    shareData.recordList.forEach(function(value, key){
        // 没有当前直播了
        if(value.child.exitCode !== null){
            store.dispatch({
                type: 'DEL_RELOADLIST2',
                liveId: key,
                value: value,
                callback: function(){
                    if(shareData.recordListCallBack){
                        shareData.recordListCallBack();
                    }
                }
            });
        }
    });
}

module.exports = panduan;