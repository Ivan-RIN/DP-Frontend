<template>
    <div class="loading-mask">
        <v-progress-circular
                class="loading-mask-component"
                :size="70"
                :width="7"
                color="#2296f3"
                indeterminate
        ></v-progress-circular>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        methods: {
        },
    };
</script>

<style lang="scss">
    /*@import "./assets/styles/main";*/

    .loading-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        background-color: rgba(4, 39, 64, 0.5);
        &-component{
            position: absolute;
            top: 45%;
            left: 50%;
        }
    }
</style>
