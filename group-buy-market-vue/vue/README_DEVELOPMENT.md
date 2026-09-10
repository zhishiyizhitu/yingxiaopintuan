# 拼团团 - 完整实现说明

## 项目结构

### 后端项目（Spring Boot）
位置：`e:\javastudy\group-buy-market-all\group-buy-market-mine`

**主要模块：**
- `group-buy-market-domain` - 领域模型和服务
- `group-buy-market-trigger` - Controller 和 HTTP 接口
- `group-buy-market-infrastructure` - 基础设施层
- `group-buy-market-app` - 应用启动模块

### 前端项目（Vue 3）
位置：`e:\javastudy\group-buy-market-all\group-buy-market-vue\vue`

**新增文件：**
- `src/views/MerchantLogin.vue` - 商家登录页面
- `src/views/AdminHome.vue` - 商家后台主页（商品管理）
- `src/api/market.js` - API 接口（已更新，包含商家后台 API）
- `src/router/index.js` - 路由配置（已更新）
- `src/api/request.js` - HTTP 请求封装（已更新）

## 启动说明

### 1. 启动后端服务

```bash
# 方式一：使用启动脚本
cd e:\javastudy\group-buy-market-all\group-buy-market-mine
.\start.bat

# 方式二：手动启动 Maven
cd e:\javastudy\group-buy-market-all\group-buy-market-mine\group-buy-market-app
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**后端服务地址：** `http://localhost:8080/group-buy-market-mine`

**注意：** 如果 Maven 仓库有权限问题，请执行以下命令修复：
```cmd
icacls "D:\maven\apache-maven-3.9.6-bin\apache-maven-3.9.6\repository" /grant Everyone:F /T
```

### 2. 启动前端服务

```bash
cd e:\javastudy\group-buy-market-all\group-buy-market-vue\vue
npm install
npm run serve
```

**前端服务地址：** `http://localhost:3000`

**注意：** 如果后端端口不是 8091，请修改 `vite.config.js` 中的代理配置：
```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // 修改为实际的后端端口
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/api')
    }
  }
}
```

## API 接口说明

### 客户商城 API

| 接口 | 路径 | 方法 | 说明 |
|------|------|------|------|
| 查询拼团配置 | `/api/v1/gbm/index/query_group_buy_market_config` | POST | 查询拼团活动信息 |
| 锁单 | `/api/v1/gbm/trade/lock_market_pay_order` | POST | 创建订单并锁单 |
| 结算 | `/api/v1/gbm/trade/settlement_market_pay_order` | POST | 支付成功后结算 |
| 退款 | `/api/v1/gbm/trade/refund_market_pay_order` | POST | 退款 |

### 商家后台 API

| 接口 | 路径 | 方法 | 说明 |
|------|------|------|------|
| 商家登录 | `/api/v1/gbm/admin/login` | POST | 商家用户登录 |
| 商家注册 | `/api/v1/gbm/admin/register` | POST | 商家用户注册 |
| 查询商品列表 | `/api/v1/gbm/admin/query_products` | POST | 查询所有商品 |
| 添加商品 | `/api/v1/gbm/admin/add_product` | POST | 添加新商品 |
| 更新商品 | `/api/v1/gbm/admin/update_product` | POST | 更新商品信息 |
| 删除商品 | `/api/v1/gbm/admin/delete_product` | POST | 删除商品 |
| 查询订单列表 | `/api/v1/gbm/admin/query_orders` | POST | 查询订单列表 |

## 页面访问路径

### 客户商城（面向消费者）
- 商城首页：`http://localhost:3000/`
- 用户登录：`http://localhost:3000/login`
- 订单列表：`http://localhost:3000/order-list`

### 商家后台（面向商家）
- 商家登录：`http://localhost:3000/merchant-login`
- 后台首页：`http://localhost:3000/admin/home`

**默认管理员账号：**
- 用户名：`admin`
- 密码：`admin123`

## 数据库配置

### 数据库表（已创建）
SQL 文件位置：`e:\javastudy\group-buy-market-all\group-buy-market-mine\docs\tag\v3.0\mysql\sql\merchant_backend_tables.sql`

**主要表：**
- `merchant_user` - 商家用户表
- `merchant_product` - 商品表
- `group_activity` - 拼团活动表
- `order_info` - 订单表
- `group_record` - 拼团记录表

### 数据库连接配置
修改 `application.yml` 或 `application-dev.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/group_buy_market?useUnicode=true&characterEncoding=utf8&serverTimezone=UTC
    username: root
    password: your_password
```

## 前后端交互流程

### 1. 商家登录流程
```
用户输入账号密码 
  → Vue 调用 merchantLogin() API 
  → 后端验证密码（BCrypt 加密）
  → 返回用户信息
  → 前端保存到 localStorage
  → 跳转到 /admin/home
```

### 2. 商品管理流程
```
页面加载 
  → 调用 queryProducts() API 
  → 后端从数据库查询商品列表
  → 返回商品数据
  → Vue 渲染商品卡片
  
添加商品：
  填写表单 → 调用 addProduct() API → 后端保存到数据库 → 刷新列表
```

### 3. 客户拼团流程
```
浏览商品 
  → 点击"开团购买"
  → 调用 lockMarketPayOrder() API
  → 后端创建订单并锁单
  → 显示支付页面
  → 支付成功后调用 settlementMarketPayOrder()
```

## 技术栈

### 后端
- Spring Boot 2.7.12
- MyBatis
- Redis
- RabbitMQ
- BCrypt 密码加密
- DDD 架构

### 前端
- Vue 3
- Vue Router
- Axios
- Element UI（可选）

## 常见问题

### 1. Maven 仓库权限问题
**错误：** `java.io.IOException: 拒绝访问`

**解决方案：**
```cmd
icacls "D:\maven\apache-maven-3.9.6-bin\apache-maven-3.9.6\repository" /grant Everyone:F /T
```

### 2. 跨域问题
确保后端 Controller 有 `@CrossOrigin("*")` 注解，或在前端配置代理。

### 3. 图片不显示
图片已复制到：`e:\javastudy\group-buy-market-all\group-buy-market-mine\group-buy-market-app\src\main\resources\static\images\`

访问路径：`http://localhost:8080/images/liuliumei1.png`

### 4. 后端端口不一致
- 检查 `application.yml` 中的 `server.port`
- 更新前端 `vite.config.js` 中的代理目标地址

## 开发计划

### 已完成
- ✅ 商家后台数据库表结构
- ✅ 商家登录/注册 API
- ✅ 商品 CRUD API
- ✅ 商家后台 Vue 页面
- ✅ 客户商城页面（溜溜梅/奥利奥）
- ✅ 图片轮播功能

### 待开发
- ⏳ 订单管理页面
- ⏳ 数据统计页面
- ⏳ 拼团记录管理
- ⏳ 用户管理
- ⏳ 角色权限管理

## 联系信息
如有问题，请联系开发团队。
