// 这是一个例子，在这里存放常量对象

module.exports = Object.freeze({
    phone: /^((13[0-9])|(14[57])|(15[^4,\D])|(18[0-9])|(17[0-9]))\d{8}$/,
    businessName: /^[\u4e00-\u9fa5\[\]]{2,40}$/,
    name: /^[a-zA-Z\u4e00-\u9fa5]{2,10}$/
})