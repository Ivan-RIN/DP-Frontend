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

		padding: 6px 10px 6px 10px;
		border-radius: 5px 5px 5px 5px;
		cursor: pointer;
		background-color: #0d304b; /* 0d304b, 0c395a */
		border-top: 1px solid #197ccf;
		border-right: 1px solid #197ccf;
        background-color: #10548A;
	}
	.style:hover {
        font-weight: bold;
		background-color: #1a70b7;
	}
</style>
