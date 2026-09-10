<template>
  <div class="login-container">
    <div class="background-content">
      <div class="logo-area">
        <h1 class="brand-title">拼团团</h1>
        <p class="brand-subtitle">发现更多美好生活</p>
      </div>
    </div>

    <div class="form-wrapper">
      <div class="form-toggle">
        <button 
          :class="{ active: isLogin }" 
          @click="toggleForm(true)"
        >
          登录
        </button>
        <button 
          :class="{ active: !isLogin }" 
          @click="toggleForm(false)"
        >
          注册
        </button>
      </div>

      <form v-if="isLogin" @submit.prevent="handleLogin" class="login-form">
        <h2>欢迎登录</h2>
        <div class="input-group">
          <input
              type="text"
              v-model="username"
              id="login-username"
              required
          >
          <label for="login-username">用户名</label>
        </div>
        <div class="input-group">
          <input
              type="password"
              v-model="password"
              id="login-password"
              required
          >
          <label for="login-password">密码</label>
        </div>
        <button type="submit">登录</button>
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      </form>

      <form v-else @submit.prevent="handleRegister" class="register-form">
        <h2>欢迎注册</h2>
        <div class="input-group">
          <input
              type="text"
              v-model="regUsername"
              id="reg-username"
              required
          >
          <label for="reg-username">用户名</label>
        </div>
        <div class="input-group">
          <input
              type="password"
              v-model="regPassword"
              id="reg-password"
              required
          >
          <label for="reg-password">密码</label>
        </div>
        <div class="input-group">
          <input
              type="password"
              v-model="confirmPassword"
              id="confirm-password"
              required
          >
          <label for="confirm-password">确认密码</label>
        </div>
        <button type="submit">注册</button>
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
        <p class="success-message" v-if="successMessage">{{ successMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(true)
const username = ref('')
const password = ref('')
const regUsername = ref('')
const regPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const toggleForm = (login) => {
  isLogin.value = login
  errorMessage.value = ''
  successMessage.value = ''
}

const handleLogin = () => {
  if (!username.value || !password.value) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  localStorage.setItem('username', username.value)
  errorMessage.value = ''

  router.push('/')
}

const handleRegister = () => {
  if (!regUsername.value || !regPassword.value) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  if (regPassword.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  if (regPassword.value.length < 6) {
    errorMessage.value = '密码长度不能少于 6 位'
    return
  }

  // 模拟注册成功
  localStorage.setItem('username', regUsername.value)
  successMessage.value = '注册成功！正在跳转...'
  errorMessage.value = ''

  setTimeout(() => {
    router.push('/')
  }, 1500)
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.background-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 60px;
}

.logo-area {
  text-align: center;
  z-index: 1;
}

.brand-title {
  font-size: 4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 8px;
  margin-bottom: 10px;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5)); }
  to { filter: drop-shadow(0 0 20px rgba(118, 75, 162, 0.8)); }
}

.brand-subtitle {
  color: rgba(255,255,255,0.6);
  font-size: 1rem;
  letter-spacing: 4px;
  font-weight: 300;
}

.form-wrapper {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 30px 30px 0 0;
  padding: 40px;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10;
}

.form-toggle {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.form-toggle button {
  padding: 12px 40px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.form-toggle button::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  transition: width 0.3s;
}

.form-toggle button.active {
  color: #667eea;
}

.form-toggle button.active::after {
  width: 80%;
}

.form-toggle button:hover {
  color: #667eea;
}

.login-form,
.register-form {
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.login-form h2,
.register-form h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}

.input-group {
  position: relative;
  margin-bottom: 25px;
}

.input-group input {
  width: 100%;
  padding: 15px 0;
  font-size: 16px;
  color: #333;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  outline: none;
  background: transparent;
  transition: 0.3s;
}

.input-group label {
  position: absolute;
  top: 15px;
  left: 0;
  font-size: 16px;
  color: #999;
  pointer-events: none;
  transition: 0.3s;
}

.input-group input:focus ~ label,
.input-group input:valid ~ label {
  top: -10px;
  font-size: 12px;
  color: #667eea;
}

.input-group input:focus {
  border-bottom: 2px solid #667eea;
}

button[type="submit"] {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  transition: all 0.3s;
  margin-top: 10px;
}

button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.error-message {
  color: #ff3860;
  font-size: 14px;
  text-align: center;
  margin-top: 15px;
}

.success-message {
  color: #4caf50;
  font-size: 14px;
  text-align: center;
  margin-top: 15px;
}
</style>
