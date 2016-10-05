'use strict';

angular.module('EnbalaApp')

.controller('EncastForecastController', ["$scope","$rootScope","$timeout","$route", "$routeParams", "$location", "$http", "ModalService","ForecastServices","NetworkServices","$cookies", function($scope,$rootScope,$timeout,$route,$routeParams, $location, $http, ModalService,ForecastServices,NetworkServices,$cookies) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    //$scope.navbarTitle = "enCast";
    $scope.$emit('navbar-title', "enCast");  

    var networkID = $routeParams.networkID;
    //var serviceType = $routeParams.serviceType;
    var serviceID = $routeParams.serviceID;

    $scope.param = {};

    $scope.param.start = "";
    $scope.param.end = "";
    $scope.param.confidence = "85";
    $scope.param.forecast_mode = 'DayOf';

    //forecastMode: DayOf, DayAhead
    $scope.forecastMode = 'DayOf';
    //$scope.forecastMode = 'DayAhead';

    $scope.programID;

    //for sidebar
    $scope.networkID = networkID.toString();
    $scope.serviceID = serviceID.toString();

    //day of
    var endpoint = "/api/v1demo/24HrForecast";

    $scope.istrue = true;

    /*
    $scope.getIconClass = function(ID){
        if(ID==='Portfolio'){
            return "fa fa-angle-down";
        }else{
            return null;
        }
        
    }*/

    $scope.forecastWindowState = "close";

    $scope.renderFT = true;

    $scope.closeWindow = function(){
        $scope.forecastWindowState = 'close';
    }

    $scope.openWindow = function(){
        $scope.forecastWindowState = 'open';
    }


    $scope.$watch('param.confidence', function() {
        if(oldValue !== newValue){
            $scope.generateForecast();
        }
    },true);

    $scope.$watch('param.forecast_mode', function(newValue,oldValue) {
        console.log( "60 forecast_mode changed - param.forecast_mode newValue:", newValue," oldValue:",oldValue);
        console.log("60 $scope.param.forecast_mode:",$scope.param.forecast_mode);

        if(oldValue !== newValue){
            $scope.generateForecast();
        }
        
    },true);

 

    $scope.generateForecast = function(){

        $scope.renderFT = false;
        
        var endpoint = "/api/v1/24HrForecast";
        console.log("134 generate forecast using endpoint:",endpoint);
        console.log("134 b4 $scope.forecastWindowState:",$scope.forecastWindowState);
        console.log("134 aft $scope.forecastWindowState:",$scope.forecastWindowState);

        var mode = $scope.param.forecast_mode;
        ForecastServices.getForecast(endpoint,mode)
        .then(function successCallBack(forecast){
            console.log("27 forecast:",forecast);
            $scope.renderFT = true;

            $scope.slots = forecast;

            $scope.programID = forecast[0].ID;
            console.log("97 $scope.programID:",$scope.programID);

        },function errorCallBack(){

        });
    };



    function getFormattedDateTime() {
        var str = moment().format('YYYYMMDD_hhmmss');
        return str;
    }
    
    $scope.downloadCSV = function(){

        var download_endpoint = "/api/v1/download_forecast_as_csv";


        //file format: Forecast_yyyymmdd_hhmmss
        var datetime = getFormattedDateTime();
        var filename = "Forecast_" + datetime+".csv";

        //get data to save
        var dataToSave = {data: $scope.slots, filename:filename};

        ForecastServices.saveForecastAsCSV(download_endpoint,dataToSave)
        .then(function successCallBack(){
           

        },function errorCallBack(){

        });
    }

    //??? be more explicit - save as csv or save in DB??
    /*
    $scope.saveForecast = function(){
        console.log("265 saveForecast");

        //var save_as_csv_endpoint = "/api/v1/save_forecast_as_csv";
        var save_endpoint = "/api/v1/save_forecast";

        //file format: Forecast_yyyymmdd_hhmmss
        var datetime = getFormattedDateTime();
        var filename = "Forecast_" + datetime+".csv";

        //get data to save
        var dataToSave = {data: $scope.slots, filename:filename};

        ForecastServices.saveForecastAsCSV(save_endpoint,dataToSave)
        .then(function successCallBack(){
           

        },function errorCallBack(){

        });
    }*/

    $scope.saveForecast = function(){
        console.log("157 saveForecast");

        //var save_as_csv_endpoint = "/api/v1/save_forecast_as_csv";
        var save_endpoint = "/api/v1/save_forecast";

        //file format: Forecast_yyyymmdd_hhmmss
        var datetime = getFormattedDateTime();
        //var data_name = "Forecast_" + datetime+".data";

        var cookie_data = $cookies.getAll();
        console.log("cookie_data:",cookie_data);
        //get data to save
        var data = {program: $scope.slots, user_id:cookie_data._id, access_token:cookie_data.access_token};

        console.log("data:",data);
        
        ForecastServices.saveForecastAsCSV(save_endpoint,data)
        .then(function successCallBack(){
           

        },function errorCallBack(){

        });
    }



    /*
    $scope.getRowClass = function(ID){

        if(ID==="Portfolio"){
            return "portfolio";
        }else if(ID==="Site"){
            return "site";
        }else{
            return "";
        }
        
    }*/

    function getSlot(date,time){

        var slots = $scope.slots;
        var selected_slot = null;

        slots.map(function(slot){
            if(slot.Date === date && slot.Time === time){
                selected_slot = slot;
            }
        });

        return selected_slot;
    }


    $scope.showModal = function(date,time) {

        console.log("227 date:",date," time:",time," $scope.slots:");

        var selected_slot = getSlot(date,time);
        console.log("244 selected_slot:",selected_slot);

        ModalService.showModal({
            templateUrl: '/app/views/encast/forecast/forecast-modal.html',
            controller: "ForecastModalController",
            inputs:{modal_input_selected_slot:selected_slot}
        }).then(function(modal) {
            modal.element.modal();

            modal.close.then(function(result) {
                console.log("modal close");
            });
            modal.closed.then(function(result) {
                console.log("modal closed");
            });
        }).catch(function(error) {
            console.log(error);
        });
    };

}]);






