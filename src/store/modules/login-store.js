
import { mapActions, mapMutations } from 'vuex';
import apiLogin from '../../api/login-api';
import api from '../../api/api';
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
	...mapActions('vm', ['setCurrentUser']),
	async login({ commit }, root) {
		if (root.isDtm) {
			api.dtm = root.isDtm;
			const user = await apiLogin.loginDtm();
			if (Object.keys(user).length) {
				await this.dispatch('vm/setCurrentUser', user);
				commit('setAlive');
			}
		} else {
			const user = await apiLogin.login();
			if (Object.keys(user).length) {
				commit('setAbilityRules', abilities.setAbilities(user));
				commit('setLogin', user);
				commit('setAlive');
			}
		}
		commit('setIsLogin', true);
	}
};

const mutations = {
	setAbilityRules(state, payload) {
		state.abilityRules = payload;
	},
	setIsLogin(state, payload) {
		state.isLogin = payload;
	},
	setAlive(state) {
		state.isAlive = true;
	},
	setLogin(state, payload) {
		state.loginUser = payload;
	},
};

export default {
	state,
	getters,
	actions,
	mutations,
};
