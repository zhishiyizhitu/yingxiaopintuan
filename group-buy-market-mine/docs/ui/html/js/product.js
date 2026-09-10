// 商品页面 JavaScript - 溜溜梅/奥利奥

// 商品数据配置
const Products = {
    liuliumei: {
        id: '9890002',
        name: '溜溜梅',
        desc: '酸甜可口的溜溜梅，开胃解馋，限时拼团优惠中',
        originalPrice: 15.00,
        payPrice: 8.80,
        images: [
            '../../../group-buy-market-vue/vue/public/images/liuliumei1.png',
            '../../../group-buy-market-vue/vue/public/images/liuliumei2.png',
            '../../../group-buy-market-vue/vue/public/images/liuliumei3.png'
        ],
        tags: ['🔥 热销', '💰 限时优惠'],
        icon: '🍒'
    },
    aoliao: {
        id: '9890003',
        name: '奥利奥',
        desc: '经典夹心饼干，扭一扭舔一舔泡一泡，多人拼团更优惠',
        originalPrice: 12.00,
        payPrice: 6.50,
        images: [
            '../../../group-buy-market-vue/vue/public/images/aoliao1.png',
            '../../../group-buy-market-vue/vue/public/images/aoliao2.png',
            '../../../group-buy-market-vue/vue/public/images/aoliao.png'
        ],
        tags: ['🍪 零食', '💰 拼团特价'],
        icon: '🍪'
    }
};

// 当前商品
let currentProduct = 'liuliumei';
let currentGalleryIndex = 0;
let galleryTimer = null;

// 模拟拼团数据
const mockTeams = [
    { userId: 'xiaofuge', lockCount: 1, targetCount: 3, validEndTime: Date.now() + 3600000 },
    { userId: 'liergou', lockCount: 2, targetCount: 3, validEndTime: Date.now() + 7200000 },
    { userId: 'user001', lockCount: 1, targetCount: 3, validEndTime: Date.now() + 5400000 }
];

// 页面加载
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadProduct('liuliumei');
    initGallery();
    bindEvents();
});

// 检查登录状态
function checkLoginStatus() {
    const userId = localStorage.getItem('loginToken') || AppUtils.getCookie('loginToken');
    if (userId) {
        document.getElementById('userName').textContent = AppUtils.obfuscateUserId(userId);
    } else {
        // 未登录，跳转到登录页
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// 切换商品
window.switchProduct = function(productKey) {
    if (productKey === currentProduct) return;
    
    currentProduct = productKey;
    currentGalleryIndex = 0;
    
    // 更新选择器状态
    document.querySelectorAll('.selector-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-goods') === productKey);
    });
    
    loadProduct(productKey);
};

// 加载商品
function loadProduct(productKey) {
    const product = Products[productKey];
    if (!product) return;
    
    // 更新标题
    document.getElementById('productTitle').textContent = product.name;
    document.title = `${product.name} - 拼团商城`;
    
    // 更新描述
    document.getElementById('productDesc').textContent = product.desc;
    
    // 更新标签
    const tagsContainer = document.getElementById('productTags');
    tagsContainer.innerHTML = '';
    product.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = tag.includes('热销') ? 'tag tag-hot' : 'tag tag-discount';
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });
    
    // 更新价格
    document.getElementById('groupPrice').textContent = product.payPrice.toFixed(2);
    document.getElementById('originalPrice').textContent = product.originalPrice.toFixed(2);
    document.getElementById('saveAmount').textContent = (product.originalPrice - product.payPrice).toFixed(2);
    
    // 更新底部按钮
    document.querySelector('#buyAloneBtn .btn-price').textContent = `¥${product.originalPrice.toFixed(2)}`;
    document.querySelector('#groupBuyBtn .btn-price').textContent = `¥${product.payPrice.toFixed(2)}`;
    
    // 更新轮播图
    updateGallery(product.images);
    
    // 加载拼团列表
    loadMockTeams();
}

// 更新轮播图
function updateGallery(images) {
    const container = document.getElementById('galleryContainer');
    container.innerHTML = '';
    
    images.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = `gallery-slide${index === 0 ? ' active' : ''}`;
        slide.innerHTML = `<img src="${img}" alt="商品图${index + 1}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjdlZWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5商品图片</text></svg>'">`;
        container.appendChild(slide);
    });
    
    // 重新初始化指示点
    initGalleryDots(images.length);
}

// 初始化轮播图
function initGallery() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.addEventListener('click', () => {
        currentGalleryIndex = (currentGalleryIndex - 1 + 3) % 3;
        updateSlide();
    });
    
    nextBtn.addEventListener('click', () => {
        currentGalleryIndex = (currentGalleryIndex + 1) % 3;
        updateSlide();
    });
    
    // 自动播放
    galleryTimer = setInterval(() => {
        currentGalleryIndex = (currentGalleryIndex + 1) % 3;
        updateSlide();
    }, 5000);
}

// 初始化指示点
function initGalleryDots(count) {
    const dotsContainer = document.getElementById('galleryDots');
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = `gallery-dot${i === 0 ? ' active' : ''}`;
        dot.addEventListener('click', () => {
            currentGalleryIndex = i;
            updateSlide();
        });
        dotsContainer.appendChild(dot);
    }
}

// 更新轮播图位置
function updateSlide() {
    const container = document.getElementById('galleryContainer');
    container.style.transform = `translateX(-${currentGalleryIndex * 100}%)`;
    
    // 更新指示点
    document.querySelectorAll('.gallery-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentGalleryIndex);
    });
}

// 加载模拟拼团数据
function loadMockTeams() {
    const groupList = document.getElementById('groupList');
    
    if (mockTeams.length === 0) {
        groupList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">👥</div>
                <div class="empty-text">暂无正在进行的拼团</div>
                <div class="empty-subtext">快来发起第一个拼团吧！</div>
            </div>
        `;
        return;
    }
    
    groupList.innerHTML = '';
    mockTeams.forEach(team => {
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
                <span class="countdown">${AppUtils.formatCountdown(team.validEndTime)}</span>
            </div>
            <div class="group-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span class="progress-text">已拼${team.lockCount}/${team.targetCount}人</span>
            </div>
        </div>
        <div class="group-item-right">
            <button class="join-btn">参与拼团</button>
        </div>
    `;
    
    div.querySelector('.join-btn').addEventListener('click', () => {
        joinGroup(team);
    });
    
    return div;
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
    document.getElementById('groupBuyBtn').addEventListener('click', createNewGroup);
    
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
function createNewGroup() {
    const userId = localStorage.getItem('loginToken');
    if (!userId) {
        showToast('请先登录', 'error');
        return;
    }
    
    const product = Products[currentProduct];
    const orderNo = 'ORDER_' + Date.now();
    
    // 显示支付弹窗
    document.getElementById('paymentAmountValue').textContent = product.payPrice.toFixed(2);
    document.getElementById('orderProductName').textContent = product.name;
    document.getElementById('orderTradeNo').textContent = orderNo;
    
    document.getElementById('paymentModal').classList.add('active');
}

// 参与拼团
function joinGroup(team) {
    const userId = localStorage.getItem('loginToken');
    if (!userId) {
        showToast('请先登录', 'error');
        return;
    }
    
    const product = Products[currentProduct];
    const orderNo = 'ORDER_' + Date.now();
    
    // 显示支付弹窗
    document.getElementById('paymentAmountValue').textContent = product.payPrice.toFixed(2);
    document.getElementById('orderProductName').textContent = product.name;
    document.getElementById('orderTradeNo').textContent = orderNo;
    
    document.getElementById('paymentModal').classList.add('active');
}

// 关闭支付弹窗
function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

// 完成支付
function completePayment() {
    showToast('支付成功！', 'success');
    closePaymentModal();
    
    // 添加到拼团列表
    const userId = localStorage.getItem('loginToken');
    mockTeams.unshift({
        userId: userId,
        lockCount: 1,
        targetCount: 3,
        validEndTime: Date.now() + 3600000
    });
    
    loadMockTeams();
    
    // 延迟跳转到订单页
    setTimeout(() => {
        window.location.href = 'order-list.html';
    }, 1500);
}

// 退出登录
function logout() {
    localStorage.removeItem('loginToken');
    localStorage.removeItem('username');
    document.cookie = 'loginToken=; path=/; max-age=0';
    document.cookie = 'username=; path=/; max-age=0';
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

// 定时更新倒计时
setInterval(() => {
    mockTeams.forEach(team => {
        const countdownEl = document.querySelector(`.countdown[data-end-time="${team.validEndTime}"]`);
        if (countdownEl) {
            countdownEl.textContent = AppUtils.formatCountdown(team.validEndTime);
        }
    });
}, 1000);
