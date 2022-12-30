<template>
	<div>
		<div style="display: flex; justify-content: space-between;">
			<div>
			</div>
			<div>
				<select v-model="dateTask" style="margin-left: 5px; width: 160px;">
					<option :value="0" style="font-weight: bold;">За весь период</option>
					<option :value="1">В прошлом месяце</option>
					<option :value="2">В этом месяце</option>
					<option :value="3">В следующем месяце</option>
				</select>
			</div>
		</div>
		<div class="line"></div>
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
				<div id="board-chart-statistics" style="width: 100%; margin-bottom: 20px;"></div>
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
						<template v-if="executorNames.length">
							<div class="v-table-row" v-for="(item, index) in executorNames" :key="index">
								<div>{{ index+1 }}. {{ item }}</div>
								<div>{{ userStat[0][index] }}</div>
								<div>{{ userStat[1][index] }}</div>
								<div>{{ userStat[2][index] }}</div>
								<div>{{ userStat[3][index] }}</div>
							</div>
						</template>
						<template v-else>
							<div class="v-table-row">
								<div>-</div>
								<div>0</div>
								<div>0</div>
								<div>0</div>
								<div>0</div>
							</div>
						</template>
					</div>
				</div>
				<div id="user-chart-statistics" v-show="!table" style="width: 100%"></div>
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
			chartBoard: null,
			chartUsers: null,
			dateTask: 0,
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
		...mapState('vm', ['currentUser', 'users', 'boards', 'taskFilter']),
	},
	watch: {
		dateTask(value) {
			//this.table = false;
			//this.taskFilter.statistics = value;
			this.createDataSet();
			this.createBoardChart();
			this.createUserChart();
		},
	},
	methods: {
		createBoardChart() {

			const parent = document.getElementById(`board-chart-statistics`);
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			parent.innerHTML = '';
			parent.appendChild(canvas);
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

			if (this.chartBoard)
				this.chartBoard.destroy();

			this.chartBoard = new Chart(ctx, {
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

			const parent = document.getElementById(`user-chart-statistics`);
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			parent.innerHTML = '';
			parent.appendChild(canvas);
			canvas.height = this.executorNames.length > 1 ? this.executorNames.length * 60 : 60;

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

			if (this.chartUsers)
				this.chartUsers.destroy();

			this.chartUsers = new Chart(ctx, {
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
				all: 0,
				inWork: 0,
				completed: 0,
				overdue: 0,
				canceled: 0
			};

			this.datasets = [];
			this.userStat = [[], [], [], []];
			this.initiatorNames = [];
			this.initiatorTasks = {};
			this.executorNames = []

			let user, index;
			let executors = {};

			for (let task of tasks) {

				if (!this.filterDate(task)) continue;

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

			this.boardStat.all = this.boardStat.inWork + this.boardStat.completed + this.boardStat.overdue + this.boardStat.canceled;

			this.datasets[0] = 100;
			this.datasets[1] = (this.boardStat.inWork / this.boardStat.all * 100).toFixed(2);
			this.datasets[2] = (this.boardStat.completed / this.boardStat.all * 100).toFixed(2);
			this.datasets[3] = (this.boardStat.overdue / this.boardStat.all * 100).toFixed(2);
			this.datasets[4] = (this.boardStat.canceled / this.boardStat.all * 100).toFixed(2);

		},
		filterDate(task) {

			if (this.dateTask == 0) return true;
			if (!task.endDate) return false;

			let endDate = new Date(task.endDate);

			switch (this.dateTask) {
				case 1:
					return this.isLastMonth(endDate);
				case 2:
					return this.isCurrentMonth(endDate);
				case 3:
					return this.isNextMonth(endDate);
				default:
					return true;
			}
		},
		select() {
			this.table = !this.table;
			if (!this.table) {
				let self = this;
				document.getElementById(`user-chart-statistics`).innerHTML = '';
				setTimeout(function () {
					self.createUserChart();
				}, 50);
			}
		},
		isCurrentMonth(date) {
			let currentDate = new Date();
			return currentDate.getFullYear() == date.getFullYear() && currentDate.getMonth() == date.getMonth() ;
		},
		isNextMonth(date) {
			let currentDate = new Date();
			currentDate.setMonth(currentDate.getMonth() + 1);
			return currentDate.getFullYear() == date.getFullYear() && currentDate.getMonth() == date.getMonth() ;
		},
		isLastMonth(date) {
			let currentDate = new Date();
			currentDate.setMonth(currentDate.getMonth() - 1);
			return currentDate.getFullYear() == date.getFullYear() && currentDate.getMonth() == date.getMonth() ;
		},
	},
	mounted() {
		this.createDataSet();
		this.createBoardChart();
		this.createUserChart();
		this.display = true;
	},
	beforeDestroy() {
		this.chartBoard.destroy();
		this.chartUsers.destroy();
	},
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
