<template>
	<div class="style" @click="action(data)"
	>
<!--		<img src="@/assets/images/add_icon.svg" alt="">-->
		<span>{{ title }}</span>
	</div>
</template>

<script>
export default {
	name: "add-task-button",
	props: {
		'title' : {
			type: String,
			default: ''
		},
		'action': {
			type: Function
		},
        'data': {}
	},
}
</script>

<style scoped>
	.style {
		font-weight: bold;
		padding: 8px 20px 8px 20px;
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
