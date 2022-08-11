<template>
  <div class="header-content" v-if="isPageReady">
    <img alt="" src="../assets/images/logo.png">
    <nav>
      <div class="menu-container">
        <div class="menu-item">
          <router-link tag="span" to="/vm">Задачи ВУЭ</router-link>
        </div>
        <div class="menu-item">
          <router-link tag="span" to="/">
            <template v-if="$can('read', 'Tasks')">Задачи</template>
            <template v-else>Задачи&nbsp;(Рапорт)</template>
          </router-link>
        </div>
        <div class="menu-item" v-if="$can('read', 'Analytics')">
          <router-link tag="span" to="/report">Аналитика</router-link>
        </div>
        <div class="menu-item" v-if="$can('read', 'Dictionaries')">
          Справочники
          <div class="submenu-container" ref="dictsubmenu">
            <div class="submenu-container-line"></div>
            <div v-for="dict in dictionaryList"
                 :key="dict.id"
                 class="submenu-item"
                 :class="{ 'submenu-item-active': dict.isActive}"
                 @click="openDict(dict)"
                 v-if="dict.isVisible"
            >
              {{ dict.name }}
            </div>
          </div>
        </div>
        <div v-if="$can('read', 'AttachFacilities')"
             class="menu-item brigadeInFacilities"
             @click="showAttachBrigadeInFacilities">
          Закрепить объект
        </div>
        <div v-if="$can('read', 'AttachOperators')"
             class="menu-item brigadeInFacilities"
             @click="showAttachOperatorToBrigade">
          Персонал
        </div>
        <div v-if="$can('read', 'ChangeHistory')"
             class="menu-item tasksHistory">
          <router-link tag="span" to="/history">История задач</router-link>
        </div>
        <div v-if="$can('read', 'EventLog')"
             class="menu-item tasksHistory">
          <router-link tag="span" to="/event-log">Журнал событий</router-link>
        </div>
        <div class="menu-item">
          <a href="/РП-ЦП v.1.3.doc">Инструкция</a>
        </div>
      </div>
    </nav>
    <div class="profile-foto">
      <img :src="foto" @error="fotoError=true"/>
    </div>
    <div class="profile-fio">
      <span>{{ loginUser.name }}</span><br><br>
      <div class="user-role">{{ loginUser.roles[0].name }} / {{ loginUser.position }}</div>
    </div>
    <!--<div class="settings">-->
    <!--<img src="../assets/images/settings.png"  alt="settings"/>-->
    <!--Настройки-->
    <!--</div>-->
    <!--<div class="logout">-->
    <!--<img src="../assets/images/logout.png"  alt="logout"/>-->
    <!--Выйти-->
    <!--</div>-->
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
  name: 'app-header',
  computed: {
      foto() {
      if (!this.fotoError) {
        return 'https://mail.gazprom-neft.local/ews/Exchange.asmx/s/GetUserPhoto?size=HR64x64&email='
            + this.loginUser.email;
      }
      return stub_img;
    },
    ...mapGetters(['isLogin', 'loginUser']),
    ...mapGetters('dict', ['dictionaryList']),
  },
  data() {
    return {
      fotoError: false,
      isPageReady: false,
    };
  },
  methods: {
    // setAltImg() {
    // 	this.src = '../assets/images/photo_stub.jpeg';
    // },
    openDict(dict) {
      if (dict.isActive) {
        this.$router.push({name: 'dictionary', params: {dictId: dict.id}});
      }
      // console.log(this.$refs.dictsubmenu.style);
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
    padding-left: 40px;

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
