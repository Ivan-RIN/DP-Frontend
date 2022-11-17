<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Подразделение</th>
                    <th>ФИО</th>
                    <th>Должность</th>
                    <th>Почта</th>
                    <th>Задач на контроле</th>
                    <th>Задач на исполнении</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>#{{ user.id }}</td>
                    <td>{{ getUserDepartment(user.departmentId) }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.post }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ countControl(user.id) }}</td>
                    <td>{{ countTasks(user.id) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

import { mapState } from 'vuex';

export default {
    name: "list-users",
    computed: {
        ...mapState('vm', ['boards', 'departments', 'users']),
    },
    methods: {
        getUserDepartment(depId) {
            if (this.departments[depId]) return this.departments[depId].abbreviation;
            return '';
        },
        countTasks(userId) {
            let count = 0;
			for(let i in this.boards) {
				let tasks = this.boards[i];
				for (let j in tasks) {
					let dep = this.tasks[j];
					for (let task of dep) {
						if (task.executorId == userId) count++;
					}
				}
			}
            return count;
        },
        countControl(userId) {
            let count = 0;
            for(let i in this.tasks) {
                let dep = this.tasks[i];
                for(let task of dep) {
                    if (task.initiatorId == userId) count++;
                }
            }
            return count;
        }
    }
}

</script>

<style scoped>

table {
    width: 100%;
    border-spacing: 0px 2px;
    text-shadow: 2px 2px 1px #000000;
}

table thead tr {
    background: linear-gradient(to bottom, #0765a0, #083354);
}

table th, table td {
    padding: 8px 16px;
}

table tr:nth-child(3n+3) {
    background: #1e90ea;
    background: linear-gradient(to bottom, #0f3e5d, #083354, #0f3e5d);
}

table tbody tr:hover {
    background: linear-gradient(to bottom, #0f3e5d, #0e5994, #0f3e5d);
}

table th:nth-child(1) {
    width: 80px;
}

table th:nth-child(2) {
    width: 80px;
}

table tbody td:nth-child(6) {
    text-align: center;
    width: 140px;
}

table tbody td:nth-child(7) {
    text-align: center;
    width: 140px;
}

</style>
