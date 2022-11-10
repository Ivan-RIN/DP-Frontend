<template>
  <div class="header-content" v-if="isPageReady">
    <img alt="" src="../assets/images/logo.png">
    <nav style="min-width: 500px;">
      <div class="menu-container" v-if="isAlive">
        <div class="menu-item">
          <a href="/">Задачи</a>
        </div>
        <div class="menu-item">
          <a href="/dtm">ВУЭ</a>
        </div>
        <div class="menu-item">
          <a href="/docs/РП-ЦП v.1.3.doc">Инструкция</a>
        </div>
      </div>
    </nav>
    <div class="profile-foto">
      <img :src="foto" @error="fotoError=true"/>
    </div>
    <div class="profile-fio" v-if="isAlive">
      <span>{{ currentUser.name }}</span><br><br>
      <div class="user-role">{{ currentUser.post }}</div>
    </div>
  </div>
  <div class="header-content" v-else>
    <img src="@/assets/images/logo.png" alt="logo">
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import attachBrigadeFormModal from './modals/attach-brigade-to-facilities-form.vue';
import attachOperatorFormModal from './modals/attach-operator-to-brigade-form.vue';
import stub_img from '../assets/images/photo_stub.jpeg';

export default {
  name: 'app-header-dtm',
  computed: {
      foto() {
      if (this.currentUser && !this.fotoError) {
        return 'https://mail.gazprom-neft.local/ews/Exchange.asmx/s/GetUserPhoto?size=HR64x64&email='
            + this.currentUser.email;
      }
      return stub_img;
    },
    ...mapGetters(['isLogin', 'loginUser', 'isAlive']),
    ...mapGetters('vm', ['currentUser']),
  },
  data() {
    return {
      fotoError: false,
      isPageReady: false,
    };
  },
  methods: {
    openDict(dict) {
      if (dict.isActive) {
        this.$router.push({name: 'dictionary', params: {dictId: dict.id}});
      }
    },
    showAttachBrigadeInFacilities() {
      this.$modal.show(attachBrigadeFormModal, {}, {height: 800, width: 800, clickToClose: false});
    },
    showAttachOperatorToBrigade() {
      this.$modal.show(attachOperatorFormModal, {}, {height: 400, width: 800, clickToClose: false});
    },
  },
  mounted() {
    this.$bus.$on('isPageReady', () => {
      this.isPageReady = true;
    });
  },
};
</script>


<style scoped lang="scss">
@import "../assets/styles/main";


.header-content {
  padding-top: 15px;
  display: flex;

  nav {
    height: 100%;
    flex: 1 1 auto;
    padding-left: 15px;

    .menu-container {
      position: absolute;
      bottom: 0;
      display: inline;
      color: $menu-color;

      .menu-item {
        position: relative;
        display: inline-block;
        /*height: 30px;*/
        /*line-height: 40px;*/
        padding: 0 10px 20px 10px;
        cursor: pointer;

        a:link {
          text-decoration: none;
          color: inherit;
        }

        a:visited {
          text-decoration: none;
          color: inherit;
        }

        span {
          cursor: pointer;
        }

        .submenu-container {
          /*color: white;*/
          background-color: #0f426b; //#005a92;
          padding: 20px;
          position: absolute;
          top: 38px;
          left: 0;
          width: 400px;
          display: none;
          cursor: auto;

          .submenu-item {
            color: $text-color-02;
            margin: 10px 0;
          }

          .submenu-item-active {
            color: $text-color-01;
            cursor: pointer;
          }

          &-line {
            position: absolute;
            top: -2px;
            height: 2px;
            left: 0;
            width: 110px;
            background-color: $menu-color;
          }

          &:hover {
            display: block;
          }
        }

        &:hover {
          .submenu-container {
            display: block;
          }

        }
      }
    }
  }

  .profile-foto {
    /*margin-top: 15px;*/
    border-radius: 50%;
    /*border: solid 1px white;*/
    width: 50px;
    height: 50px;
    flex: 0 0 50px;
    overflow: hidden;
    // background-image: url(../assets/images/photo_stub.jpeg);

    img {
      width: 50px;
      height: 50px;
    }
  }

  .profile-fio {
    padding: 5px 0 0 10px;
    flex: 0 0 100px;
    font-size: 11px;

    .user-role {
      width: 200px;
    }
  }

  %headercontroll {
    color: #1e90ea;
    text-align: center;

    img {
      margin-bottom: 5px;
    }
  }

  .settings {
    @extend %headercontroll;
    flex: 0 0 70px;
  }

  .logout {
    @extend %headercontroll;
    flex: 0 0 55px;
  }

}

</style>
