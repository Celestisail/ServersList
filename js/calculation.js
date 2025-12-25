// 计算费用汇总的核心函数
function calculateCostSummary() {
    if (!serverList || serverList.length === 0) {
        console.error('服务器数据未加载');
        return { yearlyTotal: '¥0', dailyAverage: '¥0.00' };
    }
    
    // 计算年总费用
    const yearlyTotal = serverList.reduce((sum, server) => sum + (server.monthlyCost || 0) * 12, 0);
    
    // 计算日均费用
    const dailyAverage = (yearlyTotal / 365).toFixed(2);
    
    return {
        yearlyTotal: `¥${yearlyTotal.toLocaleString()}`,
        dailyAverage: `¥${dailyAverage}`
    };
}

// 更精确的计算函数（考虑不同计费周期）
function calculatePreciseCosts() {
    if (!serverList || serverList.length === 0) {
        return { yearlyTotal: '¥0', dailyAverage: '¥0.00', activeServers: 0 };
    }
    
    const now = new Date();
    let totalYearlyCost = 0;
    let totalDailyCost = 0;
    let activeServers = 0;

    serverList.forEach(server => {
        const expireDate = new Date(server.expire);
        
        // 只计算未过期的服务器
        if (expireDate > now) {
            const monthsRemaining = (expireDate.getFullYear() - now.getFullYear()) * 12 + 
                                (expireDate.getMonth() - now.getMonth());
            
            // 限制最大计算为12个月（一年）
            const effectiveMonths = Math.min(Math.max(monthsRemaining, 0), 12);
            totalYearlyCost += (server.monthlyCost || 0) * effectiveMonths;
            totalDailyCost += (server.monthlyCost || 0) / 30; // 近似日费用
            activeServers++;
        }
    });

    const preciseDailyAverage = activeServers > 0 ? (totalDailyCost / activeServers).toFixed(2) : '0.00';
    
    return {
        yearlyTotal: `¥${Math.round(totalYearlyCost).toLocaleString()}`,
        dailyAverage: `¥${preciseDailyAverage}`,
        activeServers: activeServers
    };
}

// 更新汇总信息
function updateSummary() {
    const costs = calculateCostSummary();
    const summaryValues = document.querySelectorAll('.summary-value');
    
    if (summaryValues.length >= 2) {
        summaryValues[0].textContent = costs.yearlyTotal;
        summaryValues[1].textContent = costs.dailyAverage;
    } else {
        console.error('找不到汇总信息元素');
    }
}

// 使用精确数据更新汇总信息
function updateSummaryWithPreciseData() {
    const costs = calculatePreciseCosts();
    const summaryValues = document.querySelectorAll('.summary-value');
    
    if (summaryValues.length >= 2) {
        summaryValues[0].textContent = costs.yearlyTotal;
        summaryValues[1].textContent = costs.dailyAverage;
        
        // 可选：添加服务器数量显示
        const summaryLabels = document.querySelectorAll('.summary-label');
        if (summaryLabels.length >= 2) {
            summaryLabels[0].textContent = `${i18n.t('yearly_cost')} (${costs.activeServers}${i18n.t('server_count')})`;
            summaryLabels[1].textContent = i18n.t('daily_avg_cost');
        }
    }
}

// 费用预测函数（未来n个月）
function predictFutureCosts(months = 12) {
    const predictions = [];
    
    for (let i = 1; i <= months; i++) {
        let monthlyCost = 0;
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + i);
        
        serverList.forEach(server => {
            const expireDate = new Date(server.expire);
            if (expireDate > targetDate) {
                monthlyCost += server.monthlyCost;
            }
        });
        
        predictions.push({
            month: targetDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' }),
            cost: monthlyCost
        });
    }
    
    return predictions;
}

// 初始化费用计算
function initCostCalculation() {
    // 使用精确计算
    updateSummaryWithPreciseData();
    
    console.log('费用计算模块已初始化');
    console.log('当前费用汇总:', calculatePreciseCosts());
    
    // 预测未来6个月费用
    const futurePredictions = predictFutureCosts(6);
    console.log('未来6个月费用预测:', futurePredictions);
}
