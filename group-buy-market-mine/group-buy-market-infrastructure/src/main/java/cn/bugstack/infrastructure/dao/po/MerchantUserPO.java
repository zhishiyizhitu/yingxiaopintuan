package cn.bugstack.infrastructure.dao.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author Fuzhengwei bugstack.cn @拼团团
 * @description 商家用户 PO
 * @create 2026-05-04
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MerchantUserPO {

    /** 主键 ID */
    private Long id;
    
    /** 用户名 */
    private String username;
    
    /** 密码 */
    private String password;
    
    /** 昵称 */
    private String nickname;
    
    /** 邮箱 */
    private String email;
    
    /** 手机号 */
    private String phone;
    
    /** 状态：0-禁用，1-正常 */
    private Integer status;
    
    /** 角色：1-普通商家，2-管理员 */
    private Integer role;
    
    /** 创建时间 */
    private Date createTime;
    
    /** 更新时间 */
    private Date updateTime;

}
