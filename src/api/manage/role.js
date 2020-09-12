import request from '@/utils/request'
var group_name = 'role'
export default {
  save(role) { // 添加，保存
    return request({
      url: `/${group_name}/save`,
      method: 'post',
      data: role
    })
  },
  delete(id) { // 根据id删除
    return request({
      url: `/${group_name}/deleteById/${id}`,
      method: 'delete',
      data: id
    })
  },
  update(role) { // 修改更新
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: role
    })
  },
  get(id) { // 根据id查询
    return request({
      url: `/${group_name}/getById/${id}`,
      method: 'get',
      data: id
    })
  },
  getMenuIdsByRoleId(roleId) { // 根据角色id获取菜单权限ids
    return request({
      url: `/${group_name}/getMenuIdsByRoleId/${roleId}`,
      method: 'get',
      data: roleId
    })
  },
  list() { // 查询所有
    return request({
      url: `/${group_name}/list`,
      method: 'get'
    })
  },
  enable(id) { // 根据id启用
    return request({
      url: `/${group_name}/enable/${id}`,
      method: 'put',
      data: id
    })
  },
  disable(id) { // 根据id弃用
    return request({
      url: `/${group_name}/disable/${id}`,
      method: 'put',
      data: id
    })
  }
}
