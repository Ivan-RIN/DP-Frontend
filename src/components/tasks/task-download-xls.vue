<template>
	<div class="tasks-download">
		<date-picker-component
			@setDateFromPicker="setDateFromPicker"
		/>
		<button
			class="download-btn button"
			@click="downloadXLS">
			Скачать рапорт
		</button>
	</div>
</template>

<script>
    import api from '../../api/Reports/daily';
    import DatePickerComponent from '../common/date-picker-component.vue';

    export default {
        name: 'task-download-xls-component',
		components: { DatePickerComponent },
        data() {
            return {
                dateFormatted: new Date().toISOString().substr(0, 10),
            };
        },

        methods: {
            setDateFromPicker(date) {
              this.dateFormatted = date;
			},
			downloadXLS() {
				this.getReport(this.dateFormatted);
			},
			async getReport(date) {
                await api.getReport(date);
			},
        },
    };
</script>

<style lang="scss">

	.tasks-download {
		height: 30px;
		display: flex;
		flex-direction: row;
		align-content: center;

		.v-menu__content {
			border: 1px solid #10548a;

			.v-date-picker-table {
				background-color: #042740;

				th {
					padding: 8px 0 8px 0;
				}
			}
		}
		.download-btn {
			margin-left: 20px;
			text-transform: none;
		}
	}

</style>
