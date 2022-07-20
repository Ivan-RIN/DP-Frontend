<template>
    <div class="reports-page-header">
        <div class="reports-page-header-item">
            <div class="reports-page-header-item-title operator">Операторы</div>
            <div class="reports-page-header-item-legend">
                <div class="reports-page-header-item-legend-opened">
                    <div class="reports-page-header-item-legend-opened-title">
                        Выполнено
                    </div>
                    <div class="block"></div>
                </div>
                <div class="reports-page-header-item-legend-closed">
                    <div class="reports-page-header-item-legend-closed-title">
                        Поставлено
                    </div>
                    <div class="block"></div>
                </div>
            </div>
        </div>
        <div class="reports-page-header-item">
            <div class="reports-page-header-item-title department">Цеха</div>
            <div class="reports-page-header-item-legend">
                <div class="reports-page-header-item-legend-opened">
                    <div class="reports-page-header-item-legend-opened-title">
                        Выполнено
                    </div>
                    <div class="block"></div>
                </div>
                <div class="reports-page-header-item-legend-closed">
                    <div class="reports-page-header-item-legend-closed-title">
                        Поставлено
                    </div>
                    <div class="block"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		name: 'reportPageHeaderComponent',
		data() {
			return {};
		},
		computed: {
		},
		methods: {

		},
	};
</script>


<style scoped lang="scss">
    @import "../../assets/styles/main";

    .reports-page-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 25px;
        &-item{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 50%;
            padding: 0 100px;
            &-title{
                &.operator{
                    position: relative;
                    &:before{
                        content: "";
                        background-image: url("../../assets/images/account-group.svg");
                        background-repeat: no-repeat;
                        position: absolute;
                        top: -6px;
                        left: -30px;
                        height: 20px;
                        width: 30px;
                    }
                }
                &.department{
                    position: relative;
                    &:before {
                        content: "";
                        background-image: url("../../assets/images/factory.svg");
                        background-repeat: no-repeat;
                        position: absolute;
                        top: -7px;
                        left: -30px;
                        height: 24px;
                        width: 23px;
                    }
                }
            }
            &-legend {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                &-opened {
                    color: #71a171;
                    padding: 0 5px;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-end;
                    div.block {
                        width: 30px;
                        height: 10px;
                        background-color: #71a171;
                        border-radius: 3px;
                        margin-bottom: 3px;
                        margin-left: 3px;
                    }
                }
                &-closed {
                    color: #a8aeb4;
                    padding: 0 5px;
                    margin-left: 5px;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-end;
                    div.block {
                        width: 30px;
                        height: 10px;
                        background-color: #a8aeb4;
                        border-radius: 3px;
                        margin-bottom: 3px;
                        margin-left: 3px;
                    }
                }
            }
        }
    }
</style>
