<template>
    <div class="tasks-filter">
        <div class="tasks-filter-content">
            <div class="tasks-filter-content-group">
                <div class="tasks-filter-content-brigade">
                    <span class="tasks-filter-content-brigade-title">Бригада</span>
                    <dp-combobox-component
                            :options="dictionariesData.brigades"
                            v-model="selectBrigadeId"
                    />
                    <img src="../../assets/images/ok_icon.svg" @click="addBrigadeToFilter()" alt="">
                </div>
                <div class="tasks-filter-content-executor-selected">
                    <label for="taskFilterExecutorStatus">Ответственный не назначен</label>
                    <input type="checkbox" id="taskFilterExecutorStatus"
                           @change="setExecutorStatusInStore($event.target.checked)"
                           v-model="filterState.executorStatus"/>
                </div>
            </div>
            <div class="tasks-filter-content-time">
                <div class="tasks-filter-content-time-fields-container">
                    <div class="text">Период с:</div>
                    <date-picker-component
                            :date="filterState.dateFrom"
                            @setDateFromPicker="setDateFromPickerFrom"
                    />
                    <div class="text">по:</div>
                    <date-picker-component
                            :date="filterState.dateTo"
                            @setDateFromPicker="setDateFromPickerTo"
                    />
                </div>
                <div class="tasks-filter-content-time-preset">
                    <span @click="presetDate(1)">Сегодня</span>
                    <span @click="presetDate(2)">Вчера</span>
                    <span @click="presetDate(3)">Последние 30 дней</span>
                </div>
            </div>
            <div class="tasks-filter-content-state">
                Статус
                <dp-combobox-component
                        :options="taskStatus"
                        v-model="filterState.status"
                />
            </div>
            <div class="tasks-filter-content-category">
                Категория
                <dp-combobox-component
                        :options="dictionariesData.taskCategories"
                        v-model="filterState.taskCategoryId"
                />
            </div>
            <div class="space"></div>
            <div class="tasks-filter-content-accept" @click="acceptFilter">Показать</div>
            <div class="tasks-filter-content-download-list" @click="downloadFilteredList">
                <p>Скачать реестр задач</p>
                <img src="../../assets/images/excell.svg" alt="Скачать реестр задач">
            </div>
        </div>
        <div class="tasks-filter-selected">
            <div class="tasks-filter-selected-values">
                Выбраны:
                <div v-for="(brig, index) in filterState.brigades" v-bind:key="index">
                    {{brig.name}}
                    &nbsp;
                    <span class="button-close" @click="removeBrigade(brig)"/>
                </div>
            </div>
            <div
                    class="tasks-filter-selected-clear"
                    @click="clearFilter"
            >
                <img src="../../assets/images/cross.svg" alt="Очистить фильтр">
                Сбросить всё
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions, mapState } from 'vuex';
    import api from '../../api/Reports/daily';
    import DpComboboxComponent from '../common/dp-combobox-component.vue';
    import DatePickerComponent from '../common/date-picker-component.vue';

    export default {
        name: 'vm-task-filter-component',
        components: {
            DpComboboxComponent,
            DatePickerComponent
        },
        data() {
            return {
                selectBrigadeId: undefined,
                status: undefined,
                executorStatus: undefined,
                brigades: [],
            };
        },
        watch: {
            status(n) {
                this.setStatusInStore(n);
            },
            executorStatus(n) {
                this.setExecutorStatusInStore(n);
            },
        },
        computed: {
            ...mapGetters('dict', ['dictionariesData', 'taskStatus']),
            ...mapState('task', ['filterState']),
        },
        mounted() {
            this.status = this.filterState.status;
        },
        methods:
            {
                ...mapActions('task', ['setDefaultFilterState']),
                setDateFromInStore(date) {
                    this.$store.commit('task/setDateFrom', date);
                },
                setDateToInStore(date) {
                    this.$store.commit('task/setDateTo', date);
                },
                setBrigadesInStore(brigades) {
                    this.$store.commit('task/setBrigades', brigades);
                },
                setStatusInStore(status) {
                    this.$store.commit('task/setStatus', status);
                },
                setExecutorStatusInStore(executorStatus) {
                    this.$store.commit('task/setExecutorStatus', executorStatus);
                },
                setDateFromPickerFrom(date) {
                    this.setDateFromInStore(date);
                },
                setDateFromPickerTo(date) {
                    this.setDateToInStore(date);
                },
                monthFirstDay(d) {
                    d.setDate(1);
                    return d;
                },
                acceptFilter() {
                    this.$emit('filter');
                },
                clearFilter() {
                    this.setDefaultFilterState();
                    this.selectBrigadeId = undefined;
                    this.brigades = [];
                    this.$emit('clearFilter');
                },
                async downloadFilteredList() {
                    await api.getFilteredList(this.filterState);
                },
                presetDate(d) {
                    const dt = new Date();
                    switch (d) {
                        case 1:
                            this.setDateFromInStore(dt.toISOString()
                                .substring(0, 10));
                            this.setDateToInStore(dt.toISOString()
                                .substring(0, 10));
                            break;
                        case 2:
                            dt.setDate(dt.getDate() - 1);
                            this.setDateFromInStore(dt.toISOString()
                                .substring(0, 10));
                            this.setDateToInStore(dt.toISOString()
                                .substring(0, 10));
                            break;
                        case 3:
                            this.setDateToInStore(dt.toISOString()
                                .substring(0, 10));
                            dt.setDate(dt.getDate() - 30);
                            this.setDateFromInStore(dt.toISOString()
                                .substring(0, 10));
                            break;
                        default:
                            break;
                    }
                },
                addBrigadeToFilter() {
                    const brigades = this.filterState.brigades;
                    const index = brigades.findIndex(e => e.id.toString() === this.selectBrigadeId);
                    const dictBrigades = this.dictionariesData.brigades;
                    if (this.selectBrigadeId && index < 0) {
                        const brigade = dictBrigades.find(e => e.id.toString() === this.selectBrigadeId);
                        if (brigade) {
                            this.brigades.push(brigade);
                            this.setBrigadesInStore(this.brigades);
                        }
                    }
                },
                removeBrigade(brig) {
                    const i = this.brigades.findIndex(e => e.id === brig.id);
                    if (i >= 0) {
                        this.brigades.splice(i, 1);
                        this.setBrigadesInStore(this.brigades);
                    }
                },
            },
    };
</script>

<style lang="scss">
    @import "../../assets/styles/main";

    .tasks-filter {
        background-color: $content-background-color;
        border-radius: 5px;
        margin: 20px 0;
        padding: 15px 20px 15px 20px;
        display: flex;
        flex-direction: column;

        &-content {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items: flex-start;

            width: 100%;

            &-time-preset {
                color: $text-color-03;
                padding-left: 55px;
                height: 30px;
                display: flex;
                align-items: center;

                span {
                    margin: 0 $default-margin;
                    cursor: pointer;
                }
            }

            &-accept {
                @extend %button;
                margin: 0 10px 0 0;
            }

            .space {
                flex: 1 1 auto;
            }

            &-download-list {
                position: relative;
                display: flex;
                justify-content: space-between;
                align-content: center;
                margin: 3px 0 0 0;
                cursor: pointer;

                p {
                    position: absolute;
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

            &-group {
                display: flex;
                flex-direction: column;
            }

            &-brigade {
                display: flex;
                flex-direction: row;
                align-items: center;

                &-title {
                    margin-right: 5px;
                }

                > img {
                    position: relative;
                    top: -2px;
                    left: 4px;
                }

                select {
                    height: 30px;
                    padding: 0 0 0 8px;
                    cursor: pointer;
                }
            }

            &-time {
                &-fields-container {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                }
            }

            &-state {
                margin-right: 15px;

                select {
                    height: 30px;
                    padding: 0 0 0 8px;
                    cursor: pointer;
                }
            }

            &-category {
                margin-right: 15px;

                select {
                    height: 30px;
                    padding: 0 0 0 8px;
                    cursor: pointer;
                    max-width: 140px;
                }
            }

            &-executor-selected {
                height: 30px;
                display: flex;
                align-items: center;

                label {
                    font-size: 12px;
                    margin-right: 5px;
                }

                input {
                    margin-top: 2px;
                }
            }
        }

        &-selected {
            display: flex;
            justify-content: space-between;
            align-items: center;

            &-values {
                color: $text-color-02;
                font-size: 12px;

                div {
                    display: inline-block;
                    border-radius: 10px;
                    padding: 0 15px 0 7px;
                    background-color: #105e8f;
                    border: 1px solid #105e8f;
                    color: $text-color-01;
                    margin: 0 5px;

                    span {
                        cursor: pointer;
                    }
                }
            }

            &-clear {
                color: $text-color-03;
                text-decoration: underline;
                cursor: pointer;
                display: flex;
                align-items: center;
            }

            &-clear img {
                position: relative;
                top: 2px;
                height: 20px;
                width: 20px;
            }
        }

        .button-close {
            position: relative;

            &:after {
                content: "";
                background-image: url("../../assets/images/cross.svg");
                background-repeat: no-repeat;
                background-size: contain;
                position: absolute;
                top: -2px;
                right: -14px;
                height: 20px;
                width: 20px;
            }
        }
    }

</style>
