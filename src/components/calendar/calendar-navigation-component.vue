<template>
	<div class="calendar-navigation">
		<div @click="$emit('prev')">
			<img class="calendar-navigation-prev" src="../../assets/images/arrleft.svg" alt="">
		</div>
		<div class="calendar-navigation-content">{{dateFormatted}}</div>
		<div @click="$emit('next')">
			<img class="calendar-navigation-next" src="../../assets/images/arrright.svg" alt="">
		</div>
	</div>
</template>

<script>
	export default {
	    props: {
	        prev: { type: Function },
			next: { type: Function },
			date: {},
		},
	    data() {
	        return {
	            dateFormatted: undefined,
			};
		},
		watch: {
	      date(n) {
	          this.createFormattedDateText(n);
			},
		},
		created() {
            this.createFormattedDateText(this.date);
		},
		methods: {
			createFormattedDateText(newDate) {
			    const month = newDate.split('-');
                const date = new Date(month[0], parseInt(month[1], 10) - 1);
                this.dateFormatted = date.toLocaleDateString('ru-RU', {
                    year: 'numeric', month: 'long',
                });
			},
		},
    };
</script>

<style lang="scss">

	.calendar-navigation{
		display: flex;
		flex-direction: row;
		justify-content: center;
		&-prev {
			width: auto;
			height: 15px;
			transform: rotate(90deg);
			margin: 1px 10px 0 10px;
		}
		&-next {
			margin: 1px 10px 0 10px;
			width: auto;
			height: 15px;
			transform: rotate(-90deg);
		}
	}


</style>
