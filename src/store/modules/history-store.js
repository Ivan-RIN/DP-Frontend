const state = {
	historyFilterState: {
		dateFrom: new Date().toISOString().substring(0, 10),
		dateTo: new Date().toISOString().substring(0, 10),
	},
};

const getters = {
	historyFilterState: state => state.historyFilterState,
};

const actions = {
	setDefaultHistoryFilter({ commit }) {
		const now = new Date().toISOString().substring(0, 10);
		commit('setDateFrom', now);
		commit('setDateTo', now);
	},
};

const mutations = {
	setDateFrom(state, payload) {
		state.historyFilterState.dateFrom = payload;
	},
	setDateTo(state, payload) {
		state.historyFilterState.dateTo = payload;
	},
};

export default
{
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
