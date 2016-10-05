
angular.module('EnbalaApp')

.factory('ForecastServices', ["$http","$q", function($http,$q) {
    'use strict';

    return {

        getForecast: function(endPoint,mode){

            var deferred = $q.defer();

            //if(mode!=='dayOf' && mode!=='dayAhead1' && mode!=='dayAhead2'){
            //    return console.log("unrecognized mode");
            //}

            $http({
                    method:'GET',
                    url: endPoint+"?mode="+mode,
            }).then(function successCallback(response){
                console.log("15 forecast response:",response);
                var forecast = response.data;

                deferred.resolve(forecast);

            },function errorCallback(response){
                return deferred.reject('error occured');
     
            });

            return deferred.promise;

        },


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
            
        }

    }

}]);






