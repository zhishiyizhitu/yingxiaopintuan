package cn.bugstack.infrastructure.repository;

import cn.bugstack.domain.activity.model.entity.MerchantProductEntity;
import cn.bugstack.domain.activity.model.entity.MerchantUserEntity;
import cn.bugstack.domain.activity.repository.IMerchantRepository;
import cn.bugstack.infrastructure.dao.IMerchantProductDao;
import cn.bugstack.infrastructure.dao.IMerchantUserDao;
import cn.bugstack.infrastructure.dao.po.MerchantProductPO;
import cn.bugstack.infrastructure.dao.po.MerchantUserPO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Fuzhengwei bugstack.cn @拼团团
 * @description 商家后台仓储实现
 * @create 2026-05-04
 */
@Slf4j
@Repository
public class MerchantRepositoryImpl implements IMerchantRepository {

    @Resource
    private IMerchantUserDao merchantUserDao;

    @Resource
    private IMerchantProductDao merchantProductDao;

    @Override
    public MerchantUserEntity queryUserByUsername(String username) {
        MerchantUserPO userPO = merchantUserDao.queryByUsername(username);
        if (userPO == null) {
            return null;
        }

        return MerchantUserEntity.builder()
                .userId(userPO.getId())
                .username(userPO.getUsername())
                .password(userPO.getPassword())
                .nickname(userPO.getNickname())
                .email(userPO.getEmail())
                .phone(userPO.getPhone())
                .status(userPO.getStatus())
                .role(userPO.getRole())
                .createTime(userPO.getCreateTime())
                .updateTime(userPO.getUpdateTime())
                .build();
    }

    @Override
    public void insertUser(MerchantUserEntity merchantUser) {
        MerchantUserPO userPO = MerchantUserPO.builder()
                .username(merchantUser.getUsername())
                .password(merchantUser.getPassword())
                .nickname(merchantUser.getNickname())
                .email(merchantUser.getEmail())
                .phone(merchantUser.getPhone())
                .status(merchantUser.getStatus())
                .role(merchantUser.getRole())
                .createTime(merchantUser.getCreateTime())
                .updateTime(merchantUser.getUpdateTime())
                .build();

        merchantUserDao.insert(userPO);
    }

    @Override
    public List<MerchantProductEntity> queryProducts(MerchantProductEntity requestDTO) {
        String goodsName = requestDTO != null ? requestDTO.getGoodsName() : null;
        Integer status = requestDTO != null ? requestDTO.getStatus() : null;

        List<MerchantProductPO> productsPO = merchantProductDao.queryProductList(goodsName, status);

        List<MerchantProductEntity> products = new ArrayList<>();
        for (MerchantProductPO po : productsPO) {
            products.add(MerchantProductEntity.builder()
                    .goodsId(po.getGoodsId())
                    .goodsName(po.getName())
                    .description(po.getDescription())
                    .originalPrice(po.getOriginalPrice())
                    .groupPrice(po.getGroupPrice())
                    .stock(po.getStock())
                    .imageUrl(po.getImageUrl())
                    .status(po.getStatus())
                    .salesCount(po.getSalesCount())
                    .createTime(po.getCreateTime())
                    .updateTime(po.getUpdateTime())
                    .build());
        }

        return products;
    }

    @Override
    public MerchantProductEntity queryProductByGoodsId(String goodsId) {
        MerchantProductPO productPO = merchantProductDao.queryByGoodsId(goodsId);
        if (productPO == null) {
            return null;
        }

        return MerchantProductEntity.builder()
                .goodsId(productPO.getGoodsId())
                .goodsName(productPO.getName())
                .description(productPO.getDescription())
                .originalPrice(productPO.getOriginalPrice())
                .groupPrice(productPO.getGroupPrice())
                .stock(productPO.getStock())
                .imageUrl(productPO.getImageUrl())
                .status(productPO.getStatus())
                .salesCount(productPO.getSalesCount())
                .createTime(productPO.getCreateTime())
                .updateTime(productPO.getUpdateTime())
                .build();
    }

    @Override
    public void insertProduct(MerchantProductEntity merchantProduct) {
        MerchantProductPO productPO = MerchantProductPO.builder()
                .goodsId(merchantProduct.getGoodsId())
                .name(merchantProduct.getGoodsName())
                .description(merchantProduct.getDescription())
                .originalPrice(merchantProduct.getOriginalPrice())
                .groupPrice(merchantProduct.getGroupPrice())
                .stock(merchantProduct.getStock())
                .imageUrl(merchantProduct.getImageUrl())
                .status(merchantProduct.getStatus())
                .salesCount(merchantProduct.getSalesCount())
                .createTime(merchantProduct.getCreateTime())
                .updateTime(merchantProduct.getUpdateTime())
                .build();

        merchantProductDao.insert(productPO);
    }

    @Override
    public void updateProduct(MerchantProductEntity merchantProduct) {
        MerchantProductPO productPO = MerchantProductPO.builder()
                .goodsId(merchantProduct.getGoodsId())
                .name(merchantProduct.getGoodsName())
                .description(merchantProduct.getDescription())
                .originalPrice(merchantProduct.getOriginalPrice())
                .groupPrice(merchantProduct.getGroupPrice())
                .stock(merchantProduct.getStock())
                .imageUrl(merchantProduct.getImageUrl())
                .status(merchantProduct.getStatus())
                .salesCount(merchantProduct.getSalesCount())
                .updateTime(merchantProduct.getUpdateTime())
                .build();

        merchantProductDao.update(productPO);
    }

    @Override
    public void deleteProduct(String goodsId) {
        merchantProductDao.deleteByGoodsId(goodsId);
    }

}
