package cn.bugstack.domain.activity.repository;

import cn.bugstack.domain.activity.model.entity.MerchantProductEntity;
import cn.bugstack.domain.activity.model.entity.MerchantUserEntity;

import java.util.List;

/**
 * @author Fuzhengwei bugstack.cn @拼团团
 * @description 商家后台仓储接口
 * @create 2026-05-04
 */
public interface IMerchantRepository {

    /**
     * 根据用户名查询用户
     */
    MerchantUserEntity queryUserByUsername(String username);

    /**
     * 插入用户
     */
    void insertUser(MerchantUserEntity merchantUser);

    /**
     * 查询商品列表
     */
    List<MerchantProductEntity> queryProducts(MerchantProductEntity requestDTO);

    /**
     * 根据商品 ID 查询商品
     */
    MerchantProductEntity queryProductByGoodsId(String goodsId);

    /**
     * 插入商品
     */
    void insertProduct(MerchantProductEntity merchantProduct);

    /**
     * 更新商品
     */
    void updateProduct(MerchantProductEntity merchantProduct);

    /**
     * 删除商品
     */
    void deleteProduct(String goodsId);

}
