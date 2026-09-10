﻿﻿﻿﻿// 商品详情页 JavaScript - 完整前后端交互

// 全局变量
let currentActivityId = null;
let currentTeamId = null;
let currentOrderId = null;
let currentOutTradeNo = null;
let refreshTimer = null;

// 商品配置
const ProductConfig = {
    // 溜溜梅
    '9890002': {
        name: '溜溜梅',
        desc: '酸甜可口的溜溜梅，开胃解馋，限时拼团优惠中',
        originalPrice: 15.00,
        payPrice: 8.80,
        images: ['../../../group-buy-market-vue/vue/public/images/liuliumei1.png', '../../../group-buy-market-vue/vue/public/images/liuliumei2.png', '../../../group-buy-market-vue/vue/public/images/liuliumei3.png'],
        tags: ['🔥 热销', '💰 限时优惠']
    },
    // 奥利奥
    '9890003': {
        name: '奥利奥',
        desc: '经典夹心饼干，扭一扭舔一舔泡一泡，多人拼团更优惠',
        originalPrice: 12.00,
        payPrice: 6.50,
        images: ['../../../group-buy-market-vue/vue/public/images/aoliao1.png', '../../../group-buy-market-vue/vue/public/images/aoliao2.png', '../../../group-buy-market-vue/vue/public/images/aoliao.png'],
        tags: ['🍪 零食', '💰 拼团特价']
    }
};

// 当前商品 ID（默认溜溜梅）
let currentGoodsId = '9890002';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkLoginStatus();
    
    // 初始化轮播图
    initGallery();
    
    // 加载拼团数据
    loadGroupBuyData();
    
    // 绑定事件
    bindEvents();
    
    // 定时刷新数据（每 30 秒）
    startAutoRefresh();
});

// 检查登录状态
function checkLoginStatus() {
    const userId = AppUtils.getCurrentUserId();
    console.log('检查登录状态 - userId:', userId);
    console.log('localStorage.loginToken:', localStorage.getItem('loginToken'));
    console.log('Cookie.loginToken:', AppUtils.getCookie('loginToken'));
    
    if (!userId) {
        console.log('未登录，跳转到登录页');
        // 使用 setTimeout 避免立即跳转导致 localStorage 未设置
        setTimeout(function() {
            window.location.href = 'login.html';
        }, 100);
        return;
    }
    
    console.log('登录成功，用户名:', userId);
    // 显示用户信息
    const userName = AppUtils.obfuscateUserId(userId);
    document.getElementById('userName').textContent = userName;
}

// 初始化轮播图
function initGallery() {
    const slides = document.querySelectorAll('.gallery-slide');
    const dotsContainer = document.getElementById('galleryDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentIndex = 0;
    
    // 创建指示点
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `gallery-dot${index === 0 ? ' active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    function updateSlide() {
        const container = document.getElementById('galleryContainer');
        container.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // 更新指示点
        document.querySelectorAll('.gallery-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateSlide();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlide();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlide();
    }
    
    // 自动播放
    let autoPlay = setInterval(nextSlide, 3000);
    
    // 按钮事件
    nextBtn.addEventListener('click', () => {
        nextSlide();
        clearInterval(autoPlay);
        autoPlay = setInterval(nextSlide, 3000);
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        clearInterval(autoPlay);
        autoPlay = setInterval(nextSlide, 3000);
    });
}

// 加载拼团数据
async function loadGroupBuyData() {
    const userId = AppUtils.getCurrentUserId();
    if (!userId) return;
    
    const groupList = document.getElementById('groupList');
    
    try {
        // 调用后端 API
        const response = await fetch(`${AppConfig.groupBuyMarketUrl}/api/v1/gbm/index/query_group_buy_market_config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                source: 'WEB',
                channel: 'PC',
                goodsId: AppConfig.goodsId
            })
        });
        
        const result = await response.json();
        
        if (result.code === '0000' && result.data) {
            const data = result.data;
            currentActivityId = data.activityId;
            
            // 更新价格信息
            updatePriceInfo(data.goods);
            
            // 更新统计信息
            updateStatsInfo(data.teamStatistic);
            
            // 更新拼团列表
            updateGroupList(data.teamList);
        } else {
            showToast(result.info || '加载失败', 'error');
            showEmptyState();
        }
    } catch (error) {
        console.error('加载拼团数据失败:', error);
        showToast('网络异常，请稍后重试', 'error');
        showEmptyState();
    }
}

// 更新价格信息
function updatePriceInfo(goods) {
    if (!goods) return;
    
    document.getElementById('groupPrice').textContent = goods.payPrice.toFixed(2);
    document.getElementById('originalPrice').textContent = goods.originalPrice.toFixed(2);
    
    const saveAmount = goods.originalPrice - goods.payPrice;
    document.getElementById('saveAmount').textContent = saveAmount.toFixed(2);
    
    // 更新底部按钮价格
    document.querySelector('#buyAloneBtn .btn-price').textContent = `¥${goods.originalPrice.toFixed(2)}`;
    document.querySelector('#groupBuyBtn .btn-price').textContent = `¥${goods.payPrice.toFixed(2)}`;
}

// 更新统计信息
function updateStatsInfo(statistic) {
    if (!statistic) return;
    
    animateNumber('statTeamCount', statistic.allTeamCount || 0);
    animateNumber('statCompleteCount', statistic.allTeamCompleteCount || 0);
    animateNumber('statUserCount', statistic.allTeamUserCount || 0);
}

// 数字动画
function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    const duration = 1000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// 更新拼团列表
function updateGroupList(teams) {
    const groupList = document.getElementById('groupList');
    
    if (!teams || teams.length === 0) {
        showEmptyState();
        return;
    }
    
    groupList.innerHTML = '';
    
    teams.forEach(team => {
        const groupItem = createGroupItem(team);
        groupList.appendChild(groupItem);
    });
}

// 创建拼团项
function createGroupItem(team) {
    const div = document.createElement('div');
    div.className = 'group-item';
    
    const progress = (team.lockCount / team.targetCount) * 100;
    const remaining = team.targetCount - team.lockCount;
    const userInitial = team.userId.charAt(0).toUpperCase();
    
    div.innerHTML = `
        <div class="group-item-left">
            <div class="user-info-group">
                <div class="user-avatar-group">${userInitial}</div>
                <div class="user-name">${AppUtils.obfuscateUserId(team.userId)}</div>
            </div>
            <div class="group-status">
                <span class="status-text">组队仅剩${remaining}人，拼单即将结束</span>
                <span class="countdown" data-end-time="${new Date(team.validEndTime).getTime()}">${team.validTimeCountdown}</span>
            </div>
            <div class="group-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span class="progress-text">已拼${team.lockCount}/${team.targetCount}人</span>
            </div>
        </div>
        <div class="group-item-right">
            <button class="join-btn" data-team-id="${team.teamId}" data-price="${team.outTradeNo}">
                参与拼团
            </button>
        </div>
    `;
    
    // 绑定点击事件
    const joinBtn = div.querySelector('.join-btn');
    joinBtn.addEventListener('click', function() {
        const teamId = team.teamId;  // 使用正确的 teamId
        joinGroup(teamId, team.lockCount);
    });
    
    return div;
}

// 显示空状态
function showEmptyState() {
    const groupList = document.getElementById('groupList');
    groupList.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">👥</div>
            <div class="empty-text">暂无正在进行的拼团</div>
            <div class="empty-subtext">快来发起第一个拼团吧！</div>
        </div>
    `;
}

// 绑定事件
function bindEvents() {
    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // 单独购买
    document.getElementById('buyAloneBtn').addEventListener('click', function() {
        showToast('单独购买功能开发中', 'error');
    });
    
    // 开团购买
    document.getElementById('groupBuyBtn').addEventListener('click', function() {
        createNewGroup();
    });
    
    // 关闭弹窗
    document.getElementById('closeModal').addEventListener('click', closePaymentModal);
    document.getElementById('cancelPaymentBtn').addEventListener('click', closePaymentModal);
    
    // 支付完成
    document.getElementById('completePaymentBtn').addEventListener('click', completePayment);
    
    // 点击遮罩层关闭
    document.getElementById('paymentModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePaymentModal();
        }
    });
}

// 发起新拼团
async function createNewGroup() {
    const userId = AppUtils.getCurrentUserId();
    if (!userId || !currentActivityId) {
        showToast('请先刷新页面', 'error');
        return;
    }
    
    // 生成唯一订单号
    const outTradeNo = 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    try {
        const response = await fetch(`${AppConfig.groupBuyMarketUrl}/api/v1/gbm/trade/lock_market_pay_order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                teamId: '', // 空 teamId 表示创建新团
                activityId: currentActivityId,
                goodsId: AppConfig.goodsId,
                source: 'WEB',
                channel: 'PC',
                outTradeNo: outTradeNo,
                notifyConfigVO: {
                    notifyType: 'HTTP',
                    notifyUrl: `${window.location.origin}/test-callback.html`
                }
            })
        });
        
        const result = await response.json();
        
        if (result.code === '0000' && result.data) {
            const data = result.data;
            currentOrderId = data.orderId;
            currentTeamId = data.teamId;
            currentOutTradeNo = outTradeNo;
            
            // 显示支付弹窗
            showPaymentModal({
                amount: 40.00,
                tradeNo: outTradeNo,
                teamId: data.teamId
            });
            
            showToast('锁单成功，请完成支付', 'success');
            
            // 刷新数据
            setTimeout(() => loadGroupBuyData(), 2000);
        } else {
            showToast(result.info || '开团失败', 'error');
        }
    } catch (error) {
        console.error('开团失败:', error);
        showToast('网络异常，请稍后重试', 'error');
    }
}

// 参与拼团
async function joinGroup(teamId, lockCount) {
    const userId = AppUtils.getCurrentUserId();
    if (!userId || !currentActivityId) {
        showToast('请先刷新页面', 'error');
        return;
    }
    
    // 检查是否已满
    if (lockCount >= 2) {
        showToast('该团已满，请选择其他团', 'error');
        return;
    }
    
    // 生成唯一订单号
    const outTradeNo = 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    try {
        const response = await fetch(`${AppConfig.groupBuyMarketUrl}/api/v1/gbm/trade/lock_market_pay_order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                teamId: teamId,
                activityId: currentActivityId,
                goodsId: AppConfig.goodsId,
                source: 'WEB',
                channel: 'PC',
                outTradeNo: outTradeNo,
                notifyConfigVO: {
                    notifyType: 'HTTP',
                    notifyUrl: `${window.location.origin}/test-callback.html`
                }
            })
        });
        
        const result = await response.json();
        
        if (result.code === '0000' && result.data) {
            const data = result.data;
            currentOrderId = data.orderId;
            currentTeamId = teamId;
            currentOutTradeNo = outTradeNo;
            
            // 显示支付弹窗
            showPaymentModal({
                amount: 40.00,
                tradeNo: outTradeNo,
                teamId: teamId
            });
            
            showToast('锁单成功，请完成支付', 'success');
            
            // 刷新数据
            setTimeout(() => loadGroupBuyData(), 2000);
        } else {
            showToast(result.info || '参团失败', 'error');
        }
    } catch (error) {
        console.error('参团失败:', error);
        showToast('网络异常，请稍后重试', 'error');
    }
}

// 显示支付弹窗
function showPaymentModal(orderData) {
    const modal = document.getElementById('paymentModal');
    document.getElementById('paymentAmountValue').textContent = orderData.amount.toFixed(2);
    document.getElementById('orderTradeNo').textContent = orderData.tradeNo;
    document.getElementById('orderTeamId').textContent = orderData.teamId || '-';
    
    modal.classList.add('active');
}

// 关闭支付弹窗
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('active');
}

// 完成支付
async function completePayment() {
    const userId = AppUtils.getCurrentUserId();
    if (!userId || !currentOutTradeNo) {
        showToast('订单信息异常', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${AppConfig.groupBuyMarketUrl}/api/v1/gbm/trade/settlement_market_pay_order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                source: 'WEB',
                channel: 'PC',
                outTradeNo: currentOutTradeNo,
                outTradeTime: new Date().getTime()
            })
        });
        
        const result = await response.json();
        
        if (result.code === '0000') {
            showToast('支付成功！', 'success');
            closePaymentModal();
            
            // 跳转到订单页
            setTimeout(() => {
                window.location.href = 'order-list.html';
            }, 1500);
        } else {
            showToast(result.info || '支付失败', 'error');
        }
    } catch (error) {
        console.error('支付失败:', error);
        showToast('网络异常，请稍后重试', 'error');
    }
}

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

// 开始自动刷新
function startAutoRefresh() {
    // 每 30 秒刷新一次数据
    refreshTimer = setInterval(() => {
        loadGroupBuyData();
    }, 30000);
}

// 页面卸载时清除定时器
window.addEventListener('beforeunload', function() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
});

// 倒计时更新
function updateCountdowns() {
    const countdownElements = document.querySelectorAll('.countdown');
    countdownElements.forEach(el => {
        const endTime = parseInt(el.getAttribute('data-end-time'));
        const now = new Date().getTime();
        const diff = endTime - now;
        
        if (diff <= 0) {
            el.textContent = '已结束';
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        el.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    });
}

// 每秒更新倒计时
setInterval(updateCountdowns, 1000);
