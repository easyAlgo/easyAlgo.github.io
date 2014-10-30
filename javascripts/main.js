require.config({
	baseUrl : '../bower_components',
    //urlArgs: "bust=" + (new Date()).getTime(),
	paths : {
		// configuration base dir
		services : '../javascripts/services',
		controllers : '../javascripts/controllers',
		directives : '../javascripts/directives',
		
		// module shortcut
		app : '../javascripts/app',
		angular : 'angular/angular',
		angularBootstrap : 'angular-bootstrap/ui-bootstrap-tpls',
		angularRoute : 'angular-route/angular-route.min',
		easyAlgoParser : '../javascripts/easyAlgoLanguage/easyAlgoParser',
		easyAlgoRunner : '../javascripts/easyAlgoLanguage/easyAlgoRunner',
		easyAlgoLint : '../javascripts/easyAlgoLanguage/easyAlgoLint',
		easyAlgoFold : '../javascripts/easyAlgoLanguage/easyAlgoFold',
		easyAlgoCloseTag : '../javascripts/easyAlgoLanguage/easyAlgoCloseTag',
		easyAlgoValidator : '../javascripts/easyAlgoLanguage/easyAlgoValidator',
		easyAlgoConfiguration : '../javascripts/easyAlgoLanguage/easyAlgoConfiguration',
		easyAlgoSyntaxHighlighter : '../javascripts/easyAlgoLanguage/easyAlgoSyntaxHighlighter',
		easyAlgoContext : '../javascripts/easyAlgoLanguage/easyAlgoContext',
		easyAlgoRuntimeException : '../javascripts/easyAlgoLanguage/easyAlgoRuntimeException',
		terminalEmulator : '../javascripts/terminalEmulator/vtortola.ng-terminal',
		routes : '../javascripts/routes',
		appDir : '../javascripts/',
		ffFileSystem : 'idb.filesystem.js/src/idb.filesystem.min'
	},
	shim : {
		'angularBootstrap' : {
			deps : [
				'angular'
			],
			exports: 'angular-ui-bootstrap'
		},
		'angular-ui-codemirror/ui-codemirror' : {
			deps : [
				'angular',
				'codemirror/lib/codemirror'
			],
			exports: 'codeMirrorAngular'
		},
		'angularRoute': {		
			deps : [
				'angular'
			],
			exports: 'angularRoute'
		},
		'terminalEmulator': {
			deps : [
				'angular'
			],
			exports : 'terminalEmulator'
		},
		'controllers/easyAlgoEditor' : {
			deps : [
				'codemirror/mode/htmlmixed/htmlmixed',
				'codemirror/addon/hint/show-hint',
				'codemirror/addon/lint/lint',
				'codemirror/addon/fold/foldgutter',
                'easyAlgoSyntaxHighlighter',
                'easyAlgoParser',
				'easyAlgoLint',
				'easyAlgoFold',
				'easyAlgoValidator',
				'easyAlgoCloseTag',
				'easyAlgoRunner',				
				'services/fileSystem'
			],
			exports : 'controllers/easyAlgoEditor'
		},
		'ng-flow/dist/ng-flow-standalone' : {
			deps : ['angular']
		},
		'tc-angular-chartjs/dist/tc-angular-chartjs' : {
			deps : [
				'Chart.js/Chart.min'
			]
		},
		app : {
			deps: [
				'angular',
				'angularRoute',
				'appDir/services/dependencyResolverFor',
				'routes',
				'angularBootstrap',
				'terminalEmulator',
				'angular-ui-codemirror/ui-codemirror',
				'ng-flow/dist/ng-flow-standalone',
				'tc-angular-chartjs/dist/tc-angular-chartjs'
			],
			exports: 'app'
		}
	}
});

require(['app'], function (app) {
  // create CodeMirror on window for correcte usage of ui.codemirror
  window.CodeMirror = require('codemirror/lib/codemirror');
  app.init();
});