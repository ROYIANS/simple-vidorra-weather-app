#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}正在启动 Simple Vidorra Weather App...${NC}"
echo ""

# 检查是否安装了Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ 未检测到Node.js，请先安装Node.js: https://nodejs.org/${NC}"
    echo ""
    echo "按 Enter 键退出..."
    read
    exit 1
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ 检测到Node.js: $NODE_VERSION${NC}"
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}首次运行，正在安装依赖...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ 依赖安装失败，请检查网络连接或手动运行 npm install${NC}"
        echo ""
        echo "按 Enter 键退出..."
        read
        exit 1
    fi
    echo -e "${GREEN}✓ 依赖安装完成${NC}"
fi

# 运行开发服务器
echo ""
echo -e "${CYAN}正在启动开发服务器...${NC}"
echo ""
echo -e "${YELLOW}应用将在浏览器中自动打开，或访问: http://localhost:3000${NC}"
echo -e "${YELLOW}按 Ctrl+C 停止服务器${NC}"
echo ""

npm run dev 