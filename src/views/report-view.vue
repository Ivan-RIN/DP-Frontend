<template>
	<div class="report-view"  v-if="$can('read', 'Analytics')">
		<div class="reports-view-title">Аналитика</div>
		<ReportsFilterComponent ref="reportsChartFilter" @reportSearch="search"/>
		<ReportsPageComponent ref="reportsChartView"/>
	</div>
</template>

<script>
	import { mapState } from 'vuex';
	import ReportsFilterComponent from '../components/Reports/reportsFilterComponent.vue';
	import ReportsPageComponent from '../components/Reports/reportsPageComponent.vue';
	import apiReports from '../api/Reports/daily';

	export default {
		name: 'report-view',
		components: {
			ReportsFilterComponent,
			ReportsPageComponent,
		},
		data() {
			return {
				chartData: {},
			};
		},
		beforeDestroy() {
			this.$refs.reportsChartFilter.clearFields();
		},
		computed: {
			...mapState('reports', ['filterState']),
		},
		methods: {
			async search(filter) {
				let toFilter;

				if (filter && filter.dateFrom) {
					toFilter = filter;
				} else {
					toFilter = this.filterState;
				}

				apiReports.getExecutedTasks(toFilter)
				.then((data) => {
					this.chartData = data;
					this.$store.commit('reports/setReportsData', this.chartData);
				});
			},
		},
	};
</script>

<style lang="scss">


	.reports-view {
		width: 1347px;
		&-title {
			margin: 25px 20px;
		}
	}

</style>
