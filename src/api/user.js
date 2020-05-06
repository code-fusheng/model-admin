import request from '@/utils/request'

export function login(data) {
  return request({
    url: `/login?username=${data.username}&password=${data.password}`,
    method: 'post',
    transformResponse: [function(data) {
      return JSON.parse(data)
    }]
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
