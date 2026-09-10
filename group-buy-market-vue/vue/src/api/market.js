import request from './request'

// ==================== 客户商城 API ====================

/**
 * 查询拼团营销配置
 */
export function queryGroupBuyMarketConfig(data) {
    return request({
        url: '/index/query_group_buy_market_config',
        method: 'post',
        data
    })
}

/**
 * 锁单
 */
export function lockMarketPayOrder(data) {
    return request({
        url: '/trade/lock_market_pay_order',
        method: 'post',
        data
    })
}

/**
 * 结算
 */
export function settlementMarketPayOrder(data) {
    return request({
        url: '/trade/settlement_market_pay_order',
        method: 'post',
        data
    })
}

/**
 * 退款
 */
export function refundMarketPayOrder(data) {
    return request({
        url: '/trade/refund_market_pay_order',
        method: 'post',
        data
    })
}

// ==================== 商家后台 API ====================

/**
 * 商家登录
 */
export function merchantLogin(data) {
    return request({
        url: '/admin/login',
        method: 'post',
        data
    })
}

/**
 * 商家注册
 */
export function merchantRegister(data) {
    return request({
        url: '/admin/register',
        method: 'post',
        data
    })
}

/**
 * 查询商品列表
 */
export function queryProducts(data = {}) {
    return request({
        url: '/admin/query_products',
        method: 'post',
        data
    })
}

/**
 * 添加商品
 */
export function addProduct(data) {
    return request({
        url: '/admin/add_product',
        method: 'post',
        data
    })
}

/**
 * 更新商品
 */
export function updateProduct(data) {
    return request({
        url: '/admin/update_product',
        method: 'post',
        data
    })
}

/**
 * 删除商品
 */
export function deleteProduct(data) {
    return request({
        url: '/admin/delete_product',
        method: 'post',
        data
    })
}

/**
 * 查询订单列表
 */
export function queryOrders(data = {}) {
    return request({
        url: '/admin/query_orders',
        method: 'post',
        data
    })
}
