import request from '@/utils/request'
var group_name = 'user'
export default {
  save(user) {
    // 添加，保存
    return request({
      url: `/${group_name}/save`,
      method: 'post',
      data: user
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
  update(user) {
    // 修改更新
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: user
    })
  },
  get(id) {
    // 根据id查询
    return request({
      url: `/${group_name}/getById/${id}`,
      method: 'get',
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
  },
  list() {
    // 查询所有
    return request({
      url: `/${group_name}/list`,
      method: 'get'
    })
  },
  enable(id) {
    // 根据id启用
    return request({
      url: `/${group_name}/enable/${id}`,
      method: 'put',
      data: id
    })
  },
  disable(id) {
    // 根据id弃用
    return request({
      url: `/${group_name}/disable/${id}`,
      method: 'put',
      data: id
    })
  }
}
