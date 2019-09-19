
<template>
    <div data-scroll-warp style="position:relative;overflow: hidden;" :style="styleValue">
        <slot></slot>
    </div>
</template>

<script>
import IScroll from "../../bower_components/iscroll/build/iscroll";
import eventBus from "../utils/eventBus";
export default {
  name: "CustomScroll",
  componentName: "CustomScroll",
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    height: {
      type: [String, Number],
      default: "100%"
    },
    width: {
      type: [String, Number],
      default: "100%"
    },
    refresh: {
      type: String,
      default: "refreshScroll"
    }
  },
  computed: {
    styleValue() {
      return `height:${
        typeof this.height === "number" ? this.height + "px" : this.height
      };width:${
        typeof this.width === "number" ? this.width + "px" : this.width
      }`;
    }
  },
  mounted() {
    let self = this;
    let opts = Object.assign(
      {
        scrollX: false,
        scrollY: true,
        scrollbars: true,
        mouseWheel: true,
        interactiveScrollbars:true,
        click: false,
        disableMouse:true,
        disablePointer:true
      },
      this.options
    );
    self.scroller = new IScroll(self.$el, opts);
    self.scroller.on("scrollEnd", function() {
      if (
        (!!opts.scrollX && Math.abs(this.maxScrollX - this.x) < 50) ||
        (!!opts.scrollY && Math.abs(this.maxScrollY - this.y) < 50)
      ) {
        return self.$emit("scroll-end");
      }
    });
    eventBus.$on(self.refresh, this.refreshScroller);
  },
  methods: {
    refreshScroller(opts) {
      this.scroller.options = Object.assign(this.scroller.options, opts || {});
      this.scroller.refresh();
    }
  },
  beforeDestroy() {
    eventBus.$off(this.refresh, this.refreshScroller);
    this.scroller.destroy();
    this.scroller = null;
  }
};
</script>

