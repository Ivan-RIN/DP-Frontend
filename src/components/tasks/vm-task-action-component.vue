<template>
    <div class="tasks-action">
        <div class="tasks-action-space"></div>
        <div class="tasks-action-add" @click="openAddTaskForm">
            <img src="@/assets/images/add_icon.svg" alt="">
            <span>Добавить задачу</span>
        </div>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex';
    import searchIcon from '../common/search-icon-component.vue';
    import combobox from '../common/combobox.vue';

    export default {
        name: 'vm-task-action-component',
        data() {
            return {
                groupStatus: undefined,
                filterStatus: 2,
                value: '',
            };
        },
        components: {
            searchIcon,
            combobox
        },
        computed:
            {
                ...mapGetters('dict', ['taskStatus']),
                taskStatusGroup() {
                    return this.taskStatus.filter(e => e.id > 0);
                },
            },
        methods: {
            openAddTaskForm() {
                this.$emit('add');
            }
        },
    };
</script>

<style scoped lang="scss">
    @import "../../assets/styles/main";

    .tasks-action {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;
        justify-content: space-between;
        line-height: 30px;
        padding: 0 20px;

        &-select {
            flex: 0 0 70px;
        }

        &-select2 {
            justify-content: center;

            select {
                height: 30px;
                padding: 0 0 0 8px;
                cursor: pointer;
                width: 160px;
                line-height: 12px;
            }

        }

        &-filter-new select {
            height: 30px;
            padding: 0 0 0 8px;
            cursor: pointer;
            width: 160px;
            line-height: 12px;
        }

        &-apply {
            margin: 0 10px;
            @extend %button;
            border: 1px solid $action-color;
            line-height: 26px;
            height: 30px;
        }

        &-space {
            flex: 1 1 auto;
        }

        &-add {
            @extend %button;
            display: flex;
            flex-direction: row;

            img {
                margin-right: 5px;
            }
        }

        &-search {
            position: relative;

            input {
                height: 30px;
                font-size: 11pt;
                padding: 0 0 0 8px;
                cursor: pointer;
                width: 160px;
            }

            .search {
                position: absolute;
                width: 20px;
                height: 20px;
                right: 6px;
                top: 6px;
            }
        }
    }
</style>
