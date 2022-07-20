<template>
	<div>
		<component :is="selectDict" :currentDictionaryId="this.$route.params.dictId"></component>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import baseDictionaryComponent from '../components/dictionaries/base-dictionary-component.vue';

	export default {
		name: 'dictionary-view',
		components: { baseDictionaryComponent },
		computed: {
			selectDict() {
				const dict = this.dictionaryList.find(e => e.id === this.$route.params.dictId);
				return (dict) ? dict.componentName : '';
			},
			...mapGetters('dict', ['dictionaryList']),
		},
	};
</script>

<style scoped lang="scss">
	@import "../assets/styles/main";

</style>
