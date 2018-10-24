'use strict';

/**
 * @ngdoc service
 * @name managementApp.tagListService
 * @description
 * # tagListService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('demoListService', ["$http", function ($http) {
      var self = this;

      self.getList = function (options, callback) {
          //todo: 调用接口
          callback({
              data: [
                  { "code": "AAC", "company": "AUSTRALIAN AGRICULTURAL COMPANY LIMITED.", "price": "$1.7", "change": -0.01, "open": "$1.39", "high": "$1.39", "low": "", "volume": "9,395" },
                  { "code": "AAC", "company": "AUSTRALIAN AGRICULTURAL COMPANY LIMITED.", "price": "$1.7", "change": -0.01, "open": "$1.39", "high": "$1.39", "low": "", "volume": "9,395" },
                  { "code": "AAC", "company": "AUSTRALIAN AGRICULTURAL COMPANY LIMITED.", "price": "$1.7", "change": -0.01, "open": "$1.39", "high": "$1.39", "low": "", "volume": "9,395" },
                  { "code": "AAC", "company": "AUSTRALIAN AGRICULTURAL COMPANY LIMITED.", "price": "$1.7", "change": -0.01, "open": "$1.39", "high": "$1.39", "low": "", "volume": "9,395" },
                  { "code": "AAC", "company": "AUSTRALIAN AGRICULTURAL COMPANY LIMITED.", "price": "$1.7", "change": -0.01, "open": "$1.39", "high": "$1.39", "low": "", "volume": "9,395" },
                  { "code": "AAC", "company": "AUSTRALIAN AGRICULTURAL COMPANY LIMITED.", "price": "$1.7", "change": -0.01, "open": "$1.39", "high": "$1.39", "low": "", "volume": "9,395" },
                  { "code": "AAC", "company": "AUSTRALIAN AGRICULTURAL COMPANY LIMITED.", "price": "$1.7", "change": -0.01, "open": "$1.39", "high": "$1.39", "low": "", "volume": "9,395" },
                  { "code": "AAC", "company": "AUSTRALIAN AGRICULTURAL COMPANY LIMITED.", "price": "$1.7", "change": -0.01, "open": "$1.39", "high": "$1.39", "low": "", "volume": "9,395" },
                  { "code": "AAC", "company": "AUSTRALIAN AGRICULTURAL COMPANY LIMITED.", "price": "$1.7", "change": -0.01, "open": "$1.39", "high": "$1.39", "low": "", "volume": "9,395" },
                  { "code": "AAC", "company": "AUSTRALIAN AGRICULTURAL COMPANY LIMITED.", "price": "$1.7", "change": -0.01, "open": "$1.39", "high": "$1.39", "low": "", "volume": "9,395" },
                  { "code": "AAC", "company": "AUSTRALIAN AGRICULTURAL COMPANY LIMITED.", "price": "$1.7", "change": -0.01, "open": "$1.39", "high": "$1.39", "low": "", "volume": "9,395" },
                  { "code": "AAC", "company": "AUSTRALIAN AGRICULTURAL COMPANY LIMITED.", "price": "$1.7", "change": -0.01, "open": "$1.39", "high": "$1.39", "low": "", "volume": "9,395" }
              ],
              totalCount: 1000
          });
      }
  }]);
