<template>
	<div class="add-task">
		<div style="margin-bottom: 20px; font-weight: bold;">Выбрать подразделение:</div>
		<div>
			<select style="margin-left: 5px; width: 98%;" @change="departmentId = $event.target.value">
				<option
					v-for="(dep, index) in departments"
					:key="dep.id"
					:value="index"
					:selected="index == departmentId"
				>
					{{ dep.name }}
				</option>
			</select>
		</div>
		<div style="height: 55px;"></div>
		<div class="add-task-footer">
			<div data-remove @click="select()">Выбрать</div>
			<div data-remove @click="close()">Закрыть</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: "select-department",
	props: {
		departmentSelected: {
			type: Function,
			default: null
		}

	},
	data() {
		return {
			departmentId: 4,
		}
	},
	computed: {
		...mapState('vm', ['currentUser', 'users', 'listUsers', 'departments', 'rootDepartments']),
	},
	methods: {

		select() {
			this.$emit('close');
			this.$parent.$emit('select', this.departmentId);
			if (typeof this.departmentSelected == 'Function')
				this.departmentSelected(this.departmentId);
		},

		close() {
			this.$emit('close');
		}
	}
}
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
