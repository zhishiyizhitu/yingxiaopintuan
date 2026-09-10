@echo off
cd /d %~dp0
echo ========================================
echo 启动拼团电商系统 - 后端服务
echo ========================================
echo.

cd group-buy-market-app

echo 正在启动后端服务...
echo 端口：8091
echo 环境：dev
echo.

java -cp "target/classes;target/dependency/*" cn.bugstack.Application --spring.profiles.active=dev

pause
