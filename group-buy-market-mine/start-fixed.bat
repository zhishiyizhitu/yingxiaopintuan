@echo off
chcp 65001 >nul
cd /d %~dp0

echo ========================================
echo        拼团电商系统 - 启动脚本
echo ========================================
echo.

cd group-buy-market-app

echo [1/3] 正在编译项目...
call mvn clean compile -DskipTests

if errorlevel 1 (
    echo.
    echo [ERROR] 编译失败！请检查 Maven 配置和网络连接
    pause
    exit /b 1
)

echo.
echo [2/3] 编译成功！
echo [3/3] 正在启动应用...
echo.
echo ========================================
echo 服务地址：http://localhost:8091
echo 环境：开发环境 (dev)
echo ========================================
echo.
echo 按 Ctrl+C 可停止服务
echo.

call mvn spring-boot:run -Dspring-boot.run.profiles=dev

pause
