-- 添加溜溜梅和奥利奥商品的 SQL 脚本
-- 执行时间：2025-05-04

USE group_buy_market;

-- 1. 添加溜溜梅商品活动
INSERT INTO group_buy_activity (activity_id, activity_name, discount_id, group_type, take_limit_count, target, valid_time, status, start_time, end_time, tag_id, tag_scope)
VALUES 
(100124, '溜溜梅拼团活动', '25120207', 0, 1, 3, 180, 1, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY), NULL, NULL);

-- 2. 添加奥利奥商品活动  
INSERT INTO group_buy_activity (activity_id, activity_name, discount_id, group_type, take_limit_count, target, valid_time, status, start_time, end_time, tag_id, tag_scope)
VALUES 
(100125, '奥利奥拼团活动', '25120207', 0, 1, 3, 180, 1, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY), NULL, NULL);

-- 3. 更新人群标签表，添加更多测试用户
INSERT INTO crowd_tags_detail (tag_id, user_id, create_time, update_time)
VALUES 
('RQ_KJHKL98UU78H66554GFDV', 'user001', NOW(), NOW()),
('RQ_KJHKL98UU78H66554GFDV', 'user002', NOW(), NOW()),
('RQ_KJHKL98UU78H66554GFDV', 'user003', NOW(), NOW())
ON DUPLICATE KEY UPDATE update_time = NOW();

-- 4. 添加用户表（如果不存在）
CREATE TABLE IF NOT EXISTS `user_info` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '自增 ID',
  `user_id` varchar(32) NOT NULL COMMENT '用户 ID',
  `username` varchar(64) NOT NULL COMMENT '用户名',
  `password` varchar(128) NOT NULL COMMENT '密码（加密）',
  `nickname` varchar(64) DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(256) DEFAULT NULL COMMENT '头像',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(64) DEFAULT NULL COMMENT '邮箱',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态（0 禁用、1 正常）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_id` (`user_id`),
  UNIQUE KEY `uq_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户信息表';

-- 5. 插入默认管理员账号
INSERT INTO user_info (user_id, username, password, nickname, status)
VALUES 
('admin001', 'admin', 'e10adc3949ba59abbe56e057f20f883e', '管理员', 1),  -- 密码：123456
('user001', 'xiaofuge', 'e10adc3949ba59abbe56e057f20f883e', '小傅哥', 1),
('user002', 'liergou', 'e10adc3949ba59abbe56e057f20f883e', '二狗', 1)
ON DUPLICATE KEY UPDATE update_time = NOW();

-- 6. 添加商品图片映射表（用于商家后台）
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '自增 ID',
  `goods_id` varchar(32) NOT NULL COMMENT '商品 ID',
  `image_name` varchar(128) NOT NULL COMMENT '图片名称',
  `image_path` varchar(256) NOT NULL COMMENT '图片路径',
  `image_order` int NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_goods_id` (`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商品图片表';

-- 插入商品图片
INSERT INTO product_images (goods_id, image_name, image_path, image_order) VALUES
('9890001', '手写 MyBatis', 'images/sku-13811216-01.png', 1),
('9890001', '手写 MyBatis', 'images/sku-13811216-02.png', 2),
('9890001', '手写 MyBatis', 'images/sku-13811216-03.png', 3),
('9890002', '溜溜梅', 'images/liuliumei1.png', 1),
('9890002', '溜溜梅', 'images/liuliumei2.png', 2),
('9890002', '溜溜梅', 'images/liuliumei3.png', 3),
('9890003', '奥利奥', 'images/aoliao1.png', 1),
('9890003', '奥利奥', 'images/aoliao2.png', 2),
('9890003', '奥利奥', 'images/aoliao.png', 3);

-- 查询验证
SELECT '溜溜梅和奥利奥商品活动已添加！' AS result;
SELECT activity_id, activity_name, status FROM group_buy_activity WHERE activity_id IN (100123, 100124, 100125);
