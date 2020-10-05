const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  header: state => state.user.header,
  name: state => state.user.name,
  userId: state => state.user.userId,
  categoryList: state => state.global.categoryList
}
export default getters
