<template>
	<div>
		<dp-modal>
			<template slot="header">Добавить инициатора</template>
			<template slot="body">
				<div>
					{{ board }}
				</div>
			</template>
		</dp-modal>
	</div>
</template>

<script>

import DpModal from '@/components/vm/dp-modal';

export default {
	name: 'board-add-initiator',
	components: {
		DpModal
	},
	props: ['board'],
	data() {
		return {

		}
	}
};
</script>

<style scoped>

</style>
