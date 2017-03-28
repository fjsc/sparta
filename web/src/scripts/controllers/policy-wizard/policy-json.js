/*
 * Copyright (C) 2015 Stratio (http://stratio.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  /*POLICY CREATION AND EDITION CONTROLLER*/
  angular
    .module('webApp')
    .controller('PolicyJsonCtrl', PolicyJsonCtrl);

  PolicyJsonCtrl.$inject = ['TemplateFactory', '$q', 'PolicyModelFactory', 'PolicyService', 'ModalService', 'PolicyFactory'];
  function PolicyJsonCtrl(TemplateFactory, $q, PolicyModelFactory, PolicyService, ModalService, PolicyFactory) {
    var vm = this;
    vm.init = init;
    vm.policy = {};
    vm.validateForm = validateForm;

    vm.init();

    function init() {
      return TemplateFactory.getPolicyJsonTemplate().then(function (template) {
        vm.template = template;
        console.log(template);
      });
    }

    function validateForm() {
       var defer = $q.defer();
      PolicyModelFactory.setPolicy(JSON.parse(vm.policy.json));
      if (PolicyModelFactory.isValidSparkStreamingWindow()) {
        defer = sendPolicy();
      } else {
        PolicyModelFactory.setError("_ERROR_._4007_", "error");
        defer.reject();
      }
    }

    function sendPolicy() {
      var defer = $q.defer();
      var modalInstance = openConfirmPolicyModal();
      modalInstance.result.then(function () {
        savePolicy().then(function () {
          PolicyModelFactory.resetPolicy();
          $state.go("dashboard.policies");
          defer.resolve();
        }, function (error) {
          if (error) {
            PolicyModelFactory.setError("_ERROR_._" + error.data.i18nCode + "_", "error", error.data.subErrorModels);
          }
          defer.reject();
        });
      });
      return defer;
    }

    function openConfirmPolicyModal() {
      var templateUrl = "templates/modal/confirm-modal.tpl.html";
      var controller = "ConfirmModalCtrl";
      var resolve = {
        title: function () {
          if (vm.editionMode) {
            return "_POLICY_._WINDOW_._EDIT_._TITLE_";
          } else {
            return "_POLICY_._WINDOW_._CONFIRM_._TITLE_";
          }
        },
        message: function () {
          return "";
        }
      };
      return ModalService.openModal(controller, templateUrl, resolve, '', 'lg');
    }

    function savePolicy() {
      var defer = $q.defer();
      PolicyService.generateFinalJSON().then(function (finalJSON) {
        PolicyModelFactory.setFinalJSON(finalJSON);

        PolicyFactory.createPolicy(finalJSON).then(function () {
          defer.resolve();
        }, function (error) {
          defer.reject(error);
        });
        
      });
       return defer.promise;  
    }
  }
})();
