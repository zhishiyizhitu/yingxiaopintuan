<template>
  <div class="product-page">
    <div class="product-selector">
      <button 
        :class="{ active: currentProduct === 'liuliumei' }" 
        @click="switchProduct('liuliumei')"
      >
        溜溜梅
      </button>
      <button 
        :class="{ active: currentProduct === 'aoliao' }" 
        @click="switchProduct('aoliao')"
      >
        奥利奥
      </button>
    </div>

    <div class="swiper-container">
      <div class="swiper-wrapper" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div class="swiper-slide" v-for="(img, index) in images" :key="index">
          <img :src="img" alt="商品图片">
        </div>
      </div>
      <div class="swiper-pagination">
        <div
            v-for="(img, index) in images"
            :key="index"
            class="swiper-dot"
            :class="{ active: currentIndex === index }"
        ></div>
      </div>
    </div>

    <div class="product-info">
      <h1 class="product-title">{{ currentProduct === 'liuliumei' ? '溜溜梅' : '奥利奥' }}</h1>
      <div>
        <span class="promotion-tag">大促优惠</span>
        <span class="promotion-text">
          直降 ¥{{ deductionAmount }}, {{ teamStatistic?.allTeamUserCount || 76 }}人再抢，参与马上抢到
        </span>
      </div>
      <div class="price-section">
        <span class="original-price">¥{{ originalPrice }}</span>
        <span class="group-price">¥{{ groupPrice }}</span>
      </div>
    </div>

    <div class="group-list" v-if="teamList && teamList.length > 0">
      <div class="group-list-title">正在拼团</div>
      <div class="group-item" v-for="(team, index) in teamList" :key="index">
        <div class="group-info">
          <div class="avatar">{{ team.userId?.charAt(0)?.toUpperCase() || 'U' }}</div>
          <div>
            <div class="user-info">{{ team.userId || '用户***' }}</div>
            <div class="group-status">
              <span>组队仅剩{{ team.targetCount - team.completeCount }}人，拼单即将结束</span>
              <span class="countdown">{{ countdowns[team.teamId] || team.validTimeCountdown || '00:00:00' }}</span>
            </div>
          </div>
        </div>
        <div class="right">
          <button class="group-btn" @click="handleJoinGroup(team)">参与拼团</button>
        </div>
      </div>
    </div>

    <div class="area"></div>

    <div class="action-bar" v-if="productData">
      <button class="action-btn buy-alone" @click="handleBuyAlone">
        单独购买 (￥{{ originalPrice }})
      </button>
      <button class="action-btn group-buy" @click="handleGroupBuy">
        开团购买 (￥{{ groupPrice }})
      </button>
    </div>

    <div class="product-nav" @click="goToDetail">
      <div class="nav-content">
        <img :src="images[currentIndex]" class="nav-image">
        <div class="nav-info">
          <div class="nav-title">{{ currentProduct === 'liuliumei' ? '溜溜梅' : '奥利奥' }}</div>
          <div class="nav-price">
            <span class="group-price">¥{{ groupPrice }}</span>
            <span class="original-price">¥{{ originalPrice }}</span>
          </div>
        </div>
        <div class="nav-arrow">></div>
      </div>
    </div>

    <div class="bottom-nav">
      <router-link to="/" class="nav-item active">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">首页</span>
      </router-link>
      <router-link to="/order" class="nav-item">
        <span class="nav-icon">📋</span>
        <span class="nav-text">订单</span>
      </router-link>
      <div class="nav-item" @click="logout">
        <span class="nav-icon">👤</span>
        <span class="nav-text">我的</span>
      </div>
    </div>

    <div id="paymentModal" class="modal" v-show="showPaymentModal">
      <div class="modal-content">
        <h2>请扫码支付</h2>
        <p>支付金额：￥{{ paymentAmount }}</p>
        <img :src="currentProduct === 'liuliumei' ? '/images/liuliumei1.png' : '/images/aoliao1.png'" alt="商品图片" class="qr-code">
        <div class="button-group">
          <button @click="cancelPayment">取消支付</button>
          <button @click="completePayment">支付完成</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { queryGroupBuyMarketConfig, lockMarketPayOrder, settlementMarketPayOrder } from '@/api/market'

const router = useRouter()
const currentIndex = ref(0)
const showPaymentModal = ref(false)
const paymentAmount = ref(0)
const currentOrder = ref(null)

const liuliumeiImages = [
  '/images/liuliumei1.png',
  '/images/liuliumei2.png',
  '/images/liuliumei3.png'
]

const aoliaoImages = [
  '/images/aoliao1.png',
  '/images/aoliao2.png',
  '/images/aoliao3.png'
]

const images = ref([...liuliumeiImages])

const productData = ref(null)
const teamList = ref([])
const teamStatistic = ref(null)
const originalPrice = ref(15.00)
const groupPrice = ref(8.80)
const deductionAmount = ref(6.20)
const currentProduct = ref('liuliumei')

let swiperTimer = null

const loadProductData = async () => {
  try {
    const userId = localStorage.getItem('username')
    if (!userId) {
      router.push('/login')
      return
    }

    const goodsId = currentProduct.value === 'liuliumei' ? '9890002' : '9890003'
    
    const response = await queryGroupBuyMarketConfig({
      userId: userId,
      source: 's01',
      channel: 'c01',
      goodsId: goodsId
    })

    if (response.data) {
      productData.value = response.data
      teamList.value = response.data.teamList || []
      teamStatistic.value = response.data.teamStatistic

      if (response.data.goods) {
        originalPrice.value = response.data.goods.originalPrice
        groupPrice.value = response.data.goods.payPrice
        deductionAmount.value = response.data.goods.deductionPrice
      } else {
        // 如果没有后端数据，使用默认值
        if (currentProduct.value === 'liuliumei') {
          originalPrice.value = 15.00
          groupPrice.value = 8.80
          deductionAmount.value = 6.20
        } else {
          originalPrice.value = 12.00
          groupPrice.value = 6.50
          deductionAmount.value = 5.50
        }
      }
    }
  } catch (error) {
    console.error('加载商品数据失败:', error)
    // 使用默认值
    if (currentProduct.value === 'liuliumei') {
      originalPrice.value = 15.00
      groupPrice.value = 8.80
      deductionAmount.value = 6.20
    } else {
      originalPrice.value = 12.00
      groupPrice.value = 6.50
      deductionAmount.value = 5.50
    }
  }
}

const switchProduct = (product) => {
  currentProduct.value = product
  currentIndex.value = 0
  if (product === 'liuliumei') {
    images.value = [...liuliumeiImages]
    originalPrice.value = 15.00
    groupPrice.value = 8.80
    deductionAmount.value = 6.20
  } else {
    images.value = [...aoliaoImages]
    originalPrice.value = 12.00
    groupPrice.value = 6.50
    deductionAmount.value = 5.50
  }
  loadProductData()
}

// 倒计时功能
const countdowns = ref({})

const startCountdown = (teamId, seconds) => {
  const endTime = Date.now() + seconds * 1000
  countdowns.value[teamId] = formatCountdown(seconds)
  
  const timer = setInterval(() => {
    const remaining = Math.max(0, endTime - Date.now())
    if (remaining <= 0) {
      clearInterval(timer)
      countdowns.value[teamId] = '已结束'
    } else {
      countdowns.value[teamId] = formatCountdown(Math.floor(remaining / 1000))
    }
  }, 1000)
}

const formatCountdown = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const goToDetail = () => {
  const goodsId = currentProduct.value === 'liuliumei' ? '9890002' : '9890003'
  router.push(`/product/${goodsId}`)
}

const handleJoinGroup = (team) => {
  const userId = localStorage.getItem('username')
  if (!userId) {
    router.push('/login')
    return
  }
  
  if (confirm(`参与拼团？\n商品：${currentProduct.value === 'liuliumei' ? '溜溜梅' : '奥利奥'}\n拼团价：¥${groupPrice.value}`)) {
    // 模拟参与拼团
    paymentAmount.value = groupPrice.value
    currentOrder.value = {
      orderId: Date.now().toString(),
      goodsName: currentProduct.value === 'liuliumei' ? '溜溜梅' : '奥利奥',
      payPrice: groupPrice.value
    }
    showPaymentModal.value = true
  }
}

const startSwiper = () => {
  swiperTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.value.length
  }, 3000)
}

const handleBuyAlone = async () => {
  try {
    const userId = localStorage.getItem('username')
    if (!userId) {
      router.push('/login')
      return
    }

    paymentAmount.value = originalPrice.value

    const lockResponse = await lockMarketPayOrder({
      userId: userId,
      teamId: null,
      activityId: productData.value?.activityId,
      goodsId: productData.value?.goods?.goodsId || '9890001',
      source: 's01',
      channel: 'c01',
      outTradeNo: generateOutTradeNo(),
      notifyConfigVO: {
        notifyType: 'MQ'
      }
    })

    if (lockResponse.data) {
      currentOrder.value = lockResponse.data
      showPaymentModal.value = true
    }
  } catch (error) {
    console.error('锁单失败:', error)
    alert('锁单失败，请重试')
  }
}

const handleGroupBuy = async () => {
  await handleBuyAlone()
}

const cancelPayment = () => {
  showPaymentModal.value = false
  currentOrder.value = null
}

const completePayment = async () => {
  try {
    if (!currentOrder.value) {
      alert('订单信息不存在')
      return
    }

    const userId = localStorage.getItem('username')

    await settlementMarketPayOrder({
      userId: userId,
      outTradeNo: currentOrder.value.outTradeNo || currentOrder.value.orderId,
      outTradeTime: new Date(),
      source: 's01',
      channel: 'c01'
    })

    alert('支付成功！')
    showPaymentModal.value = false
    currentOrder.value = null

    await loadProductData()
  } catch (error) {
    console.error('结算失败:', error)
    alert('支付失败，请重试')
  }
}

const generateOutTradeNo = () => {
  return Date.now().toString().slice(-10) + Math.random().toString(36).substr(2, 2)
}

const logout = () => {
  localStorage.removeItem('username')
  router.push('/login')
}

onMounted(() => {
  loadProductData()
  startSwiper()
})

onUnmounted(() => {
  if (swiperTimer) {
    clearInterval(swiperTimer)
  }
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.product-page {
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  padding-bottom: 80px;
}

.product-selector {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 25px 20px;
  background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.product-selector button {
  padding: 12px 40px;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
  color: white;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.product-selector button.active {
  background: linear-gradient(135deg, #ff4757 0%, #ff6b6b 100%);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.4);
}

.product-selector button:hover {
  transform: scale(1.05);
}

.swiper-container {
  width: 100%;
  height: 420px;
  position: relative;
  overflow: hidden;
  background: white;
  margin-bottom: 15px;
}

.swiper-wrapper {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.swiper-slide {
  flex: 0 0 100%;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.swiper-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-pagination {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.swiper-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  transition: all 0.3s;
  cursor: pointer;
}

.swiper-dot.active {
  background: #fff;
  width: 30px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.product-info {
  padding: 20px;
  background: white;
  margin: 0 15px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.product-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.4;
  margin-bottom: 12px;
}

.promotion-tag {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(90deg,#ff4757,#ff6b81);
  color: white;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  margin-right: 10px;
}

.promotion-text {
  font-size: 15px;
  color: #ff4757;
  margin: 10px 0;
  font-weight: 500;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 15px;
  margin: 15px 0;
}

.original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.group-price {
  font-size: 28px;
  font-weight: 700;
  color: #ff4757;
}

.group-list {
  margin: 15px;
  background: white;
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.group-list-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
}

.group-item:last-child {
  border-bottom: none;
}

.group-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.group-status {
  font-size: 13px;
  color: #666;
}

.countdown {
  color: #ff4757;
  font-weight: 600;
}

.group-btn {
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
}

.group-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.4);
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 15px 20px;
  display: flex;
  gap: 15px;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
}

.action-btn {
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.buy-alone {
  background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
  color: #d63031;
}

.group-buy {
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
}

.action-btn:hover {
  transform: translateY(-2px);
}

.modal {
  display: block;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: white;
  margin: 10% auto;
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-content h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 22px;
}

.modal-content p {
  color: #ff4757;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
}

.qr-code {
  width: 200px;
  height: 200px;
  margin: 20px auto;
  border-radius: 10px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.button-group button {
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s;
}

.button-group button:first-child {
  background: #f1f2f6;
  color: #333;
}

.button-group button:last-child {
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: white;
}

.button-group button:hover {
  transform: translateY(-2px);
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

.product-nav {
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  background: white;
  padding: 10px 15px;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
  z-index: 99;
  cursor: pointer;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.nav-info {
  flex: 1;
}

.nav-title {
  font-size: 15px;
  color: #333;
  margin-bottom: 5px;
}

.nav-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.nav-price .group-price {
  font-size: 18px;
  font-weight: 700;
  color: #ff4757;
}

.nav-price .original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.nav-arrow {
  font-size: 20px;
  color: #ccc;
}
</style>
