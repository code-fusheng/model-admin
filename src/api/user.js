import request from '@/utils/request'

export function login(data) {
  return request({
    url: `/login?username=${data.username}&password=${data.password}`,
    // url: `/login?username=admin&password=123456`,
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
