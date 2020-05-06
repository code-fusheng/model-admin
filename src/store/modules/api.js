const baseUrl = process.env.VUE_APP_BASE_API
const api = {
  state: {
    // Sql 监控
    sqlApi: baseUrl + '/druid',
    // swagger
    swaggerApi: baseUrl + '/swagger-ui.html',
    // baseUrl，
    baseApi: baseUrl
  }
}

export default api
