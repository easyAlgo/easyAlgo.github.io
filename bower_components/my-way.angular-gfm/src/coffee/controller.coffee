angular.module 'mw.angular-gfm'
.controller 'gfmController', [
  '$scope', '$http', '$sce', '$element'
  ($scope, $http, $sce, $element) ->
    $http.get 'https://api.github.com/repos/'+$scope.repo+'/readme',
      cache: true
      headers:
       Accept: 'application/vnd.github.v3.html+json'
    .success (response) ->
       $scope.content = $sce.trustAsHtml response
    .error ->
      fallbackUrl = 'https://github.com/'+$scope.repo+'/raw/master/README.md'
      $http.get fallbackUrl,
        cache: true
      .success (response) ->
        $scope.content = response
      .error ->
        $scope.content = '<a href="'+fallbackUrl+'">Click to view the README</a>'
]
