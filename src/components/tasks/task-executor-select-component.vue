<template>
	<div class="task-executor">
		<div class="task-executor-header">
			назначить ответственного
			<div class="task-executor-header-close button-close" @click="closeForm()"></div>

		</div>
		<div class="line"></div>
		<div class="task-executor-content">
			<div class="task-executor-content-filter">
				<label for="task-executor-content-filter-search"></label>
				<input id="task-executor-content-filter-search" placeholder="ФИО" @input="filter($event.target.value)"/>
				<div class="lupa"></div>
			</div>
			<div class="task-executor-content-list">
				<label
					:for="`task-executor-content-list-${user.id}`"
					v-for="(user, index) in filteredOperators"
					v-bind:key="index"
					@click="setSelectItem(user)"
					:class="{'task-executor-content-list-item-select': selectUser.id === user.id,
					'task-executor-content-list-item': true}"
				>
					<input :id="`task-executor-content-list-${user.id}`"
					       type="radio"
					       name="executor"/>
					<!--{{user.login}}-->
					{{user.name}}
				</label>
			</div>
		</div>
		<div class="task-executor-footer">
			&nbsp;
			<div class="button" @click="save()">Назначить</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
  import apiTasks from '../../api/Tasks/tasks';

	export default {
		name: 'task-executor-select-component',
		data() {
			return {
				selectUser: {},
				filterText: '',
        test: [],
			};
		},
		props: ['task'],
		computed: {
      ...mapGetters('task', ['periodicType']),
      ...mapGetters('dict', ['dictionariesData']),
      filteredOperators() {
        return this.dictionariesData.operators.filter(e => ((this.filterText)
            ? (e.name.toUpperCase().indexOf(this.filterText.toUpperCase()) >= 0)
            : true));
      },
    },
		methods: {
      ...mapActions('dict', ['loadOperators']),
      closeForm() {
        this.$emit('close');
      },
      async save() {
        let response;
        this.$root.$emit('refreshTasks');

        if (this.selectUser && this.selectUser.id) {
          this.task.executorId = this.selectUser.id;
          response = await apiTasks.put(this.task.id, this.task);
          if (response.errorMessage) {
            this.$root.showModalError(response);
          } else {
            this.$emit('close');
          }
        } else {
          this.$root.showModalError({
            errorMessage: {
              title: 'Ошибка',
              message: 'Вы не выбрали ответственного',
            }
          });
        }
      },
      setSelectItem(user) {
        this.selectUser = user;
      },
      filter(event) {
        this.filterText = event;
      },
    },
		created() {
			this.loadOperators();
		},
	};
</script>

<style scoped lang="scss">
	@import "../../assets/styles/main";

	.task-executor
	{
		/*width: 100%;*/
		position: relative;
		background-color: $form-background-color;
		padding: 5px 0 20px 0;
		height: 500px;

		&-header
		{
			color: $text-color-01;
			text-transform: uppercase;
			padding: 20px;
			&-close
			{
				position: absolute;
				right: 10px;
				top: $default-margin;
				cursor: pointer;
				width: 25px;
				height: 25px;
				line-height: 25px;
				vert-align: middle;
				text-align: center;
			}
		}

		&-content
		{
			position: relative;
			/*margin: auto;*/
			/*width: 80%;*/
			padding: 0 $default-margin;

			&-filter> input
			{
				width: 350px;
				height: 30px;
			}
			.lupa
			{
				top: 7px;
				right: $default-margin;
			}

			&-list
			{
				width: 350px;
				height: 300px;
				overflow: auto;
				border: solid 1px $line-color;
				color: $text-color-01;
				padding: 5px 0;


/*
				&-item:nth-child(odd) {
					background-color: $form-background-color;
				}

				&-item:nth-child(even) {
					background-color: $content-background-color;
				}
*/
				&-item
				{
					padding: 5px 10px;
					display: inline-block;
					width: 100%;

					input {
						border: none;
						padding: 5px 0 0 0;
						height: 13px;
						cursor: pointer;
						font-size: 11px;
					}

				}
				&-item-select
				{
					background-color: $action-color;
				}
			}

		}

		&-footer
		{
			padding: 20px;
			.button {
				line-height: 28px;
			}
		}
		.button-close {
			&:after{
				content: "";
				background-image: url("../../assets/images/cross.svg");
				background-repeat: no-repeat;
				position: absolute;
				top: 3px;
				right: 10px;
				height: 18px;
				width: 18px;
			}
		}
	}

</style>
