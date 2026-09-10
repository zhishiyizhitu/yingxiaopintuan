﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿// 订单列表页 JavaScript

// 全局变量
let allOrders = [];
let currentFilter = 'all';
let selectedOrder = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkLoginStatus();
    
    // 加载订单数据
    loadOrders();
    
    // 绑定事件
    bindEvents();
});

// 检查登录状态
function checkLoginStatus() {
    const userId = AppUtils.getCurrentUserId();
    if (!userId) {
        window.location.href = 'login.html';
        return;
    }
    
    // 显示用户信息
    const userName = AppUtils.obfuscateUserId(userId);
    document.getElementById('userName').textContent = userName;
}

// 加载订单数据
async function loadOrders() {
    const userId = AppUtils.getCurrentUserId();
    if (!userId) return;
    
    const orderList = document.getElementById('orderList');
    const emptyState = document.getElementById('emptyState');
    
    try {
        // 注意：实际项目中应该有查询订单列表的 API
        // 这里我们使用模拟数据，实际应该调用后端 API
        // 例如：GET /api/v1/gbm/order/query_user_orders
        
        // 模拟数据（实际应该从后端获取）
        const mockOrders = generateMockOrders(userId);
        allOrders = mockOrders;
        
        if (mockOrders.length === 0) {
            orderList.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            orderList.style.display = 'flex';
            emptyState.style.display = 'none';
            renderOrders(filterOrders(allOrders, currentFilter));
        }
    } catch (error) {
        console.error('加载订单失败:', error);
        showToast('加载订单失败，请稍后重试', 'error');
    }
}

// 生成模拟订单数据（实际项目中应该从后端 API 获取）
function generateMockOrders(userId) {
    const now = new Date();
    const orders = [];
    
    // 生成一些测试订单
    for (let i = 0; i < 5; i++) {
        const status = ['pending_payment', 'pending_group', 'success', 'refunded'][Math.floor(Math.random() * 4)];
        const orderTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        orders.push({
            orderId: `ORDER_${Date.now()}_${i}`,
            userId: userId,
            teamId: `TEAM_${Math.random().toString(36).substr(2, 8)}`,
            goodsId: AppConfig.goodsId,
            goodsName: '手写 MyBatis：渐进式源码实践（全彩）',
            goodsImage: 'images/sku-13811216-01.png',
            originalPrice: 100.00,
            payPrice: 40.00,
            status: status,
            createTime: orderTime.getTime(),
            payTime: status !== 'pending_payment' ? orderTime.getTime() + 300000 : null,
            targetCount: 2,
            lockCount: status === 'pending_group' ? 1 : 2
        });
    }
    
    // 按时间倒序排序
    orders.sort((a, b) => b.createTime - a.createTime);
    
    return orders;
}

// 筛选订单
function filterOrders(orders, status) {
    if (status === 'all') {
        return orders;
    }
    return orders.filter(order => order.status === status);
}

// 渲染订单列表
function renderOrders(orders) {
    const orderList = document.getElementById('orderList');
    
    if (orders.length === 0) {
        orderList.innerHTML = `
            <div class="empty-state" style="padding: 60px 20px;">
                <div class="empty-icon">📋</div>
                <div class="empty-text">暂无相关订单</div>
            </div>
        `;
        return;
    }
    
    orderList.innerHTML = '';
    
    orders.forEach(order => {
        const orderItem = createOrderItem(order);
        orderList.appendChild(orderItem);
    });
}

// 创建订单项
function createOrderItem(order) {
    const div = document.createElement('div');
    div.className = 'order-item';
    
    const statusText = getStatusText(order.status);
    const statusClass = order.status;
    const createTime = AppUtils.formatTime(order.createTime);
    const payTime = order.payTime ? AppUtils.formatTime(order.payTime) : '-';
    
    div.innerHTML = `
        <div class="order-header">
            <div class="order-id">订单号：${order.orderId}</div>
            <div class="order-status ${statusClass}">${statusText}</div>
        </div>
        <div class="order-body">
            <div class="order-info">
                <div class="goods-info">
                    <img src="${order.goodsImage}" alt="商品" class="goods-image" onerror="this.src='images/placeholder.png'">
                    <div class="goods-detail">
                        <div class="goods-name">${order.goodsName}</div>
                        <div class="goods-meta">
                            <span>拼团 ID：${order.teamId}</span>
                            <span>下单时间：${createTime}</span>
                        </div>
                    </div>
                </div>
                <div class="order-meta">
                    <div class="meta-item">
                        <span class="label">支付时间：</span>
                        <span>${payTime}</span>
                    </div>
                    <div class="meta-item">
                        <span class="label">拼团进度：</span>
                        <span>${order.lockCount}/${order.targetCount}人</span>
                    </div>
                </div>
                <div class="order-actions">
                    <button class="btn btn-secondary" onclick="viewOrderDetail('${order.orderId}')">查看详情</button>
                    ${getActionButtons(order)}
                </div>
            </div>
            <div class="order-price">
                <div class="price-label">实付金额</div>
                <div class="price-value">
                    <span class="currency">¥</span>
                    ${order.payPrice.toFixed(2)}
                </div>
            </div>
        </div>
    `;
    
    return div;
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'pending_payment': '待支付',
        'pending_group': '待成团',
        'success': '已完成',
        'refunded': '已退款'
    };
    return statusMap[status] || status;
}

// 获取操作按钮
function getActionButtons(order) {
    switch (order.status) {
        case 'pending_payment':
            return `
                <button class="btn btn-primary" onclick="payOrder('${order.orderId}')">立即支付</button>
                <button class="btn btn-danger" onclick="cancelOrder('${order.orderId}')">取消订单</button>
            `;
        case 'pending_group':
            return `
                <button class="btn btn-secondary" onclick="inviteFriends('${order.teamId}')">邀请好友</button>
            `;
        case 'success':
            return `
                <button class="btn btn-secondary" onclick="buyAgain('${order.goodsId}')">再次购买</button>
            `;
        case 'refunded':
            return `
                <button class="btn btn-secondary" onclick="buyAgain('${order.goodsId}')">再次购买</button>
            `;
        default:
            return '';
    }
}

// 绑定事件
function bindEvents() {
    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // 状态筛选
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 更新激活状态
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选订单
            currentFilter = this.getAttribute('data-status');
            renderOrders(filterOrders(allOrders, currentFilter));
        });
    });
    
    // 关闭弹窗
    document.getElementById('closeModal').addEventListener('click', closeDetailModal);
    
    // 点击遮罩层关闭
    document.getElementById('orderDetailModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDetailModal();
        }
    });
}

// 查看订单详情
window.viewOrderDetail = function(orderId) {
    const order = allOrders.find(o => o.orderId === orderId);
    if (!order) {
        showToast('订单不存在', 'error');
        return;
    }
    
    selectedOrder = order;
    
    // 填充详情数据
    document.getElementById('detailOrderId').textContent = order.orderId;
    document.getElementById('detailTeamId').textContent = order.teamId;
    document.getElementById('detailGoodsName').textContent = order.goodsName;
    document.getElementById('detailStatus').textContent = getStatusText(order.status);
    document.getElementById('detailCreateTime').textContent = AppUtils.formatTime(order.createTime);
    document.getElementById('detailPayTime').textContent = order.payTime ? AppUtils.formatTime(order.payTime) : '-';
    document.getElementById('detailAmount').textContent = `¥${order.payPrice.toFixed(2)}`;
    
    // 生成底部按钮
    const modalFooter = document.getElementById('modalFooter');
    modalFooter.innerHTML = `
        <button class="btn btn-secondary" onclick="closeDetailModal()">关闭</button>
        ${getDetailActionButtons(order)}
    `;
    
    // 显示弹窗
    document.getElementById('orderDetailModal').classList.add('active');
};

// 获取详情弹窗的操作按钮
function getDetailActionButtons(order) {
    switch (order.status) {
        case 'pending_payment':
            return `
                <button class="btn btn-primary" onclick="payOrder('${order.orderId}')">立即支付</button>
            `;
        case 'pending_group':
            return `
                <button class="btn btn-primary" onclick="inviteFriends('${order.teamId}')">邀请好友</button>
            `;
        default:
            return '';
    }
}

// 关闭详情弹窗
function closeDetailModal() {
    document.getElementById('orderDetailModal').classList.remove('active');
}

// 支付订单
window.payOrder = function(orderId) {
    const order = allOrders.find(o => o.orderId === orderId);
    if (!order) {
        showToast('订单不存在', 'error');
        return;
    }
    
    // 调用结算 API
    // 实际项目中应该调用后端 API
    showToast('正在跳转支付...', 'info');
    
    // 模拟支付流程
    setTimeout(() => {
        showToast('支付成功！', 'success');
        closeDetailModal();
        
        // 刷新订单列表
        setTimeout(() => {
            loadOrders();
        }, 1500);
    }, 1000);
};

// 取消订单
window.cancelOrder = function(orderId) {
    if (!confirm('确定要取消这个订单吗？')) {
        return;
    }
    
    // 调用取消订单 API
    // 实际项目中应该调用后端 API
    
    showToast('订单已取消', 'success');
    
    // 刷新订单列表
    setTimeout(() => {
        loadOrders();
    }, 1000);
};

// 邀请好友
window.inviteFriends = function(teamId) {
    // 生成邀请链接
    const inviteUrl = `${window.location.origin}/index.html?teamId=${teamId}`;
    
    // 复制到剪贴板
    navigator.clipboard.writeText(inviteUrl).then(() => {
        showToast('邀请链接已复制，快去分享给好友吧！', 'success');
    }).catch(() => {
        showToast('复制失败，请手动复制：' + inviteUrl, 'error');
    });
};

// 再次购买
window.buyAgain = function(goodsId) {
    window.location.href = `index.html?goodsId=${goodsId}`;
};

// 退出登录
function logout() {
    // 清除 cookie
    document.cookie = 'loginToken=; path=/; max-age=0';
    document.cookie = 'username=; path=/; max-age=0';
    
    // 清除 localStorage
    localStorage.removeItem('rememberedUsername');
    
    // 跳转到登录页
    window.location.href = 'login.html';
}

// 显示 Toast 提示
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}
