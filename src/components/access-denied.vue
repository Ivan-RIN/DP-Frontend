<template>
    <dp-modal>
        <template slot="body">
            <div class="text-center">
                <img src="@/assets/images/noaccess.svg"
                     width="64"
                     height="64"
                     alt="Доступ запрещен" />
                <h4 class="pt-5">Ваша роль не позволяет произвести данное действие</h4>
            </div>
        </template>
        <template slot="footer"><span></span></template>
    </dp-modal>
</template>

<script>
    export default {
        name: 'access-denied',
    };
</script>
