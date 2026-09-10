package cn.bugstack.infrastructure.dao;

import cn.bugstack.infrastructure.dao.po.MerchantProductPO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Fuzhengwei bugstack.cn @拼团团
 * @description 商家商品 DAO
 * @create 2026-05-04
 */
@Mapper
public interface IMerchantProductDao {

    /**
     * 查询商品列表
     */
    List<MerchantProductPO> queryProductList(@Param("goodsName") String goodsName, @Param("status") Integer status);

    /**
     * 根据商品 ID 查询商品
     */
    MerchantProductPO queryByGoodsId(@Param("goodsId") String goodsId);

    /**
     * 插入商品
     */
    int insert(MerchantProductPO merchantProduct);

    /**
     * 更新商品
     */
    int update(MerchantProductPO merchantProduct);

    /**
     * 删除商品
     */
    int deleteByGoodsId(@Param("goodsId") String goodsId);

}
