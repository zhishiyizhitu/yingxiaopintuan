import axios from 'axios'

const request = axios.create({
    baseURL: '/api/v1/gbm',
    timeout: 10000
})

request.interceptors.request.use(
    config => {
        // 检查是否是商家后台请求
        const isMerchant = config.url.includes('/admin/')
        const merchantUser = localStorage.getItem('merchantUser')
        const username = localStorage.getItem('username')
        
        if (isMerchant && merchantUser) {
            const userData = JSON.parse(merchantUser)
            if (userData.userId) {
                config.headers['X-Merchant-Id'] = userData.userId
            }
        } else if (username) {
            config.headers['X-User-Id'] = username
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== '0000' && res.code !== 0) {
            console.error('API Error:', res.info)
            return Promise.reject(new Error(res.info || 'Error'))
        }
        return res
    },
    error => {
        console.error('Request Error:', error.message)
        return Promise.reject(error)
    }
)

export default request
