package cn.bugstack.api.dto;

import lombok.Data;

/**
 * @author Fuzhengwei bugstack.cn @拼团团
 * @description 商品营销请求对象
 * @create 2025-02-02 12:19
 */
//这个类是DTO，DTO是指数据传输对象，用于封装数据，通常用于接口的参数传递。
@Data
public class GoodsMarketRequestDTO {

    // 用户ID
    private String userId;
    // 渠道
    private String source;
    // 来源
    private String channel;
    // 商品ID
    private String goodsId;

}
