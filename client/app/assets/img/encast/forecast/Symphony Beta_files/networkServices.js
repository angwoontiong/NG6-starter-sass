'use strict';

angular.module('EnbalaApp')

.factory('NetworkServices', ["$http","$q", function($http,$q) {
    return {

        getNetworkByID: function(networkID){
            var deferred = $q.defer();
            var network_api = 'https://localhost:3000/api/v1demo/networks/'+ networkID;

            $http({
                    method:'GET',
                    url: network_api
            }).then(function successCallback(network){
                
                deferred.resolve(network);

            },function errorCallback(response){
                return deferred.reject('error occured');
     
            });

            return deferred.promise;

        }

    }

}]);


