
import axios from 'axios';

const state = {
  dashboardData : {
      "test" : 0
  }
}

// getters
const getters = {
  dashboardData(state) {
    return state.dashboardData;
  }
}

// actions
const actions = {
  refreshDashboardData({commit, state}) {
      axios.get("http://localhost:8082/getGrafanaData").then(response => {
         var newData = Object.keys(response.data).map(function(key) {
            return { name: key, keywords: response.data[key]};
          }) 
          commit("setDashboardData", newData);
      }).catch(error => {
          console.log(error);
      })
  }
}

// mutations
const mutations = {
  setDashboardData(state, dashboardData) {
    console.log("xdd" + dashboardData);
      state.dashboardData = dashboardData;
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
