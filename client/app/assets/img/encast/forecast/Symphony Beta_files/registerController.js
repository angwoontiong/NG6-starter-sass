'use strict';

angular.module('EnbalaApp')

.controller('RegisterController', ['$scope','$route','$http','$location','$routeParams','$rootScope','$cookies', function($scope,$route,$http,$location,$routeParams,$rootScope,$cookies) { 

    $scope.name = "RegisterController";
    $scope.params = $routeParams;
    $scope.$route = $route;
    $scope.$routeParams = $routeParams;
    $scope.user = {
        name:"",
        email:"",
        password:"",
        confirm_password:""
    };

    console.log("RegisterController");

    $scope.register = function(){
        console.log("register, $scope.user:",$scope.user);

        $http({
            method: 'POST',
            url: '/api/v1/signup',
            data: $scope.user,
            headers: {'Content-Type': 'application/json'}
        }).then(function successCB(response){
            console.log("29 success, response:",response);

            if(response.data && response.data.status === 'success'){
                console.log("signup successful");

                var data = response.data;
                $cookies.put('access_token',data.access_token);

                $http.defaults.headers.common.Authorization = data.access_token;
                $http.defaults.headers.common.userID = data._id;


                $cookies.put('isLoggedIn','true');  //cookies only stores string (no boolean)
                $rootScope.isLoggedIn = true;

                $scope.$emit('login', data); 

                $location.url('/login');
            }


        },function errorCB(response){
            console.log("31 error,response:",response);
        });
    }

        
}]);    