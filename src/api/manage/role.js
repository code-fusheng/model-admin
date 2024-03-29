import request from '@/utils/request'
var group_name = 'role'
export default {
  save(role) {
    // 添加，保存
    return request({
      url: `/${group_name}/save`,
      method: 'post',
      data: role
    })
  },
  delete(roleId) {
    // 根据id删除
    return request({
      url: `/${group_name}/deleteById/${roleId}`,
      method: 'delete',
      data: roleId
    })
  },
  update(role) {
    // 修改更新
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: role
    })
  },
  get(roleId) {
    // 根据id查询
    return request({
      url: `/${group_name}/getById/${roleId}`,
      method: 'get',
      data: roleId
    })
  },
  // 查询所有可用角色
  selectAllRole() {
    return request({
      url: `/${group_name}/selectAllRole`,
      method: 'get'
    })
  },
  // 根据角色id获取菜单权限ids
  getMenuIdsByRoleId(roleId) {
    return request({
      url: `/${group_name}/getMenuIdsByRoleId/${roleId}`,
      method: 'get',
      data: roleId
    })
  },
  // 根据用户id获取角色ids
  getRoleIdsByUserId(userId) {
    return request({
      url: `/${group_name}/getRoleIdsByUserId/${userId}`,
      method: 'get',
      data: userId
    })
  },
  // 保存角色和菜单权限之间的关系
  saveRoleMenu(roleId, menuIds) {
    // 处理如果没有选择菜单数据。无法匹配后台数据的问题
    if (menuIds.length === 0) {
      menuIds = [-1]
    }
    return request({
      url: `/${group_name}/saveRoleMenu/${roleId}/${menuIds}`,
      method: 'post',
      data: roleId,
      menuIds
    })
  },
  // 保存用户和角色之间的关系
  saveUserRole(userId, roleIds) {
    // 处理如果没有选择角色数据。无法匹配后台数据的问题
    if (roleIds.length === 0) {
      roleIds = [-1]
    }
    return request({
      url: `/${group_name}/saveUserRole/${userId}/${roleIds}`,
      method: 'post',
      data: userId,
      roleIds
    })
  },
  list() {
    // 查询所有
    return request({
      url: `/${group_name}/list`,
      method: 'get'
    })
  },
  enable(roleId) {
    // 根据id启用
    return request({
      url: `/${group_name}/enable/${roleId}`,
      method: 'put',
      data: roleId
    })
  },
  disable(roleId) {
    // 根据id弃用
    return request({
      url: `/${group_name}/disable/${roleId}`,
      method: 'put',
      data: roleId
    })
  }
}
