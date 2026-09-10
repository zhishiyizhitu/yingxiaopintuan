<template>
  <div class="product-detail-page">
    <!-- 图片轮播 -->
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
          @click="currentIndex = index"
        ></div>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="product-info">
      <h1 class="product-title">{{ product.goodsName }}</h1>
      <div class="promotion-tag">
        <span class="tag">大促优惠</span>
        <span class="text">已拼{{ product.salesCount || 1234 }}件</span>
      </div>
      
      <!-- 价格 -->
      <div class="price-section">
        <div class="group-price">
          <span class="symbol">¥</span>
          <span class="price">{{ product.groupPrice }}</span>
        </div>
        <div class="original-price">¥{{ product.originalPrice }}</div>
        <div class="deduction">省{{ (product.originalPrice - product.groupPrice).toFixed(2) }}</div>
      </div>

      <!-- 拼团信息 -->
      <div class="team-info">
        <div class="info-item">
          <div class="label">拼团规则</div>
          <div class="value">{{ product.targetCount }}人成团</div>
        </div>
        <div class="info-item">
          <div class="label">拼团时间</div>
          <div class="value">{{ product.teamHours }}小时</div>
        </div>
        <div class="info-item">
          <div class="label">库存</div>
          <div class="value">{{ product.stock }}件</div>
        </div>
      </div>
    </div>

    <!-- 正在拼团 -->
    <div class="team-list-section">
      <div class="section-title">
        <span>正在拼团</span>
        <span class="subtitle">（{{ teamList.length }}个团进行中）</span>
      </div>
      
      <div class="team-list">
        <div class="team-item" v-for="(team, index) in teamList" :key="index">
          <div class="team-header">
            <div class="avatar">{{ team.leaderName?.charAt(0)?.toUpperCase() || 'U' }}</div>
            <div class="team-info">
              <div class="leader-name">{{ team.leaderName || '用户***' }}发起的拼团</div>
              <div class="team-progress">
                已拼{{ team.completeCount }}/{{ team.targetCount }}人
              </div>
            </div>
            <div class="countdown" :class="{ warning: team.remainingSeconds < 3600 }">
              {{ formatCountdown(team.remainingSeconds) }}
            </div>
          </div>
          <div class="team-members">
            <div class="member" v-for="(member, mIndex) in team.members" :key="mIndex">
              <div class="member-avatar">{{ member.name?.charAt(0)?.toUpperCase() || 'U' }}</div>
            </div>
            <div class="member empty" v-for="i in (team.targetCount - team.members.length)" :key="'empty'+i">
              <div class="member-avatar empty">?</div>
            </div>
          </div>
          <button class="join-btn" @click="joinTeam(team)">
            去拼团
          </button>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="action-bar">
      <button class="action-btn buy-alone" @click="buyAlone">
        <div class="btn-label">单独购买</div>
        <div class="btn-price">¥{{ product.originalPrice }}</div>
      </button>
      <button class="action-btn group-buy" @click="createTeam">
        <div class="btn-label">发起拼团</div>
        <div class="btn-price">¥{{ product.groupPrice }}</div>
      </button>
    </div>

    <!-- 拼团确认弹窗 -->
    <div class="modal" v-show="showModal" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ modalTitle }}</h2>
        <div class="modal-info">
          <p>商品：{{ product.goodsName }}</p>
          <p>数量：1</p>
          <p class="price">应付：¥{{ modalPrice }}</p>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeModal">取消</button>
          <button class="btn-confirm" @click="confirmOrder">确认{{ modalActionName }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 商品数据
const product = ref({
  goodsId: route.params.goodsId || '9890002',
  goodsName: route.params.goodsId === '9890003' ? '奥利奥' : '溜溜梅',
  originalPrice: route.params.goodsId === '9890003' ? 12.00 : 15.00,
  groupPrice: route.params.goodsId === '9890003' ? 6.50 : 8.80,
  salesCount: 1234,
  stock: 9999,
  targetCount: 3,
  teamHours: 24
})

// 图片
const images = ref(
  product.value.goodsId === '9890003' 
    ? ['/images/aoliao1.png', '/images/aoliao2.png', '/images/aoliao3.png']
    : ['/images/liuliumei1.png', '/images/liuliumei2.png', '/images/liuliumei3.png']
)

const currentIndex = ref(0)
let swiperTimer = null

// 拼团列表
const teamList = ref([
  {
    teamId: '1',
    leaderName: '张三',
    completeCount: 2,
    targetCount: 3,
    remainingSeconds: 7200,
    members: [
      { name: '张三' },
      { name: '李四' }
    ]
  },
  {
    teamId: '2',
    leaderName: '王五',
    completeCount: 1,
    targetCount: 3,
    remainingSeconds: 36000,
    members: [
      { name: '王五' }
    ]
  }
])

// 弹窗
const showModal = ref(false)
const modalTitle = ref('')
const modalPrice = ref(0)
const modalActionName = ref('')
const currentAction = ref('') // 'create' or 'join'
const currentTeamId = ref('')

// 倒计时
const startCountdown = () => {
  const timer = setInterval(() => {
    teamList.value.forEach(team => {
      if (team.remainingSeconds > 0) {
        team.remainingSeconds--
      }
    })
  }, 1000)
  
  onUnmounted(() => {
    clearInterval(timer)
  })
}

const formatCountdown = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// 轮播图
const startSwiper = () => {
  swiperTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.value.length
  }, 3000)
  
  onUnmounted(() => {
    clearInterval(swiperTimer)
  })
}

// 操作
const createTeam = () => {
  currentAction.value = 'create'
  currentTeamId.value = ''
  modalTitle.value = '发起拼团'
  modalPrice.value = product.value.groupPrice
  modalActionName.value = '支付并开团'
  showModal.value = true
}

const joinTeam = (team) => {
  currentAction.value = 'join'
  currentTeamId.value = team.teamId
  modalTitle.value = '参与拼团'
  modalPrice.value = product.value.groupPrice
  modalActionName.value = '支付并参团'
  showModal.value = true
}

const buyAlone = () => {
  currentAction.value = 'alone'
  modalTitle.value = '单独购买'
  modalPrice.value = product.value.originalPrice
  modalActionName.value = '立即支付'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const confirmOrder = () => {
  // 模拟下单
  const order = {
    orderId: Date.now().toString(),
    goodsId: product.value.goodsId,
    goodsName: product.value.goodsName,
    payPrice: modalPrice.value,
    status: currentAction.value === 'alone' ? 0 : 1, // 单独购买待支付，拼团直接拼团中
    createTime: new Date()
  }
  
  // 保存订单到 localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  orders.push(order)
  localStorage.setItem('orders', JSON.stringify(orders))
  
  alert(`${currentAction.value === 'create' ? '开团' : currentAction.value === 'join' ? '参团' : '购买'}成功！`)
  closeModal()
  
  // 跳转到订单页
  router.push('/order')
}

onMounted(() => {
  startSwiper()
  startCountdown()
})
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120px;
}

.swiper-container {
  width: 100%;
  height: 400px;
  position: relative;
  overflow: hidden;
  background: white;
}

.swiper-wrapper {
  display: flex;
  transition: transform 0.5s ease;
}

.swiper-slide {
  flex: 0 0 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-pagination {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.swiper-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.swiper-dot.active {
  width: 24px;
  border-radius: 4px;
  background: white;
}

.product-info {
  background: white;
  padding: 20px;
  margin-bottom: 10px;
}

.product-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}

.promotion-tag {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.tag {
  background: linear-gradient(90deg, #ff4757, #ff6b81);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.text {
  color: #666;
  font-size: 13px;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}

.group-price {
  display: flex;
  align-items: baseline;
}

.group-price .symbol {
  font-size: 16px;
  color: #ff4757;
}

.group-price .price {
  font-size: 32px;
  font-weight: 700;
  color: #ff4757;
}

.original-price {
  font-size: 15px;
  color: #999;
  text-decoration: line-through;
}

.deduction {
  font-size: 13px;
  color: #ff4757;
  background: #fff3e0;
  padding: 2px 8px;
  border-radius: 4px;
}

.team-info {
  display: flex;
  gap: 20px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.info-item {
  flex: 1;
}

.info-item .label {
  font-size: 13px;
  color: #999;
  margin-bottom: 5px;
}

.info-item .value {
  font-size: 15px;
  color: #333;
  font-weight: 600;
}

.team-list-section {
  background: white;
  padding: 20px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
}

.section-title .subtitle {
  font-size: 13px;
  color: #999;
  font-weight: 400;
  margin-left: 8px;
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.team-item {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 15px;
  background: #fafafa;
}

.team-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.team-info {
  flex: 1;
}

.leader-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.team-progress {
  font-size: 13px;
  color: #666;
}

.countdown {
  font-size: 14px;
  color: #ff4757;
  font-weight: 600;
  background: #ffebee;
  padding: 4px 10px;
  border-radius: 12px;
}

.countdown.warning {
  background: #ffeb3b;
  color: #f57f17;
}

.team-members {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.member {
  width: 32px;
  height: 32px;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
}

.member-avatar.empty {
  background: #f5f5f5;
  color: #ccc;
}

.join-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.join-btn:hover {
  transform: scale(1.02);
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  gap: 10px;
  padding: 10px 15px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 100;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s;
}

.action-btn.buy-alone {
  background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
}

.action-btn.group-buy {
  background: linear-gradient(135deg, #ff4757, #ff6b81);
}

.btn-label {
  font-size: 13px;
  margin-bottom: 4px;
}

.btn-price {
  font-size: 18px;
  font-weight: 700;
}

.buy-alone .btn-label {
  color: #d63031;
}

.buy-alone .btn-price {
  color: #d63031;
}

.group-buy .btn-label,
.group-buy .btn-price {
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
}

.modal-content h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.modal-info {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.modal-info p {
  margin: 8px 0;
  color: #666;
}

.modal-info .price {
  font-size: 20px;
  font-weight: 700;
  color: #ff4757;
  margin-top: 12px;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.modal-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.btn-confirm {
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: white;
}
</style>
