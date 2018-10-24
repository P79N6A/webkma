// 这是一个例子，在这里存放常量对象
let config = global.require('./config/system-config')

module.exports = Object.freeze({
    // 删除
    delete: {
        //已删除
        isDelete: -1,
        //未删除
        notDelete: 0
    },
    // 状态
    state: {
        // 禁用
        disable: 1,
        // 正常
        normal: 0
    },
    // 分派状态
    distribution: {
        // 撤销
        undo: 0,
        // 分派
        dispatch: 1
    },
    // 分派范围
    range: {
        // 全部
        all: 0,
        // 指定
        specify: 1
    }
})