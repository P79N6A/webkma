<template>
  <div class="dialog-wrap">
    <div class="dialog-mask" v-show="isShow"></div>
    <transition name="drop">
      <div class="dialog-content" :style="contentStyle" v-show="isShow" transiton="drop">
        <span class="icon-cross" v-if="!options.closeBtn" v-on:click="modalResponse('close')"></span>
        <div v-if=" !!options.title " style="background-color:rgba(0,0,0,.5)">
          <div class="content-hearder">
            <span>{{ options.title }}</span>
          </div>
        </div>
        <div class="content-body">
          <slot></slot>
        </div>
        <div class="content-footer">
          <button v-if="!!options.hasBtn" type="button" class="btn btn-primary" @click="modalResponse('check')">{{options.hasBtnTxt || '确定'}}</button>
          <button type="button" v-if="options.closeBtn" class="btn btn-default" @click="modalResponse('close')">{{options.closeBtnTxt || '关闭'}}</button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'v-dialog',
  props: {
    'options': {
      default: () => {
        return {}
      }
    },
    'isShow': {
      default: false
    }
  },
  data() {
    return {
      width: '400',
      height: 'auto',
    }
  },
  computed: {
    contentStyle(obj) {
      let width = parseInt(this.options.width) || parseInt(this.width),
        height = parseInt(this.options.height) || this.height;
      return {
        'width': width + 'px',
        'height': height,
        'margin': '30px 0 0 ' + (-width / 2) + 'px'
      }
    }
  },
  methods: {
    modalResponse(type) {
      this.$emit('modalResponse', { type: type });
    }
  }
}
</script>
<style scoped>
.btn {
  margin-left: 15px;
}

.drop-enter-active {
  transition: all .5s ease;
}

.drop-leave-active {
  transition: all .5s ease;
}

.drop-enter {
  transform: translateY(-500px);
}

.drop-leave-active {
  transform: translateY(-100px);
  opacity: 0;
}

.dialog-wrap {
  position: fixed;
  width: auto;
  height: auto;
  z-index: 99;
  top: 150px;
}

.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
}

.dialog-content {
  position: fixed;
  left: 50%;
  z-index: 101;
  background-color: #fff;
  /*border: 12px solid rgba(0,0,0,.5);*/
  box-shadow: 0px 3px 16px 5px rgba(0, 0, 0, .3);
}

.content-hearder {
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #24d0c6;
  font-size: 16px;
  color: #fff;
  font-weight: 400;
  font-weight: 600;
  border-radius: 5px 5px 0px 0px;
}

.icon-cross {
  display: block;
  position: absolute;
  right: 5px;
  top: 5px;
  color: #fff;
  opacity: 0.7;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
}

.content-body {
  width: 98%;
  max-height: 300px;
  overflow-y: auto;
  height: auto;
  padding: 10px;
  background-color: #fff;
  box-sizing: border-box;
  margin: 10px auto;
}

.content-footer {
  width: 98%;
  height: 80px;
  line-height: 80px;
  background-color: #fff;
  text-align: center;
}

.content-footer button{
  width:88px;
}

.content-footer .btn-primary {
  border-color: #60e7df;
  background-color: #60e7df;
}
</style>


