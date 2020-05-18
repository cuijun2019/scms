/**
 *  分页设置
 * @type {number[]}
 */
export const pageSizes = [10, 15, 30, 35]
export const pageSize = pageSizes[0]

/**
 * 日志类型 type:(0：新增，1：修改，2：查询，3：删除)
 * @type {{insert: number, update: number, select: number, delete: number}}
 */
export const logType = {
  insert: 0,
  update: 1,
  select: 2,
  delete: 3
}

/**
 * 角色类型 1：供应商 2：代理商 3：采购人 4：采购人领导 5：招标中心经办人 6：招标中心科长 7：系统管理员
 * @type {*[]}
 */
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

/**
 * 企业性质
 * @type {*[]}
 */
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

/**
 * 审核状态
 * 1 草稿 2 审核中 3同意 4退回 5完成
 * @type {string[]}
 */
export const statusTxt = ['','草稿','审核中','同意','退回','完成']
