//networksController.js

angular.module('EnbalaApp')

.controller('NotificationsController', ["$scope", "$route", "$routeParams", "$location", "$http", function($scope, $route, $routeParams, $location, $http) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.navbarTitle = "Notifications";

    console.log("NotificationsController");



}]);