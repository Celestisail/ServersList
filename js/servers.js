// 服务器数据
let serverList = [];

function setServerList(list) {
    if (!Array.isArray(list)) {
        console.warn('服务器数据格式不正确');
        return;
    }
    serverList = list;
}

// 服务器状态映射
const serverStatus = {
    'sold': { text: '已售', class: 'badge-sold', footerClass: '' },
    'normal': { text: '正常', class: 'badge-normal', footerClass: 'footer-normal' }
};
