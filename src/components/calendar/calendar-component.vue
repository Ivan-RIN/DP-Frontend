<template>
    <v-layout>
        <calendar-navigation-component @prev="prev" @next="next" :date="focus"/>
        <v-flex>
            <v-sheet class="calendar-view" :height="calendarHeight">
                <v-calendar
                v-model="focus"
                class="calendar-main"
                ref="calendar"
                :locale="local"
                type="month"
                :weekdays="[1,2,3,4,5,6,0]"
                :events="events"
                :event-height="15"
                :event-color="setEventColor"
                @click:date="addTask($event)"
                @click:event="showEvent"
                @click:more="showList($event)">
                </v-calendar>
                <v-menu
                    v-model="selectedOpen"
                    :close-on-content-click="false"
                    content-class="calendar-view-modal-menu"
                    :position-x="setModalPositionX()"
                    :position-y="setModalPositionY()"
                    :close-on-click="true"
                    absolute
                  >
                    <v-card max-width="350" min-width="350" flat>
                        <v-card-title
                        v-html="selectedEvent.name"
                        dense="true">
                        </v-card-title>
                      <v-card-text>
                        <span>{{ checkCommentField(selectedEvent.details) }}</span>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn text color="#ffffff" @click="selectedOpen = false">
                          Закрыть
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
            </v-sheet>
        </v-flex>
    </v-layout>
</template>

<script>
    import { mapGetters } from 'vuex';
    import CalendarNavigationComponent from './calendar-navigation-component.vue';

    export default {
        name: 'calendar-component',
        components: { CalendarNavigationComponent },
        props:
            {
                // eslint-disable-next-line vue/require-valid-default-prop
                events: { type: Array, required: true, default: [] },
            },
        data() {
            return {
                month: 'month',
                local: 'ru',
                focus: undefined,
                selectedEvent: {},
                selectedElement: null,
                selectedOpen: false,
                calendarHeight: 600,
                contentWidth: 1366,
            };
        },
        created() {
            this.focus = this.filterState.dateFrom;
            this.$parent.getTasksForCalendar();
        },
        computed: {
            ...mapGetters('dict', ['taskStatus']),
	        ...mapGetters('task', ['filterState']),
        },
        methods: {
            setModalPositionX() {
                return (this.contentWidth / 3);
            },
            setModalPositionY() {
                return (this.calendarHeight / 3);
            },
            addTask(e) {
                const today = new Date();
                const options = {
                    date: e.date,
                };
	            today.setDate(today.getDate() - 1);
                if (e.date.localeCompare(today.toISOString().substring(0, 10)) >= 0) {
                    this.$parent.openAddTaskForm(options);
                } else {
                    this.$root.showModalError({
                        errorMessage: {
                            title: 'Недопустимое действие',
                            message: 'Создание задачи на прошедшие даты запрещено',
	                    },
                    });
                }
            },
            showList(event) {
                this.$store.commit('task/setDateFrom', event.date);
                this.$store.commit('task/setDateTo', event.date);
                this.$emit('showListFromCalendar');
            },
            setEventColor(input) {
                return this.taskStatus[input.state].calendarColor;
            },
            showEvent({ event }) {
                this.$parent.openEditTask(event.task);
            },
            checkCommentField(comment) {
                if (comment && comment.length > 0) {
                    return comment;
                }
                return 'Комментарии отсутствуют';
            },
            createMonthDates() {
                const date = this.focus.split('-');
                const dateFrom = new Date(date[0], date[1] - 1, 2).toISOString().substring(0, 10);
                const dateTo = new Date(date[0], date[1], 1).toISOString().substring(0, 10);
                return { dateFrom, dateTo };
            },
            prev() {
                this.$refs.calendar.prev();
                const dates = this.createMonthDates();
                this.$store.commit('task/setDateFrom', dates.dateFrom);
                this.$store.commit('task/setDateTo', dates.dateTo);
                this.$parent.getTasksForCalendar();
            },
            next() {
                this.$refs.calendar.next();
                const dates = this.createMonthDates();
                this.$store.commit('task/setDateFrom', dates.dateFrom);
                this.$store.commit('task/setDateTo', dates.dateTo);
                this.$parent.getTasksForCalendar();
            },
        },
    };
</script>

<style lang="scss">
    // @import "../../assets/styles/main";
    .layout{
        display: flex;
        flex-direction: column;
    }
    .calendar-view {
        background-color: #042740;
        border: none;
        position: relative;
        .calendar-view-modal-menu{
            .v-card{
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                outline: 0.5px solid #10548a;
                background-color: #042740;
                .v-card__title {
                    background-color: #10548a;
                    color: #fff;
                    padding: 10px 10px 10px 18px;
                }
                .v-card__text{
                    margin-top: 20px;
                    min-height: 100px;
                    span{
                        color: #ffffff;
                    }
                }
                .v-card__actions{
                    position: relative;
                    bottom: 0;
                    .v-btn {
                        background-color: #10548a;
                        border-radius: 10px;
                        bottom: 0;
                        font-size: 10px;
                        margin-bottom: 5px;
                        margin-left: 5px;
                        height: 30px;
                    }
                }
            }
        }
        .calendar-main.v-calendar-monthly {
            margin-top: 20px;
            background-color: #042740;
            padding-bottom: 20px;
            border: none;

            .v-calendar-weekly__head {
                .v-calendar-weekly__head-weekday {
                    outline: 0.5px solid #10548a;
                    border: none;
                    padding: 10px 0;
                    background-color: #0d304b;
                    color: #ffffff;
                    font-size: 10px;
                    .v-present {
                        color: rgb(34, 150, 243);
                    }
                }
            }
            .v-calendar-weekly__week {
                .v-calendar-weekly__day {
                    outline: 0.5px solid #10548a;
                    border: none;
                    background-color: #042740;
                    &.v-future, &.v-past{
                        .v-calendar-weekly__day-label {
                            text-align: right;
                            .v-btn {
                                font-size: 10px;
                                right: 30px;
                                top: 0;
                                background-color: initial;
                                color: #ffffff;
                                height: 20px;
                                width: 20px;
                            }
                        }
                    }
                    &.v-present {
                        .v-calendar-weekly__day-label {
                            text-align: right;
                        }
                        .v-btn {
                            background-color: #105e8f;
                            right: 30px;
                            height: 20px;
                            width: 20px;
                            color: #ffffff;
                            font-size: 10px;
                        }
                    }
                    .v-event{
                        background-color: #0d304b;
                        border-radius: 5px;
                        color: #000;
                        padding-left: 5px;
                        margin-left: 3.5px;
                    }
                    .v-event-more {
                        background-color: #0d304b;
                        border-radius: 5px;
                        padding-left: 5px;
                        margin-left: 3.5px;
                        color: #fff !important;
                    }
                    &.v-outside {
                        .v-btn {
                            .v-btn__content {
                                color: #042740;
                            }
                        }
                    }
                }
            }
        }
    }


</style>
