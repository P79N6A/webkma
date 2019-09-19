let statTabsWidth = function(self) {
  self.createSelectorQuery().select('.navbar').fields({
    size: true,
  }, (box) => {
    if (!box) return;
    self.data.itemWidth = box.width / self.properties.tabs.length;
    self.data.activeIndex = self.properties.tabs.findIndex(item => {
      return item.key == self.properties.activeTab
    });
    self.setData({
      itemWidth: self.data.itemWidth,
      activeIndex: self.data.activeIndex,
      sliderOffset: box.width / self.properties.tabs.length * self.data.activeIndex
    });
  }).exec();
}

Component({
  externalClasses: ['my-navbar', 'my-slider'],
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: Array,
    activeTab: String,
    color: {
      type: String,
      value: '#24d0c6'
    },
    lineColor: {
      type: String,
      value: '#24d0c6'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeIndex: 0,
    sliderOffset: 0
  },

  lifetimes: {
    ready() {
      statTabsWidth(this);
    }
  },

  ready() {
    statTabsWidth(this);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tabClick: function(e) {
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.dataset.index
      });
      this.triggerEvent("tabchange", this.properties.tabs.find(item => {
        return item.key == e.currentTarget.id
      }));
    }
  }
})