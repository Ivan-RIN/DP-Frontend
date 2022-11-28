<template>
	<div class="task-miniboard" :style="{ left: x+'px', top: y+'px' }">
		<div class="task-miniboard-background"></div>
		<div class="task-miniboard-status" :style="{backgroundColor: '#' + getColorStatus(task)}"></div>
        <div class="task-progress">{{ task.progress }}%</div>
        <div class="task-board">[{{ getBoard(task.boardId) }}]</div>
		<div class="task-miniboard-body">
            <div style="display: flex; z-index: 2;">
                <div class="profile-foto">
                    <img v-if="type == 2" :src="getFoto(task.executorId)" @error="errorFoto($event.target)"/>
                    <img v-else :src="getFoto(task.initiatorId)" @error="errorFoto($event.target)"/>
                </div>
                <div style="padding: 5px 10px; width: 230px;">
                    <div style="font-weight: bold">Инициатор</div>
                    <div>{{ getUserName(task.initiatorId) }}</div>
                </div>

            </div>
            <div style="padding: 10px 20px; height: 58px; overflow: hidden;">
                #{{ task.id }}: {{ task.name }}
            </div>
            <div style="display: flex; z-index: 2; background-color: #0493FC; border-radius: 0 0 5px 0; padding: 2px;">
                <div style="padding: 5px 10px; width: 270px; ">
                    <div style="font-weight: bold">Исполнитель</div>
                    <div>{{ getUserName(task.executorId) }}</div>
                </div>
                <div class="profile-foto">
                    <img :src="getFoto(task.executorId)" @error="errorFoto($event.target)"/>
                </div>
            </div>

			<div v-if="h > 0" :style="{ position: 'absolute', left: '-60px', top: -h+100+'px' }">
				<div :style="{ width: '50px', height: h+'px', borderLeft: '2px solid #fff', borderBottom: '2px solid #fff' }"></div>
			</div>
		</div>
	</div>
</template>

<script>

import { mapState } from 'vuex';
import stub_img from '@/assets/images/photo_stub.jpeg';
import DictionaryView from '../../views/dictionary-view';

export default {
	name: 'dtm-task-miniboard',
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
			default: 0
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
		...mapState('vm', ['currentUser', 'users', 'boards', 'departments'])
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
        getDepartment(id) {
            return this.departments[id].abbreviation;
        },
        getBoard(id) {
            for (let board of this.boards) {
                if (board.id == id) return board.name;
            }
            return '-';
        },
        getColorStatus(task) {
            if (task.state == 1) return 'FFFFFF';   // Планируется
            if (task.state == 5) return 'E0E709';   // В работе
            if (task.state == 6) return '257A0D';   // Выполнено, Завершено
            if (task.state == 7) return 'D41717';   // Просрочено
            if (task.state == 8) return 'F38F06';   // Отменено
		    return '0493FC';
        }

	}
};
</script>

<style scoped>

.task-miniboard {
    color: #FFFFFF;
	position: absolute;
	background-color: #0493FC;
	width: 340px;
	height: 190px;
	border-radius: 50px 0px 10px 0px;
	padding: 10px;
}

.task-progress {
    position: absolute;
    right: -20px;
    top: 0px;
    width: 26px;
    height: 46px;
    background-color: #0493FC;
    border-radius: 0px 5px 5px 0px;
    padding: 5px;
    color: #ffffff;
    writing-mode: vertical-rl;
    text-align: center;
}

.task-board {
    position: absolute;
    right: 8px;
    top: 52px;
    color: #ffffff;
    z-index: 1;
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

.task-miniboard-background {
	position: absolute;
	left: 0px;
	top: 46px;
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
	right: 6px;
	top: 16px;
	width: 14px;
	height: 14px;
	border-radius: 100%;
	background-color: rgb(205, 168, 29);
	border: 1px solid #fff;
}

</style>
