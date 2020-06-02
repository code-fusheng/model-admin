const state = {
  categoryList: [] // 分类列表
}

const mutations = {
  SET_CATEGORY: (state, categoryList) => {
    state.categoryList = categoryList
  }
}

export default {
  namespaced: true,
  state,
  mutations
}

