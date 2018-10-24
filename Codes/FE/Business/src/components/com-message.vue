<template>
    <div>
        <transition name="fade">
            <div class="app-statusbar app-statusbar-top" :class="['app-statusbar-'+ messageData.type]" v-if="showMsg">
                <div class="app-statusbar-text">{{ messageData.msg }}</div>
                <div class="app-statusbar-close iconfont icon-close" @click="closeMsg"></div>
            </div>
        </transition>
    </div>
</template>
<script>
  import Vue from 'vue'
  import eventBus from '../utils/eventBus'
  let _emitFn = ( type, msg ) => {
    eventBus.$emit('eventMsg',{
      type: type,
      msg: msg
    })
  }
  Vue.prototype.myMessage = {
    info: ( msg ) => {
      _emitFn( 'info', msg );
    },
    success: ( msg ) => {
      _emitFn( 'success', msg );
    },
    error:  ( msg ) => {
      _emitFn( 'danger', msg );
    },
    warning: ( msg ) => {
      _emitFn( 'warning', msg );
    }
  };

  let data = {
    messageData:{
        msg: 'bxcbxcb',
        type: 'info'
    }, 
    showMsg: false
  }
  export default {
    data() {
      return data
    },
    mounted() {
      this.getEventData();
    },
    methods: {
      getEventData () { //获取来自列表的数据
        eventBus.$off('eventMsg').$on('eventMsg', (obj) => {
          this.$set(data, 'messageData', obj);
          this.showMsg = true;
          clearTimeout( this.autoClose );
          this.autoClose ();
        });
      },
      closeMsg () {//关闭msg
        this.showMsg = false;
        clearTimeout( this.autoClose );
      },
      autoClose () {
          return setTimeout(() => {
              this.showMsg = false;
          }, 2000);
      }
    }
  }
</script>
<style scoped>
.app-statusbar {
    position: fixed;
    bottom: 0px;
    width: 100%;
    padding: 10px;
    background: rgba(0, 0, 0, 0.9);
    display: none;
    z-index: 20;
    -webkit-box-shadow: -1px 0px 6px 0px rgba(0, 0, 0, 0.1);
    box-shadow: -1px 0px 6px 0px rgba(0, 0, 0, 0.1);
}
.app-statusbar.app-statusbar-top {
    bottom: auto;
    top: 0px;
}
.app-statusbar.app-statusbar-warning {
    background: rgba(246, 159, 0, 0.9);
}
.app-statusbar.app-statusbar-danger {
    background: rgba(240, 78, 81, 0.9);
}
.app-statusbar.app-statusbar-success {
    background: rgba(118, 171, 60, 0.9);
}
.app-statusbar.app-statusbar-info {
    background: rgba(79, 181, 221, 0.9);
}
.app-statusbar .app-statusbar-text {
    font-weight: 600;
    color: #FFF;
    float: left;
    padding-right: 30px;
    line-height: 40px;
}
.app-statusbar.app-statusbar-warning .app-statusbar-text, .app-statusbar.app-statusbar-warning .app-statusbar-close, .app-statusbar.app-statusbar-warning .app-statusbar-icon {
    color: #FFF;
}
.app-statusbar.app-statusbar-top {
    display: block;
    z-index: 10100;
}
.icon-close {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #fff;
  font-size: 14px;
}
.fade-enter-active {
  transition: all .5s ease;
}
.fade-leave-active {
  transition: all .5s ease;
}
.fade-enter {
    opacity: 0;
}
.fade-leave-active {
    opacity: 0;
}
.app-statusbar-text {
  width: 100%;
  text-align: center;
  float: none;
}
</style>

