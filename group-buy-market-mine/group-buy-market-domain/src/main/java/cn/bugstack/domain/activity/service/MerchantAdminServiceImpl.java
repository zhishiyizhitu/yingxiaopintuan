package cn.bugstack.domain.activity.service;

import cn.bugstack.domain.activity.model.entity.MerchantProductEntity;
import cn.bugstack.domain.activity.model.entity.MerchantUserEntity;
import cn.bugstack.domain.activity.repository.IMerchantRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author Fuzhengwei bugstack.cn @拼团团
 * @description 商家后台管理服务实现
 * @create 2026-05-04
 */
@Slf4j
@Service
public class MerchantAdminServiceImpl implements IMerchantAdminService {

    @Resource
    private IMerchantRepository merchantRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public MerchantUserEntity login(String username, String password) {
        log.info("商家登录：username:{}", username);
        
        MerchantUserEntity userPO = merchantRepository.queryUserByUsername(username);
        if (userPO == null) {
            log.warn("用户不存在：username:{}", username);
            return null;
        }

        if (!passwordEncoder.matches(password, userPO.getPassword())) {
            log.warn("密码错误：username:{}", username);
            return null;
        }

        if (userPO.getStatus() != 1) {
            log.warn("用户已禁用：username:{}", username);
            return null;
        }

        // 清除密码信息后返回
        userPO.setPassword(null);
        return userPO;
    }

    @Override
    public void register(MerchantUserEntity merchantUserEntity) {
        log.info("商家注册：username:{}", merchantUserEntity.getUsername());
        
        MerchantUserEntity existingUser = merchantRepository.queryUserByUsername(merchantUserEntity.getUsername());
        if (existingUser != null) {
            throw new RuntimeException("用户名已存在");
        }

        MerchantUserEntity newUser = MerchantUserEntity.builder()
                .username(merchantUserEntity.getUsername())
                .password(passwordEncoder.encode(merchantUserEntity.getPassword()))
                .nickname(merchantUserEntity.getNickname() != null ? merchantUserEntity.getNickname() : merchantUserEntity.getUsername())
                .email(merchantUserEntity.getEmail())
                .phone(merchantUserEntity.getPhone())
                .status(1)
                .role(1)
                .createTime(new Date())
                .updateTime(new Date())
                .build();

        merchantRepository.insertUser(newUser);
        log.info("商家注册成功：username:{}", merchantUserEntity.getUsername());
    }

    @Override
    public List<MerchantProductEntity> queryProducts(MerchantProductEntity requestDTO) {
        log.info("查询商品列表");
        return merchantRepository.queryProducts(requestDTO);
    }

    @Override
    public void addProduct(MerchantProductEntity merchantProductEntity) {
        log.info("添加商品：goodsName:{}", merchantProductEntity.getGoodsName());
        
        if (merchantProductEntity.getGoodsId() == null || merchantProductEntity.getGoodsId().isEmpty()) {
            merchantProductEntity.setGoodsId(String.valueOf(System.currentTimeMillis()));
        }

        merchantProductEntity.setCreateTime(new Date());
        merchantProductEntity.setUpdateTime(new Date());
        merchantProductEntity.setSalesCount(0);

        merchantRepository.insertProduct(merchantProductEntity);
        log.info("添加商品成功：goodsId:{}", merchantProductEntity.getGoodsId());
    }

    @Override
    public void updateProduct(MerchantProductEntity merchantProductEntity) {
        log.info("更新商品：goodsId:{}", merchantProductEntity.getGoodsId());
        
        MerchantProductEntity existingProduct = merchantRepository.queryProductByGoodsId(merchantProductEntity.getGoodsId());
        if (existingProduct == null) {
            throw new RuntimeException("商品不存在");
        }

        // 更新字段
        if (merchantProductEntity.getGoodsName() != null) {
            existingProduct.setGoodsName(merchantProductEntity.getGoodsName());
        }
        if (merchantProductEntity.getDescription() != null) {
            existingProduct.setDescription(merchantProductEntity.getDescription());
        }
        if (merchantProductEntity.getOriginalPrice() != null) {
            existingProduct.setOriginalPrice(merchantProductEntity.getOriginalPrice());
        }
        if (merchantProductEntity.getGroupPrice() != null) {
            existingProduct.setGroupPrice(merchantProductEntity.getGroupPrice());
        }
        if (merchantProductEntity.getStock() != null) {
            existingProduct.setStock(merchantProductEntity.getStock());
        }
        if (merchantProductEntity.getImageUrl() != null) {
            existingProduct.setImageUrl(merchantProductEntity.getImageUrl());
        }
        if (merchantProductEntity.getStatus() != null) {
            existingProduct.setStatus(merchantProductEntity.getStatus());
        }
        
        existingProduct.setUpdateTime(new Date());
        
        merchantRepository.updateProduct(existingProduct);
        log.info("更新商品成功：goodsId:{}", merchantProductEntity.getGoodsId());
    }

    @Override
    public void deleteProduct(String goodsId) {
        log.info("删除商品：goodsId:{}", goodsId);
        
        MerchantProductEntity existingProduct = merchantRepository.queryProductByGoodsId(goodsId);
        if (existingProduct == null) {
            throw new RuntimeException("商品不存在");
        }

        merchantRepository.deleteProduct(goodsId);
        log.info("删除商品成功：goodsId:{}", goodsId);
    }

    @Override
    public List<MerchantProductEntity> queryOrders(MerchantProductEntity requestDTO) {
        log.info("查询订单列表");
        // TODO: 实现订单查询逻辑
        return new ArrayList<>();
    }

}
