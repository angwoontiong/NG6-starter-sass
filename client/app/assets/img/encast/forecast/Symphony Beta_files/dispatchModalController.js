'use strict';

angular.module('EnbalaApp')

.controller('DispatchModalController', ["$scope","$rootScope","$element", "$route", "$routeParams", "$location", "$http", "ModalService","close","cleared_capacity","HE", function($scope,$rootScope,$element, $route, $routeParams, $location, $http, ModalService,close,cleared_capacity,HE) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.navbarTitle = "enMarket Modal";
    $scope.networkID = $routeParams.networkID;
    $scope.serviceID = $routeParams.serviceID;

    $scope.cleared_capacity = cleared_capacity;
    $scope.HE = HE;
    console.log("13 $scope.cleared_capacity:",$scope.cleared_capacity);
    console.log("13 $scope.HE:",$scope.HE);

    function closeModal() {

        //  Manually hide the modal.
        $element.modal('hide');
        
        //  Now call close, returning control to the caller.
        close({}, 500); // close, but give 500ms for bootstrap to animate
    };

}]);







