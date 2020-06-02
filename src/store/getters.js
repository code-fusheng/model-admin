const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  header: state => state.user.header,
  name: state => state.user.name,
  userId: state => state.user.userId,
  categoryList: state => state.global.categoryList
}
export default getters
