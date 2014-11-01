(function(){var e="angular",t="codemirror/lib/codemirror",n="angularRoute",r="terminalEmulator";require.config({baseUrl:"../bower_components",paths:{services:"../javascripts/services",controllers:"../javascripts/controllers",directives:"../javascripts/directives",app:"../javascripts/app",angular:"angular/angular.min",angularBootstrap:"angular-bootstrap/ui-bootstrap-tpls",angularRoute:"angular-route/angular-route.min",easyAlgoParser:"../javascripts/easyAlgoLanguage/easyAlgoParser",easyAlgoRunner:"../javascripts/easyAlgoLanguage/easyAlgoRunner",easyAlgoLint:"../javascripts/easyAlgoLanguage/easyAlgoLint",easyAlgoFold:"../javascripts/easyAlgoLanguage/easyAlgoFold",easyAlgoCloseTag:"../javascripts/easyAlgoLanguage/easyAlgoCloseTag",easyAlgoValidator:"../javascripts/easyAlgoLanguage/easyAlgoValidator",easyAlgoConfiguration:"../javascripts/easyAlgoLanguage/easyAlgoConfiguration",easyAlgoSyntaxHighlighter:"../javascripts/easyAlgoLanguage/easyAlgoSyntaxHighlighter",easyAlgoContext:"../javascripts/easyAlgoLanguage/easyAlgoContext",easyAlgoRuntimeException:"../javascripts/easyAlgoLanguage/easyAlgoRuntimeException",terminalEmulator:"../javascripts/terminalEmulator/vtortola.ng-terminal",routes:"../javascripts/routes",appDir:"../javascripts/",ffFileSystem:"idb.filesystem.js/src/idb.filesystem.min"},shim:{angularBootstrap:{deps:[e],exports:"angular-ui-bootstrap"},"angular-ui-codemirror/ui-codemirror":{deps:[e,t],exports:"codeMirrorAngular"},angularRoute:{deps:[e],exports:n},terminalEmulator:{deps:[e],exports:r},"controllers/easyAlgoEditor":{deps:["codemirror/mode/htmlmixed/htmlmixed","codemirror/addon/hint/show-hint","codemirror/addon/lint/lint","codemirror/addon/fold/foldgutter","easyAlgoSyntaxHighlighter","easyAlgoParser","easyAlgoLint","easyAlgoFold","easyAlgoValidator","easyAlgoCloseTag","easyAlgoRunner","services/fileSystem"],exports:"controllers/easyAlgoEditor"},"ng-flow/dist/ng-flow-standalone":{deps:[e]},"tc-angular-chartjs/dist/tc-angular-chartjs":{deps:["Chart.js/Chart.min",e]},app:{deps:[e,n,"appDir/services/dependencyResolverFor","routes","angularBootstrap",r,"angular-ui-codemirror/ui-codemirror","ng-flow/dist/ng-flow-standalone","tc-angular-chartjs/dist/tc-angular-chartjs"],exports:"app"}}}),require(["app"],function(e){window.CodeMirror=require(t),e.init()})})();