import request from '@/utils/request'
var group_name = 'good'
export default {
  save(good) {
    // 添加，保存
    return request({
      url: `/${group_name}/save`,
      method: 'post',
      data: good
    })
  },
  delete(id) {
    // 根据id删除
    return request({
      url: `/${group_name}/deleteById/${id}`,
      method: 'delete',
      data: id
    })
  },
  getByPage(page) {
    // 分页查询
    return request({
      url: `/${group_name}/getByPage`,
      method: 'post',
      data: page
    })
  }
}
