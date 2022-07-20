<template>
    <div class="image-modal">
        <div class="image-modal-header">
            <h3>{{ image.name }}</h3>
            <div class="image-modal-header-close" @click="close()"></div>
        </div>
        <div class="image-modal-body">
            <img class="image-modal-image"
                 :src="image.content"
                 alt="image.name" />
        </div>
    </div>
</template>

<script>
	export default {
		name: 'error-modal',
		props: {
			image: { default: Object },
		},
		data() {
			return {};
		},
		methods: {
			close() {
				this.$emit('close');
			},
		},
	};
</script>

<style scoped lang="scss">
    .image-modal{
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #0f426b;
        color: white;
        border: 1px solid #0f426b;
        padding: 10px;
        height: 100%;
        width: 100%;
        &-header{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 5px;
            width: 100%;
            min-height: 40px;
            border-bottom: 1px solid #105e8f;
            margin-bottom: 20px;
            &-close
            {
                position: relative;
                height: 18px;
                width: 18px;
                cursor: pointer;
                &:after{
                    content: "";
                    background-image: url("../../assets/images/cross.svg");
                    background-repeat: no-repeat;
                    position: absolute;
                    top: 0;
                    right: 0;
                    height: 18px;
                    width: 18px;
                }
            }
        }
        &-body{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        &-image {
            width: 90%;
            height: auto;
        }

    }
</style>
