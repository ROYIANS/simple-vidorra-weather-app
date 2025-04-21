# Simple Vidorra Weather App

An elegant weather forecast application based on Caiyun Weather API, providing real-time weather, precipitation forecasts, and hourly forecasts.

[简体中文](README.zh-CN.md) | English

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FROYIANS%2Fsimple-vidorra-weather-app&env=NEXT_PUBLIC_CAIYUN_API_KEY&env=NEXT_PUBLIC_ANALYTICS_ID&env=NEXT_PUBLIC_ANALYTICS_SCRIPT_URL&envDescription=API%20keys%20needed%20for%20the%20application"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>

## Features

- ⛅ Real-time weather information: temperature, humidity, wind power, etc.
- 🌧️ Minute-level precipitation forecast: precipitation for the next 60 minutes
- 🕒 24-hour weather forecast: trend charts and detailed information
- 🌍 Automatic positioning: get your current location based on browser
- 🌓 Adaptive theme: adjust interface style according to the current time period
- 📱 Responsive design: perfectly adapts to various screen sizes

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework with SSR
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling solution
- [Framer Motion](https://www.framer.com/motion/) - Animation effects
- [React Animated Weather](https://www.npmjs.com/package/react-animated-weather) - Weather animation icons
- [Remix Icon](https://remixicon.com/) - Icon library
- [Caiyun Weather API](https://caiyunapp.com/api/) - Weather data source

## Quick Start

### Windows Users

Double-click the `start.bat` file in the project root directory to start the development server.

### PowerShell Users

Right-click the `start.ps1` file and select "Run with PowerShell".

### Linux/Mac Users

First, make the script executable:

```bash
chmod +x start.sh
```

Then run it:

```bash
./start.sh
```

### Manual Start

#### Install Dependencies

```bash
npm install
```

#### Development Environment

```bash
npm run dev
```

#### Build the Application

```bash
npm run build
```

#### Start Production Server

```bash
npm start
```

## Environment Variables

The application uses environment variables to manage API keys securely:

- `.env` - Default environment variables (commited to git, contains a test API key)
- `.env.local` - Local environment variables (not commited to git, your personal settings)

To use your own API key, create or edit `.env.local` file:

```
# Required: Caiyun Weather API Key
NEXT_PUBLIC_CAIYUN_API_KEY=your_api_key_here

# Optional: Analytics ID for umami analytics
# NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Optional: Analytics Script URL for custom analytics service
# NEXT_PUBLIC_ANALYTICS_SCRIPT_URL=https://your-analytics-domain.com/script.js
```

## CORS Handling

The application includes a built-in API proxy to handle CORS issues with the Caiyun Weather API. This proxy is automatically used when making API requests, so you don't need to worry about CORS errors in the browser.

## Deployment

You can deploy this application to any hosting service that supports Next.js:

- [Vercel](https://vercel.com) (Recommended)
- [Netlify](https://netlify.com)
- Any server that can run Node.js

## API Key

The default uses a test key. For long-term use, please register a [Caiyun Weather developer account](https://platform.caiyunapp.com/) to get your own API key, and add it to your `.env.local` file as described in the Environment Variables section.

## Contribution

Issues and Pull Requests are welcome!

## License

MIT © [Little Dreamland Studio](https://weather.vidorra.life)
