<template>
    <div class="reports-chart">
        <canvas :id="`chart-${chartName}`" width="450"></canvas>
    </div>
</template>
<script>
	import Chart from 'chart.js';

	export default {
		name: 'reports-base-chart-component',
        props: {
			chartData: { type: Array, defaultValue: [] },
        },
		data() {
			return {
				dataCollection: [],
                chartName: undefined,
                chart: undefined,
                departmentWidth: 250,
				chartHeight: 400,
                options: {
	                type: 'horizontalBar',
	                layout: {
		                padding: 0,
	                },
	                scales: {
		                yAxes: [{
			                afterFit: (scaleInstance) => {
				                scaleInstance.width = this.departmentWidth;
			                },
			                ticks: {
				                min: 0,
				                fontStyle: 'bold',
				                fontColor: '#ffffff',
			                },
			                gridLines: {
				                display: true,
				                color: '#0E4268',
			                },
		                }],
		                xAxes: [{
			                ticks: {
				                min: 0,
				                fontStyle: 'bold',
			                },
			                gridLines: {
				                display: true,
                                color: '#0E4268',
			                },
		                }],
	                },
	                legend: {
		                display: false,
	                },
	                responsive: true,
	                maintainAspectRatio: true,
                },
			};
		},
        watch: {
	        chartData: {
                deep: true,
                handler() {
	                this.updateChart();
                },
            },
        },
        created() {
			if (this.chartData && this.chartData.length > 0) {
				if (this.chartData[0].dept) {
					this.chartName = 'departments';
					this.departmentWidth = 100;
                } else {
					this.chartName = 'operators';
                }
            }
        },
        beforeDestroy() {
			this.chart.destroy();
        },
		mounted() {
			if (this.chartData && this.chartData.length > 0) {
				this.createDataSet();
				this.createChart();
			}
		},
		methods: {
			updateChart() {
				this.createDataSet();
				this.chart.destroy();
				this.createChart();
            },
			createChart() {
				const ctx = document.getElementById(`chart-${this.chartName}`).getContext('2d');
				const labelLength = this.dataCollection.labels.length;
				this.chartHeight = labelLength > 1 ? labelLength * 40 : 80;
				document.getElementById(`chart-${this.chartName}`).height = this.chartHeight;

				this.chart = new Chart(ctx, {
					type: 'horizontalBar',
					data: {
						labels: this.dataCollection.labels,
						datasets: this.dataCollection.datasets,
					},
                    options: this.options,
				});
            },
			createDataSet() {
				const labels = [];
				const dataExecuted = [];
				const dataCreated = [];

				this.chartData.forEach((item) => {
					if (item.dept) {
						labels.push(item.dept);
                    } else {
						labels.push(item.executor.name);
                    }
                    dataExecuted.push(item.executed);
                    dataCreated.push(item.created);
                });

				this.dataCollection = {
					labels,
					datasets: [{
						label: 'Поставлено',
						backgroundColor: '#a8aeb4',
						data: dataCreated,
						categoryPercentage: 0.4,
						barPercentage: 0.4,
					}, {
						label: 'Выполнено',
						backgroundColor: '#71a171',
						data: dataExecuted,
						categoryPercentage: 0.4,
						barPercentage: 0.4,
					}],
				};
			},
		},
	};
</script>

<style lang="scss">
</style>
