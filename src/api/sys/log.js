import request from '@/utils/request'
var group_name = 'log'
export default {
  getByPage(page) { // 前台查询
    return request({
      url: `/${group_name}/getByPage`,
      method: 'post',
      data: page
    })
  },
  exportExcel() { // 导出excel
    return request({
      url: `/${group_name}/export`,
      method: 'post',
      responseType: 'blob'
    })
  },
  deleteByIds(logIds) { // 批量删除
    return request({
      url: `/${group_name}/deleteByIds`,
      method: 'put',
      data: logIds
    })
  }
}
