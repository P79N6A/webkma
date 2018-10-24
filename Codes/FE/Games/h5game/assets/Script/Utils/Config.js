let config = {
    apiHost: "http://api.kma.dev.cn/"
}

if (window && window.config) {
    config = window.config;
}

module.exports = config;