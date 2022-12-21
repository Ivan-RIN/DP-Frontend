<template>
	<div class="states" :style="{position: fixed ? 'fixed' : 'absolute', left: x+'px', top: y+'px'}">
		<div class="states-title">
			Состояния:
		</div>
		<div class="item-row">
			<div class="state-planned"></div>
			<div>Планируется</div>
		</div>
		<div class="item-row">
			<div class="state-inwork"></div>
			<div>В работе</div>
		</div>
		<div class="item-row">
			<div class="state-agreement"></div>
			<div>На согласовании</div>
		</div>
		<div class="item-row">
			<div class="state-completed"></div>
			<div>Выполнено</div>
		</div>
		<div class="item-row">
			<div class="state-overdue"></div>
			<div>Просрочено</div>
		</div>
		<div class="item-row">
			<div class="state-canceled"></div>
			<div>Отменено</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'dtm-states',
	props: {
		x: {
			type: Number,
			default: 0
		},
		y: {
			type: Number,
			default: 0
		},
		fixed: {
			type: Boolean,
			default: false
		}

	}
};

</script>

<style scoped>

.states {
	border: 1px solid #ffffff;
	background-color: #10548A;
	padding: 5px 10px;
	width: 170px;
}

.states-title {
	padding: 2px 24px;
	font-weight: bold;
}

.item-row {
	display: flex;
}

.item-row div:nth-child(1) {
	margin: 3px;
	width: 12px;
	height: 12px;
	border-radius: 100%;
	border: 1px solid #fff;
}

.item-row div:nth-child(2) {
	padding: 1px 8px;
}

/* Планируется - 1 */
.state-planned {
	background-color: #1A88DE;
}

/* Отклонено - 2 */
.state-rejected {
	background-color: #FFFFFF;
}

/* Отложено - 3 */
.state-postponed {
	background-color: #FFFFFF;
}

/* Утверждено - 4 */
.state-approving {
	background-color: #FFFFFF;
}

/* В работе - 5 */
.state-inwork {
	background-color: #E0E709;
}

/* Выполнено, Завершено - 6 */
.state-completed {
	background-color: #257A0D;
}

/* Просрочено - 7 */
.state-overdue {
	background-color: #D41717;
}

/* На согласовании (состояние задачи выполнено) - 8 */
.state-agreement {
	background-color: #F38F06;
}

/* Отменено - 9 */
.state-canceled {
	background-color: #858585;
}

</style>
