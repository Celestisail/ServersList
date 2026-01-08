/**
 * 价格/费用计算模块（calculation.js）
 *
 * 口径说明：
 * - yearlyTotal：从“今天”起未来 12 个月（可配置 horizonDays）的预计总费用（按天等比例折算）。
 * - dailyAverage：当前“每天总费用”（所有未过期服务器的日费率之和）。
 *
 * 兼容性：
 * - 保留旧函数名对外暴露（main.js 仍可直接调用 initCostCalculation 等）。
 */

(function () {
    'use strict';

    // 太阳年平均值（用于把月费折算为日费率，避免简单除以 30 的系统性偏差）
    // 365.2425 / 12 = 30.436875
    const AVG_DAYS_PER_MONTH = 365.2425 / 12;

    // 默认展示用货币符号（本项目 monthlyCost 看起来已被“统一口径”到同一币种）
    const DEFAULT_CURRENCY_SYMBOL = '¥';

    function getLocale() {
        // 优先使用 HTML lang，其次回退到浏览器语言，最后 zh-CN。
        return (
            document.documentElement.getAttribute('lang') ||
            (navigator.languages && navigator.languages[0]) ||
            navigator.language ||
            'zh-CN'
        );
    }

    function toNumber(value, fallback = 0) {
        if (value === null || value === undefined) return fallback;
        const n = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.+-]/g, ''));
        return Number.isFinite(n) ? n : fallback;
    }

    function clamp(n, min, max) {
        return Math.min(Math.max(n, min), max);
    }

    /**
     * 解析到“当天结束”以避免 YYYY-MM-DD 被解析为 00:00:00 导致当日误判为过期。
     * 支持：
     * - YYYY-MM-DD
     * - ISO 字符串（包含时间）
     */
    function parseExpireDate(expire) {
        if (!expire) return null;

        // 已包含时间信息的（或带时区）直接交给 Date
        if (typeof expire === 'string' && /T\d{2}:\d{2}/.test(expire)) {
            const d = new Date(expire);
            return Number.isNaN(d.getTime()) ? null : d;
        }

        // 常见 YYYY-MM-DD：按本地当天 23:59:59 处理
        if (typeof expire === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(expire)) {
            const d = new Date(`${expire}T23:59:59`);
            return Number.isNaN(d.getTime()) ? null : d;
        }

        const d = new Date(expire);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    function formatCurrency(amount, {
        currencySymbol = DEFAULT_CURRENCY_SYMBOL,
        locale = getLocale(),
        minimumFractionDigits = 0,
        maximumFractionDigits = 0
    } = {}) {
        const n = toNumber(amount, 0);
        const formatted = n.toLocaleString(locale, { minimumFractionDigits, maximumFractionDigits });
        return `${currencySymbol}${formatted}`;
    }

    /**
     * 计算核心：
     * - totalCostInHorizon：未来 horizonDays 内的总费用（按天等比例）。
     * - totalDailyCostNow：当前（referenceDate 时刻）所有未过期服务器的日费率之和。
     */
    function calculateCostsCore({
        referenceDate = new Date(),
        horizonDays = 365
    } = {}) {
        const list = (typeof serverList !== 'undefined' && Array.isArray(serverList)) ? serverList : [];
        if (list.length === 0) {
            return {
                totalCostInHorizon: 0,
                totalDailyCostNow: 0,
                activeServers: 0,
                warnings: ['服务器数据未加载或为空']
            };
        }

        const now = new Date(referenceDate);
        const horizonMs = clamp(toNumber(horizonDays, 365), 1, 3660) * 24 * 60 * 60 * 1000;
        const horizonEnd = new Date(now.getTime() + horizonMs);

        let totalCostInHorizon = 0;
        let totalDailyCostNow = 0;
        let activeServers = 0;
        const warnings = [];

        for (const server of list) {
            const monthlyCost = toNumber(server.monthlyCost, 0);
            if (monthlyCost <= 0) continue;

            const expireDate = parseExpireDate(server.expire);
            if (!expireDate) {
                warnings.push(`服务器“${server.name || server.id || 'unknown'}”的 expire 无法解析：${server.expire}`);
                continue;
            }

            // 服务器是否在当前时刻有效
            const isActiveNow = expireDate.getTime() > now.getTime();
            if (isActiveNow) {
                activeServers += 1;
                totalDailyCostNow += (monthlyCost / AVG_DAYS_PER_MONTH);
            }

            // 未来 horizonDays 内的费用（按天折算）
            const effectiveEnd = expireDate.getTime() < horizonEnd.getTime() ? expireDate : horizonEnd;
            const remainingMs = effectiveEnd.getTime() - now.getTime();
            if (remainingMs <= 0) continue;

            const remainingDays = remainingMs / (24 * 60 * 60 * 1000);
            totalCostInHorizon += remainingDays * (monthlyCost / AVG_DAYS_PER_MONTH);
        }

        return { totalCostInHorizon, totalDailyCostNow, activeServers, warnings };
    }

    /**
     * 旧版：按“月费 * 12”粗算年费；保留但内部做了数据健壮性处理。
     * 注：该口径不考虑过期时间。
     */
    function calculateCostSummary() {
        const list = (typeof serverList !== 'undefined' && Array.isArray(serverList)) ? serverList : [];
        if (list.length === 0) {
            console.error('服务器数据未加载或为空');
            return { yearlyTotal: formatCurrency(0), dailyAverage: formatCurrency(0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) };
        }

        const yearlyTotalNumber = list.reduce((sum, s) => sum + toNumber(s.monthlyCost, 0) * 12, 0);
        const dailyNumber = yearlyTotalNumber / 365;

        return {
            yearlyTotal: formatCurrency(yearlyTotalNumber, { maximumFractionDigits: 0 }),
            dailyAverage: formatCurrency(dailyNumber, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        };
    }

    /**
     * 更精确的计算：
     * - yearlyTotal：未来 12 个月（365 天）内，按天折算后的预计总费用。
     * - dailyAverage：当前每天总费用（全量合计），不是“单台平均”。
     */
    function calculatePreciseCosts({ horizonDays = 365 } = {}) {
        const { totalCostInHorizon, totalDailyCostNow, activeServers } = calculateCostsCore({ horizonDays });

        return {
            yearlyTotal: formatCurrency(totalCostInHorizon, { maximumFractionDigits: 0 }),
            dailyAverage: formatCurrency(totalDailyCostNow, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            activeServers
        };
    }

    function updateSummary() {
        const costs = calculateCostSummary();
        const summaryValues = document.querySelectorAll('.summary-value');

        if (summaryValues.length >= 2) {
            summaryValues[0].textContent = costs.yearlyTotal;
            summaryValues[1].textContent = costs.dailyAverage;
        } else {
            console.error('找不到汇总信息元素（.summary-value）');
        }
    }

    function updateSummaryWithPreciseData() {
        const costs = calculatePreciseCosts({ horizonDays: 365 });
        const summaryValues = document.querySelectorAll('.summary-value');

        if (summaryValues.length >= 2) {
            summaryValues[0].textContent = costs.yearlyTotal;
            summaryValues[1].textContent = costs.dailyAverage;

            // 可选：添加服务器数量显示
            const summaryLabels = document.querySelectorAll('.summary-label');
            if (summaryLabels.length >= 2 && typeof i18n !== 'undefined' && i18n && typeof i18n.t === 'function') {
                summaryLabels[0].textContent = `${i18n.t('yearly_cost')} (${costs.activeServers}${i18n.t('server_count')})`;
                summaryLabels[1].textContent = i18n.t('daily_avg_cost');
            }
        } else {
            console.error('找不到汇总信息元素（.summary-value）');
        }
    }

    /**
     * 费用预测（未来 n 个月）：按“目标月份的 1 日”判断该月是否仍在有效期内。
     * 注：这里输出的是“当月月费合计”的预测，用于趋势展示，口径与 yearlyTotal（按天折算）不同。
     */
    function predictFutureCosts(months = 12) {
        const list = (typeof serverList !== 'undefined' && Array.isArray(serverList)) ? serverList : [];
        const locale = getLocale();
        const nMonths = clamp(toNumber(months, 12), 1, 120);

        const predictions = [];
        for (let i = 1; i <= nMonths; i++) {
            let monthlyCost = 0;
            const targetDate = new Date();
            targetDate.setDate(1);
            targetDate.setHours(0, 0, 0, 0);
            targetDate.setMonth(targetDate.getMonth() + i);

            for (const server of list) {
                const expireDate = parseExpireDate(server.expire);
                if (!expireDate) continue;
                if (expireDate.getTime() > targetDate.getTime()) {
                    monthlyCost += toNumber(server.monthlyCost, 0);
                }
            }

            predictions.push({
                month: targetDate.toLocaleDateString(locale, { year: 'numeric', month: 'short' }),
                cost: monthlyCost
            });
        }

        return predictions;
    }

    function initCostCalculation() {
        updateSummaryWithPreciseData();

        // 仅在开发/调试时有价值：生产环境可移除
        try {
            const debug = calculateCostsCore({ horizonDays: 365 });
            if (debug.warnings && debug.warnings.length) {
                console.warn('费用计算告警：', debug.warnings);
            }
            console.log('费用计算模块已初始化');
            console.log('当前费用汇总（未来 12 个月总费用/当前日费合计）：', calculatePreciseCosts());
            console.log('未来 6 个月月费预测：', predictFutureCosts(6));
        } catch (e) {
            console.error('初始化费用计算模块失败：', e);
        }
    }

    // 对外暴露（兼容旧代码直接调用全局函数）
    window.calculateCostSummary = calculateCostSummary;
    window.calculatePreciseCosts = calculatePreciseCosts;
    window.updateSummary = updateSummary;
    window.updateSummaryWithPreciseData = updateSummaryWithPreciseData;
    window.predictFutureCosts = predictFutureCosts;
    window.initCostCalculation = initCostCalculation;
})();
