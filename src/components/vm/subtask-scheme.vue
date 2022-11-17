<template>
	<div style="height: 900px; position: relative;">
		<task-miniboard :type="0" :x="offsetX + shiftX * 0" :y="shiftY * 0" :task="tasks[6]"/>
		<task-miniboard :type="1" :x="offsetX + shiftX * 1" :y="shiftY * 1" :task="tasks[65]"/>
		<task-miniboard :type="1" :x="offsetX + shiftX * 2" :y="shiftY * 2" :task="tasks[66]"/>
		<task-miniboard :type="2" :x="offsetX + shiftX * 3" :y="shiftY * 3" :task="tasks[66]"/>
		<task-miniboard :type="2" :x="offsetX + shiftX * 3" :y="shiftY * 4" :h="200" :task="tasks[68]"/>
		<task-miniboard :type="2" :x="offsetX + shiftX * 2" :y="shiftY * 5" :h="500" :task="tasks[67]"/>
	</div>
</template>

<script>

import TaskMiniboard from '@/components/vm/task-miniboard.vue';

export default {
	name: 'subtask-scheme',
	components: {
		TaskMiniboard
	},
	props: {
		task: {
			type: Object
		},
		tasks: {
			type: Object
		}
	},
	data() {
		return {
			offsetX: 250,
			shiftX: 200,
			shiftY: 150
		}
	}
};
</script>

<style scoped>

</style>
