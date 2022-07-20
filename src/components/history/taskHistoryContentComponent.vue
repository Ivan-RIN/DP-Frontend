<template>
    <div class="task-history">
        <div class="task-history-header">
            <div class="task-history-header-taskId">Номер задачи</div>
            <div class="task-history-header-date">Дата изменения</div>
            <div class="task-history-header-editor">Автор изменений</div>
            <div class="task-history-header-properties">Измененные данные</div>
        </div>
        <div class="task-history-content" v-for="(change, changeIndex) in taskHistory" v-bind:key="changeIndex">
            <div class="task-history-content-taskId">{{ change.id }}</div>
            <div class="task-history-content-date">{{ change.date }}</div>
            <div class="task-history-content-editor">{{ change.editor }}</div>
            <div class="task-history-content-properties">
                <div class="task-history-content-properties-container"
                     v-for="(item, itemIndex) in change.changes"
                     v-bind:key="itemIndex">
                        <div class="task-history-content-properties-container-title">{{item.title}}
                        </div>
                        <div class="task-history-content-properties-container-value"
                             v-html="item.value"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

	import { mapGetters } from 'vuex';
	import apiCriterions from '../../api/PerformanceCriterions/performanceCriterions';

	export default {
		name: 'task-history-content-component',
		props: ['taskHistory'],
		computed: {
			...mapGetters('dict', ['dictionariesData', 'taskStatus']),
            ...mapGetters('history', ['historyFilterState']),
		},
		watch: {},
		data() {
			return {
				performanceCriterions: [],
			};
		},
		methods: {},
		async created() {
			this.performanceCriterions = await apiCriterions.get();
		},
	};
</script>


<style scoped lang="scss">
    @import "../../assets/styles/main";

    .task-history {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        background-color: #0E3E64;
        font-family: DIN-Pro-regular,serif;
        font-size: 12px;
        &-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 25px;
            margin: 10px 0 0 0;
            background-color: #255985;
            font-size: 11px;

            &-taskId {
                margin: 0 0 0 14px;
                min-width: 75px;
            }

            &-date {
                min-width: 177px;
                margin: 0 0 0 14px;
            }
            &-editor {
                min-width: 330px;
            }
            &-properties {
                display: flex;
                flex-direction: column;
            }
        }
        &-content {
            display: flex;
            flex-direction: row;
            border-bottom: 1px solid #255985;
            color: #A8BDCE;
            padding: 8px 0 9px 0;

            &-taskId {
                margin: 0 0 0 14px;
                min-width: 75px;
            }
            &-date {
                min-width: 177px;
                margin: 0 0 0 14px;
            }
            &-editor {
                min-width: 150px;
            }
            &-properties {
                display: flex;
                flex-direction: column;
                &-container {
                    display: flex;
                    flex-direction: row;

                    &-title {
                        text-align: right;
                        min-width: 170px;
                        margin-right: 10px;
                        font-weight: bold;
                    }

                    &-value {
                        position: relative;
                        display: flex;
                        flex-direction: row;
                        width: 750px;
                    }
                }
            }
            &-nochanges {
                margin: 0 0 0 160px;
            }
            .status {
                position: relative;
                top: 2px;
                margin-right: 5px;
                border-radius: 50%;
                width: 12px;
                height: 12px;
                background-color: white;
            }
        }
    }
</style>
