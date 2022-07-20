import api from '../../api/login-api';
import abilities from '../../config/ability';

const state = {
		isLogin: false,
		loginUser: {},
		abilityRules: [],		
	};

const getters = {
		isLogin: state => state.isLogin,
		loginUser: state => state.loginUser,
		abilityRules: state => state.abilityRules,		
	};

const actions = {
		async login({ commit }) {
			const user = await api.login();
			commit('setAbilityRules', abilities.setAbilities(user));
			commit('setIsLogin', true);
			commit('setLogin', user);			
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
			state.loginUser = payload;
		},		
	};

export default
{
	state,
	getters,
	actions,
	mutations,
};
