<template>
	<div>
		<div style="display: flex; gap: 10px;">
			<input
				style="width: 250px; font-weight: normal;"
				:style="{color: user ? '#fff' : '#faa', fontWeight: user ? 'normal' : 'normal'}"
				@click="focus=true"
				@mouseover="focus=true"
				type="text"
				v-model="name"
			>
			<span @click="deleteName()" style="padding: 4px; cursor: pointer;">Удалить</span>
		</div>
		<div v-if="!user && focus"
			 style="position: relative;"
			 @mouseleave="focus=false"
		>
			<div class="list-users">
				<div
					v-for="(user, index) in list"
					@click="selectUser(user)"
					:key="index">
					{{ user.name }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import { mapState } from 'vuex';

export default {
	name: 'select-users',
	props: {
		current: {
			type: Object,
			default: null
		}
	},
	data() {
		return {
			init: false,
			user: this.current ? this.current : null,
			name: this.current ? this.current.name : '',
			focus: false,
			list: []
		};
	},
	computed: {
		...mapState('vm', ['listUsers'])
	},
	watch: {
		name(value) {
			if (this.user && this.user.name == value) return;
			this.user = null;
			this.list = [];
			for (let user of this.listUsers) {
				if (user.name && user.name.toUpperCase()
					.indexOf(value.toUpperCase()) >= 0) {
					this.list.push(user);
				}
			}
		}
	},
	methods: {
		deleteName() {
			this.name = '';
		},
		selectUser(user) {
			this.user = user;
			this.name = user.name;
			this.$emit('input', user);
		}
	},
	created() {
		if (this.user) {
			this.name = this.user.name;
		}
	}
};
</script>

<style scoped>

.list-users {
	overflow-x: hidden;
	overflow-y: auto;
	width: 250px;
	background-color: #000000;
	max-height: 120px;
	position: absolute;
	z-index: 2;
	top: 2px;
	left: 0px;
}

.list-users div {
	margin: 1px;
	padding: 4px;
	font-size: 12px;
	white-space: nowrap;
}

.list-users div:hover {
	background-color: #0f426b;
}
</style>
