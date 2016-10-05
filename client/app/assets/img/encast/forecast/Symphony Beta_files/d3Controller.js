//dashboardDrController.js

angular.module('EnbalaApp')

.controller('D3Controller', function($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.navbarTitle = "D3";

    //$location.url('/login');

   
});