define([], function(){
	var config = {};
	
	// list of accessib default function of language
	config.functions = {
		'aleatoire' : function(min, max){
			min = min || 0;
			max = max || 100;
			return Math.floor(Math.random() * max + min);
		},
		'en_entier' : function(value) {
			return parseInt(value, 10);
		},
		'taille' : function(value) {
			//checkType(value, 'array');
			// TODO optimiser le traitement en créer une nouvelle structure de donnée pour la gestion des tableaux
			// this is do for associative array
			var size = 0;
			for (var i in value) {
				size++;
			}
			return size;
		},
		'racine_carree' : Math.sqrt,
		'puissance' : Math.pow,
		'arondi_inferieur' : Math.floor,
		'arondi_superieur' : Math.ceil,
		'arondi' : Math.round,
		'cosinus' : Math.cos,
		'sinus' : Math.sin,
		'tangente' : Math.tan,
		'exponentielle' : Math.exp,
		'arctangente' : Math.atan,
		'arcsinus' : Math.asin,
		'arccosinus' : Math.acos,
		'abs' : Math.abs,
		'logarithme' : Math.log,
		'radians' : function(degrees) {
		  	return degrees * Math.PI / 180;
		},
 		'degre' : function(radians) {
		  	return radians * 180 / Math.PI;
		},
		'non' : function(boolean) {
			return !boolean;
		},
		'to_ascii' : function(car) {
			return car.charCodeAt(0);
		},
		'to_char' : function(ascii) {
		  return String.fromCharCode(ascii);
		},
		'rationaliser' : function(x) {
			var negative = x < 0 ? '-' : '';
			x = Math.abs(x);
			var tolerance = 1.0E-6;
			var h1=1; var h2=0;
			var k1=0; var k2=1;
			var b = x;
			do {
				var a = Math.floor(b);
				var aux = h1; h1 = a*h1+h2; h2 = aux;
				aux = k1; k1 = a*k1+k2; k2 = aux;
				b = 1/(b-a);
			} while (Math.abs(x-h1/k1) > x*tolerance);
			
			if (k1 == 1) {
				return negative + h1;
			}
			// over than 100 fraction have no sens
			if (Math.abs(h1) == Infinity || Math.abs(k1) == Infinity) {
				return negative + x;
			}
			
			return negative + h1+ "/"+ k1+ ((k1 > 100) ? ' (' + negative + x + ')' : '') ;
		},
		'couper' : function(string, separator) {
			return string.split(separator);
		},
		'joindre' : function(array, glue) {
			return array.join(glue || ' ');
		},
		'sous_chaine' : function(string, start, end) {
			return string.substring(start, end);
		},
		'index' : function(string, search, start) {
			return string.indexOf(search, start);
		}		
	};
	
	config.functionsDescription = {
		'aleatoire' : 'Permet de retourner un nombre au hasard entre un minimum et un maximum. par exemple aleatoir(0; 10) retourne un nombre entre 0 et 10.',
		'taille' : 'Permet de connaitre la taille d\'un tableau ou d\'une chaine',
		'en_entier' : 'Permet de convertir une chaine de caractére en un nombre',
		'racine_carree' : 'Permet de calculer la racine carée d\'un nombre',
		'arondi_inferieur' : 'Permet d\'arondir un nombre à l\'entier inférieur le plus proche',
		'arondi_superieur' : 'Permet d\'arondir un nombre à l\'entier superieur le plus proche',
		'arondi' : 'Permet de calculer l\'arondi le plus proche du nombre',
		'puissance' : 'Permet de mettre un nombre à la puissance x puissance(nombre; x). Exemple : 4*4*4 = puissance(4; 3)',
		'cosinus' : 'Permet de calculer le cosinus du paramètre',
		'sinus' : 'Permet de calculer le sinus du paramètre',
		'tangente' : 'Permet de calculer la tangente du paramètre. Le paramètre doit être en radians',
		'exponentielle' : 'Permet de calculer l\'exponentielle du nombre passé en paramètre',
		'arctangente' : 'Permet de calculer l\'arctangente du paramètre',
		'arcsinus' : 'Permet de calculer l\'arcsinus du paramètre',
		'arccosinus' : 'Permet de calculer l\'arccosinus du paramètre',
		'abs' : 'Retourne la valeur absolue du paramètre',
		'radians' : 'Converti le paramètre de degré en radian',
		'degre' : 'Converti le paramètre de radian en degré',
		'logarithme' : 'Calcul logarithme népérien du paramètre',
		'to_ascii' : 'Retourne le nombre ascii associé au caractére en paramètre ',
		'to_char' : 'Retourne le caractére associé au code ascii en paramètre',
		'rationaliser' : 'Retourne une chaine qui représente le nombre sous forme de fraction. 0.333333333 retourne 1/3',
		'couper' : 'Retourner un tableau qui est la chaine découpée en fonction d\'un separateur. Exemple couper(\'Bonjour le monde\'; \' \') = [\'Bonjour\';\'Le\';\'Monde\']',
		'sous_chaine' : 'Retourne une sous chaine de la chaine en paramétre. Prend en paramétre la chaine, le debut et la fin de la sous chaine souhaitée. Exemple sous_chaine("Bonjour"; 0; 2) = "Bo", sous_chaine("Bonjour"; 1) = "onjour".',
		'index' : 'Retourne la position de la chaine cherchée dans la chaine. index("Bonjour"; "o") = 1, index("Bonjour"; "o"; 2) = 4',
		'joindre' : 'Join les elements d\'un tableau et retourne une chaine de caractére. Exemple : joindre(["bla"; "bla"], " ") = "bla bla"'
	};

	// list of javascript function to ignore
	config.skipedFunction = ['eval'];
	
	// block used for syntaxe higlight
	// si non 
	config.blocNames = {
		'SI'  : ['FIN_SI', 'SI_NON', 'SI_NON_SI'],
		'TANT_QUE' : ['FIN_TANT_QUE'],
		'POUR' : ['FIN_POUR'],
		'SI_NON' : ['FIN_SI'],
		'DEFINIR_FONCTION' : ['FIN_FONCTION'],
		'SI_NON_SI' : ['FIN_SI', 'SI_NON', 'SI_NON_SI'],
    };

	config.autoCloseTag = {
		'SI ' : 'FIN_SI', // if have a space because SI have a SI_NON two have I car
		'POUR' : 'FIN_POUR',
		'TANT_QUE' : 'FIN_TANT_QUE',
		'DEFINIR_FONCTION' : 'FIN_FONCTION'
	};
	
	// use for validator
	// unused
	config.openBlock = {
		'SI' : {tag : 'if', error : 'Un SI doit être terminé par un FIN_SI'}, 
		'POUR' : {tag : 'for', error : 'Un POUR doit être terminé par un FIN_POUR'},
		'TANT_QUE' : {tag : 'while', error : 'Un TANT_QUE doit être terminé par un FIN_TANT_QUE'}
	};
	
	// unused
	config.endBlock = {
		'FIN_SI' : {error : 'un FIN_SI doit avoir un SI correspondant.', startTag : 'if'},
		'FIN_POUR' : {error : 'un FIN_POUR doit avoir un POUR correspondant.', startTag : 'for'},
		'FIN_TANT_QUE' : {error : 'un FIN_TANT_QUE doit avoir un TANT_QUE correspondant.', startTag : 'while'}
	};
	
	config.varTypes = {
		NOMBRE	: 'number',
		CHAINE	: 'string',
		TABLEAU : 'array',
		BOOLEEN : 'boolean'
	};

	config.booleanName = {VRAI : true, FAUX : false};
	
	config.translateVarType = {};
	
	config.writeOutput = function() {
		return {
			erreur : 'error',
			info : 'info'
		};
	}
		
	for (var i in config.varTypes) {
		config.translateVarType[config.varTypes[i]] = i;
	}
	
	config.getBooleanName = function(){
		return config.booleanName;
	}
	
	config.getVarTypes = function() {
		return config.varTypes;
	}

	// functions
	config.getFunctions = function(){
		return this.functions;
	}
	
	config.getFunctionsDescription = function() {
		return this.functionsDescription;
	}

	config.getSkipedFunction = function() {
		return this.skipedFunction;
	}
	
	config.getStartToEndBlock = function(){
		return this.blocNames;
	}
	
	// configuration use for fold
	config.getStartToLastEndBlock = function(){
		return this.blocNames;
	}
	
	config.getValidatorOpenBlock = function(){
		return this.openBlock;
	}
	
	config.getValidatorEndBlock = function(){
		return this.endBlock;
	}
	
	config.getAutoCloseTag = function(){
		return this.autoCloseTag;
	}
	return config;
});