# 拼团电商系统 - 更新说明

## 📋 本次更新内容

### 1. ✅ 登录页面优化
- ✅ 添加密码输入字段
- ✅ 增加注册功能（点击"注册账号"链接）
- ✅ 移除测试用户提示
- ✅ 支持用户名 + 密码登录
- ✅ 记住我功能

**测试账号：**
- 用户名：`xiaofuge` / `liergou` / `admin`
- 密码：`123456`（所有账号通用）

### 2. ✅ 商品更新
- ❌ 删除：手写 MyBatis（书）
- ✅ 新增：溜溜梅
  - 商品 ID：`9890002`
  - 原价：¥15.00
  - 拼团价：¥8.80
  - 图片：`liuliumei1.png`, `liuliumei2.png`, `liuliumei3.png`
  
- ✅ 新增：奥利奥
  - 商品 ID：`9890003`
  - 原价：¥12.00
  - 拼团价：¥6.50
  - 图片：`aoliao1.png`, `aoliao2.png`, `aoliao.png`

### 3. ✅ 商家后台美化
- ✅ 统一 UI 风格（与前端保持一致）
- ✅ 现代化侧边栏导航
- ✅ 商品卡片展示
- ✅ 添加/编辑商品弹窗
- ✅ 响应式设计

**访问地址：** `admin.html`

### 4. ✅ 启动脚本优化
- ✅ 创建 `run.bat` 启动脚本
- ✅ 优化启动流程
- ✅ 添加错误提示

---

## 🚀 快速启动指南

### 方法 1：使用 IDEA（推荐）

1. **打开项目**
   ```
   e:\javastudy\group-buy-market-all\group-buy-market-mine
   ```

2. **找到启动类**
   ```
   group-buy-market-app/src/main/java/cn/bugstack/Application.java
   ```

3. **右键运行**
   - 右键点击 `Application.java`
   - 选择 "Run 'Application.main()'"

4. **等待启动完成**
   - 看到日志：`Started Application in X.XXX seconds`
   - 服务地址：`http://localhost:8091`

### 方法 2：使用启动脚本

1. **双击运行**
   ```
   run.bat
   ```

2. **等待编译和启动**

### 启动前检查

确保以下服务已启动：
- ✅ MySQL（端口 3306）
- ✅ Redis（端口 6379）

---

## 📂 文件结构

```
docs/ui/html/
├── login.html              # 登录页面（新增密码和注册）
├── index.html              # 商品详情页（溜溜梅/奥利奥）
├── order-list.html         # 订单列表页
├── admin.html              # 商家后台（美化后）
├── auto-login.html         # 自动登录测试页
├── css/
│   ├── login.css           # 登录页样式
│   ├── index.css           # 商品页样式
│   ├── order-list.css      # 订单页样式
│   └── admin.css           # 商家后台样式（新增）
├── js/
│   ├── login.js            # 登录逻辑（新增注册）
│   ├── index.js            # 商品逻辑（新商品配置）
│   ├── order-list.js       # 订单逻辑
│   └── admin.js            # 商家后台逻辑（新增）
└── images/                 # 商品图片
    ├── liuliumei1.png
    ├── liuliumei2.png
    ├── liuliumei3.png
    ├── aoliao1.png
    ├── aoliao2.png
    └── aoliao.png
```

---

## 🎯 功能测试流程

### 1. 登录测试
1. 打开 `login.html`
2. 输入用户名：`xiaofuge`
3. 输入密码：`123456`
4. 点击"立即登录"
5. 跳转到商品页

### 2. 注册测试
1. 打开 `login.html`
2. 点击"注册账号"
3. 填写注册信息
4. 点击"立即注册"
5. 自动登录并跳转

### 3. 商品浏览
1. 登录后进入商品页
2. 查看溜溜梅/奥利奥商品
3. 查看拼团信息
4. 查看轮播图片

### 4. 拼团测试
1. 点击"开团购买"
2. 确认订单信息
3. 点击"支付完成"
4. 跳转到订单页

### 5. 商家后台测试
1. 打开 `admin.html`
2. 登录后进入后台
3. 查看商品列表
4. 点击"添加商品"
5. 填写商品信息
6. 保存商品

---

## 🎨 UI 风格统一

### 配色方案
- 主色：`#667eea` → `#764ba2`（渐变紫）
- 成功色：`#2ed573`（绿色）
- 危险色：`#ff4757`（红色）
- 警告色：`#ffa502`（橙色）

### 设计元素
- 圆角：`8px` - `20px`
- 阴影：`0 4px 12px rgba(0,0,0,0.05)`
- 动画：`0.3s ease`
- 字体：系统默认字体栈

---

## 📝 数据库更新

执行以下 SQL 添加新商品：

```sql
USE group_buy_market;

-- 添加溜溜梅活动
INSERT INTO group_buy_activity (activity_id, activity_name, discount_id, group_type, take_limit_count, target, valid_time, status, start_time, end_time)
VALUES (100124, '溜溜梅拼团活动', '25120207', 0, 1, 3, 180, 1, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY));

-- 添加奥利奥活动
INSERT INTO group_buy_activity (activity_id, activity_name, discount_id, group_type, take_limit_count, target, valid_time, status, start_time, end_time)
VALUES (100125, '奥利奥拼团活动', '25120207', 0, 1, 3, 180, 1, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY));
```

---

## 🔧 常见问题

### Q1: 后端启动失败？
**A:** 检查 MySQL 和 Redis 是否启动，端口是否正确

### Q2: 前端页面无法访问后端 API？
**A:** 确保后端服务运行在 `http://localhost:8091`

### Q3: 图片无法加载？
**A:** 检查图片路径是否正确，文件是否存在

### Q4: 登录成功后跳转失败？
**A:** 清除浏览器缓存，刷新页面重试

---

## 📞 技术支持

如有问题，请检查：
1. 浏览器控制台（F12）
2. 后端启动日志
3. 数据库连接状态

---

**更新时间：** 2025-05-04  
**版本：** v3.1  
**作者：** 拼团团技术团队
