<template>
	<div class="task-list">
		<div style="display: flex; justify-content: space-between;">
			<div style="display: flex;">
				<select v-model="blockId" @change="boardId = 0" style="margin-left: 5px; width: 160px;">
					<option
						v-for="(block) in blocks"
						:key="block.id"
						:value="block.id"
						:selected="block.id == blockId"
					>
						{{ block.name }}
					</option>
				</select>
				<select v-model="boardId" style="margin-left: 5px; width: 160px;">
					<option :value="0" style="font-weight: bold;">Все доски с задачами</option>
					<option
						v-for="(board) in boards"
						v-if="blockId == board.blockId"
						:key="board.id"
						:value="board.id"
						:selected="board.id == boardId">
						{{ board.name }}
					</option>
				</select>
			</div>
			<div>
				<select v-model="stateTask" style="margin-left: 5px; width: 160px;">
					<option :value="0" style="font-weight: bold;">Все задачи</option>
					<option :value="-1" style="font-weight: bold;">Текущие задачи</option>
					<option :value="5">В работе</option>
					<option :value="8">На согласовании</option>
					<option :value="6">Выполнено</option>
					<option :value="7">Просрочено</option>
				</select>
				<select v-model="dateTask" style="margin-left: 5px; width: 160px;">
					<option :value="0" style="font-weight: bold;">За весь период</option>
					<option :value="1">За сегодня</option>
					<option :value="2">На этой недели</option>-->
					<option :value="8">В прошлом месяце</option>
					<option :value="3">В этом месяце</option>
					<option :value="7">В следующем месяце</option>
					<option :value="4">В этом квартале</option>-->
					<option :value="5">В этом году</option>
					<option :value="6">В прошлом году</option>
				</select>
			</div>
		</div>
		<div style="position: relative">
			<dtm-task-states :fixed="true" :x="widthWindow/2-870" :y="290"/>
		</div>
		<div class="line"></div>
		<div style="background-color: #10548a; border-radius: 5px; margin-bottom: 15px;">
			<div class="vm-task-list-header" style="padding: 6px 0 0 0;">
				<div class="row-col-2" style="padding-left: 8px; display: block; gap: 8px;">
					<span>Прогресс</span>
				</div>
				<div class="row-col-3" style="position: relative; top: 16px;">
					Задачи
				</div>
				<div class="row-col-4">
					Инициатор
				</div>
				<div class="row-col-5">
					Исполнитель
				</div>
				<div class="row-col-6">
					Дата создания
				</div>
				<div class="row-col-1" style="padding-left: 8px; display: block; gap: 8px;">
					<span>Срок исполнения</span>
				</div>
			</div>
			<div class="vm-task-list-header" style="padding: 4px;">
				<div class="row-col-2" style="cursor: pointer;" @click="sortProgress()">
					<div class="button-style" :style="{ opacity: focusFilterProgress ? 1 : 0.5 }">
						<img src="@/assets/icons/w-filter.png" width="16">
						<img src="@/assets/icons/w-sort.png" width="16">
					</div>
				</div>
				<div class="row-col-3" style="cursor: pointer;"></div>
				<div class="row-col-4" style="cursor: pointer; display: flex; gap: 5px;">
					<input class="input-filter" type="text" v-model="inputInitiator">
					<img class="clear-filter-img" @click="clearFilter()" src="@/assets/icons/remove.png">
				</div>
				<div class="row-col-5" style="cursor: pointer; display: flex; gap: 5px;">
					<input class="input-filter" type="text" v-model="inputExecutor">
					<img class="clear-filter-img" @click="clearFilter()" src="@/assets/icons/remove.png">
				</div>
				<div class="row-col-6" style="cursor: pointer;">
				</div>
				<div class="row-col-1" style="cursor: pointer;" @click="sortExecution()">
					<div class="button-style" :style="{ opacity: focusFilterExecutionDate ? 1 : 0.5  }">
						<img src="@/assets/icons/w-filter.png" width="16" style="">
						<img src="@/assets/icons/w-sort.png" width="16">
					</div>
				</div>
			</div>
		</div>
		<div style="position: relative;"
			 v-for="board in boards"
			 :key="board.id"
			 v-if="blockId == board.blockId && (!boardId || boardId == board.id)"
		>
			<div style="height: 33px;"></div>
			<div style="padding: 8px 8px 8px 8px; font-weight: bold; background-color: #0d304b; min-width: 170px; text-align: center;
            position: absolute; top: 0px; display: inline-block; border-radius: 10px 10px 0 0; text-decoration: underline;">
				{{ board.name }}
			</div>
			<div style="display: flex; position: absolute; right: 0px; top: -2px; gap: 5px;">
				<add-task-button
					:title="'Загрузить Отчет'"
					:action="downloadBoardReport"
					:data="board"
				>
				</add-task-button>
				<add-task-button
					:title="'Статистика'"
					:action="openBoardStatistics"
					:data="board"
				>
				</add-task-button>
				<add-task-button
					v-if="getAccessAddTask(board)"
					:title="'Добавить Задачу'"
					:action="openAddTaskForm"
					:data="board"
				>
				</add-task-button>
			</div>
			<div class="vm-task-list-content-background" style="margin-bottom: 20px;">
				<template v-if="board.tasks.length > 0">
					<div class="vm-task-list-content"
						 v-for="task in board.tasks"
						 :key="task.id"
						 @click="openViewTask(board, task)">
						<div class="row-col-2">
							{{ task.progress }}%
						</div>
						<div class="row-col-3" style="text-align: left; display: flex; align-items: center;">
							<div style="width: 24px;">
								<img v-if="task.parentTaskId" src="@/assets/icons/home_house.png" width="18"
									 style="position: relative; top: 2px;">
							</div>
							<div style="width: 24px; text-align: center;">
								<!--                                <img v-if="task.state == 6" src="@/assets/icons/performed.png" width="16" style="border: 1px solid #fff; border-radius: 50%;">-->
								<img v-if="task.priority == 4 && task.state == 5" src="@/assets/icons/fire.png"
									 width="24">
								<img v-else-if="task.priority == 5 && task.state == 5" src="@/assets/icons/r-fire.png"
									 width="24">
								<div v-else class="task-miniboard-status"
									 :style="{ background: 'conic-gradient(' + getColorStatus(task) + ', transparent 0)'}"></div>
							</div>
							<div style="padding-left: 10px;">#{{ task.id }}. {{ task.name }}</div>
						</div>
						<div class="row-col-4" @click.stop="selectInitiator(task.initiatorId)">
							{{ getShortUserName(task.initiatorId) }}
						</div>
						<div class="row-col-5" @click.stop="selectExecutor(task.executorId)">
							{{ getShortUserName(task.executorId) }}
						</div>
						<div class="row-col-6">
							{{ convertDate(task.createDate) }}
						</div>
						<div class="row-col-1" :style="{ color: task.state == 7 ? '#f00' : '#fff' }">
							{{ convertDate(task.endDate) }}
						</div>
					</div>
				</template>
				<template v-else>
					<div class="vm-task-list-content" style="padding: 10px 20px; font-weight: bold;">Список задач пуст
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>

import { mapState, mapMutations, mapGetters } from 'vuex';
import api from '@/api/baseAPI';
import DpComboboxComponent from '../common/dp-combobox-component.vue';
import VMViewTask from '@/components/vm/task-view.vue';
import VMTaskActionComponent from '@/components/vm/task-action-component.vue';
import AddTaskForm from '@/components/vm/add-task-form';
import AddTaskButton from '@/components/vm/add-task-button';
import DtmTaskStates from '@/components/vm/dtm-task-states';
import DTM from '@/dtm/manager';

export default {
	name: 'task-list-component',
	data() {
		return {
			widthWindow: 0,
			user: null,
			stateTask: this.$store.state.vm.taskFilter.state,
			dateTask: this.$store.state.vm.taskFilter.date,
			listDepartments: [],
			departmentParent: null,
			departmentCurrentId: 0,
			boardId: this.$store.state.vm.boardId,
			blockId: this.$store.state.vm.blockId,
			filterExecutionDate: true,
			filterProgress: true,
			focusFilterExecutionDate: false,
			focusFilterProgress: false,
			inputInitiator: this.$store.state.vm.taskFilter.initiator,
			inputExecutor: this.$store.state.vm.taskFilter.executor,
			blockFilterInitiator: false,
			blockFilterExecutor: false
		};
	},
	components: {
		'vm-task-action-component': VMTaskActionComponent,
		DpComboboxComponent,
		VMViewTask,
		AddTaskForm,
		AddTaskButton,
		DtmTaskStates
	},
	props: {
		tasks: {
			type: Object
		},
		boards: {
			type: Array
		},
		openViewTask: {
			type: Function
		},
		buttonAction: {
			type: Function
		}
	},
	mixins: [],
	computed: {
		...mapState('vm', ['currentUser', 'users', 'departments', 'boardBlocks', 'blocks', 'boardUsers', 'taskFilter']),
	},
	watch: {
		blockId() {
			this.setBlockId(this.blockId);
		},
		boardId() {
			this.setBoardId(this.boardId);
		},
		stateTask(value) {
			this.taskFilter.state = value;
			this.sortTask();
		},
		dateTask(value) {
			this.taskFilter.date = value;
			this.sortTask();
		},
		inputInitiator(value) {
			if (this.blockFilterInitiator) {
				this.blockFilterInitiator = false;
				return;
			}
			this.taskFilter.initiator = value;
			this.clearFilterExecutor();
			this.sortTask();
		},
		inputExecutor(value) {
			if (this.blockFilterExecutor) {
				this.blockFilterExecutor = false;
				return;
			}
			this.taskFilter.executor = value;
			this.clearFilterInitiator();
			this.sortTask();
		},
	},
	methods: {
		...mapMutations('vm', ['setBlockId', 'setBoardId']),
		init() {

			this.widthWindow = document.documentElement.clientWidth;

			window.addEventListener('resize', () => {
				this.widthWindow = document.documentElement.clientWidth;
			});

			this.sortTask();

			if (this.blocks.length) return;

			for (let boardId in this.boards) {

				let board = this.boards[boardId];
				let block = this.boardBlocks[board.blockId];

				if (block) {
					let add = true;
					for (let item of this.blocks) if (item.id == block.id) add = false;
					if (add) this.blocks.push(this.boardBlocks[board.blockId]);
				}

				if (!this.boardId && board.default) {
					this.blockId = board.blockId;
					this.boardId = board.id;
				}

				if (board.ownerId && board.ownerId == this.currentUser.id) {
					this.blockId = board.blockId;
					this.boardId = board.id;
				}

			}

			if (!this.blockId && this.blocks.length) {
				this.blockId = this.blocks[0].id;
			}

		},
		// Форма добавления задачи
		openAddTaskForm(board) {

			let options = {
				board: board,
				buttonAction: this.buttonAction,
				tasks: this.tasks
			};

			this.$modal.show(AddTaskForm, options, {
				height: 'auto',
				width: '800px',
				clickToClose: false,
			});
		},
		convertDate(date) {
			return date ? date.split('T')[0].split('-')
				.reverse()
				.join('.') : '';
		},
		getNameDepartment(id) {
			return this.departments[id].abbreviation;
		},
		getNameParentDepartment(id) {
			const parentId = this.departments[id].parentId;
			if (!parentId) return 'Отсутствует';
			return this.departments[parentId].abbreviation;
		},
		getShortUserName(userId) {
			if (!userId) return '';
			let user = this.users[userId];
			let fio = user.name.split(' ');
			if (fio.length == 2) return fio[0] + ' ' + fio[1][0] + '.';
			if (fio.length > 2) return fio[0] + ' ' + fio[1][0] + '.' + fio[2][0] + '.';
			return user.name;
		},
		sortExecution() {
			this.focusFilterExecutionDate = true;
			this.focusFilterProgress = false;
			this.filterExecutionDate = !this.filterExecutionDate;
			this.boards.forEach((board) => {
				if (this.filterExecutionDate) {
					board.tasks.sort((a, b) => a.endDate > b.endDate ? -1 : 1);
					board.allTasks.sort((a, b) => a.endDate > b.endDate ? -1 : 1);
				} else {
					board.tasks.sort((a, b) => a.endDate > b.endDate ? 1 : -1);
					board.allTasks.sort((a, b) => a.endDate > b.endDate ? 1 : -1);
				}
			});
		},
		sortProgress() {
			this.focusFilterExecutionDate = false;
			this.focusFilterProgress = true;
			this.filterProgress = !this.filterProgress;
			this.boards.forEach((board) => {
				if (this.filterProgress) {
					board.tasks.sort((a, b) => a.progress > b.progress ? -1 : 1);
					board.allTasks.sort((a, b) => a.progress > b.progress ? -1 : 1);
				} else {
					board.tasks.sort((a, b) => a.progress > b.progress ? 1 : -1);
					board.allTasks.sort((a, b) => a.progress > b.progress ? 1 : -1);
				}
			});
		},
		sortTask() {
			this.boards.forEach((board) => {
				board.tasks = [];
				board.allTasks.forEach((task) => {
					if (this.filterState(task) && this.filterDate(task)) {
						if (this.inputInitiator) {
							let user = this.users[task.initiatorId];
							if (user) {
								if (user.name.toUpperCase()
									.indexOf(this.inputInitiator.toUpperCase()) >= 0) {
									board.tasks.push(task);
								}
							}
						} else if (this.inputExecutor) {
							let user = this.users[task.executorId];
							if (user) {
								if (user.name.toUpperCase()
									.indexOf(this.inputExecutor.toUpperCase()) >= 0) {
									board.tasks.push(task);
								}
							}
						} else {
							board.tasks.push(task);
						}
					}
				});
			});
		},
		filterState(task) {
			return this.stateTask == 0 || this.stateTask == task.state || (this.stateTask == -1 && task.state != 6);
		},
		filterDate(task) {

			if (this.dateTask == 0) return true;
			if (this.dateTask == 1) return this.isCurrentDay(new Date(task.createDate));
			if (!task.endDate) return false;

			let endDate = new Date(task.endDate);

			switch (this.dateTask) {
				case 2:
					return this.isCurrentWeek(endDate);
				case 3:
					return this.isCurrentMonth(endDate);
				case 4:
					return this.isCurrentQuarter(endDate);
				case 5:
					return this.isCurrentYear(endDate);
				case 6:
					return this.isLastYear(endDate);
				case 7:
					return this.isNextMonth(endDate);
				case 8:
					return this.isLastMonth(endDate);
				default:
					return true;
			}
		},
		isCurrentDay(date) {
			date.setHours(0, 0, 0, 0);
			let currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0)
			return currentDate.getTime() == date.getTime();
		},
		isCurrentWeek(date) {
			let minDate = new Date();
			let maxDate = new Date();
			let diffDays = minDate.getDate() - minDate.getDay() + 1;
			minDate.setDate(diffDays);
			maxDate.setDate(diffDays + 6);
			return date >= minDate && date <= maxDate;
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
		isCurrentQuarter(date) {
			let currentDate = new Date();
			let currentQuarter = Math.floor((currentDate.getMonth() + 3) / 3);
			let dateQuarter = Math.floor((date.getMonth() + 3) / 3);
			return currentDate.getFullYear() == date.getFullYear() && currentQuarter == dateQuarter;
		},
		isCurrentYear(date) {
			return new Date().getFullYear() == date.getFullYear();
		},
		isLastYear(date) {
			let currentDate = new Date();
			currentDate.setFullYear(currentDate.getFullYear() - 1);
			return currentDate.getFullYear() == date.getFullYear();
		},
		selectInitiator(userId) {
			let user = this.users[userId];
			if (user) {
				//this.clearExecutor();
				this.inputInitiator = user.name.split(' ')[0];
			}

		},
		selectExecutor(userId) {
			let user = this.users[userId];
			if (user) {
				//this.clearInitiator();
				this.inputExecutor = user.name.split(' ')[0];
			}

		},
		clearFilterInitiator() {
			if (this.inputInitiator) {
				this.blockFilterInitiator = true;
				this.inputInitiator = '';
				this.taskFilter.initiator = '';
			}
		},
		clearFilterExecutor() {
			if (this.inputExecutor) {
				this.blockFilterExecutor = true;
				this.inputExecutor = '';
				this.taskFilter.executor = '';
			}
		},
		clearFilter() {
			this.clearFilterInitiator();
			this.clearFilterExecutor();
			this.sortTask();
		},
		downloadBoardReport(board) {
			let url = 'Tasks/getReportBoard/' + board.id;
			api.getFile(url, board.name + '.xlsx');
		},
		getAccessAddTask(board) {
			if (this.currentUser.access.isDeveloper || this.currentUser.access.isAdministrator) {
				return true;
			}
			if (board.ownerId && this.currentUser.id == board.ownerId) {
				return true;
			}
			if (board.accessType == 1 &&
				(this.boardUsers[board.id] && this.boardUsers[board.id] > 1)) {
				return true;
			}
			if (board.accessType == 2 &&
				(board.departmentId == this.currentUser.departmentId) ||
				(this.boardUsers[board.id] && this.boardUsers[board.id] > 1)) {
				return true;
			}
			if (board.accessType == 3 &&
				(board.departmentId == this.currentUser.departmentId) ||
				(this.boardUsers[board.id] && this.boardUsers[board.id])) {
				return true;
			}
			return false;
		},
		getColorStatus(task) {

			let state = task.state;

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

			if (state == 5) return `${states[6]} 0% ${task.progress}%, ${states[5]} 0% 100%`;
			return `${states[state]} 100%`;

		},
		openBoardStatistics(board) {
			this.$parent.openBoardStatistics(board);
		}
	},
	mounted() {
		this.init();
	}
};

</script>

<style scoped lang="scss">

@import "../../assets/styles/main";

.filter {
	display: flex;
	flex-direction: row;
	justify-content: left;
}

input {
	font-size: 14px;
}

input.CDNG {
	width: 155px;
	height: 25px;
	//outline: none;
}

input.Object {
	width: 90px;
	height: 25px;
	//outline: none;
}

input.Author {
	width: 102px;
	height: 25px;
	//outline: none;
}

input.Executor {
	width: 140px;
	height: 25px;
	//outline: none;
}

.vm-task-list {

	&-header {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		padding: 0px;
		/*border-bottom: solid 2px $app-background-color;*/
		font-weight: bold;
	}

	&-content-background {
		background-color: #0d304b;
	}

	&-content:hover {
		background-color: #0c395a;
	}

	&-content {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		min-height: 40px;
		padding: 10px 10px 10px 10px;
		border-bottom: solid 1px $line-color;
		border-right: solid 1px $line-color;
		margin: 0px 0;
		cursor: pointer;
	}

}

.task-miniboard-status {
	position: relative;
	left: 8px;
	width: 14px;
	height: 14px;
	border-radius: 50%;
	border: 1px solid #fff;
}

.task-list {

	a {
		cursor: pointer;
	}

	&-data-header {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		//justify-content: space-between;
		padding: 0 $default-margin;

		div[data-col='1'] {
			flex: 0 0 160px;
			text-align: center;
		}

		div[data-col='2'] {
			flex: 0 0 40px;
			padding: 0 0 0 5px;

			input {
				border: none;
				padding: 0;
				height: 20px;
				cursor: pointer;
			}
		}

		.facilityField {
			flex: 0 0 90px;
			text-align: center;
		}

		.drill-site-field {
			flex: 0 0 160px;
			text-align: center;
		}

		.author-field {
			width: 110px;
			padding-left: 4px;
			text-align: center;
		}
	}

	&-content {
		position: relative;

		a {
			color: $text-color-03;
			text-decoration: underline;
		}

		&-brigade {
			position: relative;
			background-color: $content-background-color;
			border-radius: 5px;
			min-height: 40px;
			margin: 10px 0;

			div[data-brigade-name] {
				position: absolute;
				top: 5px;
				left: -120px;
				width: 120px;
			}

			&-category {
				min-height: 40px;
				padding: 10px 10px 10px 20px;
				border-bottom: solid 2px $app-background-color;

				input {
					border: none;
					padding: 0;
					height: 20px;
					cursor: pointer;
				}

				> div[data-name] {
					width: 160px;
					float: left;
				}

				> div[data-values] {

					margin-left: 160px;

					.task-list-content-brigade-category-task {
						border-bottom: solid 1px $line-color;
						padding: 5px 0 5px 0;
						display: flex;
						flex-direction: column;

						&-container {
							display: flex;

							div[data-col='2'] {
								position: relative;
								flex: 0 0 40px;
								padding: 0 0 0 5px;

								.cover-input {
									position: absolute;
									top: 0;
									left: 0;
									height: 20px;
									width: 20px;
									z-index: 5;
								}
							}

							div[data-col='3'] {
								position: relative;
								flex: 0 0 70px;
								text-align: center;
								padding-top: 1px;

								div[data-status] {
									position: absolute;
									top: 4px;
									border-radius: 50%;
									width: 12px;
									height: 12px;
									background-color: white;
								}
							}

							div[data-col='4'] {
								flex: 0 0 500px;

								> div[data-task-name] {
									cursor: pointer;
								}

								> div[data-task-comment] {
									span {
										color: $text-color-02
									}
								}
							}

							div[data-col='5'] {
								flex: 0 0 130px;
								cursor: pointer;
							}

							.facilityField {
								flex: 0 0 90px;
							}

							.drill-site-field-data {
								flex: 0 0 160px;
							}

							.author-field {
								flex: 0 0 110px;
							}

							.load-pdf-icon {
								min-width: 35px;
								max-width: 35px;
								height: 35px;

								img {
									position: relative;
									top: 5px;
									cursor: pointer;
								}
							}

							.history-button {
								width: 40px;
								height: 40px;
								cursor: pointer;

								&-open {
									margin: 5px 0 0 10px;
								}

								&-close {
									margin: 5px 0 0 10px;
								}
							}
						}
					}

					.task-list-content-brigade-category-task:last-child {
						border-bottom: none;
					}
				}

			}

			&-category:last-child {
				border-bottom: none;
			}
		}
	}
}

.row-col-1 {
	flex: 0 0 150px;
	text-align: center;
}

.row-col-2 {
	flex: 0 0 100px;
	text-align: center;
}

.row-col-3 {
	flex: 0 0 630px;
	text-align: center;
}

.row-col-4 {
	flex: 0 0 180px;
	text-align: center;
}

.row-col-5 {
	flex: 0 0 180px;
	text-align: center;
}

.row-col-6 {
	flex: 0 0 120px;
	text-align: center;
}

.button-style {
	display: inline-block;
	padding: 4px 16px 0px;
	border-radius: 5px;
	border: 1px solid #ffffff;
	opacity: 0.4;
}

.button-style:hover {
	opacity: 1;
}

.input-filter {
	width: 145px;
	height: auto;
	padding: 4px 8px;
	border-radius: 5px;
	border: 1px solid #1b7ac6;
}

.clear-filter-img {
	width: 22px;
	height: 22px;
	position: relative;
	top: 5px;
}

</style>
