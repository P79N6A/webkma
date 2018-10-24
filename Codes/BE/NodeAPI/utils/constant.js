'use strict';

class util {
    static getEnumKey(source, value) {
        for (const key in source) {
            if (source[key] == value) return key;
        }
    }
}

module.exports = util;
