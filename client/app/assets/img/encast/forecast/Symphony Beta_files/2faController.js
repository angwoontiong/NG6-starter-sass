//2faController.js

angular.module('EnbalaApp')
.controller('2faController', function($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.access_code = "";

    console.log("2faController");

    $scope.auth2 = function() {

        //var data = {
        //    email: $scope.user.username,
        //    password: $scope.user.password
        //}
        console.log("$scope.user:",$scope.user);

        //if($scope.access_code ==="123456"){
        if($scope.access_code ===""){    
          console.log("authentication passed");

          $location.url('/networks');
            //console.log("data:",data);   
        }else{
            console.log("authentication failed");
        }
           
    };

});