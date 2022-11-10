<template>
	<div class="style" :style="{right: offset + 'px'}"
	    v-if="user.access.isDeveloper || user.access.isAdministrator || user.access.isModerator || user.access.isInitiator"
	    @click="action({ board: board })"
	>
<!--		<img src="@/assets/images/add_icon.svg" alt="">-->
		<span>{{ title }}</span>
	</div>
</template>

<script>
export default {
	name: "add-task-button",
	//props: ['user', 'board', 'action'],
	props: {
		'title' : {
			type: String,
			default: 'Добавить Задачу'
		},
		'offset': {
			type: Number,
			default: 0
		},
		'user': {},
		'board': {},
		'action': {
			type: Function
		}
	},
	methods: {},
}
</script>

<style scoped>
	.style {
		display: flex;
		align-items: center;
		font-weight: bold;
		padding: 8px 20px 8px 20px;
		position: absolute;
		top: -1px;
		right: 0px;
		border-radius: 10px 10px 0px 0px;
		cursor: pointer;
		background-color: #0d304b; /* 0d304b, 0c395a */
		border-top: 1px solid #10548a;
		border-right: 1px solid #10548a;
	}
	.style:hover {
		background-color: #0c395a;
	}
</style>
