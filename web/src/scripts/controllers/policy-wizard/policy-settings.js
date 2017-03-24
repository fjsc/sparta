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

  /*POLICY CREATION MODAL CONTROLLER */
  angular
    .module('webApp')
    .controller('PolicySettingsCtrl', PolicySettingsCtrl);

  PolicySettingsCtrl.$inject = ['PolicyModelFactory', 'PolicyFactory', 'TemplateFactory','WizardStatusService'];

  function PolicySettingsCtrl(PolicyModelFactory, PolicyFactory, TemplateFactory, WizardStatusService) {
    /*jshint validthis: true*/
    var vm = this;
    vm.validateForm = validateForm;

    init();

    ///////////////////////////////////////

    function init() {
      WizardStatusService.enableNextStep();
      return TemplateFactory.getPolicyTemplate().then(function (template) {
        PolicyModelFactory.setTemplate(template);
        vm.policy = PolicyModelFactory.getCurrentPolicy();
        vm.template = template;
        vm.helpLink = template.helpLinks[0];
      });
    }

    function validateForm() {
      if (vm.form.$valid) {
        vm.error = false;
        /*Check if the name of the policy already exists*/
        return PolicyFactory.existsPolicy(vm.policy.name, vm.policy.id).then(function (found) {
          vm.error = found;
          /* Policy name doesn't exist */
          if (!found) {
            $uibModalInstance.close();
          }
          /* Policy name exists */
          else {
            vm.errorText = "_ERROR_._200_";
            document.querySelector('#dataSourcenameForm').focus();
          }
        });
      }
      else{
        /*Focus on the first invalid input*/
        document.querySelector('input.ng-invalid').focus();
      }
    }

  }

})();
