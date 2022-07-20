<template>
    <div class="reports-page">
        <ReportsPageHeaderComponent>
        </ReportsPageHeaderComponent>
        <div class="reports-page-container">
            <ReportsBaseChartComponent
                    class="reports-chart task-legend-operators"
                    v-if="reportsData"
                    :chartData="reportsData.operatorsTasks">
            </ReportsBaseChartComponent>
            <ReportsBaseChartComponent
                    class="reports-chart task-legend-departments"
                    v-if="reportsData"
                    :chartData="reportsData.deptsTasks">
            </ReportsBaseChartComponent>
        </div>
    </div>
</template>

<script>

	import { mapState } from 'vuex';
	import ReportsBaseChartComponent from './reportsBaseChartComponent.vue';
	import ReportsPageHeaderComponent from './reportsPageHeaderComponent.vue';

    export default {
		name: 'reportPageComponent',
        components: { ReportsBaseChartComponent, ReportsPageHeaderComponent },
		data() {
			return {};
		},
        computed: {
            ...mapState('reports', ['reportsData']),
        },
		methods: {

		},
	};
</script>


<style scoped lang="scss">
    @import "../../assets/styles/main";
    .reports-page {
        display: flex;
        flex-direction: column;
        background-color: #0d304b;
        border-radius: 5px;
        padding: 20px 20px 0 20px;

        &-container {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: flex-start;
            position: relative;

            .reports-chart {
                padding: 0 0 50px 0;
                margin: 0;
                width: 50%;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: flex-start;
                overflow: auto;
            }

            .task-legend {
                &-operators {
                    position: relative;
                    &:after{
                        content: 'Задачи';
                        position: absolute;
                        color: #a8aeb4;
                        bottom: 30px;
                        left: 250px;
                    }
                }
                &-departments {
                    position: relative;
                    &:after{
                        content: 'Задачи';
                        position: absolute;
                        color: #a8aeb4;
                        bottom: 30px;
                        left: 100px;
                    }
                }
            }
        }
    }
</style>
