const state = {
    filterState: {
        operator: undefined,
        brigade: undefined,
        department: undefined,
        dateFrom: undefined,
        dateTo: undefined,
    },
    reportsData: null,
};

const getters = {
    filterState: state => state.filterState,
    reportsData: state => state.reportsData,
};

const actions = {
    setFilterDefault({ commit }) {
        commit('setReportFilterOperator', undefined);
        commit('setReportFilterBrigade', undefined);
        commit('setReportFilterDepartment', undefined);
        commit('setReportFilterDateFrom', undefined);
        commit('setReportFilterDateTo', undefined);
    },
};

const mutations = {
    setReportsData(state, payload) {
        state.reportsData = payload;
    },
    setReportFilterOperator(state, payload) {
        state.filterState.operator = payload;
    },
    setReportFilterBrigade(state, payload) {
        state.filterState.brigade = payload;
    },
    setReportFilterDepartment(state, payload) {
        state.filterState.department = payload;
    },
    setReportFilterDateFrom(state, payload) {
        state.filterState.dateFrom = payload;
    },
    setReportFilterDateTo(state, payload) {
        state.filterState.dateTo = payload;
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
