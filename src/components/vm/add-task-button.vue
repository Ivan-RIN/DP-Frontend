<template>
	<div
	    v-if="user.access.isDeveloper || user.access.isAdministrator || user.access.isModerator || user.access.isInitiator"
	    @click="action({ boardId: boardId })"
	>
		<img src="@/assets/images/add_icon.svg" alt="">
		<span>Добавить задачу</span>
	</div>
</template>

<script>
export default {
	name: "add-task-button",
	props: ['user', 'boardId', 'action'],
	methods: {}
}
</script>

<style scoped>
	div {
		display: flex;
		align-items: center;
		font-weight: bold;
		padding: 6px 10px 6px 10px;
		background-color: #10548a;
		position: absolute;
		top: -4px; right: 0px;
		border-radius: 10px 10px 0px 0px;
		cursor: pointer;
	}
</style>
