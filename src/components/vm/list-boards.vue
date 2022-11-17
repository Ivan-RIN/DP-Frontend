<template>
	<div style="display: flex; flex-wrap: wrap; grid-gap: 20px; padding: 0px 40px;">
		<div
		style="background-color: #10548A; border-radius: 10px; width: 300px;
		min-height: 130px; padding: 10px; cursor: pointer; border-top: 1px solid #1071be;
		border-right: 1px solid #1071be;"
		v-for="board in boards"
		@click="openViewBoard(board)"
		>
			<div style="font-size: 16px;">
				{{ board.block.name }} => {{ board.name }}
			</div>
			<div style="font-size: 12px;">
				{{ board.description }}
			</div>
			<div style="border-bottom: 1px solid #ffffff; margin: 8px 0px;"></div>
			<div style="font-size: 14px;" v-if="board.ownerId">
				Владелец: {{ getShortUserName(board.ownerId) }}
			</div>
			<div style="font-size: 14px;" v-if="board.adminId">
				Администратор: {{ getShortUserName(board.adminId) }}
			</div>
			<div style="font-size: 14px;">
				Количество задач: {{ board.tasks.length }}
			</div>

		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'list-boards',
	props: {
		boards: {
			type: Array
		},
		openViewBoard: {
			type: Function
		},
	},
	computed: {
		...mapState('vm', ['currentUser', 'users', 'departments', 'boardBlocks']),
	},
	methods: {
		getShortUserName(userId) {
			let user = this.users[userId];
			let fio = user.name.split(' ');
			if (fio.length == 2) return fio[0] + ' ' + fio[1][0] + '.';
			if (fio.length > 2) return fio[0] + ' ' + fio[1][0] + '.' + fio[2][0] + '.';
			return user.name;
		},
		getNameDepartment(id) {
			return this.departments[id].abbreviation;
		}
	}
};
</script>

<style scoped lang="scss">

</style>
