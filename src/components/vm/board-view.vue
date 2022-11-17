<template>
		<div class="add-task">
			<div class="add-task-header">
				<span>Борд задач</span>
				<div class="add-task-header-close" @click="$parent.closeViewTask()"></div>
			</div>

			<div class="add-task-content" style="display: flex;">
				<div style="width: 18%; border-right: 1px solid #ffffff; padding: 10px; margin-right: 20px;">
					<div style="margin-bottom: 16px; font-size: 16px;">Управление</div>
					<div class="navigation">
						<div @click="appendOwner" style="padding: 4px 10px;">- Установить владельца</div>
						<div @click="addInitiator" style="padding: 4px 10px;">- Добавить инициатора</div>
						<div @click="addDepartment" style="padding: 4px 10px;">- Добавить подразделение</div>
						<div @click="addUser" style="padding: 4px 10px;">- Добавить пользователя</div>
					</div>
					<div class="navigation">
						<div @click="$parent.closeViewTask()" style="padding: 4px 10px;">- Закрыть окно</div>
					</div>
				</div>
				<div style="width: 80%;">
					<div class="body-row">
						<div>Номер борда / ID</div>
						<div>#{{ board.id }}</div>
					</div>
					<div class="body-row">
						<div>Имя</div>
						<div>{{ board.block.name }} => {{ board.name }}
							<div style="font-size: 12px;">
								{{ board.description }}
							</div>
						</div>
					</div>
					<div class="body-row">
						<div>Организация:</div>
						<div>{{ getOrganizationName(board.organizationId) }}</div>
					</div>
					<div class="body-row" v-if="ownerId">
						<div>Владелец борда:</div>
						<div>{{ getOwnerName }}</div>
					</div>
					<div class="body-row" v-if="board.adminId">
						<div>Администратор:</div>
						<div>{{ getUserName(board.adminId) }}</div>
					</div>
					<div class="body-row">
						<div>Количество задач:</div>
						<div>{{ board.tasks.length }}</div>
					</div>
					<div class="line"></div>
					<div class="body-row">
						<div>Инициаторы:</div>
						<div>
							<div v-if="!getInitiators.length">
								Не назначены
							</div>
							<div v-for="initiator in getInitiators" style="display: flex;">
									<div style="min-width: 300px;">
										- [{{ getNameUserDepartment(initiator.userId) }}]
										{{ getUserName(initiator.userId) }}
								</div>
								<div @click="removeUser(initiator.userId)" style="cursor: pointer; color: #dd0f0f;">
									<img style="height: 14px; padding: 0 8px;" src="@/assets/icons/user-remove.png">
									<span>Удалить</span>
								</div>
							</div>
						</div>
					</div>
					<div class="line"></div>
					<div class="body-row">
						<div>Структурные подразделения:</div>
						<div>
							<div v-if="!getDepartments().length">
								Не назначены
							</div>
							<div v-for="department in getDepartments()" style="display: flex;">
								<div style="min-width: 300px;">
									- {{ getNameSortDepartment(department.departmentId) }}
								</div>
								<div @click="removeDepartment(department.departmentId)" style="cursor: pointer; color: #dd0f0f;">
									<img style="height: 14px; padding: 0 8px;" src="@/assets/icons/user-remove.png">
									<span>Удалить</span>
								</div>
							</div>
						</div>
					</div>
					<div class="line"></div>
					<div class="body-row">
						<div>Пользователи:</div>
						<div>
							<div v-if="!getUsers.length">
								Не назначены
							</div>
							<div v-for="user in getUsers" style="display: flex;">
								<div style="min-width: 300px;">
									- [{{ getNameUserDepartment(user.userId) }}] {{ getUserName(user.userId) }}
								</div>
								<div @click="removeUser(user.userId)" style="cursor: pointer; color: #dd0f0f;">
									<img style="height: 14px; padding: 0px 8px;" src="@/assets/icons/user-remove.png">
									<span>Удалить</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div style="height: 40px;"></div>
			<div class="add-task-footer" style="margin-top: 20px;">
				<div data-remove @click="$parent.closeViewTask()">Закрыть</div>
			</div>
		</div>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import api from '@/api/baseAPI';
import SelectDepartment from '@/components/vm/select-department';
import SelectUser from '@/components/vm/select-user';

export default {
	name: 'board-view',
	props: {
		board: {
			type: Object
		},
		openViewBoard: {
			type: Function
		},
	},
	data() {
		return {
			ownerId: 0
		}
	},
	computed: {
		...mapState('vm', ['currentUser', 'users', 'organizations', 'departments', 'boardBlocks']),
		getInitiators() {
			if (!this.board.users) return [];
			let list = [];
			this.board.users.forEach(user => {
				if (user.roleId == 3) list.push(user);
			});
			return list;
		},
		getUsers() {
			if (!this.board.users) return [];
			let list = [];
			this.board.users.forEach(user => {
				if (user.roleId != 3) list.push(user);
			});
			return list;
		},
		getOwnerName() {
			return this.users[this.ownerId].name;
		}

	},
	methods: {
		...mapActions('task', ['setLoaderState']),
		getOrganizationName(id) {
			return this.organizations[id].shortName;
		},
		getUserName(userId) {
			return this.users[userId].name;
		},
		getShortUserName(userId) {
			let user = this.users[userId];
			let fio = user.name.split(' ');
			if (fio.length == 2) return fio[0] + ' ' + fio[1][0] + '.';
			if (fio.length > 2) return fio[0] + ' ' + fio[1][0] + '.' + fio[2][0] + '.';
			return user.name;
		},
		getNameUserDepartment(userId) {
			let depId = this.users[userId].departmentId;
			if (depId) return this.departments[depId].abbreviation;
			return '*';
		},
		getNameDepartment(id) {
			return this.departments[id].name;
		},
		getNameSortDepartment(id) {
			return this.departments[id].abbreviation;
		},
		getDepartments() {
			return this.board.departments ? this.board.departments : [];
		},

		addInitiator() {
			let self = this;
			this.$modal.show(SelectUser,
				{},
				{
					height: 'auto',
					width: '600px',
					clickToClose: false
				},
				{
					async select(initiatorId) {

						let response;
						let roleId = 3;

						if (initiatorId && initiatorId > 0) {

							self.setLoaderState(true);

							try{

								response = await api.post('Boards/setUserRole', {
									boardId: self.board.id,
									userId: initiatorId,
									roleId: roleId
								});

								if (response.result && response.result == 5) {

									let add = true;
									self.board.users.forEach(user => {
										if (user.userId == initiatorId) add = false;
									})

									if (add)
										self.board.users.push({
											boardId: self.board.id,
											userId: initiatorId,
											roleId: roleId
										});
								}

							} catch (e) {
								self.$root.showModalError("Не удалось добавить инициатора.");
							} finally {
								self.setLoaderState(false);
							}
						}
					}
				}
			);
		},

		addUser() {
			let self = this;
			this.$modal.show(SelectUser,
				{},
				{
					height: 'auto',
					width: '600px',
					clickToClose: false
				},
				{
					async select(userId) {

						let response;
						let roleId = 1;

						if (userId && userId > 0) {

							self.setLoaderState(true);

							try{

								response = await api.post('Boards/setUserRole', {
									boardId: self.board.id,
									userId: userId,
									roleId: roleId
								});

								if (response.result && response.result == 5) {

									let add = true;
									self.board.users.forEach(user => {
										if (user.userId == userId) add = false;
									})

									if (add)
										self.board.users.push({
											boardId: self.board.id,
											userId: userId,
											roleId: roleId
										});
								}

							} catch (e) {
								self.$root.showModalError("Не удалось добавить пользователя.");
							} finally {
								self.setLoaderState(false);
							}
						}
					}
				}
			);
		},

		async removeUser(id) {

			this.setLoaderState(true);

			try{
				let response = await api.post('Boards/setUserRole', {
					boardId: this.board.id,
					userId: id,
					roleId: 0
				});

				this.board.users = this.board.users.filter(value => value.userId != id);

			} catch (e) {
				this.$root.showModalError("Не удалось удалить пользователя.");
			} finally {
				this.setLoaderState(false);
			}
		},

		addDepartment() {

			let self = this;
			this.$modal.show(SelectDepartment,
				{},
				{
					height: 'auto',
					width: '600px',
					clickToClose: false
				},
				{
					async select(departmentId) {

						let roleId = 1;
						let cancel = false;
						let response;

						if (!departmentId) return;

						self.board.departments.forEach(department => {
							if (department.departmentId == departmentId) cancel = true;
						})

						if (cancel)  return;

						self.setLoaderState(true);

						try{

							response = await api.post('Boards/setDepartmentRole', {
								boardId: self.board.id,
								departmentId: departmentId,
								roleId: roleId
							});

							if (response.result && response.result == 5) {

								self.board.departments.push({
									boardId: self.board.id,
									departmentId: departmentId,
									roleId: roleId
								});

							}

						} catch (e) {
							self.$root.showModalError("Не удалось добавить подразделение.");
						} finally {
							self.setLoaderState(false);
						}

					}
				}
			);
		},

		async removeDepartment(id) {

			this.setLoaderState(true);

			try{
				let response = await api.post('Boards/setDepartmentRole', {
					boardId: this.board.id,
					DepartmentId: id,
					roleId: 0
				});

				this.board.departments = this.board.departments.filter(value => value.departmentId != id);

			} catch (e) {
				this.$root.showModalError("Не удалось удалить подразделение.");
			} finally {
				this.setLoaderState(false);
			}
		},

		appendOwner() {

			let self = this;
			this.$modal.show(SelectUser,
				{},
				{
					height: 'auto',
					width: '600px',
					clickToClose: false
				},
				{
					async select(userId) {

						let response;
						let roleId = 3;

						if (userId && userId > 0) {

							self.setLoaderState(true);

							try{

								response = await api.post('Boards/setOwner', {
									boardId: self.board.id,
									userId: userId,
									roleId: 1
								});

								if (response.result && response.result == 5) {
									self.ownerId = userId;
									self.board.owner = userId;
								}

							} catch (e) {
								self.$root.showModalError("Не удалось добавить владельца.");
							} finally {
								self.setLoaderState(false);
							}
						}
					}
				}
			);

		}
	},
	mounted() {
		this.ownerId = this.board.ownerId || 0;
	}
};
</script>

<style scoped lang="scss">

@import "../../assets/styles/main";

.line {
	margin: 1px 0;
}

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

}

.navigation {
	cursor: pointer;
}

.navigation div:after {
	display: block;
	left: 0;                      /*изменить на right:0;, чтобы изменить направление подчёркивания */
	width: 0;                     /*задаём длинну линии до наведения курсора*/
	height: 0.5px;                /*задаём ширину линии*/
	background-color: #ffffff;    /*задаём цвет линии*/
	content: "";
	transition: width 0.15s ease-out; /*задаём время анимации*/
}

.navigation div:hover:after, .navigation div:focus:after {
	width: 90%;
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

div[data-add] {
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
		padding: 20px 10px 20px 10px;
		border-bottom: solid 1px $line-color;
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
		margin: 20px 20px;
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
		//display: flex;
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
