<template>
	<div class="profile" :style="{ width: width }">
		<div>
			<div class="profile-foto">
				<img :src="getFoto()" @error="getFoto($event.target)"/>
			</div>
		</div>
		<div>
			<div data-name>
				{{ getName() }}
			</div>
			<div>
				{{ getPost() }}
			</div>
			<div>
				{{ getDepartment() }}
			</div>
			<div>
				<a :href="getMailTo()">{{ getEmail() }}</a>
			</div>
			<div>
				<span v-show="user.telephone">Тел.: {{ user.telephone }}</span>
				<span v-show="user.telephone && user.mobile">,&nbsp;</span>
				<span v-show="user.mobile">Сот.: {{ user.mobile }}</span>
			</div>
		</div>
	</div>
</template>

<script>

import stub_img from '@/assets/images/photo_stub.jpeg';
import { mapState } from 'vuex';

export default {
	name: "dtm-user-card",
	props:{
		user: {
			required: true,
			type: Object
		},
		width: {
			type: String,
			default: '100%'
		}
	},
	computed: {
		...mapState('vm', ['departments'])
	},
	methods: {

		getFoto(target) {
			if (target) {
				target.src = stub_img;
			} else {
				return 'https://mail.gazprom-neft.local/ews/Exchange.asmx/s/GetUserPhoto?size=HR64x64&email=' + this.user.email;
			}
		},

		getMailTo() {
			return 'mailto:' + this.user.email;
		},

		getName() {
			return this.user.name;
		},

		getPost() {
			return this.user.post;
		},

		getDepartment() {
			this.departments[this.user.departmentId].name;
		},

		getEmail() {
			return this.user.email;
		}

	}
}
</script>

<style scoped >

.profile {
	display: flex;
	gap: 20px;
	padding: 20px;
	background-color: #0d304b;
}

.profile a {
	color: #ffffff;
}

.profile div[data-name] {
	font-weight: bold;
}

.profile-foto {
	border-radius: 50%;
	width: 64px;
	height: 64px;
	overflow: hidden;
}

.profile-foto img {
	width: 64px;
	height: 64px;
}

</style>
