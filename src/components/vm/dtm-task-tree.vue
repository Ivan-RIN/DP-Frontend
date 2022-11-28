<template>
	<div class="task-tree" :style="{left: x+'px', top: y+'px'}">
		<div>
            {{ task.id }}, {{ task.name }}
		</div>
	</div>
</template>

<script>

export default {
	name: "dtm-task-tree",
	props: {
		x: {
			type: Number ,
			default: 0
		},
		y: {
			type: Number ,
			default: 0
		},
		task: {
			type: Object
		},
	},
	data() {
		return {
			count: 0,
		}
	},
	computed: {
	},
	methods: {
	},
	mounted() {

	}
}
</script>

<style scoped>

.task-tree {
	position: absolute;
	background-color: rgb(19, 108, 179);
	top: 0px;
	left: 0px;
	width: 300px;
	height: 130px;
	border-radius: 50px 0px 10px 0px;
	padding: 10px;
}

</style>
