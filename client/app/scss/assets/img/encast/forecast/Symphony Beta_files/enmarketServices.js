
angular.module('EnbalaApp')

.factory('EnmarketServices', ["$http","$q", function($http,$q) {
    'use strict';

    return {

        getSavedForecastByID: function(end_point,forecast_id){

            var deferred = $q.defer();

            $http({
                    method:'GET',
                    url: end_point+'/'+forecast_id,
            }).then(function successCallback(response){
                console.log("15 forecast response:",response);
                var forecast = response.data;

                deferred.resolve(forecast);

            },function errorCallback(response){
                return deferred.reject('error occured');
     
            });

            return deferred.promise;

        },

        deleteSavedForecastByID: function(end_point,forecast_id){

            var deferred = $q.defer();

            $http({
                    method:'DELETE',
                    url: end_point+'/'+forecast_id,
            }).then(function successCallback(response){
                console.log("15 forecast response:",response);
                var forecast = response.data;

                deferred.resolve(forecast);

            },function errorCallback(response){
                return deferred.reject('error occured');
     
            });

            return deferred.promise;

        },


        getSavedForecastList: function(endPoint){

            var deferred = $q.defer();

            $http({
                    method:'GET',
                    url: endPoint,
            }).then(function successCallback(response){
                console.log("15 forecast response:",response);
                var forecast = response.data;

                deferred.resolve(forecast);

            },function errorCallback(response){
                return deferred.reject('error occured');
     
            });

            return deferred.promise;

        },

        /*
        saveForecastAsCSV: function(endPoint,data){

            var deferred = $q.defer();

            $.fileDownload(endPoint,{
                httpMethod : "POST",
                data : data
            }).done(function(e, response){
                // success
                deferred.resolve(response);

            }).fail(function(e, response){
                // failure
                return deferred.reject('error occured');
            });

            return deferred.promise;
            
        }*/

    }

}]);






