// 处理图标加载失败
function handleImageError(img, vendor) {
    const provider = getProviderInfo(vendor);
    if (provider && img.src !== provider.defaultIcon) {
        img.src = provider.defaultIcon;
    } else {
        img.style.display = 'none';
    }
}

// 创建服务器卡片
function createServerCard(server) {
    const card = document.createElement("div");
    card.className = "server-card";
    card.setAttribute('data-server-id', server.id);

    const provider = getProviderInfo(server.vendor);
    const statusInfo = serverStatus[server.status] || serverStatus.normal;

    // 标题栏
    const header = document.createElement("div");
    header.className = "card-header";
    
    // 服务商图标
    const iconImg = document.createElement("img");
    iconImg.className = "vendor-icon";
    iconImg.src = provider.icon;
    iconImg.alt = server.vendor;
    iconImg.title = `${i18n.t('view_details')} ${server.vendor}`;
    iconImg.onclick = () => window.open(provider.website, '_blank');
    iconImg.onerror = () => handleImageError(iconImg, server.vendor);
    
    // 服务器名称
    const nameSpan = document.createElement("span");
    nameSpan.className = "server-name";
    nameSpan.textContent = server.name;
    nameSpan.title = server.name;
    
    const statusBadge = document.createElement("div");
    statusBadge.className = `status-badge ${statusInfo.class}`;
    
    header.append(iconImg, nameSpan, statusBadge);
    card.append(header);

    // 信息行
    const body = document.createElement("div");
    body.className = "card-body";
    
    const infoItems = [
        { label: "vendor", value: server.vendor, isLink: false },
        { label: "type", value: server.type, isLink: false },
        { label: "memory", value: server.memory, isLink: false },
        { label: "bandwidth", value: server.bandwidth, isLink: false },
        { label: "price", value: server.price, isLink: false },
        { label: "expire_time", value: server.expire, isLink: false },
    ];
    
    infoItems.forEach((item) => {
        const row = document.createElement("div");
        row.className = "info-row";
        
        const labelSpan = document.createElement("span");
        labelSpan.className = "info-label";
        labelSpan.textContent = `${i18n.t(item.label)}：`;
        
        const valueSpan = document.createElement("span");
        valueSpan.className = "info-value";
        
        if (item.isLink && item.link) {
            const valueLink = document.createElement("a");
            valueLink.className = "info-link";
            valueLink.href = item.link;
            valueLink.target = "_blank";
            valueLink.textContent = item.value;
            valueLink.title = item.title || item.value;
            valueSpan.appendChild(valueLink);
        } else {
            valueSpan.textContent = item.value;
        }
        
        row.append(labelSpan, valueSpan);
        body.append(row);
    });
    
    card.append(body);

    // 底部状态
    const footer = document.createElement("div");
    footer.className = `card-footer ${statusInfo.footerClass}`;
    
    const statusText = document.createElement("span");
    const statusTranslation = i18n.t(`status_${server.status}`);
    statusText.textContent = `${i18n.t('status')}：${statusTranslation}`;

    footer.append(statusText);
    card.append(footer);

    return card;
}

// 渲染所有服务器卡片
function renderServers() {
    const container = document.getElementById("serverList");
    
    if (!container) {
        console.error('找不到服务器列表容器');
        return;
    }
    
    // 清空现有内容
    container.innerHTML = '';
    
    // 添加服务器数量显示
    const countInfo = document.createElement("div");
    countInfo.className = "server-count";
    countInfo.textContent = `${i18n.t('total_servers')}: ${serverList.length}`;
    container.appendChild(countInfo);
    
    serverList.forEach((server) => {
        const card = createServerCard(server);
        container.appendChild(card);
    });
}

// 初始化页面
function init() {
    // 确保数据已加载
    if (typeof i18n !== 'undefined') {
        i18n.init();
    } else {
        console.error('i18n 未定义');
    }
    
    // 渲染页面内容
    renderServers();
    initCostCalculation();
}

// 页面加载后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
