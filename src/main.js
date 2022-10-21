import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import { abilitiesPlugin } from '@casl/vue';
import Vue from 'vue';
import AsyncComputed from 'vue-async-computed';
import ability from './config/ability';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './modal';
import modal from './components/dp-modal.vue';
import vuetify from './plugins/vuetify';
import errorModal from './components/modals/error-modal-component.vue';
import globalMethods from './mixins/global-methods';
import kiContext from '@kiyoaki_w/vue-context'

Vue.use(AsyncComputed);
Vue.use(abilitiesPlugin, ability.createAbility());
Vue.component('dp-modal', modal);
Vue.config.productionTip = false;

Object.defineProperty(Vue.prototype, '$bus', {
    get() {
        return this.$root.bus;
    },
});
Vue.config.devtools = true;

new Vue({
    router,
    store,
    render: h => h(App),
    vuetify,

    data: {
        bus: new Vue({}),
    },
    mixins: [globalMethods],
    methods: {
        showModalError(options) {
            this.$modal.show(errorModal, { response: options });
        },
    },
}).$mount('#app');

function DebuggerHelp(time) {
    setTimeout(() => {
        debugger;
    }, time);
}

window.DHelper = DebuggerHelp;
