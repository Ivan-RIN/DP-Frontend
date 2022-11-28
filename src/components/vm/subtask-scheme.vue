<template>
	<div :style="{height: height + 'px', position: 'relative'}">
		<DtmTaskMiniboard v-for="node in ListTasks"
			:x="node.x" :y="node.y" :type="node.type" :h="node.h" :task="node.task"
        />
        <div class="type-states">
            <div style="padding: 2px 24px; font-weight: bold;">
                Состояния:
            </div>
            <div style="display: flex;">
                <div class="task-status" style="background-color: #FFFFFF; margin: 3px;"></div>
                <div style="padding: 1px 8px;">Планируется</div>
            </div>
            <div style="display: flex;">
                <div class="task-status" style="background-color: #E0E709; margin: 3px;"></div>
                <div style="padding: 1px 8px;">В работе</div>
            </div>
            <div style="display: flex;">
                <div class="task-status" style="background-color: #257A0D; margin: 3px;"></div>
                <div style="padding: 1px 8px;">Выполнено</div>
            </div>
            <div style="display: flex;">
                <div class="task-status" style="background-color: #D41717; margin: 3px;"></div>
                <div style="padding: 1px 8px;">Просрочено</div>
            </div>
            <div style="display: flex;">
                <div class="task-status" style="background-color: #F38F06; margin: 3px;"></div>
                <div style="padding: 1px 8px;">Отменено</div>
            </div>
        </div>
	</div>
</template>

<script>

import DtmTaskMiniboard from '@/components/vm/dtm-task-miniboard.vue';
import DtmTaskTree from '@/components/vm/dtm-task-tree.vue';

export default {
	name: 'subtask-scheme',

	components: {
		DtmTaskMiniboard,
		DtmTaskTree
	},
	props: {
		task: {
			type: Object
		},
		tasks: {
			type: Object
		}
	},
	data() {
		return {
            height: 0,
            level: -1,
            offsetX: 180,
            treeTasks: {},
			ListTasks:[]
		}
	},
	methods: {

        getTreeTasks(task, node) {
            node.task = task;
            node.type = node.task.parentTaskId ? 1 : 0;
            node.childs = [];
            for (let id in this.tasks) {
                let child = this.tasks[id];
                if (task.id == child.parentTaskId) {
                    var tree = {}
                    node.childs.push(tree);
                    this.getTreeTasks(child, tree);
                }
            }
            // if (!node.childs.length) {
            //     node.childs.push({
            //         task: task,
            //         type: 2,
            //         childs: []
            //     });
            // }
        },

        addTaskNodes(node, offset, par_level) {

            this.level++;
            let cur_level = this.level;
            let h = this.level - par_level;

            this.ListTasks.push({
                task: node.task,
                x: this.offsetX + offset,
                y: 200 * this.level,
                type: node.type,
                h: h == 1 ? 100 : h * 200 - 120
            })

            offset += 120;

            for (var i in node.childs) {
                this.addTaskNodes(node.childs[i], offset, cur_level);
            }
        },

        setHeightCanvas() {
            this.height = this.level * 200 + 220;
        }
    },

	mounted() {
        this.getTreeTasks(this.task, this.treeTasks);
		this.addTaskNodes(this.treeTasks, 0, 0);
        this.setHeightCanvas();
	}
};
</script>

<style scoped>

.type-states {
    position: absolute;
    border: 1px solid #ffffff;
    background-color: #10548A;
    padding: 5px 10px;
    left: 0px;
    top: 0px;
    width: 150px;
}

.task-status {
    width: 12px;
    height: 12px;
    border-radius: 100%;
    background-color: #ffffff;
    border: 1px solid #fff;
}

</style>
