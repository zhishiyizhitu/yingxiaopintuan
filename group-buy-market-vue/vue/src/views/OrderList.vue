<template>
  <div class="order-page">
    <div class="header">
      <h1>我的订单</h1>
      <div class="tabs">
        <button 
          :class="{ active: currentTab === 'all' }" 
          @click="switchTab('all')"
        >
          全部
        </button>
        <button 
          :class="{ active: currentTab === 'pending' }" 
          @click="switchTab('pending')"
        >
          待支付
        </button>
        <button 
          :class="{ active: currentTab === 'grouping' }" 
          @click="switchTab('grouping')"
        >
          拼团中
        </button>
        <button 
          :class="{ active: currentTab === 'completed' }" 
          @click="switchTab('completed')"
        >
          已完成
        </button>
      </div>
    </div>

    <div class="order-list">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="orders.length === 0" class="empty">
        <div class="empty-icon">📦</div>
        <p>暂无订单</p>
      </div>
      <div v-else class="order-item" v-for="order in orders" :key="order.orderId">
        <div class="order-header">
          <span class="order-status" :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </span>
          <span class="order-time">{{ formatTime(order.createTime) }}</span>
        </div>
        
        <div class="order-content">
          <div class="product-info">
            <img :src="order.imageUrl || '/images/liuliumei1.png'" class="product-image">
            <div class="product-detail">
              <h3>{{ order.goodsName || (currentProduct === 'liuliumei' ? '溜溜梅' : '奥利奥') }}</h3>
              <p class="specs">规格：默认规格</p>
            </div>
          </div>
          
          <div class="price-info">
            <div class="price">¥{{ order.payPrice || order.originalPrice }}</div>
            <div class="quantity">x{{ order.quantity || 1 }}</div>
          </div>
        </div>
        
        <div class="order-footer">
          <div class="total">
            实付款：<span class="total-price">¥{{ order.payPrice || order.originalPrice }}</span>
          </div>
          <div class="actions">
            <button 
              v-if="order.status === 0" 
              class="btn btn-primary"
              @click="payOrder(order)"
            >
              立即支付
            </button>
            <button 
              v-if="order.status === 0" 
              class="btn btn-secondary"
              @click="cancelOrder(order)"
            >
              取消订单
            </button>
            <button 
              v-if="order.status === 1" 
              class="btn btn-default"
              disabled
            >
              拼团中
            </button>
            <button 
              v-if="order.status === 2" 
              class="btn btn-default"
              disabled
            >
              已完成
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-nav">
      <router-link to="/" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">首页</span>
      </router-link>
      <router-link to="/order" class="nav-item active">
        <span class="nav-icon">📋</span>
        <span class="nav-text">订单</span>
      </router-link>
      <div class="nav-item" @click="logout">
        <span class="nav-icon">👤</span>
        <span class="nav-text">我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentTab = ref('all')
const loading = ref(false)
const orders = ref([])
const currentProduct = ref('liuliumei')

const switchTab = (tab) => {
  currentTab.value = tab
  loadOrders()
}

const loadOrders = () => {
  loading.value = true
  // 模拟加载订单数据
  setTimeout(() => {
    const mockOrders = [
      {
        orderId: '1234567890',
        goodsName: '溜溜梅',
        imageUrl: '/images/liuliumei1.png',
        originalPrice: 15.00,
        payPrice: 8.80,
        quantity: 1,
        status: 0, // 0-待支付，1-拼团中，2-已完成
        createTime: new Date(Date.now() - 3600000)
      },
      {
        orderId: '1234567891',
        goodsName: '奥利奥',
        imageUrl: '/images/aoliao1.png',
        originalPrice: 12.00,
        payPrice: 6.50,
        quantity: 1,
        status: 1,
        createTime: new Date(Date.now() - 7200000)
      },
      {
        orderId: '1234567892',
        goodsName: '溜溜梅',
        imageUrl: '/images/liuliumei1.png',
        originalPrice: 15.00,
        payPrice: 8.80,
        quantity: 1,
        status: 2,
        createTime: new Date(Date.now() - 86400000)
      }
    ]
    
    if (currentTab.value !== 'all') {
      const statusMap = {
        'pending': 0,
        'grouping': 1,
        'completed': 2
      }
      orders.value = mockOrders.filter(o => o.status === statusMap[currentTab.value])
    } else {
      orders.value = mockOrders
    }
    
    loading.value = false
  }, 500)
}

const getStatusClass = (status) => {
  const classes = {
    0: 'status-pending',
    1: 'status-grouping',
    2: 'status-completed',
    3: 'status-cancelled'
  }
  return classes[status] || ''
}

const getStatusText = (status) => {
  const texts = {
    0: '待支付',
    1: '拼团中',
    2: '已完成',
    3: '已取消'
  }
  return texts[status] || '未知'
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const payOrder = (order) => {
  if (confirm(`确认支付订单 ${order.orderId} 吗？`)) {
    alert('支付成功！')
    loadOrders()
  }
}

const cancelOrder = (order) => {
  if (confirm(`确认取消订单 ${order.orderId} 吗？`)) {
    // 直接更新本地数据，不调用 loadOrders 避免循环
    const index = orders.value.findIndex(o => o.orderId === order.orderId)
    if (index !== -1) {
      orders.value[index].status = 3 // 3-已取消
    }
    alert('订单已取消')
  }
}

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('username')
    localStorage.removeItem('merchantUser')
    localStorage.removeItem('isLoggedIn')
    router.push('/login')
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.order-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 70px;
}

.header {
  background: white;
  padding: 20px 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
}

.tabs {
  display: flex;
  gap: 10px;
}

.tabs button {
  flex: 1;
  padding: 8px 12px;
  background: #f5f5f5;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.tabs button.active {
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: white;
  font-weight: 600;
}

.order-list {
  padding: 15px;
}

.loading, .empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.order-item {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.order-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.status-pending {
  background: #fff3e0;
  color: #ff9800;
}

.status-grouping {
  background: #e3f2fd;
  color: #2196f3;
}

.status-completed {
  background: #e8f5e9;
  color: #4caf50;
}

.status-cancelled {
  background: #ffebee;
  color: #f44336;
}

.order-time {
  font-size: 13px;
  color: #999;
}

.order-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.product-info {
  display: flex;
  gap: 12px;
  flex: 1;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-detail h3 {
  font-size: 15px;
  color: #333;
  margin-bottom: 5px;
}

.product-detail .specs {
  font-size: 13px;
  color: #999;
}

.price-info {
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #ff4757;
}

.quantity {
  font-size: 13px;
  color: #999;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.total {
  font-size: 14px;
  color: #666;
}

.total-price {
  font-size: 18px;
  font-weight: 700;
  color: #ff4757;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: white;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-default {
  background: #e8f5e9;
  color: #4caf50;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
  z-index: 100;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  text-decoration: none;
  color: #666;
  cursor: pointer;
}

.nav-item.active {
  color: #ff4757;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.nav-text {
  font-size: 12px;
}
</style>
