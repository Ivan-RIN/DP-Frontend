<template>
	<div class="app-footer">
		<span>
		© АО «Газпромнефть-ННГ», 2019<br/>
		629807, Российская Федерация, Тюменская обл.,<br/>
		ЯНАО, г.Ноябрьск, ул.Ленина, д.59/87
		</span><br>
		<span class="phone">Телефон службы поддержки: <span style="color: #1e90ea">8888</span></span><br>
    <span class="phone">E-mail службы поддержки: <a style="color: #1e90ea" href="mailto:helpdesk@gazprom-neft.ru">helpdesk@gazprom-neft.ru</a></span><br>
    <span class="phone">Портал самообслуживания: </span><a style="color: #1e90ea" href="http://selfservice.gazprom-neft.local/">http://selfservice.gazprom-neft.local/</a>
		<div class="front-version">
			Front-version {{version}}
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default
	{
		name: 'app-footer',
		computed:
			{
				...mapGetters(['version']),
			},
	};
</script>

<style scoped lang="scss">

	@import "../assets/styles/main";

	.app-footer
	{
		position: relative;
		border-top: solid 2px $line-color;
		padding-top: 20px;
	}
	.front-version
	{
		position: absolute;
		font-size: 10px;
		bottom: 0;
		right: 0;
		width: 80px;
		border: none;
	}
</style>
