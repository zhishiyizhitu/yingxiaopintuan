package cn.bugstack.trigger.http;

import cn.bugstack.api.response.Response;
import cn.bugstack.domain.activity.model.entity.MerchantProductEntity;
import cn.bugstack.domain.activity.model.entity.MerchantUserEntity;
import cn.bugstack.domain.activity.service.IMerchantAdminService;
import cn.bugstack.types.enums.ResponseCode;
import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author Fuzhengwei bugstack.cn @拼团团
 * @description 商家后台管理 Controller
 * @create 2026-05-04
 */
@Slf4j
@RestController()
@CrossOrigin("*")
@RequestMapping("/api/v1/gbm/admin/")
public class MerchantAdminController {

    @Resource
    private IMerchantAdminService merchantAdminService;

    /**
     * 商家登录
     */
    @RequestMapping(value = "login", method = RequestMethod.POST)
    public Response<MerchantUserEntity> login(@RequestBody MerchantUserEntity requestDTO) {
        try {
            log.info("商家登录开始:username:{}", requestDTO.getUsername());

            if (requestDTO.getUsername() == null || requestDTO.getPassword() == null) {
                return Response.<MerchantUserEntity>builder()
                        .code(ResponseCode.ILLEGAL_PARAMETER.getCode())
                        .info(ResponseCode.ILLEGAL_PARAMETER.getInfo())
                        .build();
            }

            MerchantUserEntity userEntity = merchantAdminService.login(requestDTO.getUsername(), requestDTO.getPassword());

            if (userEntity == null) {
                return Response.<MerchantUserEntity>builder()
                        .code(ResponseCode.E0001.getCode())
                        .info("用户名或密码错误")
                        .build();
            }

            log.info("商家登录成功:username:{} userId:{}", requestDTO.getUsername(), userEntity.getUserId());

            return Response.<MerchantUserEntity>builder()
                    .code(ResponseCode.SUCCESS.getCode())
                    .info(ResponseCode.SUCCESS.getInfo())
                    .data(userEntity)
                    .build();
        } catch (Exception e) {
            log.error("商家登录失败:username:{}", requestDTO.getUsername(), e);
            return Response.<MerchantUserEntity>builder()
                    .code(ResponseCode.UN_ERROR.getCode())
                    .info(ResponseCode.UN_ERROR.getInfo())
                    .build();
        }
    }

    /**
     * 商家注册
     */
    @RequestMapping(value = "register", method = RequestMethod.POST)
    public Response<String> register(@RequestBody MerchantUserEntity requestDTO) {
        try {
            log.info("商家注册开始:username:{}", requestDTO.getUsername());

            if (requestDTO.getUsername() == null || requestDTO.getPassword() == null) {
                return Response.<String>builder()
                        .code(ResponseCode.ILLEGAL_PARAMETER.getCode())
                        .info(ResponseCode.ILLEGAL_PARAMETER.getInfo())
                        .build();
            }

            merchantAdminService.register(requestDTO);

            log.info("商家注册成功:username:{}", requestDTO.getUsername());

            return Response.<String>builder()
                    .code(ResponseCode.SUCCESS.getCode())
                    .info(ResponseCode.SUCCESS.getInfo())
                    .data("注册成功")
                    .build();
        } catch (Exception e) {
            log.error("商家注册失败:username:{}", requestDTO.getUsername(), e);
            return Response.<String>builder()
                    .code(ResponseCode.UN_ERROR.getCode())
                    .info(ResponseCode.UN_ERROR.getInfo())
                    .build();
        }
    }

    /**
     * 查询商品列表
     */
    @RequestMapping(value = "query_products", method = RequestMethod.POST)
    public Response<List<MerchantProductEntity>> queryProducts(@RequestBody(required = false) MerchantProductEntity requestDTO) {
        try {
            log.info("查询商品列表开始");

            List<MerchantProductEntity> products = merchantAdminService.queryProducts(requestDTO);

            log.info("查询商品列表完成:size:{}", products.size());

            return Response.<List<MerchantProductEntity>>builder()
                    .code(ResponseCode.SUCCESS.getCode())
                    .info(ResponseCode.SUCCESS.getInfo())
                    .data(products)
                    .build();
        } catch (Exception e) {
            log.error("查询商品列表失败", e);
            return Response.<List<MerchantProductEntity>>builder()
                    .code(ResponseCode.UN_ERROR.getCode())
                    .info(ResponseCode.UN_ERROR.getInfo())
                    .build();
        }
    }

    /**
     * 添加商品
     */
    @RequestMapping(value = "add_product", method = RequestMethod.POST)
    public Response<String> addProduct(@RequestBody MerchantProductEntity requestDTO) {
        try {
            log.info("添加商品开始:goodsName:{}", requestDTO.getGoodsName());

            merchantAdminService.addProduct(requestDTO);

            log.info("添加商品成功:goodsName:{}", requestDTO.getGoodsName());

            return Response.<String>builder()
                    .code(ResponseCode.SUCCESS.getCode())
                    .info(ResponseCode.SUCCESS.getInfo())
                    .data("添加成功")
                    .build();
        } catch (Exception e) {
            log.error("添加商品失败:goodsName:{}", requestDTO.getGoodsName(), e);
            return Response.<String>builder()
                    .code(ResponseCode.UN_ERROR.getCode())
                    .info(ResponseCode.UN_ERROR.getInfo())
                    .build();
        }
    }

    /**
     * 更新商品
     */
    @RequestMapping(value = "update_product", method = RequestMethod.POST)
    public Response<String> updateProduct(@RequestBody MerchantProductEntity requestDTO) {
        try {
            log.info("更新商品开始:goodsId:{}", requestDTO.getGoodsId());

            merchantAdminService.updateProduct(requestDTO);

            log.info("更新商品成功:goodsId:{}", requestDTO.getGoodsId());

            return Response.<String>builder()
                    .code(ResponseCode.SUCCESS.getCode())
                    .info(ResponseCode.SUCCESS.getInfo())
                    .data("更新成功")
                    .build();
        } catch (Exception e) {
            log.error("更新商品失败:goodsId:{}", requestDTO.getGoodsId(), e);
            return Response.<String>builder()
                    .code(ResponseCode.UN_ERROR.getCode())
                    .info(ResponseCode.UN_ERROR.getInfo())
                    .build();
        }
    }

    /**
     * 删除商品
     */
    @RequestMapping(value = "delete_product", method = RequestMethod.POST)
    public Response<String> deleteProduct(@RequestBody MerchantProductEntity requestDTO) {
        try {
            log.info("删除商品开始:goodsId:{}", requestDTO.getGoodsId());

            merchantAdminService.deleteProduct(requestDTO.getGoodsId());

            log.info("删除商品成功:goodsId:{}", requestDTO.getGoodsId());

            return Response.<String>builder()
                    .code(ResponseCode.SUCCESS.getCode())
                    .info(ResponseCode.SUCCESS.getInfo())
                    .data("删除成功")
                    .build();
        } catch (Exception e) {
            log.error("删除商品失败:goodsId:{}", requestDTO.getGoodsId(), e);
            return Response.<String>builder()
                    .code(ResponseCode.UN_ERROR.getCode())
                    .info(ResponseCode.UN_ERROR.getInfo())
                    .build();
        }
    }

    /**
     * 查询订单列表
     */
    @RequestMapping(value = "query_orders", method = RequestMethod.POST)
    public Response<List<MerchantProductEntity>> queryOrders(@RequestBody(required = false) MerchantProductEntity requestDTO) {
        try {
            log.info("查询订单列表开始");

            List<MerchantProductEntity> orders = merchantAdminService.queryOrders(requestDTO);

            log.info("查询订单列表完成:size:{}", orders.size());

            return Response.<List<MerchantProductEntity>>builder()
                    .code(ResponseCode.SUCCESS.getCode())
                    .info(ResponseCode.SUCCESS.getInfo())
                    .data(orders)
                    .build();
        } catch (Exception e) {
            log.error("查询订单列表失败", e);
            return Response.<List<MerchantProductEntity>>builder()
                    .code(ResponseCode.UN_ERROR.getCode())
                    .info(ResponseCode.UN_ERROR.getInfo())
                    .build();
        }
    }

}
