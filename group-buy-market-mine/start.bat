@echo off
cd /d %~dp0
echo ========================================
echo 启动拼团电商系统...
echo ========================================
echo.

echo 正在编译项目...
call mvn clean package -DskipTests -pl group-buy-market-app -am

if errorlevel 1 (
    echo.
    echo [ERROR] 编译失败！
    pause
    exit /b 1
)

echo.
echo ========================================
echo 启动应用...
echo ========================================
echo.

cd group-buy-market-app
call mvn spring-boot:run -Dspring-boot.run.profiles=dev

pause
