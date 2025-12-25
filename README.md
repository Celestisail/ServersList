![ServersList](https://img.jingsublog.com/i/2025/12/06/ov0zuw.png)

# ServersList - Server Asset Management System

A modern web application for managing server assets with multi-language support, automatic cost calculation, and responsive design.

[English (Current)](README.md) - [简体中文](README_CN.md) 

## ✨ Features

### 🚀 Core Functionality
- **Multi-language Support**: Chinese, English, and Japanese.
- **Automatic Cost Calculation**: Real-time computation of yearly/daily expenses.
- **Cloud Provider Integration**: Pre-built icons and links for major CSPs (Aliyun, AWS, Azure, etc.).
- **Responsive Design**: Flawless experience on desktop and mobile.
- **Status Tracking**: Clear visual indicators for server status (Normal/Sold).


### 📊 Data Visualization
- Detailed server information display (configuration, bandwidth, price, etc.)
- Service provider icon for quick redirection to the official website
- Summary of fees and statistics


### 🌍 Multilingual Support
- Chinese (Simplified)
- English
- Japanese
- More languages ​​are being updated (or [contribute a new language](new_language.md) )

### 🌐 Preview webpage
[Preview webpage](https://sl.jingsublog.com/)

## 💻 File Structure
```
ServersList/
├─index.html                # Main entry point
├─svg
|  └─favicon.svg            # Website icon
├─js
| ├─calculation.js          # Cost calculation logic
| ├─i18n.js                 # Multi-language setup
| ├─main.js                 # Core rendering & initialization
| ├─providers.js            # Cloud provider configs (icons/links)
| └─servers.js              # Server data & status definitions
└─css
  └─style.css               # Global styles
```

### 🛠️ Deployment Guide
  [Deployment Guide](Deployment-Guide.md)

## 📝 License
GPL-3.0 License. See [LICENSE](LICENSE) for details.
