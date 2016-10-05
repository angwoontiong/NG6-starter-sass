angular.module('EnbalaApp')

.config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider

    /*.when('/', {
      templateUrl: '/app/views/authentication/login/login.html',
      controller: 'LoginController'
    })*/

    .when('/', {     
        templateUrl: '/app/views/networks/networks.html',
        controller: 'NetworksController'
    }) 

    .when('/login', {
      templateUrl: '/app/views/authentication/login/login.html',
      controller: 'LoginController'
    }) 
    .when('/register', {
      templateUrl: '/app/views/register/register.html',
      controller: 'RegisterController'
    }) 

 
    .when('/networks/:networkID/encontrol/services/:serviceID', {       
        templateUrl: '/app/views/encontrol/edisonSPA/encontrol.html',
        controller: 'EncontrolController'
    }) 

    .when('/networks/:networkID/encast/services/:serviceID', {       
        //templateUrl: '/app/views/encast/encast.html',
        templateUrl: '/app/views/encast/encast_edisonSPA.html',
        controller: 'EncastController'
    })

    .when('/networks/:networkID/enmarket/services/:serviceID', {       
        //templateUrl: '/app/views/enmarket/enmarket.html',
        templateUrl: '/app/views/enmarket/edisonSPA/enmarket.html',
        controller: 'EnmarketController'
    }) 

    .when('/networks', {     
        templateUrl: '/app/views/networks/networks.html',
        controller: 'NetworksController'
    }) 

    .when('/notifications', {     
        templateUrl: '/app/views/notifications/notifications.html',
        controller: 'NotificationsController'
    }) 

    .when('/2fa', {     
        templateUrl: '/app/views/authentication/2fa/2fa.html',
        controller: '2faController'
    })  

    .otherwise('/');


    $locationProvider.html5Mode({
        enabled: true,
        //requireBase: false
    });

});
