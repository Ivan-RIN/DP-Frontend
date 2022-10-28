<template>
	<div id="app">
		<loading-mask-component v-if="!isPageReady"></loading-mask-component>
		<template>
			<header>
				<app-header></app-header>
			</header>
			<div class="header-stub"></div>
			<main role="main" v-if="isPageReady">
				<div id="main-content" v-if="isAlive">
					<router-view/>
				</div>
				<div class="center-container container text-center" v-else>
					<img src="./assets/images/noaccess.svg" width="64" height="64" alt="Доступ запрещен" />
					<h4 class="pt-5">Ваша учетная запись заблокирована или отсутсвует в системе.</h4>
				</div>
			</main>
			<main role="main" v-else></main>
			<footer>
				<app-footer></app-footer>
			</footer>
		</template>
		<modals-container/>
	</div>
</template>

<script>

  import api from '@/api/api';
	import { mapGetters, mapActions } from 'vuex';
	import AppHeader from './components/app-header.vue';
	import AppFooter from './components/app-footer.vue';
	import LoadingMaskComponent from './components/common/loading-mask-component.vue';

	export default {
		components: {
			AppFooter,
			AppHeader,
			LoadingMaskComponent,
		},
		data() {
			return {
				isPageReady: false,
			};
		},
		created() {
      if (this.$route.name == 'vm-tasks') {
        api.dtm = true;
        this.loginDtm();
      } else
			  this.login();
		},
		mounted() {
			// this.$bus.$on('openModal',this.showModal);
		},
		beforeDestroy() {
			// this.showModal && this.$bus.$off('openModal',this.showModal);
		},
		computed: {
			...mapGetters(['isLogin', 'isAlive', 'abilityRules']),
		},
		methods: {
			...mapActions(['login', 'loginDtm']),
		},
		watch: {
			isLogin() {
				this.$ability.update(this.abilityRules);
				this.isPageReady = true;
				this.$bus.$emit('isPageReady', true);
			},
		},
	};
</script>

<style lang="scss">
	@import "./assets/styles/main";

	body{
		min-height: 100vh;
		padding: 0;
		margin: 0;
	}

	select
	{
		font-family: 'DIN-Pro-regular',serif;
		font-size: 12px;
	}

	$header-height: 90px;
	$footer-height: 140px;

	#app
	{
		position: relative;
		/*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
		font-family: 'DIN-Pro-regular',serif;
		font-size: 14px;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: white;
		background-color: $app-background-color;
		padding: 0;
		margin: 0;
		min-height: 100vh;


		main
		{
			position: relative;
			// padding-top: $header-height;
			// top: $header-height;
			min-height: 450px;
			#main-content
			{
				margin: 2px auto 2px auto;
				width: $app-width;
				/*border: solid 1px white;*/
			}
		}
		header, footer
		{
			> div
			{
				margin: auto;
				width: $app-width;
			}
		}
		header
		{
			height: $header-height;
			background-color: #031726;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 100;
		}

		.header-stub
		{
			height: $header-height;
		}

		footer
		{
			position: relative;
			height: $footer-height;
			/*
                        div
                        {
                            !*margin-top: 76px;*!
                            color: #90a5ae;
                        }
            */
		}
	}
</style>
