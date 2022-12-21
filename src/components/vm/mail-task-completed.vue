<template>
	<div class="add-task">
		<div style="font-weight: bold; font-size: 16px;">Рассылка уведомления на электронную почту:</div>
		<div class="line"></div>
		<div>
			Вы установили состояние текущей задачи в "Выполнено".
			Отправить уведомление на почту о выполнении задачи?
		</div>
		<div slot="body">
			<div style="padding: 10px; font-size: 16px; margin: 10px 0;">
				Наименование задачи: {{ task.name }}
			</div>
			<div style="padding: 10px;">
				<div style="font-weight: bold; font-size: 14px;">Инициатор:</div>
				<div style="display: flex;">
					<div>
						<input v-model="initiator" type="checkbox" style="width: 16px;">
					</div>
					<div style="padding: 6px 10px;">
						<label>{{ getUserName(task.initiatorId) }}</label>
					</div>
				</div>
			</div>
			<div style="padding: 10px;" v-if="task.initiatorId != task.executorId">
				<div style="font-weight: bold; font-size: 14px;">Исполнитель:</div>
				<div style="display: flex;">
					<div>
						<input v-model="executor" type="checkbox" style="width: 16px;">
					</div>
					<div style="padding: 6px 10px;">
						<label>{{ getUserName(task.executorId) }}</label>
					</div>
				</div>
			</div>
			<div style="height: 55px;"></div>
		</div>
		<div class="add-task-footer">
			<div data-remove @click="save()">Отправить</div>
			<div data-remove @click="close()">Закрыть</div>
		</div>
	</div>
</template>

<script>

import DpModal from '@/components/vm/dp-modal';
import { mapState } from 'vuex';

export default {
	name: 'mail-task-completed',
	components: {
		DpModal
	},
	props: ['task'],
	data() {
		return {
			initiator: true,
			executor: this.task.initiatorId != this.task.executorId,
			listUsers: []
		};
	},
	computed: {
		...mapState('vm', ['currentUser', 'users', 'departments', 'listDepartments', 'rootDepartments']),
	},
	methods: {
		getUserName(userId) {
			return this.users[userId] ? this.users[userId].name : '';
		},
		// Сохранить
		save() {

			if (this.initiator) {
				this.listUsers.push(this.task.initiatorId);
			}
			if (this.executor) {
				this.listUsers.push(this.task.executorId);
			}

			this.$emit('close');
			this.$parent.$emit('send', this.listUsers);

		},
		close() {
			this.$emit('close');
		}
	},
	mounted() {
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
