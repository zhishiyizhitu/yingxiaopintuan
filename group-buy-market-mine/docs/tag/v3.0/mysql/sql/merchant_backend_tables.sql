-- 商家后台管理系统数据库表
-- 创建时间：2026-05-04

-- 1. 商家用户表
CREATE TABLE IF NOT EXISTS `merchant_user` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(100) NOT NULL COMMENT '密码（加密）',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `status` TINYINT(4) DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
  `role` TINYINT(4) DEFAULT 1 COMMENT '角色：1-普通商家，2-管理员',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家用户表';

-- 2. 商品表
CREATE TABLE IF NOT EXISTS `merchant_product` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `goods_id` VARCHAR(50) NOT NULL COMMENT '商品 ID',
  `name` VARCHAR(100) NOT NULL COMMENT '商品名称',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '商品描述',
  `original_price` DECIMAL(10,2) NOT NULL COMMENT '原价',
  `group_price` DECIMAL(10,2) NOT NULL COMMENT '拼团价',
  `stock` INT(11) DEFAULT 0 COMMENT '库存',
  `image_url` VARCHAR(255) DEFAULT NULL COMMENT '商品图片 URL',
  `status` TINYINT(4) DEFAULT 1 COMMENT '状态：0-下架，1-上架',
  `sales_count` INT(11) DEFAULT 0 COMMENT '销量',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_goods_id` (`goods_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 3. 拼团活动表
CREATE TABLE IF NOT EXISTS `group_activity` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `activity_id` BIGINT(20) NOT NULL COMMENT '活动 ID',
  `goods_id` VARCHAR(50) NOT NULL COMMENT '商品 ID',
  `activity_name` VARCHAR(100) NOT NULL COMMENT '活动名称',
  `group_size` INT(11) DEFAULT 2 COMMENT '成团人数',
  `target_count` INT(11) DEFAULT 3 COMMENT '目标参团人数',
  `valid_time` INT(11) DEFAULT 180 COMMENT '有效期（分钟）',
  `status` TINYINT(4) DEFAULT 1 COMMENT '状态：0-结束，1-进行中',
  `start_time` DATETIME DEFAULT NULL COMMENT '开始时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_goods_id` (`goods_id`),
  KEY `idx_activity_id` (`activity_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='拼团活动表';

-- 4. 订单表
CREATE TABLE IF NOT EXISTS `order_info` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `order_id` VARCHAR(50) NOT NULL COMMENT '订单 ID',
  `user_id` BIGINT(20) DEFAULT NULL COMMENT '用户 ID',
  `goods_id` VARCHAR(50) NOT NULL COMMENT '商品 ID',
  `goods_name` VARCHAR(100) NOT NULL COMMENT '商品名称',
  `goods_image` VARCHAR(255) DEFAULT NULL COMMENT '商品图片',
  `order_status` TINYINT(4) DEFAULT 0 COMMENT '订单状态：0-待支付，1-待发货，2-待收货，3-已完成，4-已取消',
  `payment_amount` DECIMAL(10,2) NOT NULL COMMENT '支付金额',
  `payment_time` DATETIME DEFAULT NULL COMMENT '支付时间',
  `delivery_time` DATETIME DEFAULT NULL COMMENT '发货时间',
  `receive_time` DATETIME DEFAULT NULL COMMENT '收货时间',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_goods_id` (`goods_id`),
  KEY `idx_order_status` (`order_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 5. 拼团记录表
CREATE TABLE IF NOT EXISTS `group_record` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `team_id` VARCHAR(50) NOT NULL COMMENT '团队 ID',
  `activity_id` BIGINT(20) NOT NULL COMMENT '活动 ID',
  `goods_id` VARCHAR(50) NOT NULL COMMENT '商品 ID',
  `user_id` BIGINT(20) NOT NULL COMMENT '用户 ID',
  `order_id` VARCHAR(50) NOT NULL COMMENT '订单 ID',
  `status` TINYINT(4) DEFAULT 0 COMMENT '状态：0-拼团中，1-成功，2-失败',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_team_id` (`team_id`),
  KEY `idx_activity_id` (`activity_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='拼团记录表';

-- 插入初始商家用户（密码：admin123）
INSERT INTO `merchant_user` (`username`, `password`, `nickname`, `role`, `status`) 
VALUES ('admin', '$2a$10$N.zmdr9k7uOQoYnMTeT1u.1h3gPJPxWnXV5qG8FZLKJF9zH5cN8Oy', '管理员', 2, 1);

-- 插入溜溜梅商品
INSERT INTO `merchant_product` (`goods_id`, `name`, `description`, `original_price`, `group_price`, `stock`, `image_url`, `status`) 
VALUES 
('9890002', '溜溜梅', '酸甜可口的溜溜梅，开胃解馋', 15.00, 8.80, 1000, '/images/liuliumei1.jpg', 1),
('9890003', '奥利奥', '经典夹心饼干，扭一扭舔一舔泡一泡', 12.00, 6.50, 1000, '/images/aoliao1.jpg', 1);

-- 插入拼团活动
INSERT INTO `group_activity` (`activity_id`, `goods_id`, `activity_name`, `group_size`, `target_count`, `valid_time`, `status`, `start_time`, `end_time`) 
VALUES 
(100124, '9890002', '溜溜梅拼团活动', 2, 3, 180, 1, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY)),
(100125, '9890003', '奥利奥拼团活动', 2, 3, 180, 1, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY));
