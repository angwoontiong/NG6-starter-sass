'use strict';

angular.module('EnbalaApp')

.controller('LoginController', ['$scope','$route', '$http', '$location','$routeParams','$rootScope','$cookies', function($scope, $route, $http, $location,$routeParams,$rootScope,$cookies) { 

    $scope.name = "LoginController";
    $scope.params = $routeParams;
    $scope.$route = $route;
    $scope.$routeParams = $routeParams;
    $scope.user = {
        email:"",
        password:""
    };

    console.log("LoginController");

    $scope.auth = function(){
        console.log("register, $scope.user:",$scope.user);

        $http({
            method: 'POST',
            url: '/api/v1/login',
            data: $scope.user,
            headers: {'Content-Type': 'application/json'}
        }).then(function successCB(response){
            
            var data = response.data;
            console.log("data:",data);

            
            if(data.access_token){
                console.log("login successful");

                $cookies.put('access_token',data.access_token);

                $cookies.put('isLoggedIn','true');  //cookies only stores string (no boolean)
                $rootScope.isLoggedIn = true;

                $cookies.put('_id',data._id);  

                //$http.defaults.headers.common.Authorization = data.access_token;
                //$http.defaults.headers.common.userID = data._id;

                $scope.$emit('login', data); 

                $location.url('/networks');
            }else{
                console.log("login failed");
                $scope.formSubmissionStatus = true;
            }


        },function errorCB(response){
            console.log("31 error,response:",response);
        });
    }

    /*
    $scope.auth = function() {


        console.log("$scope.user:",$scope.user);

        if($scope.user.email==="" && $scope.user.password===""){    
          console.log("authentication passed");

          $location.url('/2fa');
            //console.log("data:",data);   
          return "passed";
        }else{
            console.log("authentication failed");
            return "failed";
        }
           
    };*/
        
}]);    