'use strict';

angular.module('EnbalaApp')

.factory('DrServices', ["$http","$q", function($http,$q) {
    return {

        getServiceDetails: function(endPoint){
            var deferred = $q.defer();

            $http({
                    method:'GET',
                    url: endPoint
            }).then(function successCallback(response){
                
                var service = response.data.service;

                //var hourly_commitments = service.details.hourly_commitments;

                deferred.resolve(service);

            },function errorCallback(response){
                return deferred.reject('error occured');
     
            });

            return deferred.promise;

        },

        createDrEvent: function(eventToCreate,API){
            var deferred = $q.defer();

            $http({
                    method:'POST',
                    url: API,
                    data: eventToCreate
            }).then(function successCallback(response){
                
                deferred.resolve(response);

            },function errorCallback(response){
                return deferred.reject('error occured');
     
            });

            return deferred.promise;
        }
    }

}]);






