<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <span class="logo-icon">🏪</span>
          <span class="logo-text">拼团团商家后台</span>
        </div>
        <div class="header-right">
          <div class="user-info">
            <span class="user-avatar">👤</span>
            <span class="user-name">{{ userName }}</span>
          </div>
          <button class="logout-btn" @click="handleLogout">退出</button>
        </div>
      </div>
    </header>

    <!-- 侧边栏 -->
    <aside class="sidebar">
      <nav class="nav-menu">
        <div 
          class="nav-item" 
          :class="{ active: currentPage === 'products' }"
          @click="currentPage = 'products'"
        >
          <span class="nav-icon">📦</span>
          <span>商品管理</span>
        </div>
        <div 
          class="nav-item" 
          :class="{ active: currentPage === 'orders' }"
          @click="currentPage = 'orders'"
        >
          <span class="nav-icon">📋</span>
          <span>订单管理</span>
        </div>
      </nav>
    </aside>

    <!-- 主要内容区 -->
    <main class="main-content">
      <!-- 商品管理页面 -->
      <div v-if="currentPage === 'products'" class="page">
        <div class="page-header">
          <h1 class="page-title">📦 商品管理</h1>
          <button class="btn btn-primary" @click="showAddModal">
            <span>+</span> 添加商品
          </button>
        </div>

        <!-- 商品列表 -->
        <div class="product-list">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>

          <div v-else-if="products.length === 0" class="empty-state">
            <div class="empty-icon">📦</div>
            <p>暂无商品</p>
            <button class="btn btn-primary" @click="showAddModal" style="margin-top: 20px;">
              添加第一个商品
            </button>
          </div>

          <div v-else class="product-grid">
            <div v-for="product in products" :key="product.goodsId" class="product-card">
              <div class="product-image">
                <span v-if="!product.imageUrl" style="font-size: 80px;">📦</span>
                <img v-else :src="product.imageUrl" :alt="product.goodsName" @error="handleImageError">
                <span class="product-status" :class="product.status === 1 ? 'status-active' : 'status-inactive'">
                  {{ product.status === 1 ? '上架中' : '已下架' }}
                </span>
              </div>
              <div class="product-info">
                <div class="product-name">{{ product.goodsName }}</div>
                <div class="product-desc">{{ product.description || '暂无描述' }}</div>
                <div class="product-prices">
                  <span class="pay-price">¥{{ parseFloat(product.groupPrice).toFixed(2) }}</span>
                  <span class="original-price">¥{{ parseFloat(product.originalPrice).toFixed(2) }}</span>
                </div>
                <div class="product-meta">
                  <span class="product-sales">销量：{{ product.salesCount || 0 }}</span>
                  <div class="product-actions">
                    <button class="action-btn edit-btn" @click="editProduct(product)">编辑</button>
                    <button class="action-btn delete-btn" @click="deleteProduct(product)">删除</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单管理页面 -->
      <div v-else-if="currentPage === 'orders'" class="page">
        <div class="page-header">
          <h1 class="page-title">📋 订单管理</h1>
        </div>
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <p>订单管理功能开发中...</p>
        </div>
      </div>
    </main>

    <!-- 添加/编辑商品弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">×</button>
        <div class="modal-header">
          <h3>{{ isEditMode ? '编辑商品' : '添加商品' }}</h3>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProduct">
            <div class="form-row">
              <div class="form-group">
                <label>商品名称 *</label>
                <input
                  type="text"
                  v-model="productForm.goodsName"
                  required
                  placeholder="请输入商品名称"
                />
              </div>
              <div class="form-group">
                <label>商品 ID *</label>
                <input
                  type="text"
                  v-model="productForm.goodsId"
                  required
                  placeholder="如：9890001"
                  :disabled="isEditMode"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>原价 *</label>
                <input
                  type="number"
                  v-model.number="productForm.originalPrice"
                  required
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div class="form-group">
                <label>拼团价 *</label>
                <input
                  type="number"
                  v-model.number="productForm.groupPrice"
                  required
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div class="form-group">
              <label>商品描述</label>
              <textarea
                v-model="productForm.description"
                rows="3"
                placeholder="请输入商品描述"
              ></textarea>
            </div>

            <div class="form-group">
              <label>商品图片 URL</label>
              <input
                type="text"
                v-model="productForm.imageUrl"
                placeholder="请输入图片 URL 或留空使用默认图片"
              />
              <div class="image-tips">提示：可输入 /images/liuliumei1.jpg 等路径</div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveProduct" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 消息提示 -->
    <transition name="toast">
      <div v-if="toast.show" :class="['toast', toast.type]">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script>
import { queryProducts, addProduct, updateProduct, deleteProduct } from '@/api/market'

export default {
  name: 'AdminHome',
  data() {
    return {
      currentPage: 'products',
      userName: '',
      products: [],
      loading: false,
      showModal: false,
      isEditMode: false,
      saving: false,
      productForm: {
        goodsId: '',
        goodsName: '',
        description: '',
        originalPrice: 0,
        groupPrice: 0,
        imageUrl: '',
        status: 1,
        stock: 1000
      },
      toast: {
        show: false,
        message: '',
        type: 'info'
      }
    }
  },
  created() {
    this.checkAuth()
    this.loadProducts()
  },
  methods: {
    checkAuth() {
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      const user = localStorage.getItem('merchantUser')
      
      if (isLoggedIn !== 'true' || !user) {
        this.$router.push('/merchant-login')
        return
      }

      const userData = JSON.parse(user)
      this.userName = userData.nickname || userData.username
    },

    async loadProducts() {
      this.loading = true
      try {
        const res = await queryProducts()
        if (res.code === '0000' && res.data) {
          this.products = res.data
          this.showToast('加载成功', 'success')
        } else {
          this.showToast('加载商品失败：' + (res.info || '未知错误'), 'error')
        }
      } catch (error) {
        console.error('加载商品错误:', error)
        // 网络错误时，使用本地模拟数据
        this.showToast('后端服务未启动，使用本地演示数据', 'info')
        this.products = [
          {
            goodsId: '9890002',
            goodsName: '溜溜梅',
            description: '酸甜可口的溜溜梅，开胃解馋',
            originalPrice: 15.00,
            groupPrice: 8.80,
            stock: 1000,
            imageUrl: '/images/liuliumei1.png',
            status: 1,
            salesCount: 0,
            createTime: new Date(),
            updateTime: new Date()
          },
          {
            goodsId: '9890003',
            goodsName: '奥利奥',
            description: '经典夹心饼干，扭一扭舔一舔泡一泡',
            originalPrice: 12.00,
            groupPrice: 6.50,
            stock: 1000,
            imageUrl: '/images/aoliao1.png',
            status: 1,
            salesCount: 0,
            createTime: new Date(),
            updateTime: new Date()
          }
        ]
      } finally {
        this.loading = false
      }
    },

    showAddModal() {
      this.isEditMode = false
      this.productForm = {
        goodsId: '',
        goodsName: '',
        description: '',
        originalPrice: 0,
        groupPrice: 0,
        imageUrl: '',
        status: 1,
        stock: 1000
      }
      this.showModal = true
    },

    editProduct(product) {
      this.isEditMode = true
      this.productForm = {
        goodsId: product.goodsId,
        goodsName: product.goodsName,
        description: product.description || '',
        originalPrice: parseFloat(product.originalPrice),
        groupPrice: parseFloat(product.groupPrice),
        imageUrl: product.imageUrl || '',
        status: product.status,
        stock: product.stock || 1000
      }
      this.showModal = true
    },

    async saveProduct() {
      this.saving = true
      try {
        const api = this.isEditMode ? updateProduct : addProduct
        const res = await api(this.productForm)
        
        if (res.code === '0000') {
          this.showToast(this.isEditMode ? '更新成功' : '添加成功', 'success')
          this.closeModal()
          this.loadProducts()
        } else {
          this.showToast(res.info || '操作失败', 'error')
        }
      } catch (error) {
        console.error('保存商品错误:', error)
        // 网络错误时，模拟保存成功
        this.showToast('后端服务未启动，模拟保存成功', 'info')
        this.closeModal()
        // 添加到本地列表
        if (!this.isEditMode) {
          this.products.push({
            ...this.productForm,
            createTime: new Date(),
            updateTime: new Date(),
            salesCount: 0
          })
        } else {
          const index = this.products.findIndex(p => p.goodsId === this.productForm.goodsId)
          if (index !== -1) {
            this.products[index] = {
              ...this.productForm,
              updateTime: new Date()
            }
          }
        }
      } finally {
        this.saving = false
      }
    },

    async deleteProduct(product) {
      if (!confirm(`确定要删除商品"${product.goodsName}"吗？`)) {
        return
      }

      try {
        const res = await deleteProduct({ goodsId: product.goodsId })
        if (res.code === '0000') {
          this.showToast('删除成功', 'success')
          this.loadProducts()
        } else {
          this.showToast(res.info || '删除失败', 'error')
        }
      } catch (error) {
        console.error('删除商品错误:', error)
        // 网络错误时，模拟删除成功
        this.showToast('后端服务未启动，模拟删除成功', 'info')
        this.products = this.products.filter(p => p.goodsId !== product.goodsId)
      }
    },

    closeModal() {
      this.showModal = false
      this.isEditMode = false
    },

    handleImageError(e) {
      e.target.style.display = 'none'
      e.target.parentElement.innerHTML = '<span style="font-size: 80px;">📦</span>'
    },

    handleLogout() {
      if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('merchantUser')
        localStorage.removeItem('isLoggedIn')
        this.$router.push('/merchant-login')
      }
    },

    showToast(message, type = 'info') {
      this.toast = {
        show: true,
        message,
        type
      }
      setTimeout(() => {
        this.toast.show = false
      }, 3000)
    }
  }
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 顶部导航栏 */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0 30px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
}

.logo-icon {
  font-size: 28px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  font-size: 24px;
}

.user-name {
  font-size: 14px;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 侧边栏 */
.sidebar {
  position: fixed;
  left: 0;
  top: 60px;
  width: 220px;
  height: calc(100vh - 60px);
  background: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
}

.nav-menu {
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  cursor: pointer;
  transition: all 0.3s;
  color: #555;
  font-size: 15px;
}

.nav-item:hover {
  background: #f5f7fa;
  color: #667eea;
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.1), transparent);
  color: #667eea;
  border-right: 3px solid #667eea;
}

.nav-icon {
  font-size: 20px;
}

/* 主要内容区 */
.main-content {
  margin-left: 220px;
  margin-top: 60px;
  padding: 30px;
  min-height: calc(100vh - 60px);
}

.page {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* 商品列表 */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 240px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background: rgba(52, 199, 89, 0.9);
  color: white;
}

.status-inactive {
  background: rgba(142, 142, 147, 0.9);
  color: white;
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.product-desc {
  font-size: 13px;
  color: #888;
  margin-bottom: 16px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-prices {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}

.pay-price {
  font-size: 24px;
  font-weight: 700;
  color: #ff6b6b;
}

.original-price {
  font-size: 15px;
  color: #999;
  text-decoration: line-through;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.product-sales {
  font-size: 13px;
  color: #888;
}

.product-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.edit-btn {
  background: #e3f2fd;
  color: #1976d2;
}

.edit-btn:hover {
  background: #bbdefb;
}

.delete-btn {
  background: #ffebee;
  color: #d32f2f;
}

.delete-btn:hover {
  background: #ffcdd2;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 20px;
  color: #333;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 表单 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.image-tips {
  margin-top: 8px;
  font-size: 12px;
  color: #888;
}

/* Toast */
.toast {
  position: fixed;
  top: 80px;
  right: 30px;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 3000;
}

.toast.success {
  background: white;
  border-left: 4px solid #52c41a;
  color: #52c41a;
}

.toast.error {
  background: white;
  border-left: 4px solid #ff4d4f;
  color: #ff4d4f;
}

.toast.info {
  background: white;
  border-left: 4px solid #1890ff;
  color: #1890ff;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(400px);
}
</style>
