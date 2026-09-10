// 公共配置和工具函数

// 应用配置
const AppConfig = {
    // 后端服务地址 - 可根据实际部署环境修改
    groupBuyMarketUrl: "http://127.0.0.1:8091",  // 拼团服务
    sPayMallUrl: "http://127.0.0.1:8070",        // 商城服务
    
    // 商品 ID（固定）
    goodsId: "9890001"
};

// 工具函数
const AppUtils = {
    /**
     * 获取 Cookie 值
     * @param {string} name - Cookie 名称
     * @returns {string|null} Cookie 值
     */
    getCookie: function(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    },
    
    /**
     * 设置 Cookie
     * @param {string} name - Cookie 名称
     * @param {string} value - Cookie 值
     * @param {number} maxAge - 有效期（秒）
     */
    setCookie: function(name, value, maxAge) {
        const expires = maxAge ? `; max-age=${maxAge}` : '';
        document.cookie = `${name}=${value}; path=/${expires}`;
    },
    
    /**
     * 删除 Cookie
     * @param {string} name - Cookie 名称
     */
    deleteCookie: function(name) {
        document.cookie = `${name}=; path=/; max-age=0`;
    },
    
    /**
     * 获取当前登录用户 ID
     * @returns {string|null} 用户 ID
     */
    getCurrentUserId: function() {
        // 优先从 localStorage 获取（更可靠）
        let userId = localStorage.getItem('loginToken');
        
        // 如果 localStorage 没有，尝试从 Cookie 获取
        if (!userId) {
            userId = this.getCookie("loginToken");
        }
        
        if (!userId) {
            // 如果未登录，跳转到登录页
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = "login.html";
            }
            return null;
        }
        return userId;
    },
    
    /**
     * 检查是否已登录
     * @returns {boolean} 是否已登录
     */
    isLoggedIn: function() {
        return !!this.getCookie("loginToken");
    },
    
    /**
     * 混淆用户 ID 显示（脱敏处理）
     * @param {string} userId - 用户 ID
     * @returns {string} 脱敏后的用户 ID
     */
    obfuscateUserId: function(userId) {
        if (!userId) return '';
        if (userId.length <= 4) {
            return userId;
        } else {
            const start = userId.slice(0, 2);
            const end = userId.slice(-2);
            const middle = '*'.repeat(userId.length - 4);
            return `${start}${middle}${end}`;
        }
    },
    
    /**
     * 从 URL 参数获取值
     * @param {string} paramName - 参数名称
     * @returns {string|null} 参数值
     */
    getUrlParam: function(paramName) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(paramName);
    },
    
    /**
     * 格式化金额
     * @param {number} amount - 金额
     * @returns {string} 格式化后的金额
     */
    formatMoney: function(amount) {
        return parseFloat(amount).toFixed(2);
    },
    
    /**
     * 格式化时间
     * @param {Date|number} time - 时间
     * @param {string} format - 格式
     * @returns {string} 格式化后的时间
     */
    formatTime: function(time, format = 'YYYY-MM-DD HH:mm:ss') {
        const date = new Date(time);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },
    
    /**
     * 计算倒计时
     * @param {number} endTime - 结束时间戳
     * @returns {object} 倒计时对象 {hours, minutes, seconds, isExpired}
     */
    getCountdown: function(endTime) {
        const now = new Date().getTime();
        const diff = endTime - now;
        
        if (diff <= 0) {
            return {
                hours: 0,
                minutes: 0,
                seconds: 0,
                isExpired: true
            };
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return {
            hours,
            minutes,
            seconds,
            isExpired: false
        };
    },
    
    /**
     * 格式化倒计时字符串
     * @param {number} endTime - 结束时间戳
     * @returns {string} 倒计时字符串 HH:MM:SS
     */
    formatCountdown: function(endTime) {
        const countdown = this.getCountdown(endTime);
        if (countdown.isExpired) {
            return '已结束';
        }
        return `${String(countdown.hours).padStart(2, '0')}:${String(countdown.minutes).padStart(2, '0')}:${String(countdown.seconds).padStart(2, '0')}`;
    },
    
    /**
     * 发起 HTTP 请求
     * @param {string} url - 请求 URL
     * @param {object} options - 请求选项
     * @returns {Promise} 请求结果
     */
    request: async function(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        
        const config = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, config);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('请求失败:', error);
            throw error;
        }
    },
    
    /**
     * 显示加载提示
     * @param {boolean} show - 是否显示
     */
    showLoading: function(show) {
        let loading = document.getElementById('globalLoading');
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'globalLoading';
            loading.className = 'global-loading';
            loading.innerHTML = `
                <div class="loading-spinner"></div>
                <p>加载中...</p>
            `;
            document.body.appendChild(loading);
        }
        loading.style.display = show ? 'flex' : 'none';
    }
};

// 导出到全局
window.AppConfig = AppConfig;
window.AppUtils = AppUtils;
window.getCookie = AppUtils.getCookie;
window.setCookie = AppUtils.setCookie;
window.deleteCookie = AppUtils.deleteCookie;
window.obfuscateUserId = AppUtils.obfuscateUserId;

// 添加全局样式（如果还没有）
if (!document.getElementById('globalLoadingStyle')) {
    const style = document.createElement('style');
    style.id = 'globalLoadingStyle';
    style.textContent = `
        .global-loading {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            z-index: 9999;
            color: white;
        }
        .global-loading .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}
