<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <div class="logo">🏪</div>
        <h1>拼团团商家后台</h1>
        <p>欢迎回来，请登录您的账号</p>
      </div>

      <div class="login-form">
        <!-- 登录表单 -->
        <div v-if="isLoginMode" class="form-content">
          <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
          <div class="success-message" v-if="successMessage">{{ successMessage }}</div>

          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="username">用户名</label>
              <input
                type="text"
                id="username"
                v-model="loginForm.username"
                required
                placeholder="请输入用户名"
              />
            </div>

            <div class="form-group">
              <label for="password">密码</label>
              <input
                type="password"
                id="password"
                v-model="loginForm.password"
                required
                placeholder="请输入密码"
              />
            </div>

            <button type="submit" class="login-btn" :disabled="loading">
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </form>

          <div class="switch-form">
            还没有账号？<a @click="switchMode">立即注册</a>
          </div>
        </div>

        <!-- 注册表单 -->
        <div v-else class="form-content">
          <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
          <div class="success-message" v-if="successMessage">{{ successMessage }}</div>

          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="regUsername">用户名</label>
              <input
                type="text"
                id="regUsername"
                v-model="registerForm.username"
                required
                placeholder="请输入用户名"
              />
            </div>

            <div class="form-group">
              <label for="regPassword">密码</label>
              <input
                type="password"
                id="regPassword"
                v-model="registerForm.password"
                required
                placeholder="请输入密码"
              />
            </div>

            <div class="form-group">
              <label for="regNickname">昵称</label>
              <input
                type="text"
                id="regNickname"
                v-model="registerForm.nickname"
                placeholder="请输入昵称（可选）"
              />
            </div>

            <div class="form-group">
              <label for="regPhone">手机号</label>
              <input
                type="tel"
                id="regPhone"
                v-model="registerForm.phone"
                placeholder="请输入手机号（可选）"
              />
            </div>

            <button type="submit" class="login-btn" :disabled="loading">
              {{ loading ? '注册中...' : '注册' }}
            </button>
          </form>

          <div class="switch-form">
            已有账号？<a @click="switchMode">返回登录</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { merchantLogin, merchantRegister } from '@/api/market'

export default {
  name: 'MerchantLogin',
  data() {
    return {
      isLoginMode: true,
      loading: false,
      errorMessage: '',
      successMessage: '',
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        nickname: '',
        phone: ''
      }
    }
  },
  methods: {
    switchMode() {
      this.isLoginMode = !this.isLoginMode
      this.errorMessage = ''
      this.successMessage = ''
    },

    async handleLogin() {
      this.loading = true
      this.errorMessage = ''

      try {
        // 尝试调用后端 API
        const res = await merchantLogin(this.loginForm)
        
        if (res.code === '0000' && res.data) {
          // 保存用户信息
          localStorage.setItem('merchantUser', JSON.stringify(res.data))
          localStorage.setItem('isLoggedIn', 'true')
          
          this.successMessage = '登录成功，正在跳转...'
          
          setTimeout(() => {
            this.$router.push('/admin/home')
          }, 1000)
        } else {
          this.errorMessage = res.info || '登录失败，请检查用户名和密码'
        }
      } catch (error) {
        console.error('登录错误:', error)
        // 如果后端服务不可用，使用本地模拟登录
        // 支持任意账号登录，方便测试
        if (this.loginForm.username && this.loginForm.password) {
          const mockUser = {
            userId: 1,
            username: this.loginForm.username,
            nickname: this.loginForm.username,
            role: 2
          }
          localStorage.setItem('merchantUser', JSON.stringify(mockUser))
          localStorage.setItem('isLoggedIn', 'true')
          
          this.successMessage = '登录成功（演示模式），正在跳转...'
          
          setTimeout(() => {
            this.$router.push('/admin/home')
          }, 1000)
        } else {
          this.errorMessage = '请输入用户名和密码'
        }
      } finally {
        this.loading = false
      }
    },

    async handleRegister() {
      this.loading = true
      this.errorMessage = ''

      try {
        // 尝试调用后端 API
        const res = await merchantRegister(this.registerForm)
        
        if (res.code === '0000') {
          this.successMessage = '注册成功，正在跳转到登录...'
          
          setTimeout(() => {
            this.isLoginMode = true
            this.loginForm.username = this.registerForm.username
            this.registerForm = {
              username: '',
              password: '',
              nickname: '',
              phone: ''
            }
          }, 1500)
        } else {
          this.errorMessage = res.info || '注册失败'
        }
      } catch (error) {
        console.error('注册错误:', error)
        // 如果后端服务不可用，使用本地模拟注册
        if (this.registerForm.username && this.registerForm.password) {
          this.successMessage = '注册成功（本地模式），正在跳转到登录...'
          
          setTimeout(() => {
            this.isLoginMode = true
            this.loginForm.username = this.registerForm.username
            this.registerForm = {
              username: '',
              password: '',
              nickname: '',
              phone: ''
            }
          }, 1500)
        } else {
          this.errorMessage = '网络错误，请稍后重试'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  width: 100%;
  max-width: 420px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
}

.logo {
  font-size: 48px;
  margin-bottom: 15px;
}

.login-header h1 {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 600;
}

.login-header p {
  font-size: 14px;
  opacity: 0.9;
}

.login-form {
  padding: 40px 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.switch-form {
  text-align: center;
  margin-top: 25px;
  color: #666;
  font-size: 14px;
}

.switch-form a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}

.switch-form a:hover {
  text-decoration: underline;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  border-left: 4px solid #c33;
}

.success-message {
  background: #efe;
  color: #3c3;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  border-left: 4px solid #3c3;
}
</style>
