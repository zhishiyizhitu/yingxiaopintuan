// 商家后台管理 JavaScript

// 商品数据（本地数据，不依赖后端）
let products = [
    {
        id: 1,
        goodsId: '9890002',
        name: '溜溜梅',
        originalPrice: 15.00,
        payPrice: 8.80,
        desc: '酸甜可口的溜溜梅，开胃解馋',
        image: '🍒',
        createTime: new Date().getTime()
    },
    {
        id: 2,
        goodsId: '9890003',
        name: '奥利奥',
        originalPrice: 12.00,
        payPrice: 6.50,
        desc: '经典夹心饼干，扭一扭舔一舔泡一泡',
        image: '🍪',
        createTime: new Date().getTime()
    }
];

// 页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    checkAdminLogin();
    initNavigation();
    loadProducts();
});

// 检查管理员登录状态
function checkAdminLogin() {
    const adminId = localStorage.getItem('adminToken');
    if (!adminId) {
        // 未登录，跳转到登录页
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('adminName').textContent = adminId;
}

// 初始化导航
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 切换激活状态
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // 切换页面
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
}

// 显示页面
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = page.id === `page-${pageName}` ? 'block' : 'none';
    });
    
    // 加载对应数据
    switch(pageName) {
        case 'products':
            loadProducts();
            break;
        case 'activities':
            loadActivities();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

// 加载商品列表
function loadProducts() {
    const productList = document.getElementById('productList');
    
    if (products.length === 0) {
        productList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <div class="empty-text">暂无商品</div>
                <div class="empty-subtext">点击右上角添加新商品</div>
            </div>
        `;
        return;
    }
    
    productList.innerHTML = '';
    
    products.forEach(product => {
        const card = createProductCard(product);
        productList.appendChild(card);
    });
}

// 创建商品卡片
function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    
    // 使用 emoji 作为图片的替代
    const imageContent = product.image.startsWith('🍒') || product.image.startsWith('🍪') 
        ? `<div style="font-size: 120px; text-align: center; line-height: 280px;">${product.image}</div>`
        : `<img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjdlZWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7kvKDlm77orr7orqE8L3RleHQ+PC9zdmc+'">`;
    
    div.innerHTML = `
        ${imageContent}
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">
                <span class="price-current">¥${product.payPrice.toFixed(2)}</span>
                <span class="price-original">¥${product.originalPrice.toFixed(2)}</span>
            </div>
            <div class="product-meta">
                <span class="product-id">ID: ${product.goodsId}</span>
                <div class="product-actions">
                    <button class="action-btn edit" onclick="editProduct(${product.id})">编辑</button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})">删除</button>
                </div>
            </div>
        </div>
    `;
    
    return div;
}

// 显示添加商品弹窗
window.showAddProductModal = function() {
    document.getElementById('productModalTitle').textContent = '添加商品';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imageUploadArea').style.display = 'block';
    document.getElementById('productModal').classList.add('active');
}

// 编辑商品
window.editProduct = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('productModalTitle').textContent = '编辑商品';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productGoodsId').value = product.goodsId;
    document.getElementById('productOriginalPrice').value = product.originalPrice;
    document.getElementById('productPayPrice').value = product.payPrice;
    document.getElementById('productDesc').value = product.desc;
    document.getElementById('productImage').value = product.image;
    
    // 显示图片预览
    if (product.image) {
        document.getElementById('previewImg').src = product.image;
        document.getElementById('imagePreview').style.display = 'block';
        document.getElementById('imageUploadArea').style.display = 'none';
    }
    
    document.getElementById('productModal').classList.add('active');
}

// 关闭商品弹窗
window.closeProductModal = function() {
    document.getElementById('productModal').classList.remove('active');
}

// 保存商品
window.saveProduct = function() {
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const goodsId = document.getElementById('productGoodsId').value;
    const originalPrice = parseFloat(document.getElementById('productOriginalPrice').value);
    const payPrice = parseFloat(document.getElementById('productPayPrice').value);
    const desc = document.getElementById('productDesc').value;
    const image = document.getElementById('productImage').value;
    
    // 验证
    if (!name || !goodsId || !originalPrice || !payPrice) {
        showToast('请填写必填项', 'error');
        return;
    }
    
    if (id) {
        // 编辑商品
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                goodsId,
                originalPrice,
                payPrice,
                desc,
                image
            };
            showToast('商品更新成功', 'success');
        }
    } else {
        // 添加商品
        const newProduct = {
            id: Date.now(),
            goodsId,
            name,
            originalPrice,
            payPrice,
            desc,
            image,
            createTime: new Date().getTime()
        };
        products.push(newProduct);
        showToast('商品添加成功', 'success');
    }
    
    closeProductModal();
    loadProducts();
}

// 删除商品
window.deleteProduct = function(productId) {
    if (!confirm('确定要删除这个商品吗？')) return;
    
    products = products.filter(p => p.id !== productId);
    showToast('商品已删除', 'success');
    loadProducts();
}

// 上传图片（模拟）
window.uploadImage = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('previewImg').src = e.target.result;
                document.getElementById('productImage').value = e.target.result;
                document.getElementById('imagePreview').style.display = 'block';
                document.getElementById('imageUploadArea').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// 移除图片
window.removeImage = function() {
    document.getElementById('productImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imageUploadArea').style.display = 'block';
}

// 加载活动列表（模拟）
function loadActivities() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🎯</div>
            <div class="empty-text">暂无活动数据</div>
        </div>
    `;
}

// 加载订单列表（模拟）
function loadOrders() {
    const orderTableBody = document.getElementById('orderTableBody');
    orderTableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; color: #888; padding: 40px;">暂无订单数据</td>
        </tr>
    `;
}

// 加载用户列表（模拟）
function loadUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">👥</div>
            <div class="empty-text">暂无用户数据</div>
        </div>
    `;
}

// 退出登录
window.logout = function() {
    if (!confirm('确定要退出登录吗？')) return;
    
    localStorage.removeItem('adminToken');
    localStorage.removeItem('loginToken');
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
