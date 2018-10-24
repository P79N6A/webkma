'use strict';

/**
 * @ngdoc service
 * @name managementApp.messenger
 * @description
 * # messenger
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('messenger', ["$rootScope", "$timeout", function ($rootScope, $timeout) {
      var self = this;
      Messenger.options = {
          extraClasses: 'messenger-fixed messenger-on-top',
          theme: 'future'
      }

      var _postMessage = function (message, type) {
          Messenger().post({
              message: message,
              type: type,
              showCloseButton: true,
              hideAfter: 3
          });
      }

      self.success = function (message) {
          _postMessage(message, "success");
      }

      self.error = function (message) {
          _postMessage(message, "error");
      }

      self.info = function (message) {
          _postMessage(message, "info");
      }

      self.confirm = function (message, callback) {
          var _$template = $("<div id=\"confirm-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\">\
                                  <div class=\"modal-dialog\">\
                                      <div class=\"modal-content\">\
                                          <div class=\"modal-body\">\
                                          </div>\
                                          <div class=\"modal-footer\">\
                                              <div class=\"text-right\">\
                                                  <button id=\"btnOK\" type=\"button\" class=\"btn btn-primary\">确认</button>\
                                                  <button id=\"btnCancel\" type=\"button\" class=\"btn btn-default\">取消</button>\
                                              </div>\
                                          </div>\
                                      </div>\
                                  </div>\
                              </div>");

          _$template.find(".modal-body").html(message);

          _$template.find("#btnOK").click(function () {
              $timeout(function () {
                  callback(true);
              });
              _$template.modal("hide");
          });

          _$template.find("#btnCancel").click(function () {
              $timeout(function () {
                  callback(false);
              });
              _$template.modal("hide");
          });

          $("body").append(_$template);
          _$template.modal("show");

          _$template.on("hidden.bs.modal", function () {
              $("#confirm-modal").remove();
          });
      }


      $.extend(true, window.KEM, {
          utils: {
              messenger: self
          }
      });
  }]);
