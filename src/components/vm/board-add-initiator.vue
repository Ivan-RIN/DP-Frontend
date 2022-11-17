<template>
	<div class="add-task">
			<div>Добавить инициатора</div>
			<div slot="body">
				<div style="padding: 10px;">
					{{ board.name }}
				</div>
				<div style="padding: 10px;">Структурные подразделения:</div>
				<div style="display: flex;">
					<select style="margin-left: 5px;" @change="setDepartmentId($event.target.value)">
						<option :value="0" style="font-weight: bold;">Все пользователи</option>
						<option
							v-for="(root) in rootDepartments"
							:key="root.id"
							:value="root.id"
							:selected="selectedDepartment(0, root)"
						>
							{{ root.abbreviation }}
						</option>
					</select>
					<template v-for="(department, index) in currentDepartments" v-if="department.childs.length">
						<select style="margin-left: 5px;" @change="setDepartmentId($event.target.value)">
							<option :value="department.id" style="font-weight: bold;">Все</option>
							<option
								v-for="(dep) in department.childs"
								:key="dep.id"
								:value="dep.id"
								:selected="selectedDepartment(index + 1, dep)"
							>
								{{ dep.abbreviation }}
							</option>
						</select>
					</template>
				</div>

				<div style="padding: 10px;">Ответственный:</div>
				<div style="display: flex;">
					<div>
						<input style="width: 250px;"
							   type="text" v-model="userName"
							   @input="inputValue($event.target.value)"
							   @focus="visible=true"
							   @click="visible=true"
						>
						<div v-show="visible"
							 @mouseleave="visible=false"
							 style="position: absolute; top: 214px; overflow: hidden;
								background-color: rgba(0,0,0,0.9); border: 1px solid #010177"
						>
							<div if v-if="filteredList.length > 0"
								 style="overflow-x: hidden; overflow-y: auto; width: 250px; max-height: 120px;">
								<div
									class="add-task-content-data-list-users"
									style="padding: 4px; font-size: 12px; white-space: nowrap;"
									v-for="(user, index) in filteredList"
									v-bind:key="index"
									@click="setExecutorId(user.id)"
									@mouseover=""
								>
									{{ user.name }}
								</div>
							</div>
						</div>
					</div>
					<div style="padding: 10px; cursor: pointer; white-space: nowrap;">
						<span @click="resetUserName" style="">Очистить поле</span>
					</div>
				</div>
				<div style="height: 155px;"></div>
			</div>
		<div class="add-task-footer">
			<div data-remove @click="save()">Добавить</div>
			<div data-remove @click="close()">Закрыть</div>
		</div>
	</div>
</template>

<script>

import DpModal from '@/components/vm/dp-modal';
import { mapState } from 'vuex';

export default {
	name: 'board-add-initiator',
	components: {
		DpModal
	},
	props: ['board'],
	data() {
		return {
			userId: 0,
			userName: '',
			visible: false,
			currentDepartment: null,
			currentDepartments: []
		}
	},
	computed: {
		...mapState('vm', ['currentUser', 'users', 'listUsers', 'departments', 'listDepartments', 'rootDepartments']),
		filteredList() {
			let list = [];
			let users = this.currentDepartment ? this.currentDepartment.users : this.listUsers;
			for (let id in users) {
				let user = users[id];
				if (user.name.toUpperCase()
					.indexOf(this.userName.toUpperCase()) >= 0) {
					list.push(user);
				}
			}
			if (!list.length) this.visible = false;
			return list;
		},
	},
	methods: {
		setUserCurrentDepartment() {
			let dep = this.departments[this.currentUser.departmentId];
			this.currentDepartment = dep;
			this.currentDepartments.unshift(dep);
			while (dep.parentId) {
				dep = this.departments[dep.parentId];
				this.currentDepartments.unshift(dep);
			}
		},
		setDepartmentId(id) {
			this.currentDepartment = null;
			this.currentDepartments.length = 0;
			if (!id) return;
			if (this.departments[id]) {
				let dep = this.departments[id];
				this.currentDepartment = dep;
				while (dep) {
					this.currentDepartments.unshift(dep);
					if (dep.parentId) {
						dep = this.departments[dep.parentId];
					} else {
						dep = null;
					}
				}
			}
		},
		selectedDepartment(index, department) {
			if (index < this.currentDepartments.length) {
				return this.currentDepartments[index].id == department.id;
			}
			return false;
		},
		// Ввести имя ответственного
		inputValue(value) {
			this.visible = true;
			this.userName = value;
			this.userId = 0;
		},

		resetUserName() {
			this.userName = '';
			this.visible = false;
		},
		// Выберите имя исполнителя
		setExecutorId(id) {
			this.userName = this.users[id].name;
			this.userId = id;
			this.visible = false;
		},
		// Сохранить
		save() {
			this.$emit('close');
			this.$parent.$emit('append', this.userId);

		},
		close() {
			this.$emit('close');
		}
	},
	mounted() {
		this.setUserCurrentDepartment();
	}
};
</script>

<style scoped lang="scss">

@import "../../assets/styles/main";

div[data-remove] {
	@extend %button;
}

.add-task {
	position: relative;
	width: 100%;
	background-color: $form-background-color;
	color: $text-color-01;
	z-index: 1000;
	overflow: auto;
	padding: 20px;

	&-footer {
		width: 95%;
		padding: 20px;
		display: flex;
		position: absolute;
		bottom: 0;
		gap: 5px;
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
