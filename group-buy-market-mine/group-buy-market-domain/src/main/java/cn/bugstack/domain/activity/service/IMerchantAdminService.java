package cn.bugstack.domain.activity.service;

import cn.bugstack.domain.activity.model.entity.MerchantProductEntity;
import cn.bugstack.domain.activity.model.entity.MerchantUserEntity;

import java.util.List;

/**
 * @author Fuzhengwei bugstack.cn @拼团团
 * @description 商家后台管理服务接口
 * @create 2026-05-04
 */
public interface IMerchantAdminService {

    /**
     * 商家登录
     * @param username 用户名
     * @param password 密码
     * @return 商家用户信息
     */
    MerchantUserEntity login(String username, String password);

    /**
     * 商家注册
     * @param merchantUserEntity 商家用户信息
     */
    void register(MerchantUserEntity merchantUserEntity);

    /**
     * 查询商品列表
     * @param requestDTO 查询条件
     * @return 商品列表
     */
    List<MerchantProductEntity> queryProducts(MerchantProductEntity requestDTO);

    /**
     * 添加商品
     * @param merchantProductEntity 商品信息
     */
    void addProduct(MerchantProductEntity merchantProductEntity);

    /**
     * 更新商品
     * @param merchantProductEntity 商品信息
     */
    void updateProduct(MerchantProductEntity merchantProductEntity);

    /**
     * 删除商品
     * @param goodsId 商品 ID
     */
    void deleteProduct(String goodsId);

    /**
     * 查询订单列表
     * @param requestDTO 查询条件
     * @return 订单列表
     */
    List<MerchantProductEntity> queryOrders(MerchantProductEntity requestDTO);

}
