angular.module 'mw.angular-gfm'
.directive 'githubReadme', ->
  restrict: 'EAC'
  controller: 'gfmController'
  templateUrl: 'jade/angular-gfm-view.html'
  scope:
    repo: '='
    showTitle: '='
