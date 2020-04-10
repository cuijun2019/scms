
// 分页设置

export const pageSizes = [10, 15, 30, 35]
export const pageSize = pageSizes[0]

// 日志类型 type:(0：新增，1：修改，2：查询，3：删除)
export const logType = {
  insert: 0,
  update: 1,
  select: 2,
  delete: 3
}

// 角色类型 1：供应商 2：代理商 3：采购人 4：采购人领导 5：招标中心经办人 6：招标中心科长 7：系统管理员
export const roleType = [
  {
    name: '供应商',
    value: 1
  },
  {
    name: '代理商',
    value: 2
  },
  {
    name: '采购人',
    value: 3
  },
  {
    name: '采购人领导',
    value: 4
  },
  {
    name: '招标中心经办人',
    value: 5
  },
  {
    name: '招标中心科长',
    value: 6
  },
  {
    name: '系统管理员',
    value: 7
  }
]

// 企业性质
export const hopeType = [
  {
    name: '国有企业',
    value: '国有企业'
  },
  {
    name: '集体企业',
    value: '集体企业'
  },
  {
    name: '联营企业',
    value: '联营企业'
  },
  {
    name: '股份合作制企业',
    value: '股份合作制企业'
  },
  {
    name: '私营企业',
    value: '私营企业'
  },
  {
    name: '个体户',
    value: '个体户'
  },
  {
    name: '合伙企业',
    value: '合伙企业'
  },
  {
    name: '有限责任公司',
    value: '有限责任公司'
  },
  {
    name: '股份有限公司',
    value: '股份有限公司'
  }
]
// 缺的菜单图标

// 询价管理 XJGL    一级菜单
// 我的询价记录 WDXJJJ  二级菜单
//
// 我的供货商 WDGYS   二级菜单 （它的一级菜单是供应商管理）
//
// 采购结果通知书 CGJGTZS  一级菜单
// 我的采购结果通知书 WDCGJGTZS 二级菜单
//
// 成交通知书 CJTZS  一级菜单
//
// 合同管理 HTGL   一级菜单 （它的二级菜单是我的合同）
//
// 模板管理 MBGL   一级菜单
// 采购结果通知书模板 CGZGTZSMB 二级菜单
// 成交通知书模板 CJTZSMB   二级菜单
// 合同模板 HTMB   二级菜单
//
// 已办  ===没有选择状态的图标 YB-XZ  （它的一级菜单是首页）
