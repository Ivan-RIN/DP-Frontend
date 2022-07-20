<template>
	<div class="error-modal">
		<div class="error-modal-header">
			<div class="error-modal-header-close" @click="close()"></div>
		</div>
		<div class="error-modal-body">
			<img class="error-modal-body-icon"
			     :src="icon"
			     width="64"
			     height="64"
			     alt="Ошибка" />
			<div class="error-modal-body-title">{{title}}</div>
			<div class="error-modal-body-message">{{message}}</div>
		</div>
	</div>
</template>

<script>
    import noaccessLogo from '../../assets/images/noaccess.svg';
    import okLogo from '../../assets/images/ok_icon.svg';

    export default {
      name: 'error-modal',
		  props: {
        response: { default: Object },
		  },
		  data() {
        return {
          title: 'Ошибка',
				  message: 'Неизвестная ошибка',
          icon: noaccessLogo,
			  };
		  },
		  created() {
			  this.getErrorBody();
		  },
		  methods: {
        close() {
          this.$emit('close');
			  },
			  getErrorBody() {
          if (!this.$root.isEmpty(this.response)) {
            if (this.response.errorMessage.title === 'Успешно') {
              this.icon = okLogo;
            }
            if (this.response.errorMessage && this.$root.isObject(this.response.errorMessage)) {
						  if (this.response.errorMessage.error) {
                this.message = this.response.errorMessage.error;
              } else {
                this.message = this.response.errorMessage.message;
						  }
              this.title = this.response.errorMessage.title;
              return;
            }
            if (this.$root.isObject(this.response)) {
						  if (this.$root.isString(this.response.errorMessage)) {
							  this.message = this.response.errorMessage;
						  }
              if (this.response.attached && this.response.attached.length > 0) {
                this.response.attached.forEach((item) => {
                  this.message += `${item.facility.name} в ${item.brigade.name}.`;
                });
              }
            }
          }
        },
		  },
    };
</script>

<style scoped lang="scss">
	.error-modal{
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
			justify-content: flex-end;
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
		&-body {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			&-icon{
				margin-bottom: 20px;
			}
			&-title {
				font-size: 16px;
				font-weight: bold;
				margin-bottom: 10px;
			}
			&-message {
				font-size: 12px;
			}
		}

	}
</style>
