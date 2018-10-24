module.exports = Object.freeze({
    // 模板类型
    type: {
        // 模板(供用户选择使用)
        template: 1,
        // 稿件(用户创建的草稿)
        draft: 2,
        // 推广(已发布的草稿)
        release: 3
    },
    // 终端类型
    terminal: {
        pc: 1,
        wap: 2
    },
    name: {
        default: '未命名素材'
    },
    // 标签类型
    tag: {
        // 系统标签
        system: 1,
        // 用户标签
        user: 2
    },
    // 删除
    delete: {
        //已删除
        isDelete: -1,
        //未删除
        notDelete: 0
    },
    // 启用禁用
    enable: {
        // 临时
        temporary: -1,
        //启用
        enable: 1,
        //禁用
        disable: 0
    },
    // 分发属性
    distribution: {
        // 公有
        public: 0,
        // 私有
        private: 1
    },
    // 分发操作
    distributionType: {
        // 撤销
        undo: 0,
        // 分派
        dispatch: 1
    }
})