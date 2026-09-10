@echo off
chcp 65001 >nul
cd /d %~dp0

echo ========================================
echo        拼团电商系统 - 快速启动
echo ========================================
echo.

cd group-buy-market-app\target\classes

echo [启动中] 正在启动 Spring Boot 应用...
echo [端口] 8091
echo [环境] dev
echo.
echo 按 Ctrl+C 可停止服务
echo.

REM 直接使用 java 命令启动，跳过 Maven
java -cp ".;../../../../../../dependency/*" cn.bugstack.Application --spring.profiles.active=dev

pause
