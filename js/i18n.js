// 多语言支持配置
const i18n = {
    currentLang: 'zh',
    
    // 语言包
    messages: {
        'zh': {
            'cost_summary': '服务器费用汇总',
            'yearly_cost': '年供金额',
            'daily_avg_cost': '日供平均金额',
            'vendor': '服务商',
            'type': '类型',
            'memory': '配置',
            'ip': 'IP地址',
            'bandwidth': '带宽',
            'price': '价格',
            'expire_time': '到期时间',
            'status': '状态',
            'status_normal': '正常',
            'status_sold': '已售',
            'status_active': '活跃',
            'status_inactive': '未激活',
            'ssh_connect': 'SSH连接',
            'view_details': '查看详情',
            'server_count': '台服务器',
            'total_servers': '服务器总数'
        },
        'en': {
            'cost_summary': 'Server Cost Summary',
            'yearly_cost': 'Yearly Cost',
            'daily_avg_cost': 'Daily Average Cost',
            'vendor': 'Vendor',
            'type': 'Type',
            'memory': 'Configuration',
            'ip': 'IP Address',
            'bandwidth': 'Bandwidth',
            'price': 'Price',
            'expire_time': 'Expire Time',
            'status': 'Status',
            'status_normal': 'Normal',
            'status_sold': 'Sold',
            'status_active': 'Active',
            'status_inactive': 'Inactive',
            'ssh_connect': 'SSH Connect',
            'view_details': 'View Details',
            'server_count': 'servers',
            'total_servers': 'Total Servers'
        },
        'ja': {
            'cost_summary': 'サーバー費用サマリー',
            'yearly_cost': '年間費用',
            'daily_avg_cost': '日次平均費用',
            'vendor': 'プロバイダー',
            'type': 'タイプ',
            'memory': '構成',
            'ip': 'IPアドレス',
            'bandwidth': '帯域幅',
            'price': '価格',
            'expire_time': '有効期限',
            'status': 'ステータス',
            'status_normal': '正常',
            'status_sold': '販売済み',
            'status_active': 'アクティブ',
            'status_inactive': '非アクティブ',
            'ssh_connect': 'SSH接続',
            'view_details': '詳細表示',
            'server_count': '台のサーバー',
            'total_servers': 'サーバー総数'
        }
    },
    
    // 获取翻译文本
    t: function(key) {
        return this.messages[this.currentLang][key] || key;
    },
    
    // 切换语言
    setLanguage: function(lang) {
        if (this.messages[lang]) {
            this.currentLang = lang;
            this.updatePage();
            this.savePreference();
            return true;
        }
        return false;
    },
    
    // 更新页面文本
    updatePage: function() {
        // 更新所有带data-i18n属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
        
        // 更新语言按钮状态
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
        
        // 重新渲染服务器列表以更新语言
        if (typeof renderServers === 'function') {
            renderServers();
        }
        
        // 重新计算费用
        if (typeof updateSummary === 'function') {
            updateSummary();
        }
    },
    
    // 保存语言偏好
    savePreference: function() {
        localStorage.setItem('preferred_language', this.currentLang);
    },
    
    // 加载语言偏好
    loadPreference: function() {
        const savedLang = localStorage.getItem('preferred_language');
        if (savedLang && this.messages[savedLang]) {
            this.currentLang = savedLang;
        } else {
            // 根据浏览器语言自动检测
            const browserLang = navigator.language.split('-')[0];
            this.currentLang = this.messages[browserLang] ? browserLang : 'zh';
        }
    },
    
    // 初始化多语言支持
    init: function() {
        this.loadPreference();
        this.updatePage();
        
        // 绑定语言切换事件
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setLanguage(btn.dataset.lang);
            });
        });
    }
};
