import api from '../../api/login-api';
import abilities from '../../config/ability';

const state = {
	isLogin: false,
	isAlive: false,
	loginUser: {},
	abilityRules: [],
};

const getters = {
	isLogin: state => state.isLogin,
	isAlive: state => state.isAlive,
	loginUser: state => state.loginUser,
	abilityRules: state => state.abilityRules,
};

const actions = {
	async login({ commit }) {
		const user = await api.login();
		if (Object.keys(user).length) {
			commit('setAbilityRules', abilities.setAbilities(user));
			commit('setLogin', user);
		}
		commit('setIsLogin', true);
	},
};

const mutations = {
	setAbilityRules(state, payload) {
		state.abilityRules = payload;
	},
	setIsLogin(state, payload) {
		state.isLogin = payload;
	},
	setLogin(state, payload) {
		state.isAlive = true;
		state.loginUser = payload;
	},
};

export default {
	state,
	getters,
	actions,
	mutations,
};
