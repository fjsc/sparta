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

  angular
    .module('webApp')
    .service('PolicyService', PolicyService);

  PolicyService.$inject = ['PolicyModelFactory', 'OutputService', 'UtilsService', '$q'];

  function PolicyService(PolicyModelFactory, OutputService, UtilsService, $q) {
    var vm = this;
    vm.generateFinalJSON = generateFinalJSON;
    vm.getCubeOutputs = getCubeOutputs;
    vm.getTriggerOutputs = getTriggerOutputs;

    init();

    ///////////////////////////////////////

    function init() {
      vm.policy = PolicyModelFactory.getCurrentPolicy();
    }

    function generateFinalJSON() {
      var finalJSON = angular.copy(vm.policy);
      finalJSON = UtilsService.convertDottedPropertiesToJson(finalJSON);
      finalJSON = convertDescriptionAttributes(finalJSON);
      finalJSON = convertTriggerAttributes(finalJSON);
      finalJSON = convertCubeAttributes(finalJSON);
      var cleanedJSON = cleanUnusedAttributes(finalJSON);
      return convertFragments(cleanedJSON);
    }

    function convertFragments(json) {
      var defer = $q.defer();
      var convertedFragmentsPolicy = angular.copy(json);
      var fragments = [json.input];
      delete convertedFragmentsPolicy.input;
      OutputService.getOutputList().then(function (allOutputs) {
        var cubeOutputs = getCubeOutputs(allOutputs);
        var triggerOutputs = getTriggerOutputs(allOutputs);
        var rawDataOutputs = getRawDataOutputs(allOutputs);
        fragments = fragments.concat(cubeOutputs);
        fragments = fragments.concat(triggerOutputs);
        fragments = fragments.concat(rawDataOutputs);
        fragments = fragments.concat(getRawDataOutputs);
        fragments = UtilsService.removeDuplicatedJSONs(fragments, 'id');
        convertedFragmentsPolicy.fragments = fragments;

        defer.resolve(convertedFragmentsPolicy);
      });
      return defer.promise;
    }

    function convertDescriptionAttributes(json) {
      var convertedDescriptionJson = angular.copy(json);
      convertedDescriptionJson.sparkStreamingWindow = json.sparkStreamingWindowNumber + json.sparkStreamingWindowTime;
      if (json.rememberNumber && json.rememberTime) {
        convertedDescriptionJson.remember = json.rememberNumber + json.rememberTime;
      }
      return convertedDescriptionJson;
    }

    function getCubeOutputs(allOutputs) {
      var cubes = vm.policy.cubes;
      var outputs = [];
      var cubeOutputs = [];
      for (var c = 0; c < cubes.length; ++c) {
        var cube = cubes[c];
        if (cube.writer && cube.writer.outputs) {
          cubeOutputs = cubeOutputs.concat(cube.writer.outputs);
        }

        for (var t = 0; t < cube.triggers.length; ++t) {
          cubeOutputs = cubeOutputs.concat(cube.triggers[t].writer.outputs);
        }
      }

      if (allOutputs && cubeOutputs) {
        outputs = UtilsService.getFilteredArray(allOutputs, cubeOutputs, 'name');
      }
      return outputs;
    }

    function getRawDataOutputs(allOutputs) {
      var outputs = [];
      var rawData = vm.policy.rawData;
      if (!rawData || !rawData.writer) {
        return [];
      }
      var rawDataOutputs = rawData.writer.outputs;

      if (allOutputs && rawDataOutputs && rawDataOutputs.length) {
        outputs = UtilsService.getFilteredJSONByArray(allOutputs, rawDataOutputs, 'name');
      }
      return outputs;
    }

    function getRawDataOutputs(allOutputs) {
      var outputs = [];
      var transformations = vm.policy.transformations;
      if (!transformations || !transformations.writer) {
        return [];
      }
      var transformationsOutputs = transformations.writer.outputs;

      if (allOutputs && transformationsOutputs && transformationsOutputs.length) {
        outputs = UtilsService.getFilteredJSONByArray(allOutputs, transformationsOutputs, 'name');
      }
      return outputs;
    }

    function getTriggerOutputs(allOutputs) {
      var outputs = [];
      var triggers = vm.policy.streamTriggers;
      var triggerOutputs = [];
      for (var t = 0; t < triggers.length; ++t) {
        triggerOutputs = triggerOutputs.concat(triggers[t].writer.outputs);
      }
      if (allOutputs && triggerOutputs) {
        outputs = UtilsService.getFilteredJSONByArray(allOutputs, triggerOutputs, 'name');
      }
      return outputs;
    }

    function convertTriggerAttributes(policyJson) {
      var triggers = policyJson.streamTriggers;
      for (var i = 0; i < triggers.length; ++i) {
        if (triggers[i].overLastNumber && triggers[i].overLastTime) {
          triggers[i].overLast = triggers[i].overLastNumber + triggers[i].overLastTime;
          delete triggers[i].overLastNumber;
          delete triggers[i].overLastTime;
        }
        if (triggers[i].computeEveryNumber && triggers[i].computeEveryTime) {
          triggers[i].computeEvery = triggers[i].computeEveryNumber + triggers[i].computeEveryTime;
          delete triggers[i].computeEveryNumber;
          delete triggers[i].computeEveryTime;
        }
      }
      return policyJson;
    }

    function convertCubeAttributes(policyJson) {
      var cubes = policyJson.cubes;
      for (var i = 0; i < cubes.length; ++i) {
        cubes[i] = UtilsService.convertDottedPropertiesToJson(cubes[i]);
      }
      return policyJson;
    }

    function cleanUnusedAttributes(finalJSON) {
      delete finalJSON['sparkStreamingWindowNumber'];
      delete finalJSON['sparkStreamingWindowTime'];
      delete finalJSON['rememberNumber'];
      delete finalJSON['rememberTime'];

      return finalJSON;
    }
  }
})();
