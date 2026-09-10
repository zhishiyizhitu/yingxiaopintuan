# 拼团团商城 - 启动和测试指南

## 一、项目结构说明

本项目采用 DDD（领域驱动设计）架构：
- **domain 层**：领域模型和业务逻辑（不依赖其他层）
- **infrastructure 层**：基础设施实现（数据库访问、Redis、MQ 等）
- **trigger 层**：触发器（HTTP 接口、定时任务等）
- **app 层**：应用启动和配置
- **vue 前端**：客户商城和商家后台

## 二、数据库初始化

### 1. 启动 MySQL
确保 MySQL 已启动，并创建数据库：

```sql
CREATE DATABASE IF NOT EXISTS group_buy_market DEFAULT CHARSET utf8mb4;
```

### 2. 执行 SQL 脚本
依次执行以下 SQL 文件：

```bash
# 1. 基础表结构（已有）
e:\javastudy\group-buy-market-all\group-buy-market-mine\docs\tag\v3.0\mysql\sql\*.sql

# 2. 商家后台表结构
e:\javastudy\group-buy-market-all\group-buy-market-mine\docs\tag\v3.0\mysql\sql\merchant_backend_tables.sql
```

## 三、启动后端服务

### 1. 配置数据库连接
编辑 `application-dev.yml`，确保数据库配置正确：

```yaml
spring:
  datasource:
    username: root
    password: 你的密码
    url: jdbc:mysql://127.0.0.1:3306/group_buy_market?...
```

### 2. 启动后端
```bash
cd e:\javastudy\group-buy-market-all\group-buy-market-mine\group-buy-market-app
mvn spring-boot:run
```

或者使用 IDEA 直接运行 `Application.java`

### 3. 验证后端启动成功
访问：http://localhost:8091/api/v1/gbm/admin/query_products

如果返回 JSON 数据，说明后端启动成功。

## 四、启动前端服务

### 1. 启动前端
```bash
cd e:\javastudy\group-buy-market-all\group-buy-market-vue\vue
npm run dev
```

### 2. 访问页面
- **客户商城登录**: http://localhost:3000/login
- **商家后台登录**: http://localhost:3000/merchant-login

## 五、前后端交互验证

### 1. 客户商城测试
1. 访问 http://localhost:3000/login
2. 输入任意用户名和密码（如：test/123456）
3. 点击登录，应该跳转到首页
4. 首页应该显示溜溜梅和奥利奥商品
5. 可以切换商品查看不同图片

**验证点**：
- 打开浏览器开发者工具（F12）
- 查看 Network 标签
- 应该看到对 `/api/v1/gbm/index/query_group_buy_market_config` 的请求
- 如果后端未启动，页面会显示"后端服务未启动，使用本地演示数据"

### 2. 商家后台测试
1. 访问 http://localhost:3000/merchant-login
2. 使用默认账号：admin/admin123
3. 点击登录

**验证点**：
- 如果后端已启动且数据库有数据，会显示真实数据
- 如果后端未启动，会显示"后端服务未启动，使用本地演示数据"，并显示溜溜梅和奥利奥

### 3. 商品管理测试
1. 登录商家后台后，进入商品管理页面
2. 点击"添加商品"
3. 填写商品信息：
   - 商品名称：测试商品
   - 商品 ID：9890004
   - 原价：20.00
   - 拼团价：12.00
   - 商品描述：这是一个测试商品
   - 商品图片 URL：/images/liuliumei1.png
4. 点击保存

**验证点**：
- 打开浏览器开发者工具（F12）
- 查看 Network 标签
- 应该看到对 `/api/v1/gbm/admin/add_product` 的请求
- 如果后端已启动，数据会保存到数据库
- 如果后端未启动，会提示"后端服务未启动，模拟保存成功"

## 六、API 接口列表

### 客户商城接口
- `POST /api/v1/gbm/index/query_group_buy_market_config` - 查询拼团配置
- `POST /api/v1/gbm/trade/lock_market_pay_order` - 锁单
- `POST /api/v1/gbm/trade/settlement_market_pay_order` - 结算
- `POST /api/v1/gbm/trade/refund_market_pay_order` - 退款

### 商家后台接口
- `POST /api/v1/gbm/admin/login` - 商家登录
- `POST /api/v1/gbm/admin/register` - 商家注册
- `POST /api/v1/gbm/admin/query_products` - 查询商品列表
- `POST /api/v1/gbm/admin/add_product` - 添加商品
- `POST /api/v1/gbm/admin/update_product` - 更新商品
- `POST /api/v1/gbm/admin/delete_product` - 删除商品

## 七、常见问题

### 1. 前端一直显示"加载中..."
**原因**：后端服务未启动
**解决**：检查后端服务是否启动，查看后端日志

### 2. 后端启动失败
**可能原因**：
- 数据库未启动或配置错误
- 端口被占用（8091）
- Maven 依赖问题

**解决**：
- 检查数据库连接配置
- 修改端口或停止占用端口的进程
- 执行 `mvn clean install` 重新构建

### 3. 数据库表不存在
**解决**：确保执行了所有 SQL 脚本

### 4. 前端页面空白
**解决**：
- 检查浏览器控制台是否有错误
- 检查前端服务是否启动
- 清除浏览器缓存

## 八、测试账号

### 客户商城
- 用户名：任意（如 test）
- 密码：任意（如 123456）

### 商家后台
- 用户名：admin
- 密码：admin123

## 九、数据持久化验证

### 1. 添加商品后验证
```sql
SELECT * FROM merchant_product WHERE goods_id = '9890004';
```

### 2. 注册用户后验证
```sql
SELECT * FROM merchant_user WHERE username = 'testuser';
```

如果查询到数据，说明前后端交互正常，数据已成功保存到数据库。

## 十、完成标志

✅ 客户商城显示溜溜梅和奥利奥商品
✅ 客户可以注册新账号
✅ 商家后台可以登录和注册
✅ 商家可以添加、删除、修改商品
✅ 所有数据都能保存到数据库
✅ 前端页面有加载状态和错误提示
✅ Network 面板能看到真实的 API 请求
