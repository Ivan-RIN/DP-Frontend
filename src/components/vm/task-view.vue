<template>
	<div>
		<div class="add-task">
			<div class="add-task-header">
				<span>Обзор / Доска задачи</span>
				<div class="add-task-header-close" @click="$parent.closeViewTask()"></div>
			</div>
			<div style="display: flex;">
				<div class="add-task-content" style="width: 250px;">
					<div class="body-row">
						<div
							style="min-height: 460px; text-align: left; margin-left: 20px; border-right: 1px solid #ffffff;">
							<div style="margin-bottom: 16px; font-size: 16px;">Управление задачей</div>
							<ul class="nav-ul" style="list-style-type: none; cursor: pointer;font-weight: normal;">
								<li @click="conformTask()"
									v-show="task.state == 8 && (currentUser.access.isAdministrator || currentUser.id == board.ownerId || currentUser.id == task.initiatorId)">
									- Согласовать
								</li>
								<li @click="sendArchive()"
									v-show="task.state == 6 && (currentUser.access.isAdministrator || currentUser.id == board.ownerId || currentUser.id == task.initiatorId)">
									- Отправить в архив
								</li>
								<li @click="editTask()"
									v-show="currentUser.access.isAdministrator || currentUser.id == task.initiatorId || (board.ownerId && currentUser.id == board.ownerId)">
									- Редактировать
								</li>
								<li
									@click="uploadFiles()"
									v-show=" currentUser.access.isAdministrator || (board.ownerId && currentUser.id == board.ownerId) || currentUser.id == task.initiatorId || currentUser.id == task.executorId">
									- Загрузить файлы
								</li>
								<li></li>
								<li
									@click="сhangeProgress()"
									v-show="currentUser.access.isAdministrator || (board.ownerId && currentUser.id == board.ownerId) || currentUser.id == task.initiatorId || currentUser.id == task.executorId">
									- Изменить статус
								</li>
								<!--                                <li @click="setParentTask()" >- Установить родителя</li>-->
								<li v-show="getAccessChangeBoard(board, task) && !task.parentTaskId"
									@click="changeBoardTask()">- Перенести в доску
								</li>
								<li v-if="getAccessDelegateTask(board, task)" @click="delegateTask()">- Делегировать
									задачу
								</li>
								<li @click="downloadReport()">- Загрузить отчет</li>
								<li v-show="task.mainTaskId" @click="$parent.showStructure(task.mainTaskId)">- Структура
									подзадач
								</li>
								<!--						        <li @click="$parent.closeViewTask()">- Закрыть окно</li>-->
								<li style="margin-top: 30px;" @click="removeTask()"
									v-show="!task.countChilds && ((board.ownerId && currentUser.id == board.ownerId) || currentUser.id == task.initiatorId || currentUser.access.isAdministrator) ">
									- Удалить задачу
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="add-task-content" style="left: -100px;">
					<div class="body-row">
						<div>Номер задачи / ID</div>
						<div>#{{ task.id }}</div>
					</div>
					<div class="body-row" v-if="task.parentTask">
						<div>Родительская задача</div>
						<div style="padding: 10px; background-color: #0d304b;">
							<div class="body-row-child">
								<div>Задача:</div>
								<div>#{{ task.parentTask.id }}, {{ task.parentTask.name }}</div>
							</div>
							<div class="body-row-child">
								<div>Описание:</div>
								<div>{{ task.parentTask.description }}</div>
							</div>
							<div class="body-row-child">
								<div>Инициатор:</div>
								<div>{{ getUserName(task.parentTask.initiatorId) }}</div>
							</div>
							<div class="body-row-child">
								<div>Срок выполнения</div>
								<div>{{ convertDate(task.parentTask.startDate) }} -
									{{ convertDate(task.parentTask.endDate) }}
								</div>
							</div>
							<div class="body-row-child">
								<div>Приоритет</div>
								<div>{{ getPriority(task.parentTask.priority) }}</div>
							</div>
							<div class="body-row-child">
								<div>Прогресс</div>
								<div>{{ task.parentTask.progress }}%</div>
							</div>
							<div class="body-row-child" style="position: relative;">
								<div></div>
								<div data-button style="position: absolute; right: 0px; top: -30px"
									 @click="$parent.openViewTaskBy(task.parentTask.id)">Открыть задачу
								</div>
							</div>
						</div>
					</div>
					<div class="body-row">
						<div>Задача</div>
						<div style="padding: 10px; background-color: #0d304b;">{{ task.name }}</div>
					</div>
					<div class="body-row">
						<div>Описание</div>
						<div style="padding: 10px; background-color: #0d304b;">{{ task.description }}</div>
					</div>
					<div class="body-row">
						<div>Инициатор &#8658; Исполнитель</div>
						<div style="display: flex; gap: 10px;">
							<dtm-user-card :user="this.users[task.initiatorId]"/>
							<dtm-user-card v-if="task.executorId && task.executorId != task.initiatorId"
										   :user="this.users[task.executorId]"/>
						</div>
					</div>
					<div class="body-row">
						<div>Статус</div>
						<div>{{ getState(task.state) }}</div>
					</div>
					<div class="body-row">
						<div>Срок выполнения</div>
						<div>{{ convertDate(task.startDate) }} - {{ convertDate(task.endDate) }}</div>
					</div>
					<div class="body-row">
						<div>Приоритет</div>
						<div>{{ getPriority(task.priority) }}</div>
					</div>
					<div class="body-row">
						<div>Прогресс</div>
						<div>{{ task.progress }}%</div>
					</div>
					<div class="line"></div>
					<div class="body-row">
						<div>Ход выполнения задачи,<br>Комментарии</div>
						<div style="padding: 8px; background-color: #0d304b;">
							<div v-for="(step, index) in getTaskSteps" :key="step.id">
								<div style="padding: 2px;">
									{{ index + 1 }}. [{{ convertDate(step.userDate) }}] - {{
										getUserName(step.userId)
									}}
									<span style="float: right">Прогресс {{ step.value }}% </span>
								</div>
								<template v-if="step.comment.trim()">
									<div style="padding: 2px 20px; overflow: hidden; white-space: pre-line;">
										{{ step.comment.trim() }}
									</div>
									<div v-if="index != countTaskSteps" style="height: 8px;"></div>
								</template>
							</div>
						</div>
					</div>
					<div class="body-row">
						<div>Загруженные файлы</div>
						<div style="padding: 10px; background-color: #0d304b; min-height: 50px;">
							<div v-for="(file, index) in task.files" :key="index" style="padding-bottom: 2px;">
								<div
									style="display: flex; padding: 8px; border: 1px solid #0e5994; overflow: hidden; margin-top: 2px;">
									<img src="@/assets/icons/document-file.png"
										 style="margin-right: 10px; cursor: pointer;"
										 @click="downloadFile(file)">
									<div style="width: 100%;">
										<img
											v-show="currentUser.access.isAdministrator || currentUser.id == task.initiatorId || currentUser.id == task.initiatorId || currentUser.id == task.executorId"
											src="@/assets/icons/file-delete.png"
											style="float: right; cursor: pointer; height: 32px;"
											@click="deleteFile(file)"
										>
										<div @click="downloadFile(file)" style="cursor: pointer;">
											{{ index + 1 }}. [{{ convertDate(file.date, true) }} -
											{{ getUserName(file.userId) }}]<br>
											{{ file.name }}, {{ getSize(file.size) }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="line"></div>
					<div class="body-row" v-if="task.countChilds">
						<div>Подзадачи</div>
						<div style="padding: 10px; background-color: #0d304b;">
							<div class="body-row-child" v-for="child in getTaskChilds(task.id)">
								<div>
									{{ getShortUserName(child.initiatorId) }}
								</div>
								<div
									style="display: flex; position: relative; width: 100%; justify-content: space-between;">
									<div>
										[{{ convertDate(task.endDate) }}]
										[{{ child.progress }}%]
										| #{{ child.id }}, {{ child.name }}
									</div>
									<div style="text-align: right; cursor: pointer;"
										 @click="$parent.openViewTaskBy(child.id)">
										Открыть
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="add-task-footer">
				<div data-remove @click="$parent.closeViewTask()">Закрыть</div>
			</div>
		</div>
	</div>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import api from '@/api/baseAPI';
import VMTaskModal from '@/components/vm/task-dp-modal.vue';
import VMTaskDialog from '@/components/vm/task-dialog.vue';
import AddTaskForm from '@/components/vm/add-task-form';
import AddTaskDelegateForm from '@/components/vm/add-task-delegate-form';
import ChangeProgress from '@/components/vm/change-progress';
import LoaderFiles from '@/components/vm/loader-files';
//import taskMessage from '@/components/vm/task-message';
import DtmUserCard from '@/components/vm/dtm-user-card';
import SetParentTask from '@/components/vm/set-parent-task';
import ChangeBoardTask from '@/components/vm/change-board-task';
import MailAlertInitiator from '@/components/vm/mail-alert-initiator';
import MailTaskCompleted from '@/components/vm/mail-task-completed';
import MailTaskCancel from '@/components/vm/mail-task-cancel';
import DialogWindow from '@/components/vm/dialog-window';


export default {
	name: 'task-view',
	components: {
		'vm-task-dp-modal': VMTaskModal,
		'vm-task-dialog': VMTaskDialog,
		DtmUserCard
	},
	data() {
		return {
			comments: [],
			countTaskSteps: 0
		};
	},
	props: {
		board: {
			type: Object,
			required: true
		},
		task: {
			type: Object,
			required: true
		},
		buttonAction: {
			type: Function
		}
	},
	getters: {},
	computed: {
		...mapState('vm', ['currentUser', 'users', 'departments', 'boardUsers', 'boards']),
		taskInitiator() {
			return this.users[this.task.initiatorId] ? this.users[this.task.initiatorId] : null;
		},
		taskExecutor() {
			return this.users[this.task.executorId] ? this.users[this.task.executorId] : null;
		},
		getTaskSteps() {
			this.countTaskSteps = this.task.taskSteps.length - 1;
			return this.task.taskSteps.sort((a, b) => a.id > b.id ? 1 : -1);
		}
	},
	methods: {

		...mapActions('task', ['setLoaderState']),

		init() {
		},

		getState(state) {
			return ['Неизвестный', 'Планируется', 'Отклонено', 'Отложено', 'Утверждено', 'В работе', 'Выполнено', 'Просрочено', 'На согласовании', 'Отменено'][state];
		},

		getUserName(id) {
			if (!id) return '';
			if (!this.users[id]) return 'Не известный';
			return this.users[id].name;
		},

		getShortUserName(userId) {
			if (!userId) return '';
			let user = this.users[userId];
			let fio = user.name.split(' ');
			if (fio.length == 2) return fio[0] + ' ' + fio[1][0] + '.';
			if (fio.length > 2) return fio[0] + ' ' + fio[1][0] + '.' + fio[2][0] + '.';
			return user.name;
		},

		getPriority(state) {
			return ['Неизвестный', 'Низкий', 'Обычный', 'Средний', 'Высокий', 'Критический'][state];
		},

		// Конвертировать дату
		convertDate(date, full = false) {
			if (!date) return '';
			let part = date.split('T');
			if (part.length == 1) {
				return part[0].split('-')
					.reverse()
					.join('.');
			}
			part[0] = part[0].split('-')
				.reverse()
				.join('.');
			part[1] = part[1].split('.')[0];
			if (full) {
				return part[0] + ' ' + part[1];
			} else {
				return part[0];
			}
		},

		getSize: function (size) {
			return size > 1048576 ? `${(size / 1048576).toFixed(2)}Мб.` : `${(size / 1024).toFixed(2)}Кб.`;
		},

		editTask() {
			let optionsNew = {
				board: this.board,
				_task: this.task
			};
			this.$modal.show(AddTaskForm, optionsNew, {
				height: 'auto',
				width: '800px',
				clickToClose: false,
			}, {
				close() {
					this.$emit('close');
				},
				async save() {
					this.$emit('close');
					let response = await api.put('Tasks/' + this.task.id, this.task);
				}
			});
		},

		сhangeProgress(callback) {

			let self = this;
			const options = {
				task: this.task
			};

			this.$modal.show(ChangeProgress,
				options,
				{
					height: 'auto',
					width: '600px',
					clickToClose: false
				},
				{

					async save(progress) {

						self.setLoaderState(true);
						let response = await api.post('Tasks/setProgress/' + progress.taskId, progress);
						self.task.taskSteps.push(response);
						self.task.progress = progress.value;
						self.setLoaderState(false);

						if (typeof callback == 'function'){
							callback();
							return;
						}

						if (progress.value == 100) {

							self.task.state = 8;

							self.$modal.show(MailAlertInitiator,
								{
									task: self.task
								},
								{
									height: 'auto',
									width: '600px',
									clickToClose: false
								},
								{
									async send(users) {

										let recipients = [];

										for (let userId of users) {
											recipients.push({
												taskId: self.task.id,
												userId: userId,
												mailId: 4
											});
										}

										await api.post('Tasks/SendTaskMail', recipients);

									}
								}
							);

							// let options = {
							// 	title: 'Внимание!',
							// 	content: `<p>Вы установили прогресс выполнения задачи в 100%, состояние текущей задачи будет автоматически обновлен до статуса "Выполнено"` +
							// 		` и отправлены уведомления на почту.</p>`
							// };
							//
							// self.$modal.show(taskMessage, options, {
							// 	height: 'auto',
							// 	width: '600px',
							// 	clickToClose: false
							// });

							// let _recipients = [];
							//
							// if (self.task.initiatorId == self.task.executorId || !self.task.executorId) {
							// 	_recipients.push({
							// 		taskId: self.task.id,
							// 		userId: self.task.initiatorId,
							// 		mailId: 2
							// 	});
							// } else {
							// 	_recipients.push({
							// 		taskId: self.task.id,
							// 		userId: self.task.initiatorId,
							// 		mailId: 2
							// 	});
							// 	_recipients.push({
							// 		taskId: self.task.id,
							// 		userId: self.task.executorId,
							// 		mailId: 2
							// 	});
							// }
							//
							// await api.post('Tasks/sendTaskMail', _recipients);

						}

					},
					close() {
						if (typeof callback == 'function')
							callback();
					}
				});
		},

		async conformTask() {

			let self = this;

			let options = {
				title: 'Изменить состояние задачи',
				content: 'Вы действительно хотите согласовать задачу?<br><br>' +
						'«ДА» - Согласовать задачу и перевести в стадию «Выполнено».<br>' +
						'«НЕТ» - Отклонить согласование и вернуть задачу в стадию «В работе». Установить текущий прогресс, оставить комментарий, отправить уведомление исполнителю.<br><br>',
				cancel: true
			};

			this.$modal.show(DialogWindow,
				options,
				{
					height: 'auto',
					width: '600px',
					clickToClose: false
				},
				{
					async ok() {

						self.task.state = 6;

						await api.post('Tasks/changeState', {
							taskId: self.task.id,
							state: self.task.state
						});

						const options = {
							task: self.task
						};

						self.$modal.show(MailTaskCompleted,
							{
								task: self.task
							},
							{
								height: 'auto',
								width: '600px',
								clickToClose: false
							},
							{
								async send(users) {

									let recipients = [];

									for (let userId of users) {
										recipients.push({
											taskId: self.task.id,
											userId: userId,
											mailId: 2
										});
									}

									await api.post('Tasks/SendTaskMail', recipients);

								}
							}
						);
					},
					async cancel() {

						self.task.state = 5;

						await api.post('Tasks/changeState', {
							taskId: self.task.id,
							state: self.task.state
						});

						self.сhangeProgress(function () {

							self.$modal.show(MailTaskCancel,
								{
									task: self.task
								},
								{
									height: 'auto',
									width: '600px',
									clickToClose: false
								},
								{
									async send(users) {

										let recipients = [];

										for (let userId of users) {
											recipients.push({
												taskId: self.task.id,
												userId: userId,
												mailId: 5
											});
										}

										await api.post('Tasks/SendTaskMail', recipients);

									}
								}
							);

						});
					}
			});

		},

		sendArchive() {

			let self = this;

			let options = {
				title: 'Изменить состояние задачи',
				content: 'Вы действительно хотите отправить задачу в Архив?'
			};

			this.$modal.show(DialogWindow,
				options,
				{
					height: 'auto',
					width: '600px',
					clickToClose: false
				},
				{
					async ok() {
						await api.post('Tasks/changeStatus', {
							taskId: self.task.id,
							status: 2
						});
						await self.$parent.loadData();
					}
				});
		},

		uploadFiles() {
			let self = this;
			const options = {
				task: this.task
			};
			this.$modal.show(LoaderFiles,
				options,
				{
					height: 'auto',
					width: '600px',
					clickToClose: false
				},
				{

					async save(files) {

						self.setLoaderState(true);

						if (files) {

							let response = await api.form('Tasks/uploadFiles', files);
							console.log(response);

							for (let i in response.loadedFiles) {
								self.task.files.push(response.loadedFiles[i]);
							}

							if (response.errorFiles.length) {

							}

						}

						self.setLoaderState(false);
					}
				});
		},

		downloadFile(file) {
			let url = 'Tasks/downloadFile/' + file.id;
			api.getFile(url, file.name);
		},

		async deleteFile(file) {

			let self = this;

			let options = {
				title: 'Внимание!',
				content: `<p>Вы действительно хотите удалить файл: "${file.name}"?</p>`
			};

			this.$modal.show(VMTaskDialog,
				options,
				{
					height: 'auto',
					width: '600px',
					clickToClose: false
				},
				{
					async ok() {

						self.setLoaderState(true);
						let response = await api.get('Tasks/deleteFile/' + file.id);
						//response = await apiTasks.deleteFile(file.id);
						self.setLoaderState(false);

						let index = self.task.files.indexOf(file);
						if (index !== -1) {
							self.task.files.splice(index, 1);
						}

						self.$emit('close');
					}
				}
			);
		},

		downloadReport() {
			let url = 'Tasks/getReportTask/' + this.task.id;
			api.getFile(url, this.task.name + '.xlsx');
		},

		// Удалить задачу
		removeTask() {
			let self = this;
			let options = {
				title: 'Вы действительно хотите удалить задачу?',
				content: '<h3>' + this.task.name + '</h3><p><span style="font-weight: bold;">Описание:</span> ' + this.task.description + '</p>'
			};
			this.$modal.show(VMTaskDialog,
				options,
				{
					height: 'auto',
					width: '600px',
					clickToClose: false
				},
				{
					ok() {
						self.$emit('close');
						self.$parent.removeTask(self.task);
					}
				});
		},

		delegateTask() {

			let optionsNew = {
				board: this.board,
				task: this.task,
				buttonAction: this.buttonAction
			};

			this.$modal.show(AddTaskDelegateForm, optionsNew, {
				height: 'auto',
				width: '800px',
				clickToClose: false,
			}, {
				close() {
					this.$emit('close');
				},
				async save() {
					this.$emit('close');
					let response = await api.put('Tasks/delegateTask/' + this.task.id, this.task);
				}
			});
		},

		getAccessDelegateTask(board, task) {
			if (this.currentUser.access.isDeveloper || this.currentUser.access.isAdministrator) return true;
			if (task.executorId == this.currentUser.id && this.boardUsers[board.id] && this.boardUsers[board.id] > 1) return true;
			return false;
		},

		getAccessChangeBoard(board, task) {
			if (this.currentUser.access.isDeveloper || this.currentUser.access.isAdministrator) return true;
			if (board.ownerId && this.currentUser.id == board.ownerId) return true;
			for (let b of this.boards) {
				if (this.boardUsers[b.id] && this.boardUsers[b.id] > 1) return true;
			}
			return false;
		},

		getTaskChilds(parentId) {
			let childs = [];
			for (let board of this.boards) {
				for (let task of board.tasks) {
					if (task.parentTaskId == parentId) {
						childs.push(task);
					}
				}
			}
			return childs;
		},

		setParentTask() {
			let self = this;
			const options = {
				task: this.task,
				blockId: this.board.blockId
			};
			this.$modal.show(SetParentTask,
				options,
				{
					height: 'auto',
					width: '600px',
					clickToClose: false
				},
				{

					async selected(parentId) {

						self.setLoaderState(true);

						try {

							let response = await api.post('Tasks/setParentTask', {
								taskId: self.task.id,
								parentId: parentId
							});

							if (response.result && response.result == 5) {
								self.task.parentTaskId = parentId;
								if (self.buttonAction) {
									self.buttonAction('createTask', { id: self.task.id });
								}
							}

						} catch (e) {
							self.$root.showModalError('Не удалось сменить родителя задачи.');
						} finally {
							self.setLoaderState(false);
						}
					}
				});
		},

		changeBoardTask() {
			let self = this;
			const options = {
				task: this.task,
				blockId: this.board.blockId
			};
			this.$modal.show(ChangeBoardTask,
				options,
				{
					height: 'auto',
					width: '600px',
					clickToClose: false
				},
				{

					async selected(boardId) {

						self.setLoaderState(true);

						try {

							let response = await api.post('Tasks/changeBoardTask', {
								mode: 2,
								taskId: self.task.id,
								boardId: boardId
							});

							if (response.result && response.result == 5) {
								self.task.boardId = boardId;
								if (self.buttonAction) {
									self.buttonAction('createTask', { id: self.task.id });
								}
							}

						} catch (e) {
							self.$root.showModalError('Не удалось сменить борд задачи.');
						} finally {
							self.setLoaderState(false);
						}
					}
				});
		}

	},

	created() {
		this.init();
	},

	mounted() {
		this.task.files = this.task.files || [];
	}
};
</script>

<style scoped lang="scss">

@import "../../assets/styles/main";

.body-row {
	display: flex;
}

.body-row > div {
	margin: 10px;
}

.body-row > div:nth-child(1) {
	width: 300px;
	text-align: right;
	font-weight: bold;
}

.body-row > div:nth-child(2) {
	width: 880px;
}

.body-row-child {
	display: flex;
}

.body-row-child > div {
	margin: 4px 10px;
}

.body-row-child > div:nth-child(1) {
	width: 160px;
	text-align: right;
	font-weight: bold;
}

.body-row-child > div:nth-child(2) {

}

.profile-foto {
	/*margin-top: 15px;*/
	border-radius: 50%;
	/*border: solid 1px white;*/
	width: 64px;
	height: 64px;
	overflow: hidden;
	// background-image: url(../assets/images/photo_stub.jpeg)
}

.nav-ul li {
	position: relative;
	cursor: pointer;
	line-height: 1; /*задаём высоту строки*/
	text-decoration: none; /*убираем подчёркивание*/
	margin: 10px;
}

.nav-ul li:after {
	display: block;
	position: absolute;
	left: 0; /*изменить на right:0;, чтобы изменить направление подчёркивания */
	width: 0; /*задаём длинну линии до наведения курсора*/
	height: 0.5px; /*задаём ширину линии*/
	background-color: #ffffff; /*задаём цвет линии*/
	content: "";
	transition: width 0.15s ease-out; /*задаём время анимации*/
}

.nav-ul li:hover:after,
.nav-ul li:focus:after {
	width: 90%;
}

div[data-button] {
	@extend %button;
}

.add-task {
	position: relative;
	width: 100%;
	z-index: 0;
	/*max-height: 80vh;*/
	background-color: $form-background-color;
	color: $text-color-01;
	overflow: auto;

	&-header {
		padding: 20px 0 20px 10px;
		border-bottom: solid 1px $line-color;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;

		span {
			text-transform: uppercase;
		}

		&-close {
			position: absolute;
			right: 0;
			top: 15px;
			cursor: pointer;

			&:after {
				content: "";
				background-image: url("../../assets/images/cross.svg");
				background-repeat: no-repeat;
				position: absolute;
				top: 3px;
				right: 10px;
				height: 24px;
				width: 24px;
			}
		}
	}

	&-content {
		position: relative;
		margin: 70px $default-margin;
		max-height: 90%;
		overflow: hidden;

		&-data {
			display: flex;
		}

		&-data-periodic {
			position: relative;
			// top:-30px;
			border: solid 1px $line-color;
			border-top: none;
			//padding-top: 20px;
		}
	}

	&-footer {
		width: 100%;
		padding: 20px;
		display: flex;
		gap: 10px;
		justify-content: right;

		div[data-remove] {
			@extend %button;
		}

		div[data-close] {
			color: $text-color-02;
			padding: 5px 10px;
			margin-left: 20px;
			cursor: pointer;
		}
	}
}

</style>
