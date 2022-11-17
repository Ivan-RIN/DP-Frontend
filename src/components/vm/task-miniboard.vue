<template>
	<div class="task-miniboard" :style="{left: x+'px', top: y+'px'}">
		<div class="task-miniboard-background"></div>
		<div class="task-miniboard-status"></div>
		<div class="task-miniboard-body">
			<template v-if="type == 0">
				<div style="display: flex; z-index: 2;">
					<div class="profile-foto">
						<img :src="getFoto(task.initiatorId)" @error="errorFoto($event.target)"/>
					</div>
					<div style="padding: 5px 10px; width: 210px;">
						<span style="font-weight: bold">Инициатор</span><br>
						{{ getUserName(task.initiatorId) }}
					</div>
				</div>
			</template>
			<template v-if="type == 1">
				<div style="display: flex;">
					<div class="profile-foto">
						<img :src="getFoto(task.initiatorId)" @error="errorFoto($event.target)"/>
					</div>
					<div style="padding: 5px 10px; width: 210px;">
						<span style="font-weight: bold">Исполнитель-Инициатор</span><br>
						{{ getUserName(task.initiatorId) }}
					</div>
				</div>
			</template>
			<template v-if="type == 2">
				<div style="display: flex;">
					<div class="profile-foto">
						<img :src="getFoto(task.executorId)" @error="errorFoto($event.target)"/>
					</div>
					<div style="padding: 5px 10px; width: 210px;">
						<span style="font-weight: bold">Исполнитель</span><br>
						{{ getUserName(task.executorId) }}
					</div>
				</div>
			</template>
			<div style="padding: 10px 20px;">{{ task.name }}</div>
			<div v-if="type > 0" :style="{position: 'absolute', left: '-60px', top: -h+80+'px'}">
				<div :style="{width: '50px', height: h+'px', borderLeft: '2px solid #fff', borderBottom: '2px solid #fff'}"></div>
			</div>
		</div>
	</div>
</template>

<script>

import { mapState } from 'vuex';
import stub_img from '@/assets/images/photo_stub.jpeg';
import DictionaryView from '../../views/dictionary-view';

export default {
	name: 'task-miniboard',
	components: { DictionaryView },
	props: {
		x: {
			type: Number ,
			default: 0
		},
		y: {
			type: Number ,
			default: 0
		},
		h: {
			type: Number ,
			default: 80
		},
		task: {
			type: Object,
			default: null
		},
		taskId: {
			default: 0
		},
		type: {
			default: 0
		}
	},
	computed: {
		...mapState('vm', ['currentUser', 'users', 'departments'])
	},
	methods: {

		getFoto(userId) {
			if (this.users[userId])
				return 'https://mail.gazprom-neft.local/ews/Exchange.asmx/s/GetUserPhoto?size=HR64x64&email=' + this.users[userId].email;
			else
				return stub_img;
		},

		errorFoto(img) {
			img.src = stub_img;
		},
		getUserName(id) {
			if (!this.users[id]) return 'Не известный';
			return this.users[id].name;
		},

	}
};
</script>

<style scoped>

.task-miniboard {
	position: absolute;
	background-color: rgb(19, 108, 179);
	width: 300px;
	height: 130px;
	border-radius: 50px 0px 10px 0px;
	padding: 10px;
}

.profile-foto {
	border-radius: 50%;
	width: 64px;
	height: 64px;
	overflow: hidden;
}

.task-miniboard-background {
	position: absolute;
	left: 0px;
	top: 45px;
	bottom: 0px;
	right: 0px;
	z-index: 1;
	background-color: rgb(16, 84, 138);
	border-radius: 60px 0px 10px 0px;
}

.task-miniboard-body {
	position: absolute;
	left: 0px;
	top: 0px;
	bottom: 0px;
	right: 0px;
	z-index: 2;
}

.task-miniboard-status {
	position: absolute;
	right: 8px;
	top: 8px;
	width: 12px;
	height: 12px;
	border-radius: 100%;
	background-color: rgb(37, 122, 13);
	border: 1px solid #fff;
}

</style>
