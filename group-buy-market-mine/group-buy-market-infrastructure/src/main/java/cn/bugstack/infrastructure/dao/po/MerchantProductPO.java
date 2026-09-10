package cn.bugstack.infrastructure.dao.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

/**
 * @author Fuzhengwei bugstack.cn @拼团团
 * @description 商家商品 PO
 * @create 2026-05-04
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MerchantProductPO {

    /** 主键 ID */
    private Long id;
    
    /** 商品 ID */
    private String goodsId;
    
    /** 商品名称 */
    private String name;
    
    /** 商品描述 */
    private String description;
    
    /** 原价 */
    private BigDecimal originalPrice;
    
    /** 拼团价 */
    private BigDecimal groupPrice;
    
    /** 库存 */
    private Integer stock;
    
    /** 商品图片 URL */
    private String imageUrl;
    
    /** 状态：0-下架，1-上架 */
    private Integer status;
    
    /** 销量 */
    private Integer salesCount;
    
    /** 创建时间 */
    private Date createTime;
    
    /** 更新时间 */
    private Date updateTime;

}
