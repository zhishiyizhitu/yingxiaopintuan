package cn.bugstack.infrastructure.dao;

import cn.bugstack.infrastructure.dao.po.MerchantUserPO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * @author Fuzhengwei bugstack.cn @拼团团
 * @description 商家用户 DAO
 * @create 2026-05-04
 */
@Mapper
public interface IMerchantUserDao {

    /**
     * 根据用户名查询用户
     */
    MerchantUserPO queryByUsername(@Param("username") String username);

    /**
     * 插入用户
     */
    int insert(MerchantUserPO merchantUser);

    /**
     * 更新用户
     */
    int update(MerchantUserPO merchantUser);

}
