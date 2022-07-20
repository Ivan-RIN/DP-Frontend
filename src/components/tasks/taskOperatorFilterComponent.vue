<template>
    <div class="tasks-filter-operator">
        <div class="tasks-filter-operator-content">
            <div class="tasks-filter-operator-content-time">
                <div class="tasks-filter-operator-content-time-fields-container">
                    <div class="text">Период с:</div>
                    <date-picker-component
                            :date="filterState.dateFrom"
                            :minDate="yesterday"
                            @setDateFromPicker="setDateFromPickerFrom"
                    />
                    <div class="text">по:</div>
                    <date-picker-component
                            :date="filterState.dateTo"
                            :minDate="yesterday"
                            @setDateFromPicker="setDateFromPickerTo"
                    />
                    <div
                            class="clear"
                            @click="clearFilter"
                    >
                        <img src="../../assets/images/cross.svg" alt="Очистить фильтр">
                    </div>
                </div>
                <div class="tasks-filter-operator-content-time-preset">
                    <span @click="presetDate(3)">Вчера</span>
                    <span @click="presetDate(1)">Сегодня</span>
                    <span @click="presetDate(2)">Завтра</span>
                </div>
            </div>
        </div>
        <div class="tasks-filter-operator-buttons">
            <div class="tasks-filter-operator-buttons-container">
                <div class="tasks-filter-operator-buttons-container-accept button" @click="acceptFilter" >Показать</div>
            </div>
            <div class="tasks-filter-operator-buttons-selected">
                <div class="tasks-filter-operator-buttons-selected-download-list" @click="downloadFilteredList">
                    <p>Скачать реестр задач</p>
                    <img src="../../assets/images/excell.svg" alt="Скачать реестр задач">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import { mapGetters, mapActions, mapState } from 'vuex';
	import api from '../../api/Reports/daily';
	import DatePickerComponent from '../common/date-picker-component.vue';

	export default {
		name: 'task-filter-component',
		components: { DatePickerComponent },
		data() {
			return {
                today: new Date().toISOString().substring(0, 10),
                yesterday: undefined,
			};
		},
		computed: {
			...mapGetters('dict', ['dictionariesData', 'taskStatus']),
			...mapState('task', ['filterState']),
		},
        created() {
	        this.setYesterday();
        },
		methods:
			{
				...mapActions('task', ['setDefaultOperatorFilter']),
				setDateFromInStore(date) {
					this.$store.commit('task/setDateFrom', date);
				},
				setDateToInStore(date) {
					this.$store.commit('task/setDateTo', date);
				},
				setDateFromPickerFrom(date) {
					this.setDateFromInStore(date);
				},
				setDateFromPickerTo(date) {
					this.setDateToInStore(date);
				},
				acceptFilter() {
					this.$emit('filter');
				},
				clearFilter() {
					this.setDefaultOperatorFilter();
					this.$emit('clearFilter');
				},
                setYesterday() {
					const day = new Date();
					day.setDate(day.getDate() - 1);
					this.yesterday = day.toISOString().substring(0, 10);
                },
				async downloadFilteredList() {
					await api.getFilteredList(this.filterState);
				},
				presetDate(d) {
					const dt = new Date();
					switch (d) {
						case 1:
							this.setDateFromInStore(dt.toISOString().substring(0, 10));
							this.setDateToInStore(dt.toISOString().substring(0, 10));
							break;
						case 2:
							dt.setDate(dt.getDate() + 1);
							this.setDateFromInStore(dt.toISOString().substring(0, 10));
							this.setDateToInStore(dt.toISOString().substring(0, 10));
							break;
						case 3:
							dt.setDate(dt.getDate() - 1);
							this.setDateFromInStore(dt.toISOString().substring(0, 10));
							this.setDateToInStore(dt.toISOString().substring(0, 10));
							break;
						default:
							break;
					}
				},
			},
	};
</script>

<style lang="scss">
    @import "../../assets/styles/main";

    .tasks-filter-operator {
        background-color: $content-background-color;
        border-radius: 5px;
        margin: 20px 0;
        padding: 10px 20px 10px 20px;
        display: flex;
        flex-direction: row;

        .clear {
            color: $text-color-03;
            text-decoration: underline;
            cursor: pointer;
            margin-left: 10px;

            & img {
                position: relative;
                top: 3px;
                left: -5px;
                height: 13px;
                width: 13px;
            }
        }

        &-content {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: nowrap;
            line-height: 30px;

            width: 100%;
            &-time-preset {
                color: $text-color-03;
                flex-direction: row;

                span {
                    margin: 0 $default-margin;
                    cursor: pointer;
                }
            }


            &-time {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                &-fields-container{
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    margin-right: 120px;
                    margin-left: 50px;
                }
            }
        }
        &-buttons {
            display: flex;
            flex-direction: row;
            &-container {
                display: flex;
                flex-direction: column;

                &-accept {
                    line-height: 28px;
                }
            }
            &-selected
            {
                display: flex;
                justify-content: flex-end;

                &-download-list {
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    align-content: center;
                    margin: 3px 0 0 10px;
                    cursor: pointer;

                    p {
                        position: absolute;
                        font-size: 11pt;
                        background-color: #a8aeb4;
                        border-radius: 4px;
                        width: 150px;
                        height: 30px;
                        top: -37px;
                        left: -110px;
                        visibility: hidden;
                        opacity: 0;
                        padding: 0 0 0 8px;
                        color: #0d304b;
                    }

                    &:hover p {
                        visibility: visible;
                        opacity: 1;
                    }

                    img {
                        width: auto;
                        height: 24px;
                    }
                }
            }
        }
    }

</style>
