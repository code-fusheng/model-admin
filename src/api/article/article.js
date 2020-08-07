import request from '@/utils/request'
var group_name = 'article'
export default {
  save(article) { // 保存文章 - 增
    return request({
      url: `/${group_name}/save`,
      method: 'post',
      data: article
    })
  },
  delete(id) { // 根据id删除文章 - 删【逻辑删除】
    return request({
      url: `/${group_name}/deleteById/${id}`,
      method: 'delete'
    })
  },
  update(article) { // 修改文章 - 改
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: article
    })
  },
  getByPage(page) { // 多条件分页查询 - 查
    return request({
      url: `/${group_name}/getByPage`,
      method: 'post',
      data: page
    })
  },
  list() { // 查询所有 - 查
    return request({
      url: `/${group_name}/list`,
      method: 'get'
    })
  },
  get(id) { // 根据id查询
    return request({
      url: `/${group_name}/get/${id}`,
      method: 'get'
    })
  },
  enable(id) { // 启用 - 改
    return request({
      url: `/${group_name}/enable/${id}`,
      method: 'put'
    })
  },
  disable(id) { // 弃用 - 改
    return request({
      url: `/${group_name}/disable/${id}`,
      method: 'put'
    })
  },
  read(id) { // 根据id阅读 - 查/改
    return request({
      url: `/${group_name}/read/${id}`,
      method: 'get'
    })
  }
}
