![ServersList](https://img.jingsublog.com/i/2025/12/06/ov0zuw.png)

# ServersList - 服务器资产管理系统

一个现代化的服务器资产管理网页应用，支持多语言、自动费用计算和响应式设计。

[English](README.md) - [简体中文（当前）](README_CN.md)  

## 功能特性

### 🚀 核心功能
- **多语言支持** - 支持中文、英文、日文三种语言
- **自动费用计算** - 实时计算年供金额和日供平均金额
- **服务商集成** - 内置主流云服务商图标和链接
- **响应式设计** - 完美适配桌面端和移动端
- **状态管理** - 清晰标识服务器状态（正常/已售）

### 📊 数据展示
- 服务器详细信息展示（配置、带宽、价格等）
- 服务商图标快速跳转官网
- 费用汇总统计

### 🌍 多语言支持
- 中文 (简体)
- English 
- 日本語
- 更多语言更新中（或[贡献新语言](new_language.md)）

### 🌐 预览网页
[预览网页](https://sl.jingsublog.com/)

## 💻 文件结构
```
ServersList/
├─index.html                # 主入口点
├─svg
|  └─favicon.svg            # 网站图标
├─js
| ├─calculation.js          # 费用计算逻辑
| ├─i18n.js                 # 多语言设置
| ├─main.js                 # 核心渲染和初始化
| ├─providers.js            # 云提供商配置（图标/链接）
| └─servers.js              # 服务器数据和状态定义
└─css
  └─style.css               # 全局样式
```

### 🛠️ 部署指南

[部署指南](Deployment-Guide.md)

## 📝 许可证

GPL-3.0 许可证。详情请参阅[LICENSE](LICENSE)。
