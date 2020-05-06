const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  baseApi: state => state.api.baseApi,
  swaggerApi: state => state.api.swaggerApi,
  name: state => state.user.name
}
export default getters
