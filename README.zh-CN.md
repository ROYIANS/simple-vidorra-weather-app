# Simple Vidorra Weather App (简易天气应用)

一个优雅的天气预报应用，基于彩云天气API，提供实时天气、降水预报和小时级预报。

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FROYIANS%2Fsimple-vidorra-weather-app&env=NEXT_PUBLIC_CAIYUN_API_KEY&env=NEXT_PUBLIC_ANALYTICS_ID&env=NEXT_PUBLIC_ANALYTICS_SCRIPT_URL&envDescription=API%20keys%20needed%20for%20the%20application"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>

## 功能特点

- ⛅ 实时天气信息：温度、湿度、风力等
- 🌧️ 分钟级降水预报：未来60分钟的降水情况
- 🕒 24小时天气预报：趋势图表和详细信息
- 🌍 自动定位：基于浏览器获取当前位置
- 🌓 自适应主题：根据当前时间段调整界面风格
- 📱 响应式设计：完美适配各种屏幕尺寸

## 技术栈

- [Next.js 15](https://nextjs.org/) - 支持SSR的React框架
- [React 19](https://react.dev/) - 用户界面库
- [Tailwind CSS](https://tailwindcss.com/) - 样式解决方案
- [Framer Motion](https://www.framer.com/motion/) - 动画效果
- [React Animated Weather](https://www.npmjs.com/package/react-animated-weather) - 天气动画图标
- [Remix Icon](https://remixicon.com/) - 图标库
- [彩云天气API](https://caiyunapp.com/api/) - 气象数据来源

## 快速开始

### Windows用户

双击项目根目录中的`start.bat`文件即可启动开发服务器。

### PowerShell用户

右键点击`start.ps1`文件，选择"使用PowerShell运行"。

### Linux/Mac用户

首先，使脚本可执行：

```bash
chmod +x start.sh
```

然后运行脚本：

```bash
./start.sh
```

### 手动启动

#### 安装依赖

```bash
npm install
```

#### 开发环境

```bash
npm run dev
```

#### 构建应用

```bash
npm run build
```

#### 启动生产服务器

```bash
npm start
```

## 环境变量

应用使用环境变量安全地管理API密钥：

- `.env` - 默认环境变量（提交到git，包含测试API密钥）
- `.env.local` - 本地环境变量（不提交到git，存放您的个人设置）

要使用您自己的API密钥，请创建或编辑`.env.local`文件：

```
# 必需：彩云天气API密钥
NEXT_PUBLIC_CAIYUN_API_KEY=你的API密钥

# 可选：umami统计分析ID
# NEXT_PUBLIC_ANALYTICS_ID=你的统计ID

# 可选：统计脚本URL，用于自定义统计服务
# NEXT_PUBLIC_ANALYTICS_SCRIPT_URL=https://你的统计域名.com/script.js
```

## CORS处理

应用内置了API代理来处理与彩云天气API的CORS问题。在发起API请求时会自动使用此代理，因此您无需担心浏览器中的CORS错误。

## 部署

您可以将此应用部署到任何支持Next.js的托管服务：

- [Vercel](https://vercel.com)（推荐）
- [Netlify](https://netlify.com)
- 任何可以运行Node.js的服务器

## API密钥

默认使用测试密钥，如需长期使用，请注册[彩云天气开发者账号](https://platform.caiyunapp.com/)获取自己的API密钥，并将其添加到`.env.local`文件中，如环境变量部分所述。

## 贡献

欢迎提交 Issue 和 Pull Request 贡献代码！

## 许可证

MIT © [小梦岛工作室](https://weather.vidorra.life) 
