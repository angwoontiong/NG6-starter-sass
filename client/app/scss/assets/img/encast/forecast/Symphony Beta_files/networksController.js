'use strict'

angular.module('EnbalaApp')

.controller('NetworksController', ["gService","$scope","$rootScope","$route","$routeParams","$location","$http","$cookies", function(gService,$scope,$rootScope,$route,$routeParams,$location,$http,$cookies) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    //$scope.navbarTitle = "Your Networks";

    var markers = [];
    var marker;
    var longitude;
    var latitude;
    var location;
    var coord;
    //$location.url('/login');
    console.log("networksController");

    $scope.$emit('navbar-title', "Networks"); 

    var networks = [];

    if($cookies.get('isLoggedIn')==='true'){
        $rootScope.isLoggedIn = true;
    }else{
        $rootScope.isLoggedIn = false;
        $location.url('/login');
    }

    
    //var networks_endpoint = 'https://localhost:3000/api/v1demo/networks';
    
    //var networks_endpoint = 'https://stormy-bastion-61502.herokuapp.com/api/v1/networks';
    var networks_endpoint = $rootScope.API_SERVER+'/api/v1/networks';

    $http.get(networks_endpoint).success(function(data) {
        networks = data.networks;  
        console.log("networks:",networks);
        
        if(networks.errorMessage){
            console.log("errorMessage:",data.errorMessage);

            if(networks.errorMessage=="Unauthorized"){
                console.log("Unauthorized");
                $location.url('/login');
            }else{
                console.log("error message ignored. Reload page");
                $route.reload();
            }
            
        }

        console.log("networks:",networks);

        $scope.networks = networks;

  
    }).error(function(response){
            console.log("response:",response);
    }); 


    /*
    var networks_endpoint = 'http://stormy-bastion-61502.herokuapp.com/api/v1/networks';
    
    $http.get(networks_endpoint).success(function(data) { 
  
        var networks = data.networks;
        console.log("networks:",networks);

        $scope.networks = networks;

  
    }).error(function(response){
            console.log("response:",response);
    });*/


    $scope.getUnit = function(key){
        console.log("70 get unit");

        if(key === 'Available' || key === 'Committed'){
            return "MW";
        }else if(key === 'Savings'){
            return "";
        }else if(key === 'Peak_saved'){
            return "kW";
        }else if(key === 'Notifications'){
            return "";
        }

        return "";
    }



    $scope.showMap = function(){
        console.log("46 showMap()");

        $http({
            method:'GET',
            url:'/api/v1demo/networks_detail'
        }).then(function successCallback(response){
            console.log("105 response:",response);
            var networksDetailCount = response.data.count;
            var networks = response.data.Details;

            if(networks.errorMessage){
                console.log("errorMessage:",data.errorMessage);

                if(networks.errorMessage=="Unauthorized"){
                    console.log("Unauthorized");
                    $location.url('/login');
                }else{
                    console.log("error message ignored. Reload page");
                    $route.reload();
                }
                
            }

            $scope.networks_detail = networks;

            var selectedLat = 39.50;
            var selectedLong = -98.35;

            gService.showMap(selectedLat,selectedLong, $scope.networks_detail,'mapCanvas');   //show map at #mapCanvas
        },function errorCallback(){
            console.log("response:",response);
        });


        //gService.refresh(39,-100, $scope.networks_detail);
    };  



}]);