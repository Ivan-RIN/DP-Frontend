<template>
    <div class="tasks-history-filter">
        <div class="tasks-history-filter-container">
            <div class="text">Период с:</div>
            <date-picker-component
                    :date="historyFilterState.dateFrom"
                    @setDateFromPicker="setDateFromPickerFrom"
            />
            <div class="text">по:</div>
            <date-picker-component
                    :date="historyFilterState.dateTo"
                    @setDateFromPicker="setDateFromPickerTo"
            />
            <div
                    class="clear"
                    @click="clearFilter"
            >
                <img src="../../assets/images/cross.svg" alt="Очистить фильтр">
            </div>
        </div>
        <div class="tasks-history-filter-buttons">
            <div class="tasks-history-filter-buttons-container">
                <div class="tasks-history-filter-buttons-container-accept button" @click="filter" >Показать</div>
            </div>
        </div>
    </div>
</template>

<script>

	import { mapGetters, mapActions } from 'vuex';

	import DatePickerComponent from '../common/date-picker-component.vue';

	export default {
		name: 'tasks-history-filter',
        components: { DatePickerComponent },
		computed: {
			...mapGetters('history', ['historyFilterState']),
		},
		data() {
			return {};
		},
        created() {
			this.setDefaultHistoryFilter();
        },
		methods: {
			...mapActions('history', ['setDefaultHistoryFilter', 'searchTasksHistory']),

			setDateFromInStore(date) {
				this.$store.commit('history/setDateFrom', date);
			},
			setDateToInStore(date) {
				this.$store.commit('history/setDateTo', date);
			},
			setDateFromPickerFrom(date) {
				this.setDateFromInStore(date);
			},
			setDateFromPickerTo(date) {
				this.setDateToInStore(date);
			},
			clearFilter() {
				this.setDefaultHistoryFilter();
				this.filter();
			},
			filter() {
				this.$emit('filter');
			},
		},
		mounted() {

		},
	};
</script>


<style scoped lang="scss">
    @import "../../assets/styles/main";

    .tasks-history-filter {
        background-color: $content-background-color;
        border-radius: 5px;
        margin: 20px 0;
        padding: 10px 20px 10px 20px;
        display: flex;
        flex-direction: row;

        &-container {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            width: 100%;

            img {
                cursor: pointer;
            }
            &-time-preset {
                color: $text-color-03;
                flex-direction: row;

                span {
                    margin: 0 $default-margin;
                    cursor: pointer;
                }
            }
        }
    }


</style>
