
define(['app', 'easyAlgoConfiguration', 'easyAlgoParser', 'controllers/popUp'], function(app, easyAlgoConfiguration, Parser){

	var formValidator = {
		isEmpty : function(value) {
			return value == undefined || value.trim().length == 0;
		},
		'define' : function(values) {
			return !this.isEmpty(values.varname) && !this.isEmpty(values.type);
		},
		'read' : function(values) {
			return !this.isEmpty(values.varname);
		},
		'afectation' : function(values) {
			if (values.varType == 'array') {
				if (!values.arrayType) {
					return false;
				}
				if (values.arrayType == 3 && !values.expression) {
					return false;	
				}
			}
			return values.varname != undefined ;
		},
		'if' : function(values) {
			return !this.isEmpty(values.test);
		},
		'while' : function(values) {
			return !this.isEmpty(values.test);
		},
		'foreach' : function(values) {
			return !this.isEmpty(values.varname) && !this.isEmpty(values.array);	
		},
		'for' : function(values) {
			return !this.isEmpty(values.varname) && !this.isEmpty(values.start) && !this.isEmpty(values.end);		
		},
		'functionSimple' : function(values) {
			return !this.isEmpty(values.name) && !this.isEmpty(values.expression);
		},
		'functionConditional' : function(values) {
			return !this.isEmpty(values.name)  && !this.isEmpty(values.paramType) && !this.isEmpty(values.elseReturn);
		},
		'function' : function(values) {
			return !this.isEmpty(values.name);
		}
	};
	
	var codeConstructor = {
		tabulate : function(lines){
			return lines.replace(/\n/g, '\n\t');
		},
		escapeString : function(string) {
			return string.replace(/"/g, '\\"');
		},
		/**
		 * if expression have error expression is a string
		 */
		refactorExpression : function(context, expression) {
			var parser = new Parser(undefined, context);
			parser.initParser(expression);
			// try to parse expression
			try {
				parser.parseExpression();
			} catch (exception) {
				return '"'+ this.escapeString(expression) + '"';
			}
			
			return expression;
		},
		// définir varname vartype
		'define' : function(context, values) {
			return {code : 'definir ' + values.varname + ' ' + values.type};
		},
		'read' : function(context, values ) {
			return {code : 'lire ' + values.varname};
		},
		'afectation' : function(context, values) {
			var vartype = values.varType;
			var expression = undefined;
			console.log(vartype);
			// it's a string
			if (vartype == 'string' && values.message) {
				expression = '"' + this.escapeString(values.message) + '"';
			} else if (vartype == 'number' && values.number) {
				expression = values.number;
			} else if (vartype == 'boolean' && values.boolean) {
				expression = values.boolean;
			} else if (vartype == 'array') {
				if (values.arrayType == 1) {
					expression = '[';
					if (values.arrayValues) {
						for (var i in values.arrayValues) {
							expression += this.refactorExpression(context, values.arrayValues[i]) + '; ';
						}
						expression = expression.substring(0, expression.length - 2);						
					}
					expression += ']';
				} else if (values.arrayType == 2) {
					expression = '[';
					if (values.arrayValues) {
						for (var i in values.arrayValues) {
							var value = values.arrayValues[i];
							expression += this.refactorExpression(context, value.key) + ' : ' + this.refactorExpression(context, value.value) + '; ';
						}
						expression = expression.substring(0, expression.length - 2);						
					}
					expression += ']';
				} else if (values.arrayType == 3) {
					values.varname += '[' + (values.index || '') + ']';
				}
			}
			
			if (!expression) {
				expression = this.refactorExpression(context, values.expression);
			}

			return {code : values.varname + ' = ' + expression}
		},
		'write' : function(context, values) {
			var expression = undefined;
			
			if (values.message) {
				expression = '"' + this.escapeString(values.message) + '"';
			}
			
			if (!expression) {
				expression = this.refactorExpression(context, values.expression);
			}
			
			return {code : 'ecrire ' + expression + (values.output ? ' \''+values.output+'\'' : '')}
		},
		'if' : function(context, values, selectedCode) {
			var code = 'si ' + values.test + '\n';
			if (selectedCode) {
				code += '\t' + this.tabulate(selectedCode.trim());
			} else {
				code += '\t' + '// code si le test est vrai';
			}
			
			if (values.elseBlock) {
				code += '\nSI_NON\n\t//code si le test est faux';
			}
			code += '\nFIN_SI';

			return {overrideSelection : true, code : code};
		},
		'while' : function(context, values, selectedCode) {
			var code = 'tant_que ' + values.test + '\n';
			if (selectedCode) {
				code += '\t' + this.tabulate(selectedCode.trim());
			} else {
				code += '\t' + '// code executé dans la boucle';
			}
			
			code += '\nfin_tant_que';

			return {overrideSelection : true, code : code};
		},
		'foreach' : function(context, values, selectedCode) {
			var code = '';
			if (!context.isset(values.varname, false)) {
				code = 'definir ' + values.varname + ' chaine // attention vérifier le type de la variable \n';
			}

			code += 'pour ' + values.varname + ' dans ' + values.array + '\n';
			if (selectedCode) {
				code += '\t' + this.tabulate(selectedCode.trim());
			} else {
				code += '\t' + '// code executé pour chaques element du tableau';
			}			
			code += '\nfin_pour';

			return {overrideSelection : true, code : code};
		},
		'for' : function(context, values, selectedCode) {
			var code = '';
			if (!context.isset(values.varname, false)) {
				code = 'definir ' + values.varname + ' nombre\n';
			}

			code += 'pour ' + values.varname + ' de ' + values.start + ' a ' + values.end;
			if (values.step) {
				code += ' par ' + values.step;
			}
			code += '\n';

			if (selectedCode) {
				code += '\t' + this.tabulate(selectedCode.trim());
			} else {
				code += '\t' + '// code executé pour chaques element du tableau';
			}			
			
			code += '\nfin_pour';

			return {overrideSelection : true, code : code};
		},
		'functionSimple' : function(context, values) {
			var code = '// ' + values.name + '(x) = ' + values.expression;
			
			code += '\ndefinir_fonction ' + values.name + '(x : nombre)\n';
			code += '\tretourner ' + values.expression;
			code += '\nfin_fonction';

			return {overrideSelection : false, code : code, addAtStart : true};
		},
		'functionConditional' : function(context, values) {
			var code = 'definir_fonction ' + values.name + '(x : '+values.paramType+')\n';
			
			if (values.arrayValues) {
				for (var i in values.arrayValues) {
					var condition = values.arrayValues[i];
					code += '\tsi' + (i == 0 ? ' ' : '_non_si ') + condition.condition + '\n';
					code += '\t\tretourner '+ condition.expression + '\n';
				}				
				code += '\tfin_si\n';
			}

			code += '\tretourner ' + values.elseReturn;
			code += '\nfin_fonction';

			return {overrideSelection : false, code : code, addAtStart : true};
		},
		'function' : function(context, values) {
			var code = 'definir_fonction ' + values.name + '(';
			
			if (values.arrayValues) {
				for (var i in values.arrayValues) {
					var parameter = values.arrayValues[i];
					code += parameter.name + ' : ' + parameter.type + '; ';
				}
				code = code.substring(0, code.length - 2);
			}

			code += ')\n';
			code += '\t// code de la fonction\n';
			code += '\tretourner ""//compléter la fonction avec la valeur à retourner';
			code += '\nfin_fonction';

			return {overrideSelection : false, code : code, addAtStart : true};
		}
	};
	
	
	app.controller('editorInstructionPopUp', function($scope, $modalInstance, $controller,$timeout, codeMirror){	
			
		// extends PopUpController
		angular.extend(this, $controller('popUpController', {$scope: $scope, $modalInstance : $modalInstance, title : '', message : '', buttons : {}}));	
		
		$scope.sections = {
			'Instruction' : {
				'Définir une variable' : {id : 'define', title : 'Définir une variable'},
				'Lire une variable' : {id : 'read', title : 'Lire une variable'},
				'Ecrire un message' : {id : 'write', title : 'Ecrire un message'},
				'Afecter une variable' : {id : 'afectation', title : 'Afectation d\'une variable'},
				'position' : 1
			}, 
			'Structure conditionelle' : {
				'Si' : {id : 'if', title : 'Condition'},
				'position' : 2
			}, 
			'Structure itérative' : {
				'Execution tant que vrai' : {id:'while', title : 'Boucle tant que'},
				'Parcour entre deux nombres' : {id:'for', title : 'Boucle pour'},
				'Parcour d\'un tableau' : {id:'foreach', title : 'Boucle pour chaque'},
				'position' : 3
			},
			'Fonctions' : {
				'Fonction simple' : {id : 'functionSimple', title : 'Fonction simple'},
				'Fonction conditionnel' : {id : 'functionConditional', title : 'Fonction conditionnel'},
				'Fonction' : {id : 'function', title : 'Fonction'}
			},
			'Aide' : {
				'Liste de fonctions' : {type : 'help', id : 'functions', title : 'Fonctions'},
				'Liste des variables' : {type : 'help', id : 'variables', title : 'Variables'},
				'position' : 5
			}
		};

		
		$scope.configuration = easyAlgoConfiguration;
		$scope.selected = undefined;
		$scope.setSelected = function(menu) {
			if (menu.type == 'help') {
				$scope.help = menu;
			} else {
				if ($scope.selected) {
					$scope.selected.selected = false;
				}
				$scope.selected = menu;
				menu.selected = true;
				$scope.isValidated = false;				
			}
		};

		$scope.closeHelp = function(){
			$scope.help = undefined;
		};

		// init vars selectionnales
		var parser = new Parser();
		var parsed = parser.parse(codeMirror.getValue());
		// get var by context
		var pos = codeMirror.indexFromPos(codeMirror.getCursor());
		var context = parsed.context.getContextFor(pos);
		
		console.log(parsed.context);
		$scope.vars = context.getAccessibleVars();
		$scope.functions = easyAlgoConfiguration.getFunctions();
		$scope.accessibleFunctions = context.getAccessibleFunctions();
		
		
		console.log($scope.functions);
		$scope.functionsDescription = easyAlgoConfiguration.getFunctionsDescription();

		$scope.removeArray = function(index) {
			$scope.selected.arrayValues.splice(index, 1);
		};

		$scope.addArrayValue = function(value) {
			if (!$scope.selected.arrayCurrentValue) {
				return;
			}
			if ($scope.selected.arrayValues == undefined) {
				$scope.selected.arrayValues = [];
			}
			$scope.selected.arrayValues.push($scope.selected.arrayCurrentValue);
			$scope.selected.arrayCurrentValue = undefined;
		};

		$scope.validateForm = function(){
			$scope.isValidated = true;
			var selected = $scope.selected || {};
			if (selected.id in formValidator) {
				var valide = formValidator[selected.id](selected);
				
				return valide;
			}
			
			
			return true;
		};
		
		// when the popup is closed
		$modalInstance.result.then(function () {
			// no selection just close the popup
			if (!$scope.selected || !($scope.selected.id in codeConstructor)) {
				return ;
			}
			
			function tabulate(indentNumber) {
				var tab = '';
				for (var i = 0; i < indentNumber; ++i) {
					tab += ' ';
				}
				return tab;
			}
			
			var easyAlgoMod = codeMirror.getMode({},"easyAlgo");

			// timeout is used because replaceRange do digest error
			$timeout(function(){				
				var selection = codeMirror.listSelections()[0];
				var selected = $scope.selected || {};
		     	// check if start == end
		     	var selectedCode = undefined;
		     	if(!(selection.head.line == selection.anchor.line && selection.head.ch == selection.anchor.ch)) {
			     	var startSelected = CodeMirror.Pos(selection.head.line, 0);
			     	var endLineSelected = codeMirror.getLine(selection.anchor.line);
					var endSelected = CodeMirror.Pos(selection.anchor.line, endLineSelected.length);
					selectedCode = codeMirror.getRange(startSelected, endSelected);
				}

	     		var value  = codeConstructor[selected.id](context, selected, selectedCode);
				// new line of code
				var newLine = value.code;
				// must remove the selected code
		     	var overrideSelection = value.overrideSelection || false;		     	
				// add the code at top of code
				var addAtStart = value.addAtStart;

		     	var start = selection.head;
		     	var end = selection.head;

		     	if (overrideSelection && selectedCode) {
		     		start = startSelected;
		     		end = endSelected;
		     	} else if (addAtStart) {
					start = {ch : 0, line : 0};
		     		end = start;
		     	}

				// indent correctly the current line
				var token = codeMirror.getTokenAt(start);
				var indentNumber = easyAlgoMod.indent(token.state, newLine);

				// tabulate 
				var stringTabulate = tabulate(indentNumber);	
				newLine = stringTabulate + newLine;
				newLine = newLine.replace(/\n/g, '\n' + stringTabulate);

		     	// already add a new line end add the code at the end of line
		     	var beforeCursor = codeMirror.getRange(CodeMirror.Pos(start.line, 0), start);
				var line = codeMirror.getLine(start.line);
				if (beforeCursor.trim().length > 0) {
					// if we are not at start of line add the line after the current
					start.ch = line.length;
					newLine = '\n' + newLine;
		     	} else if (line.trim().length > 0){
					// if we are at start on an existing line add the line before this line
					start.ch = 0;
					newLine = newLine + (overrideSelection ? '' : '\n' );
				} else {
					// empty line add the line on this line
					start.ch = 0;
				}
				
		     	// add code on code mirror
		     	codeMirror.replaceRange (
	     			newLine,
	     			start, 
	     			end
	     		);
				
				codeMirror.setSelection(start, start);
			})
	    });
	});
});