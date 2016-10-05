var myModule = angular.module('EnbalaApp',['ngRoute','ngMessages','angularModalService','nya.bootstrap.select','thatisuday.dropzone','ngCookies'])

//myModule.controller('MainController', function($scope, $route, $routeParams, $location) {
.controller('MainController', ['$scope','$rootScope','$http','$document','$route', '$routeParams', '$location','DataServices','$cookies', function($scope,$rootScope,$http,$document,$route, $routeParams, $location, DataServices,$cookies) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $rootScope.API_SERVER = $("meta[name='API_SERVER']").attr('content');

    /*
    Dropzone.autoDiscover = false;

    myNgApp.config(function(dropzoneOpsProvider){
        dropzoneOpsProvider.setOptions({
            url : '/upload_url',
            maxFilesize : '10',
            ...
        });
    });*/


    if($cookies.get('isLoggedIn')==='true'){
        $rootScope.isLoggedIn = true;
    }else{
        $rootScope.isLoggedIn = false;
        $location.url('/login');
    }

    //$scope.navbarTitle = DataServices.get_data().navbar_title;

    $scope.showSidebar = function(){
        if ($scope.navbarTitle === 'enControl' || $scope.navbarTitle === 'enCast' || $scope.navbarTitle === 'enMarket' ) {
            console.log("25 showSidebar $scope.navbarTitle:",$scope.navbarTitle);
            console.log("25 return true");
            return true;
        } else {
            console.log("25 showSidebar $scope.navbarTitle:",$scope.navbarTitle);
            console.log("25 return false");
            return false;
        }
    };


    $scope.showNav = function(){
        console.log("showNav()");
        if ($scope.navbarTitle === 'enControl' || $scope.navbarTitle === 'enCast' || $scope.navbarTitle === 'enMarket' || $scope.navbarTitle === "Your Networks" ) {
            console.log("42 showNav $scope.navbarTitle:",$scope.navbarTitle);
            console.log("42 return true");
            return true;
        } else {
            console.log("42 showNav $scope.navbarTitle:",$scope.navbarTitle);
            console.log("42 return false");
            return false;
        }
    };



    $scope.$on('navbar-title', function(event, value) {
        console.log("17 navbar-title event triggered, value:",value);
        
        if(value==="Networks"){
            $scope.navbarTitleShow = false;
        }else{
            $scope.navbarTitleShow = true;
        }
        
        $scope.navbarTitle = value; 
    });

    $scope.$on('login', function(event, value) {
        console.log("80 login event triggered, value:",value);
        
        $rootScope.user = value;
        console.log("83 $rootScope.user:",$rootScope.user);    
    });

    $scope.logout = function(){
        console.log("100 logout");
        $http({
            method: 'POST',
            url: '/api/v1/logout',
            //headers: {'Content-Type': 'application/json'}
        }).then(function successCB(response){
            
            var data = response.data;
            console.log("data:",data);

            if(data.status === 'success'){

                $cookies.put('isLoggedIn',false);
                $cookies.put('access_token',false);
                $rootScope.isLoggedIn = false;

                console.log("after logout, $cookies.getAll():",$cookies.getAll());
                $location.url('/login');
            }


        },function errorCB(response){
            console.log("31 error,response:",response);
        });
    }


    $scope.$on('route-params', function(event, value) {
        console.log("35 route-params event triggered, value:",value);
        $scope.networkID = value.networkID.toString();
        $scope.serviceID = value.serviceID.toString();
        console.log("39 $scope.networkID:",$scope.networkID);
        console.log("39 $scope.serviceID:",$scope.serviceID);
    });

    $scope.getClass = function () {
        var location = $location.path();
        console.log("location:",location);

        //if (location === '/' || location === '/login' || location === '/2fa' || location === '/register' ) {
        if (location === '/login' || location === '/2fa' || location === '/register' ) {      
            return 'login';
        } else {
            return '';
        }
    }

}])



//make tab content visible 
.directive('showTab',
    function () {
        return {
            restrict:'A',
            link: function (scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    console.log("clicked element:",element);
                    $(element).tab('show');

                    //note: rendering of tab content done somewhere else
                });
            }
        };
    } 
);

