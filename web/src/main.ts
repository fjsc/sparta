///
/// Copyright (C) 2015 Stratio (http://stratio.com)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import './scripts/app';
import './styles/main.scss';

import './scripts/filters/truncate-number';
import './scripts/filters/fragment-filter';

import './languages/en-US.json';
import './data-templates/policy.json';


/* controllers */
import './scripts/controllers/inputs';
import './scripts/controllers/outputs';
import './scripts/controllers/policy-list';
import './scripts/controllers/executions-list';
import './scripts/controllers/policy-list';
import './scripts/controllers/policy-wizard/policy';
import './scripts/controllers/policy-wizard/policy-wizard-header';
import './scripts/controllers/modal/confirm-modal';
import './scripts/controllers/plugins-list';
import './scripts/controllers/policy-wizard/modal/create-entity-modal';
import './scripts/controllers/policy-wizard/policy-settings';

/* factories */
import './scripts/factories/request-interceptor-factory';
import './scripts/factories/policy-factory';
import './scripts/factories/policy-model-factory';
import './scripts/factories/cube-model-factory';
import './scripts/factories/fragment-factory';
import './scripts/factories/template-factory';
import './scripts/factories/entity-factory';

/* services */
import './scripts/services/wizard-status-service';
import './scripts/services/api/api-policy-service';
import './scripts/services/utils-service';
import './scripts/services/modal-service';
import './scripts/services/api/api-fragment-service';
import './scripts/services/api/api-template-service';
import './scripts/services/api/api-fragment-service';
import './scripts/services/fragment-service';
import './scripts/services/policy-service';
import './scripts/services/output-service';
import './scripts/services/api/api-entities-service';

/* directives */
import './scripts/directives/c-step-progress-bar-directive';
import './scripts/directives/c-step-directive';
import './scripts/directives/c-horizontal-tabs-directive';
import './stratio-ui/script/directives/forms/form-field-directive';
import './stratio-ui/script/directives/forms/form-field-input-directive';
import './stratio-ui/script/directives/forms/form-field-select-directive';

/*stratio-ui*/
import './stratio-ui/script/helper/ui.stratio.contant.templateUrl';
import './stratio-ui/script/helper/ui.stratio.passAllAttributes';
import './stratio-ui/script/layout/ui.stratio.dashboard';
import './stratio-ui/script/layout/ui.stratio.menutab';
import './stratio-ui/script/components/ui.stratio.quickSearch';
import './stratio-ui/script/components/ui.stratio.primarySidebarSubmenu';
import './stratio-ui/script/components/ui.stratio.floatingMenu';
import './stratio-ui/script/components/ui.stratio.menuElement';
import './stratio-ui/script/components/ui.stratio.nodeList';
import './stratio-ui/script/components/ui.stratio.primarySidebarTitle';
import './stratio-ui/script/components/ui.stratio.heading';
import './stratio-ui/script/components/ui.stratio.actionButton';

/* vendors */
import 'scripts/vendors/ui-bootstrap-1.3.3.min.js';
import 'scripts/vendors/ui-bootstrap-tpls-1.3.3.min';
import 'scripts/vendors/angular-translate.js';

import './stratio-ui/script/ui.stratio';
import './scripts/vendors/ui.stratio.grid';

/* constants */
import './scripts/constants/api-config-settings';
import './scripts/constants/fragment-constants';





/*<!-- build:js(. scripts/vendors.js -->
<script src="node_modules/jquery/dist/jquery.js"></script>
<script src="node_modules/angular/angular.js"></script>
<script src="node_modules/angular-resource/angular-resource.js"></script>
<script src="node_modules/angular-route/angular-route.js"></script>
<script src="node_modules/angular-ui-router/release/angular-ui-router.js"></script>
<script src="node_modules/angular-animate/angular-animate.js"></script>
<!-- endbuild -->

<!-- build:js({.tmp,src} scripts/scripts.js -->
<script src="scripts/app.js"></script>
<!-- Filters -------------------------------- -->
<script src="scripts/filters/truncate-number.js"></script>
<script src="scripts/filters/fragment-filter.js"></script>
<!-- Controllers -------------------------------- -->
<script src="scripts/controllers/inputs.js"></script>
<script src="scripts/controllers/outputs.js"></script>
<script src="scripts/controllers/policy-list.js"></script>
<script src="scripts/controllers/executions-list.js"></script>
<script src="scripts/controllers/plugins-list.js"></script>
<script src="scripts/controllers/drivers-list.js"></script>
<script src="scripts/controllers/settings.js"></script>
<script src="scripts/controllers/modal/new-fragment-modal.js"></script>
<script src="scripts/controllers/fragments/edit-fragment.js"></script>
<script src="scripts/controllers/fragments/duplicate-fragment.js"></script>
<script src="scripts/controllers/fragments/delete-fragment.js"></script>
<script src="scripts/controllers/policy-wizard/policy.js"></script>
<script src="scripts/controllers/policy-wizard/policy-inputs.js"></script>
<script src="scripts/controllers/policy-wizard/policy-settings.js"></script>
<script src="scripts/controllers/policy-wizard/policy-wizard-header.js"></script>
<script src="scripts/controllers/policy-wizard/modal/delete-policy-modal.js"></script>
<script src="scripts/controllers/policy-wizard/modal/delete-entity-modal.js"></script>
<script src="scripts/controllers/policy-wizard/modal/create-entity-modal.js"></script>
<script src="scripts/controllers/policy-wizard/modal/new-dimension-modal.js"></script>
<script src="scripts/controllers/policy-wizard/modal/new-operator-modal.js"></script>
<script src="scripts/controllers/policy-wizard/policy-cube.js"></script>
<script src="scripts/controllers/policy-wizard/policy-model.js"></script>
<script src="scripts/controllers/policy-wizard/policy-raw-data.js"></script>
<script src="scripts/controllers/policy-wizard/policy-cube-accordion.js"></script>
<script src="scripts/controllers/policy-wizard/policy-trigger-accordion.js"></script>
<script src="scripts/controllers/policy-wizard/policy-model-accordion.js"></script>
<script src="scripts/controllers/modal/confirm-modal.js"></script>
<script src="scripts/controllers/policy-wizard/modal/policy-creation-modal.js"></script>
<script src="scripts/controllers/policy-wizard/modal/policy-json-creation-modal.js"></script>
<script src="scripts/controllers/policy-wizard/trigger.js"></script>
<script src="scripts/controllers/modal/policy-info-modal.js"></script>
<!-- Directives ----------------------------------------- -->
<script src="scripts/vendors/angular-translate.js"></script>
<script src="scripts/vendors/ui.stratio.grid.js"></script>
<script src="scripts/vendors/ui-bootstrap-1.3.3.min.js"></script>
<script src="scripts/vendors/ui-bootstrap-tpls-1.3.3.min.js"></script>

<!-- Form directives -->
<script src="stratio-ui/script/directives/forms/form-field-directive.js"></script>
<script src="stratio-ui/script/directives/forms/form-field-input-directive.js"></script>
<script src="stratio-ui/script/directives/forms/form-field-select-directive.js"></script>
<script src="stratio-ui/script/directives/forms/form-field-check-directive.js"></script>
<script src="stratio-ui/script/directives/forms/form-field-list-directive.js"></script>
<script src="stratio-ui/script/directives/forms/form-field-multiple-list-directive.js"></script>
<script src="stratio-ui/script/directives/forms/form-field-textarea-directive.js"></script>
<script src="stratio-ui/script/directives/forms/form-field-array-directive.js"></script>
<!-- HTML component directives -->
<script src="scripts/directives/c-step-directive.js"></script>
<script src="scripts/directives/c-step-progress-bar-directive.js"></script>
<script src="scripts/directives/c-horizontal-tabs-directive.js"></script>
<script src="scripts/directives/c-route-button-directive.js"></script>
<script src="scripts/directives/c-array-min-length.js"></script>
<script src="scripts/directives/c-slider-directive.js"></script>
<script src="scripts/directives/c-icon-label-directive.js"></script>
<script src="scripts/directives/c-input-file-reader.js"></script>
<script src="scripts/directives/c-input-file-model.js"></script>
<script src="scripts/directives/c-icon-link-directive.js"></script>
<script src="scripts/directives/c-output-field-list-directive.js"></script>
<script src="scripts/directives/c-add-element-directive.js"></script>
<script src="scripts/directives/c-json-text-directive.js"></script>
<script src="scripts/directives/c-tag-list-directive.js"></script>
<script src="scripts/directives/c-accordion-directive.js"></script>
<script src="scripts/directives/c-panel-directive.js"></script>
<script src="scripts/directives/c-slider-section-directive.js"></script>
<script src="scripts/directives/c-animated-msg-directive.js"></script>
<script src="scripts/directives/c-auto-calculated-fields-directive.js"></script>
<script src="scripts/directives/c-writer-model-directive.js"></script>
<script src="scripts/directives/c-value-validate-directive.js"></script>
<!-- Factories ----------------------------------- -->
<script src="scripts/factories/fragment-factory.js"></script>
<script src="scripts/factories/template-factory.js"></script>
<script src="scripts/factories/policy-factory.js"></script>
<script src="scripts/factories/entity-factory.js"></script>
<script src="scripts/factories/policy-model-factory.js"></script>
<script src="scripts/factories/model-factory.js"></script>
<script src="scripts/factories/cube-model-factory.js"></script>
<script src="scripts/factories/trigger-model-factory.js"></script>
<script src="scripts/factories/request-interceptor-factory.js"></script>
<!-- Services ----------------------------------- -->
<script src="scripts/services/api/api-policy-service.js"></script>
<script src="scripts/services/api/api-template-service.js"></script>
<script src="scripts/services/api/api-fragment-service.js"></script>
<script src="scripts/services/api/api-entities-service.js"></script>
<script src="scripts/services/accordion-status-service.js"></script>
<script src="scripts/services/cube-service.js"></script>
<script src="scripts/services/model-service.js"></script>
<script src="scripts/services/trigger-service.js"></script>
<script src="scripts/services/rawData-service.js"></script>
<script src="scripts/services/utils-service.js"></script>
<script src="scripts/services/modal-service.js"></script>
<script src="scripts/services/output-service.js"></script>
<script src="scripts/services/wizard-status-service.js"></script>
<script src="scripts/services/policy-service.js"></script>
<script src="scripts/services/fragment-service.js"></script>
<!-- Constants ----------------------------------- -->
<script src="scripts/constants/api-config-settings.js"></script>
<script src="scripts/constants/fragment-constants.js"></script>
<script src="scripts/constants/trigger-constants.js"></script>
<script src="scripts/constants/rawData-constants.js"></script>
<script src="scripts/constants/model-constants.js"></script>
<script src="scripts/constants/cube-constants.js"></script>

<!-- endbuild -->

<!-- build:js({.tmp,src} scripts/stratio-ui.js -->
<script src="stratio-ui/script/helper/ui.stratio.contant.templateUrl.js"></script>
<script src="stratio-ui/script/helper/ui.stratio.passAllAttributes.js"></script>
<script src="stratio-ui/script/layout/ui.stratio.dashboard.js"></script>
<script src="stratio-ui/script/layout/ui.stratio.menutab.js"></script>
<script src="stratio-ui/script/components/ui.stratio.actionButton.js"></script>
<script src="stratio-ui/script/components/ui.stratio.floatingMenu.js"></script>
<script src="stratio-ui/script/components/ui.stratio.heading.js"></script>
<script src="stratio-ui/script/components/ui.stratio.menuElement.js"></script>
<script src="stratio-ui/script/components/ui.stratio.nodeList.js"></script>
<script src="stratio-ui/script/components/ui.stratio.primarySidebarTitle.js"></script>
<script src="stratio-ui/script/components/ui.stratio.primarySidebarSubmenu.js"></script>
<script src="stratio-ui/script/components/ui.stratio.quickSearch.j*/