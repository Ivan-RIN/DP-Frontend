import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import ru from '../assets/locale/ru';

Vue.use(Vuetify);

export default new Vuetify({
	lang: {
		locales: { ru },
		current: 'ru',
	},
	icons: {
		iconfont: 'mdiSvg' || 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4',
	},
});
