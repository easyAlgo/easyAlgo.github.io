define(['app'], function(app){
	
	app.factory('templatePreloader', ['$http', '$injector', '$templateCache' , function($http, $injector, $templateCache){
		return function(templateUrl){
			$injector.invoke(function($http, $templateCache){
		    	$http.get(templateUrl, {cache: $templateCache}).then(function (result) {
		          return result.data;
		      });
		    });	
		};
	}]);    
});