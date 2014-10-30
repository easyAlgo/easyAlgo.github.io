/**
 * runner for easyAlgo expression parsed with the easyAlgoParser.js
 */

 define(['easyAlgoConfiguration', 'easyAlgoContext', 'easyAlgoRuntimeException'], function(easyAlgoConfiguration, Context, RuntimeException){
 	
 	/**
 	 * exeption throw when return instruction is call
 	 * the parameter is the returned value
 	 */
 	var StopBlockException = function(returnedValue) {
 		this.returnedValue = returnedValue;
 	}

 	var runner = {};

 	/**
 	 * @param expression the expression give with easyAlgoParser
 	 * @param output an object for write this object must have 3 methodes error, info, write they have one string parameter
 	 */
 	runner.run = function(expression, output, input, runnerEndFunction) {
 		console.log(expression);
 		var FUNCTIONS = easyAlgoConfiguration.getFunctions();		
		var SKIP_FUNCTION = easyAlgoConfiguration.getSkipedFunction();
	
		
		var blocId = 0;
		var BlockRunner = function(context, lines, parent, lineProcessor) {
			this.context = context;
			this.lines = lines;
			this.parent = parent;
			this.lineProcessor = lineProcessor;

			this.currentLine = 0;
			this.onEndFunction = [];
			this.fatalError = false;
			
			// the child currently run
			this.proccessingChild = undefined;

			// id use for log
			this.id = blocId++;
		}

		BlockRunner.prototype = {			
			registerEndFunction : function(endFunction) {
				this.onEndFunction.push(endFunction);
			},
			blockEnd : function(stopException) {
				//console.log('blockRunner > ' + this.id + ': block ended. number of callback ' + this.onEndFunction.length);
				// run handler, the last handler is exec before
				for (var i = this.onEndFunction.length - 1; i >= 0; i--) {
					var canContinue = this.onEndFunction[i](stopException);
					if (canContinue === false) {
						break;
					}
				}
			},			
			/**
	 		 * run a line of code
	 		 */
	 		runLine : function(line, endOfLine){
	 			var _this = this;
				try {
					//console.log('blockRunner > ' + this.id + ' : run line ');
					this.lineProcessor.runLine(line, this.context, this, function(){
						endOfLine && endOfLine();
						_this.runNextLine();
					});	
				} catch (e) {
					if (e instanceof StopBlockException) {
						//console.log('blockRunner > ' + this.id + ' : catch StopBlockException : '+ e.returnedValue);
						// stop don't run next line
						endOfLine(e);
					} else {						
						this.haveFatalError();
						output.error(e);
						console.log(e);
					}
				}				
	 		},
			haveFatalError : function() {
				this.fatalError = true;
				if (this.getParent()) {
					this.getParent().haveFatalError();
				}
			},
			runNextLine : function() {
				if (this.fatalError) {
					return;
				}
				// no line to call, runLine never call, so we can call endOfLineHandler
				if (this.lines.length == 0) {
					this.endOfLineHandler();
				}
				if (this.currentLine < this.lines.length) {
	 				// call run line function (not in context class)
	 				var _this = this;
	 				var _currentLine = this.currentLine + 1;
	 				this.runLine(
	 					this.lines[this.currentLine++], 
	 					function(e){
	 						_this.endOfLineHandler(e)
	 					} 
 					);
	 			}
			},	
			haveARunningChild : function(){
				return this.proccessingChild != undefined;
			},
			endOfLineHandler : function(stopException){
				// if there are a return instruction
				if (stopException) {
					this.blockEnd(stopException);
					return;
				}
				
				// warn if a child running 
 				if (this.currentLine >= this.lines.length) {
 					if (!this.haveARunningChild()) {
 						this.blockEnd();	 						
 					} else {
 						var _this = this;
 						this.proccessingChild.registerEndFunction(function(){_this.blockEnd()});
 					}
 				}
			},
	 		/**
	 		 * run a suite of line as child
	 		 */
	 		runChildBlock : function(block, onEndFunction, context) {
	 			// true if we are in function execution
	 			var inFunction = context != undefined;

				var subContext = context || new Context(this.context);
	 			var childBlockRunner = new BlockRunner(subContext, block, this, this.lineProcessor);
	 			this.proccessingChild = childBlockRunner;
				var _this = this;
		
				var onEndBlockRunnerException = function(stopException){
					//console.log('blockRunner > ' + _this.id + ' : onEndBlockRunnerException : ', stopException, inFunction);
					// if return is on a sub block of function
					// maybe a if in a function
					if (stopException && !inFunction) {
						//console.log('blockRunner > ' + childBlockRunner.id + ' : run block end on : ' + _this.id);
						_this.blockEnd(stopException);	
						return;
					}

					// unregister the child
					_this.proccessingChild = undefined;
					// call callback for this end of child block
					try {
						//console.log('blockRunner > ' + childBlockRunner.id + ' : onEndFunction : ');
						onEndFunction(stopException ? stopException.returnedValue : undefined);
					} catch (e) {
						if (e instanceof StopBlockException) {
							// if return call an other function, the return value is on the exception
							//console.log('blockRunner > ' + childBlockRunner.id + ' : catch StopBlockException on  onEndFunction', e)
							_this.blockEnd(e);
							return;							
						}
						throw e;
					}

					// call the block next line if the child is finish and it's not the end of a function
					// end of function have no next line
					if (!inFunction) {
						if (_this.haveARunningChild() !== true && _this.currentLine < _this.lines.length) {
		 					_this.runNextLine();
		 				}						
					}
				};
				
				childBlockRunner.registerEndFunction(onEndBlockRunnerException);
				
	 			// run the first line of the child
				setTimeout(function(){
					try {
						childBlockRunner.runNextLine();
					} catch (e) {
						if (e instanceof StopBlockException) {
							onEndBlockRunnerException(e);
						}
						_this.haveFatalError();
						output.error(e);
						console.log(e);
					}
				}, 0);
	 		},
			getParent : function(){
				return this.parent;
			}
		}

 		// context is init on the runBlock function
 		var context = undefined;

 		var typeTranslation = {
 			"number" : "Nombre",
 			"boolean" : "Booleen",
 			"string" : "Chaine",
			"array" : "Tableau"
 		};

 		/**
 		 * check the type of the value, if type is bad a runtime exception is throw
 		 */
 		var checkType = function(value, type, offset) {
 			if (Array.isArray(type)) {
 				var translatedType = [];
 				for (var i in type) {
 					translatedType.push(typeTranslation[type[i]]);
 					try {
	 					if (checkType(value, type[i], offset)) {
	 						return true;
	 					} 						
 					} catch(e){}
 				}

 				throw new RuntimeException(value + ' doit être du type ' + translatedType.join(' ou '), offset);
 			}

 			if (typeof value == type || (type == 'array' && angular.isArray(value))) {
 				return true;
 			}
 			throw new RuntimeException(value + ' doit être du type ' + (typeTranslation[type] || type), offset);
 		}

 		var evaluateOperation = function(left, right, operator, offset) {
 			switch (operator) {
 				case '+' :
					if (typeof left == "string" || typeof right == "string") {
						left = toString(left);
						right = toString(right);
					}
 					return left + right;
 				case '-' :
 					checkType(left, "number", offset);
 					checkType(right, "number", offset);
 					return left - right;
 				case '*' :
 					checkType(left, "number", offset);
 					checkType(right, "number", offset);
 					return left * right;
 				case '/' : 					
 					checkType(left, "number", offset);
 					checkType(right, "number", offset);
 					return left / right;
 				case 'mod' :
 				case '%' : 					
 					checkType(left, "number", offset);
 					checkType(right, "number", offset);
 					return left % right;
 				case '>' : 					
 					return left > right;
 				case '<' : 
 					return left < right;
 				case '>=' :
 					return left >= right;
 				case '<=' :
 					return left <= right;
 				case '==' :
 					return left == right;
 				case '<>' :
 				case '!=' :
 					return left != right;
 				case '&&' : 					
 					checkType(left, "boolean", offset);
 					checkType(right, "boolean", offset);
 					return left && right;
 				case '||' :
 					checkType(left, "boolean", offset);
 					checkType(right, "boolean", offset);
 					return left || right;
 				default : 
 					return undefined;
 			}
 		}

		var forEach = function(list, exec, onEnd) {
			if (list == undefined || list.length == 0) {
				onEnd();
				return;
			}

			var length = list.length; 				
			var i = -1;
			var nextStep = function(){ 
				++i;					
				if (i < length) {
					var value = list[i];
					exec(nextStep, value, i);
				} else {
					onEnd && onEnd();
				}
			};
			nextStep();
		};

 		/**
 		 * evaluate one expression
 		 */
 		var evaluateExpression = function(expression, context, blockRunner, callback) {
 			// if no expression just call callback
 			if (expression == undefined) {
 				callback();
 				return;
 			}

 			if (typeof expression == "string" || typeof expression == "number" || typeof expression == "boolean") {
 				callback(expression);
 				return;
 			}

 			if (expression.operation || expression.type == "comparaison" || expression.type == "boolean") {
 				// TODO ne pas evaluer la second partie pour un && avec la partie gauche à false. idem avec ou
				evaluateExpression(expression.left, context, blockRunner, function(leftValue){
					evaluateExpression(expression.right, context, blockRunner, function(rightValue) {
						var value = evaluateOperation(leftValue, rightValue, expression.operation, expression.offset);
						callback(value);
					});
				});
				return;
 			}

 			if (expression.type == 'var') {
 				context.isset(expression.name, true, expression.offset);
 				
				var variable = context.getValue(expression.name);
				if (expression.indexs != undefined && expression.indexs.length > 0) {
					// asynchronius method
					var indexs = [];
					forEach(
						expression.indexs, 
						function(nextStep, index){
							if (index == 'ADD_AT_END') {
								throw new RuntimeException('Vous devez préciser l\'indice de l\'element à accéder.', expression.offset);
							}
							evaluateExpression(index, context, blockRunner, function(index) {							
								indexs.push(index);
								checkType(variable, ['array', 'string'], expression.offset);
								variable = variable[index];
								if (variable == undefined) {
									output.info('La variable ' + expression.name + '[' + indexs.join('][')+ '] n\'est pas initialisée')
								}
								nextStep();
							});
						},
						function(){
							callback(variable);
						}
					);
					return;
				}
				if (variable == undefined) {
					output.info('La variable ' + expression.name + ' n\'est pas initialisée')
				}
				callback(variable);
				return;
 			}

 			if (expression.type == 'function') {
 				context.issetFunction(expression.name, true, expression.offset);
				
				var easyAlgofunction = context.getFunction(expression.name);
				if (typeof easyAlgofunction == 'function') {
					var args = [];
					
					forEach(
						expression.params,
						function(nextStep, param) {
							evaluateExpression(param, context, blockRunner, function(arrayCell){
								args.push(arrayCell);
								nextStep();
							});
						},
						function(){
							// run the function add add return value to callback
							var value = easyAlgofunction.apply(undefined, args);
							callback(value);
						}
					);
					return;
 				} else if (typeof easyAlgofunction == 'object') {
 					// object is a easyAlgo function
 					// two object value : body, parameters
 					var subContext = new Context(blockRunner.context, expression.name);
 					if (easyAlgofunction.parameters.length != expression.params.length) {
 						throw new RuntimeException('Le nombre de paramétre n\'est pas correcte, la fonction ' + espression.name + ' prend ' + expression.params.length + ' paramètre(s)', expression.offset);
 					}

 					// foreach parameter
 					forEach(
 						easyAlgofunction.parameters,
 						function(nextStep, param, i) {
 							// define var
							subContext.defineVar(param.varname, param.vartype);
							// setValue
							evaluateExpression(expression.params[i], context, blockRunner, function(value){
								subContext.setValue(param.varname, value);
								nextStep();
							});
 						},
 						function(){
							blockRunner.runChildBlock(
		 						easyAlgofunction.body, 
		 						function(returnedValue) {
		 							// get function value
		 							callback(returnedValue);
		 						}, 
		 						subContext
							);
 						}
 					);
 					return;
 				} else {
 					// throw error
 					throw new RuntimeException('La fonction ' + expression.name + ' n\'existe pas', expression.offset);
 				}
				return;
 			}
			
			// array [1;2;3]
			if (expression.type == 'array') {
				var ret = [];
				forEach(
					expression.elements,
					function(nextStep, element) {						
						evaluateExpression(element.expression, context, blockRunner, function(value){
							if (element.name != undefined) {
								ret[element.name] = value;
							} else {
								ret.push(value);
							}
							nextStep();
						});
					}, 
					function(){
						callback(ret);
					}
				);
			}
 		};

		/**
		 * format value for write value
		 */
		var toString = function(value) {
			if (value == undefined) {
				return "NON_INITIALISEE";
			}
			if (Array.isArray(value)) {
				var ret = '[';
				for (var i in value) {
					ret += ' ';
					if (isNaN(i)) {
						ret += i + ' : '
					}
					ret += toString(value[i]) + ',';
				}
				return ret.substring(0, ret.length - 1) + ' ]';
			}	
			return value;
		}
		
 		/**
 		 * run a command
 		 * write, read, affectation, define
 		 */
 		var runCommand = function(line, context,blockRunner, endFunction) {
 			if (line.commandName == 'write') {
 				evaluateExpression(line.params[0], context, blockRunner, function(value) {
					var string = toString(value);
					if (line.output && line.output == 'error') {
						output.error(string);
					} else if (line.output && line.output == 'info') {
						output.info(string);
					} else {
						output.write(string);
					} 		
					endFunction && endFunction();			
 				});
 				return false;
			} else if (line.commandName == 'define') {
				context.defineVar(line.varname, line.vartype);
			} else if (line.commandName == 'affectation') { 
				context.isset(line.varname.name, true, line.offset);
				evaluateExpression(line.expression, context, blockRunner, function(value) {
					if (line.varname.indexs == undefined) {
						checkType(value, context.getType(line.varname.name), line.expression.offset || line.offset);
					}

					var indexs = [];
					forEach(
						line.varname.indexs, 
						function(nextStep, index){
							evaluateExpression(index, context, blockRunner, function(idx){
								indexs.push(idx);
								nextStep();
							});
						}, 
						function(){
							// TODO gérer les variables des objets	
							context.setValue(line.varname.name, value, indexs.length == 0 ? undefined : indexs);
							endFunction && endFunction();
						}
					);
				});
				return false;
			} else if (line.commandName == 'read') {
				context.isset(line.varname.name, true, line.offset);
				var type = context.getType(line.varname.name);
				if (type == 'array') {
					output.info('Un tableau est une suite de valeurs séparée par des ";", par exemple 1;2;Bonjour;5');
				}
				input.read(function(value) { 						
					
					var translatedType = typeTranslation[type] || type;
					
					switch (type) {
						case 'number' :
							if (isNaN(value)) {
								output.info('L\'entrée doit être de type ' + translatedType + '. Entrez une nouvelle valeur');
								return false;
							}
						break;
						case 'boolean' :
							if (value != '1' && value != '0' && value != 'vrai' && value != 'faux') {
								output.info('L\'entrée doit être de type ' + translatedType + '. Entrez une nouvelle valeur (1, 0, vrai, faux)');
								return false;
							}
						break;
					}

					return true;
				}, function(value){
					var value = value;
					
					if (type == 'number') {
						value = parseInt(value, 10);
					} else if (type == 'boolean') {
						value = value == '1' || value == 'vrai';
					} else if (type == 'array') {
						value = value.split(';');
					}
					context.setValue(line.varname.name, value);
					endFunction && endFunction();
				});
				return false;
			} else if (line.commandName == 'return') {
				// evaluate return expression
				evaluateExpression(line.expression, context, blockRunner, function(value){
					throw new StopBlockException(value);
				});
				return false;
			}
			return true;
 		}

	 	var runLineProcessor = {
	 		runLine : function(line, context, blockRunner, nextLineFunction) {
		 		var runNextLine = true;
				if (line.type && line.type == 'command') {
	 				runNextLine = runCommand(line, context,blockRunner, nextLineFunction);
	 			} else if (line.type && line.type == 'condition') {
	 				evaluateExpression(line.test, context, blockRunner, function(testResult){
						checkType(testResult, "boolean", line.offset);
		 				if (testResult && line.yes && line.yes.length > 0) {
		 					blockRunner.runChildBlock(line.yes, nextLineFunction);
		 				} else if (line.no && line.no.length > 0) {
		 					blockRunner.runChildBlock(line.no, nextLineFunction);
		 				} else {
		 					nextLineFunction && nextLineFunction();
		 				}
	 				});
	 				runNextLine = false;
	 			} else if (line.type && line.type == 'for') {
	 				// todo modifier les evalute expression
	 				context.isset(line.varname, true, line.offset);
					

					evaluateExpression(line.step, context, blockRunner, function(calcStep) {
						var step = calcStep === undefined ? 1 : calcStep ;
						evaluateExpression(line.start, context, blockRunner, function(calcStart){
							var start = calcStart - step; // -1 because step begin by ++
							evaluateExpression(line.end, context, blockRunner, function(end){

				 				context.setValue(line.varname, start);
				 				var nextStep = function(){ 	
									start += step;
				 					if (start <= end) {
										context.setValue(line.varname, start);
				 						blockRunner.runChildBlock(line.block, nextStep);
				 					} else {
										nextLineFunction && nextLineFunction();
				 					}
				 				};

				 				nextStep();
							});
						});
					});
	 				
					
	 				runNextLine = false;
	 			} else if (line.type && line.type == 'forEach') {
					var varname = line.varname;
					var indiceVarname = (varname+'_index').toUpperCase();
					context.isset(varname, true, line.offset);
					context.defineVar(indiceVarname, 'NOMBRE');
					evaluateExpression(line.array ,context, blockRunner, function(array){
						// get keys
						var keys = [];
						for (var i in array) {
							keys.push(i);
						}
						var arrayLength = keys.length;
						var i = -1;	// -1 because step begin by ++	
							
						var nextStep = function(){ 			
		 					i++;
							if (i < arrayLength) {
								var key = keys[i];
								var value = array[key];
		 						context.setValue(indiceVarname, key);
								context.setValue(varname, value);
								blockRunner.runChildBlock(line.block, nextStep);
		 					} else {
								nextLineFunction && nextLineFunction();
		 					}
		 				};

		 				nextStep();
					});
	 				runNextLine = false;						
				} else if (line.type && line.type == 'while') {
	 				var test = line.test;
	 				var block = line.block;

	 				var nextStep = function(){
	 					evaluateExpression(test, context, blockRunner, function(result){
		 					if (result === true) {
		 						blockRunner.runChildBlock(block, nextStep);
		 					} else {
		 						nextLineFunction && nextLineFunction();
		 					}
	 					});
	 				}

	 				nextStep();
	 				runNextLine = false;
	 			} else if (line.type && line.type == 'function') {
					evaluateExpression(line, context, blockRunner, function(){
						nextLineFunction && nextLineFunction(); 
					});
					runNextLine = false;
				} else if (line.type && line.type == 'defineFunction') {
					context.defineFunction(line.name, line.parameters, line.body);
				}

	 			// run the next line
	 			if (runNextLine) {
	 				nextLineFunction && nextLineFunction(); 				
	 			}
		 	}
		 }

	 	var initialContext = new Context();
	 	var initialBlockRunner = new BlockRunner(initialContext, expression, undefined, runLineProcessor);
	 	initialBlockRunner.registerEndFunction(runnerEndFunction);

		setTimeout(function(){
			initialBlockRunner.runNextLine();
		}, 0);
 		
 	}


 	return runner;
 });
