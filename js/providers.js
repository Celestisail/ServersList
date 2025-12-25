// 云服务提供商配置
const cloudProviders = {
    '阿里云': {
        name: '阿里云',
        icon: 'https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-183-60.png',
        website: 'https://www.aliyun.com',
        defaultIcon: 'https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-183-60.png'
    },
    '腾讯云': {
        name: '腾讯云',
        icon: 'https://qcloud.com/favicon.ico',
        website: 'https://cloud.tencent.com',
        defaultIcon: 'https://qcloud.com/favicon.ico'
    },
    'AWS': {
        name: 'AWS',
        icon: 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png',
        website: 'https://aws.amazon.com',
        defaultIcon: 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png'
    },
    'Azure': {
        name: 'Azure',
        icon: 'https://azurecomcdn.azureedge.net/cvt-ffeb6b799bf55c78dffa0d8e29a0b0c86f3c0e4d5b0a0b0a0a0a0a0a0a0a0a0a0/images/icon/favicon.png',
        website: 'https://azure.microsoft.com',
        defaultIcon: 'https://azurecomcdn.azureedge.net/cvt-ffeb6b799bf55c78dffa0d8e29a0b0c86f3c0e4d5b0a0b0a0a0a0a0a0a0a0a0a0/images/icon/favicon.png'
    },
    '华为云': {
        name: '华为云',
        icon: 'https://auth.huaweicloud.com/authui/favicon.ico',
        website: 'https://www.huaweicloud.com',
        defaultIcon: 'https://auth.huaweicloud.com/authui/favicon.ico'
    },
    'Google Cloud': {
        name: 'Google Cloud',
        icon: 'https://www.gstatic.com/devrel-devsite/prod/vf3c0d978a0a0e4c7d4d8a8e8a8e8a8e8a8e8a8e8a8e8a8e8a8e8a8e8a8e8a8e8/icons/cloud/favicon.ico',
        website: 'https://cloud.google.com',
        defaultIcon: 'https://www.gstatic.com/devrel-devsite/prod/vf3c0d978a0a0e4c7d4d8a8e8a8e8a8e8a8e8a8e8a8e8a8e8a8e8a8e8a8e8a8e8/icons/cloud/favicon.ico'
    },
    'Sadidc': {
        name: 'Sadidc',
        icon: 'https://www.jingsublog.com/upload/favicon.ico',
        website: 'https://sadidc.com/aff/GUUEMEGT',
        defaultIcon: 'https://www.jingsublog.com/upload/favicon.ico'
    },
    'Starvm': {
        name: 'Starvm',
        icon: 'https://www.starvm.cn/favicon.ico',
        website: 'https://www.starvm.cn/aff/RCFXQCYG',
        defaultIcon: 'https://www.starvm.cn/favicon.ico'
    }
};

// 获取提供商信息
function getProviderInfo(providerName) {
    return cloudProviders[providerName] || {
        name: providerName,
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzk5OTk5OSIvPgo8dGV4dCB4PSI1MCIgeT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPj8/PC90ZXh0Pgo8L3N2Zz4K',
        website: '#',
        consoleUrl: '#',
        defaultIcon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzk5OTk5OSIvPgo8dGV4dCB4PSI1MCIgeT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPj8/PC90ZXh0Pgo8L3N2Zz4K'
    };
}
