const categories = {
  loading: {
    img: "https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/miniapp/cover-loading.png",
    text: "加载中"
  },
  empty: {
    img: "/images/cover-data-empty.png",
    text: "这里空空如也，小宝没有找到内容~"
  },
  "error-data": {
    img: "/images/cover-data-error.png",
    text: "抱歉，小宝有点开小差"
  },
  "error-network": {
    img: "https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/miniapp/cover-network-error.png",
    text: "网络异常"
  }
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String, // loading | empty | error-data | error-network
      value: "",
      observer(newVal, oldVal, changedPath) {
        this.getCategory(newVal);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    category: {}
  },

  lifetimes: {
    ready() {
      this.getCategory(this.properties.type);
    }
  },
  methods: {
    getCategory(key) {
      this.setData({
        category: categories[key] || {}
      });
    }
  }
})