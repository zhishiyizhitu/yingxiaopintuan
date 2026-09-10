﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿// 支付回调测试页 JavaScript

// 页面加载完成后处理回调
document.addEventListener('DOMContentLoaded', function() {
    handleCallback();
});

// 处理支付回调
async function handleCallback() {
    const loadingState = document.getElementById('loadingState');
    const successState = document.getElementById('successState');
    const errorState = document.getElementById('errorState');
    const callbackInfo = document.getElementById('callbackInfo');
    const errorMessage = document.getElementById('errorMessage');

    try {
        // 从 URL 参数获取支付信息
        const urlParams = new URLSearchParams(window.location.search);
        const outTradeNo = urlParams.get('outTradeNo');
        const teamId = urlParams.get('teamId');
        const status = urlParams.get('status');
        const orderId = urlParams.get('orderId');
        
        // 如果没有参数，尝试从 localStorage 获取
        let paymentData = null;
        if (!outTradeNo) {
            const storedData = localStorage.getItem('pendingPayment');
            if (storedData) {
                paymentData = JSON.parse(storedData);
                localStorage.removeItem('pendingPayment');
            }
        }

        if (outTradeNo || paymentData) {
            // 模拟调用后端 API 验证支付状态
            // 实际项目中应该调用后端 API 确认支付结果
            // 例如：GET /api/v1/gbm/order/query_status?outTradeNo=xxx
            
            // 模拟延迟
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 显示成功状态
            loadingState.style.display = 'none';
            successState.style.display = 'block';

            // 填充订单信息
            const orderData = paymentData || {
                outTradeNo: outTradeNo || 'ORDER_' + Date.now(),
                teamId: teamId || 'TEAM_' + Math.random().toString(36).substr(2, 8),
                orderId: orderId || 'ORDER_' + Math.random().toString(36).substr(2, 9),
                amount: 40.00,
                goodsName: '手写 MyBatis：渐进式源码实践（全彩）',
                payTime: new Date().getTime()
            };

            callbackInfo.innerHTML = `
                <div class="info-row">
                    <span class="label">订单号：</span>
                    <span class="value">${orderData.orderId}</span>
                </div>
                <div class="info-row">
                    <span class="label">交易号：</span>
                    <span class="value">${orderData.outTradeNo}</span>
                </div>
                <div class="info-row">
                    <span class="label">拼团 ID：</span>
                    <span class="value">${orderData.teamId}</span>
                </div>
                <div class="info-row">
                    <span class="label">商品名称：</span>
                    <span class="value">${orderData.goodsName}</span>
                </div>
                <div class="info-row">
                    <span class="label">支付金额：</span>
                    <span class="value success">¥${orderData.amount.toFixed(2)}</span>
                </div>
                <div class="info-row">
                    <span class="label">支付时间：</span>
                    <span class="value">${AppUtils.formatTime(orderData.payTime)}</span>
                </div>
            `;

            // 自动跳转到订单页（3 秒后）
            setTimeout(() => {
                // window.location.href = 'order-list.html';
            }, 5000);

        } else {
            // 显示错误状态
            loadingState.style.display = 'none';
            errorState.style.display = 'block';
            errorMessage.textContent = '未找到支付信息，请从商品详情页发起支付';
        }

    } catch (error) {
        console.error('处理支付回调失败:', error);
        
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
        errorMessage.textContent = '网络异常，请稍后重试或联系客服';
    }
}

// 模拟后端回调通知（用于测试）
// 实际项目中，后端会通过 HTTP POST 或 MQ 发送回调通知
window.simulateBackendCallback = function(data) {
    console.log('收到后端回调通知:', data);
    
    // 这里可以处理后端返回的支付结果
    // 例如更新订单状态、显示提示等
    
    return {
        code: '0000',
        info: '回调处理成功',
        data: data
    };
};

// 页面可见性变化处理（用户从支付页面返回）
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // 用户从后台返回，可以检查支付状态
        console.log('用户返回页面，检查支付状态...');
    }
});
