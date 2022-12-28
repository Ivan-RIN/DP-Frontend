<template>
	<div>
		<div style="display: flex; gap: 10px;">
			<div style="width: 500px;">
				<template v-if="display">
					<h3>
						{{ board.name }}
					</h3>
					<div style="margin: 0px 4px 10px 14px;">
						{{ board.description }}
					</div>
					<hr style="margin-bottom: 10px;">
					<div class="stat-row">
						<div style="font-weight: bold;">
							Всего поставлено задач:
						</div>
						<div>
							{{ boardStat.all }}
						</div>
					</div>
					<div class="stat-row">
						<div>
							В работе:
						</div>
						<div>
							{{ boardStat.inWork }}
						</div>
					</div>
					<div class="stat-row">
						<div>
							Выполнено:
						</div>
						<div>
							{{ boardStat.completed }}
						</div>
					</div>
					<div class="stat-row">
						<div>
							Просрочено:
						</div>
						<div>
							{{ boardStat.overdue }}
						</div>
					</div>
					<div class="stat-row">
						<div>
							Отменено:
						</div>
						<div>
							{{ boardStat.canceled }}
						</div>
					</div>

					<div class="stat-row" style="margin-top: 10px;">
						<div style="font-weight: bold;">Инициаторы:</div>
						<div>
							задач
						</div>
					</div>
					<div v-for="(item, index) in initiatorTasks" :key="index" class="stat-row">
						<div>{{ item[0] }}</div>
						<div>{{ item[1] }}</div>
					</div>
					<div class="stat-row" style="margin-top: 10px;">
						<div style="font-weight: bold;">
							Всего исполнителей:
						</div>
						<div>
							{{ executorNames.length }}
						</div>
					</div>
				</template>
			</div>
			<div style="width: 900px;">
				<h3 style="text-align: center;">Общая статистика в %</h3>
				<div style="width: 100%; margin-bottom: 20px;">
					<canvas id="board-chart-statistics"></canvas>
				</div>
				<div style="position: relative;">
					<h3 style="text-align: center;">Статистика по исполнителям</h3>
					<div class="select-show">
						<add-task-button
							:title="table ? 'График' : 'Таблица'"
							:action="select"
						/>
					</div>
				</div>
				<div v-show="table" style="width: 100%">
					<div class="v-table">
						<div class="v-table-header v-table-row">
							<div><div>Исполнитель</div></div>
							<div><div>Всего</div></div>
							<div><div>В работе</div></div>
							<div><div>Выполнено</div></div>
							<div><div>Просрочено</div></div>
						</div>
						<div class="v-table-row" v-for="(item, index) in executorNames" :key="index">
							<div>{{ index+1 }}. {{ item }}</div>
							<div>{{ userStat[0][index] }}</div>
							<div>{{ userStat[1][index] }}</div>
							<div>{{ userStat[2][index] }}</div>
							<div>{{ userStat[3][index] }}</div>
						</div>
					</div>
				</div>
				<div v-show="!table" style="width: 100%">
					<canvas id="user-chart-statistics"></canvas>
				</div>

			</div>
		</div>
		<div style="margin: 20px;"></div>
	</div>
</template>

<script>

import Chart from 'chart.js';
import { mapState } from 'vuex';
import AddTaskButton from '@/components/vm/add-task-button';

let states = {
	1: '#1A88DE',	// Планируется
	2: '#FFFFFF',	// Отклонено
	3: '#FFFFFF',	// Отложено
	4: '#FFFFFF',	// Утверждено
	5: '#E0E709',	// В работе
	6: '#257A0D',	// Выполнено, Завершено
	7: '#D41717',	// Просрочено
	8: '#F38F06',	// На согласовании
	9: '#858585'	// Отменено
};

let labels = ['Всего', 'В работе', 'Выполнено', 'Просрочено', 'Отменено'];
let colors = ['#FFFFFF', '#E0E709', '#257A0D', '#D41717', '#858585'];

function getShortName(name) {
	let parts = name.split(' ');
	if (parts.length > 2) {
		return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`;
	}
	if (parts.length == 2) {
		return `${parts[0]} ${parts[1][0]}.`;
	}
	return parts[0];
}

export default {
	name: 'board-statistics',
	components: {
		AddTaskButton
	},
	props: {
		board: {
			type: Object,
			required: true
		},
		allTasks: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			display: false,
			table: false,
			departmentWidth: 150,
			boardStat: {},
			datasets: [],
			userStat: [[], [], [], []],
			initiatorNames: [],
			initiatorTasks: {},
			executorNames: []
		};
	},
	computed: {
		...mapState('vm', ['currentUser', 'users', 'boards']),
	},
	methods: {

		createBoardChart() {

			const canvas = document.getElementById(`board-chart-statistics`);
			const ctx = canvas.getContext('2d');
			canvas.height = 200;

			let options = {
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
						position: 'top',
						ticks: {
							min: 0,
							fontStyle: 'bold',
							fontColor: '#b8b8b8',
							callback: function (value) {
								return (value / this.max * 100).toFixed(0) + '%';
							},
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
				maintainAspectRatio: false,
			};

			this.chart = new Chart(ctx, {
				type: 'horizontalBar',
				data: {
					labels: labels,
					datasets: [
						{
							backgroundColor: colors,
							data: this.datasets,
							categoryPercentage: 1,
							barPercentage: 0.5,
						}
					]
				},
				options: options,
			});
		},
		createUserChart() {

			const canvas = document.getElementById(`user-chart-statistics`);
			const ctx = canvas.getContext('2d');
			const labelLength = this.executorNames.length;
			canvas.height = labelLength > 1 ? labelLength * 60 : 60;

			let options = {
				type: 'horizontalBar',
					layout: {
					padding: 0,
				},
				scales: {
					yAxes: [
						{
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

						}
					],
					xAxes: [
						{
							position: 'top',
							ticks: {
								min: 0,
								fontStyle: 'bold',
								fontColor: '#b8b8b8'
							},
							gridLines: {
								display: true,
								color: '#0E4268',
							},
						}
					],
				},
				legend: {
					display: false,
				},
				responsive: true,
					maintainAspectRatio: false,
			};

			let datasets = [
				{
					label: 'Поставлено',
					backgroundColor: '#FFFFFF',
					data: this.userStat[0],
					categoryPercentage: 0.6,
					barPercentage: 0.8,
				},
				{
					label: 'В работе',
					backgroundColor: states[5],
					data: this.userStat[1],
					categoryPercentage: 0.6,
					barPercentage: 0.8,
				},
				{
					label: 'Выполнено',
					backgroundColor: states[6],
					data: this.userStat[2],
					categoryPercentage: 0.6,
					barPercentage: 0.8,
				},
				{
					label: 'Просрочено',
					backgroundColor: states[7],
					data: this.userStat[3],
					categoryPercentage: 0.6,
					barPercentage: 0.8,
				}
			];

			this.chart = new Chart(ctx, {
				type: 'horizontalBar',
				data: {
					labels: this.executorNames,
					datasets: datasets
				},
				options: options,
			});
		},
		createDataSet() {

			let tasks = this.allTasks ? this.board.allTasks : this.board.tasks;

			this.boardStat = {
				all: tasks.length,
				inWork: 0,
				completed: 0,
				overdue: 0,
				canceled: 0
			};

			let user, index;
			let executors = {};

			for (let task of tasks) {

				if (task.state == 5 || task.state == 8) this.boardStat.inWork++;
				if (task.state == 6) this.boardStat.completed++;
				if (task.state == 7) this.boardStat.overdue++;
				if (task.state == 9) this.boardStat.canceled++;

				user = this.users[task.initiatorId];

				if (user) {
					if (this.initiatorTasks[user.id] == undefined) {
						this.initiatorTasks[user.id] = [getShortName(user.name), 1];
					} else {
						this.initiatorTasks[user.id][1]++;
					}
				}

				user = this.users[task.executorId];

				if (user) {

					if (executors[user.id] == undefined) {
						this.userStat[0].push(0);
						this.userStat[1].push(0);
						this.userStat[2].push(0);
						this.userStat[3].push(0);
						executors[user.id] = this.executorNames.length;
						this.executorNames.push(getShortName(user.name));
					}

					index = executors[user.id];

					this.userStat[0][index]++;
					if (task.state == 5 || task.state == 8) this.userStat[1][index]++;
					if (task.state == 6) this.userStat[2][index]++;
					if (task.state == 7) this.userStat[3][index]++;
				}
			}

			this.datasets[0] = 100;
			this.datasets[1] = (this.boardStat.inWork / this.boardStat.all * 100).toFixed(2);
			this.datasets[2] = (this.boardStat.completed / this.boardStat.all * 100).toFixed(2);
			this.datasets[3] = (this.boardStat.overdue / this.boardStat.all * 100).toFixed(2);
			this.datasets[4] = (this.boardStat.canceled / this.boardStat.all * 100).toFixed(2);

		},

		select() {
			this.table = !this.table;
		}
	},
	mounted() {
		this.createDataSet();
		this.createBoardChart();
		this.createUserChart();
		this.display = true;
	}
};
</script>

<style scoped>

.stat-row {
	display: flex;
	gap: 10px;
}

.stat-row > div:nth-child(1) {
	width: 240px;
	padding: 4px;
	text-align: right;
}

.stat-row > div:nth-child(2) {
	padding: 4px;
}

.select-show {
	position: absolute;
	width: 100px;
	right: 10px;
	top: -6px;
	padding: 5px;
	cursor: pointer;
	font-weight: bold;
	text-align: center;
}

.select-show:hover {
	text-decoration-line: underline;
}

.v-table {
	margin: 10px;
}

.v-table > div:nth-child(3n+3) {
	background: #1e90ea;
	background: linear-gradient(to bottom, #0f3e5d, #083354, #0f3e5d);
}

.v-table-header {
	font-weight: bold;
	background: linear-gradient(to bottom, #0765a0, #083354);
}

.v-table-header div {
	padding: 6px;
}

.v-table-row {
	display: flex;
	justify-content: space-around;
}

.v-table-row > div:nth-child(1) {
	border-right:  1px solid #0E4268;
	width: 32%;
	padding: 6px 20px;
}

.v-table-row > div:nth-child(2) {
	text-align: center;
	border-right:  1px solid #0E4268;
	width: 18%;
	padding: 6px 10px;
}

.v-table-row > div:nth-child(3) {
	text-align: center;
	border-right:  1px solid #0E4268;
	width: 18%;
	padding: 6px 10px;
}

.v-table-row > div:nth-child(4) {
	text-align: center;
	border-right:  1px solid #0E4268;
	width: 18%;
	padding: 6px 10px;
}

.v-table-row > div:nth-child(5) {
	text-align: center;
	width: 18%;
	padding: 6px 10px;
}

</style>
