<template>
	<div v-if="task.groupId && facilities.length > 0" style="margin-right: 10px;">
		<table>
			<template v-for="(sop, index) in facilities">
				<tr v-if="index == 0">
					<th style="padding: 8px;">Скв.</th>
					<th v-for="(criterion, index) in sop.criterions">
						{{ criterion.criterion.name }}
					</th>
				</tr>
			</template>
		</table>
		<div style="overflow-y: scroll; max-height: 250px;">
			<table ref="table_criterion_values">
				<template v-for="(sop, index) in facilities">
					<tr>
						<td style="text-align: center;"> {{ sop.facility }}</td>
						<td v-for="(criterion, index) in sop.criterions">
							<input
								name="text"
								v-model="tasksCriterions[sop.taskId + '-' + sop.sopId + '-' + criterion.criterion.id]"
								:name="sop.taskId + '-' + sop.sopId + '-' + criterion.criterion.id"
							>
						</td>
					</tr>
				</template>
			</table>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import TaskHistoryComponent from './taskHistoryComponent';

export default {
	name: 'PerformanceCriterionsComponentTable',
	components: { TaskHistoryComponent },
	props: ['task', 'tasksCriterions'],
	data() {
		return {
			facilities: [],
		};
	},
	computed: {
		...mapState('storage', ['tasks']),
	},
	methods: {

		setValuesToSop() {

			this.tasks.forEach(task => {

				if (task.groupId && task.groupId == this.task.groupId) {

					let sops = {};

					task.soPs.forEach((item) => {
						if (item.sop.criterions && item.sop.criterions.length > 0) {
							let sop = {
								sopId: item.sopId,
								taskId: item.taskId,
								facilityId: task.facilityId,
								sopName: item.sop.number,
								facility: task.facility.name,
								criterions: item.sop.criterions.sort((a, b) => a.criterion.id - b.criterion.id)
							};
							sops[item.sopId] = sop;
							this.facilities.push(sop);
						}
					});

					task.values.forEach((itemValue) => {
						if (sops[itemValue.sopId]) {
							const criterionId = itemValue.criterionId;
							sops[itemValue.sopId].criterions.map((itemCriterion) => {
								if (itemCriterion.criterionId == criterionId) {
									let id = sops[itemValue.sopId].taskId + '-' + sops[itemValue.sopId].sopId + '-' + criterionId;
									this.tasksCriterions[id] = itemValue.value;
								}
							});
						}
					});

					this.facilities.sort((a, b) => a.facility - b.facility);

				}
			});

		},
		setValues(taskId, sopId, criterionId, value) {
			console.log(taskId, sopId, criterionId, value);
		}
	},
	mounted() {
		this.setValuesToSop();
	}
};
</script>

<style scoped>

table {

}

table th {
	text-align: center;
}

table input {
	width: 86px;
}

table th, td {
	width: 86px;
	padding: 0px;
}

</style>
