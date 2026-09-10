@echo off
chcp 65001 >nul
title 拼团电商系统启动器

echo ========================================
echo     拼团电商系统 - 启动程序
echo ========================================
echo.

cd /d %~dp0group-buy-market-app

echo 步骤 1/2: 准备启动环境...
echo.

REM 检查 target 目录是否存在
if not exist "target\classes" (
    echo [错误] 未找到编译文件，请先使用 Maven 编译项目
    echo 命令：mvn clean package -DskipTests
    pause
    exit /b 1
)

echo 步骤 2/2: 启动应用...
echo.
echo ========================================
echo 服务地址：http://localhost:8091
echo 前端页面：docs/ui/html/login.html
echo 商家后台：docs/ui/html/admin.html
echo ========================================
echo.
echo 正在启动，请稍候...
echo.

REM 使用 Spring Boot Maven Plugin 启动
call mvn spring-boot:run -Dspring-boot.run.profiles=dev

if errorlevel 1 (
    echo.
    echo [错误] 启动失败
    pause
)
