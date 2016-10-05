
angular.module('EnbalaApp')

.controller('EnmarketController', ["$scope","$rootScope","$q","$route","$routeParams","$location","$http","ModalService","DrServices","EnmarketServices","$timeout", function($scope,$rootScope,$q,$route,$routeParams,$location,$http,ModalService,DrServices,EnmarketServices,$timeout) {
    'use strict';

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.navbarTitle = "enMarket";
    $scope.$emit('navbar-title', "enMarket");  

    $scope.program_id;;
    $scope.selected_forecast_id;;
    $scope.slots = [];
    $scope.show_table = false;
    $scope.forecast_loader_selected = true;


    //$routeParams
    var networkID = $routeParams.networkID;
    var serviceID = $routeParams.serviceID;

    //for sidebar
    $scope.networkID = networkID.toString();
    $scope.serviceID = serviceID.toString();

    //**** filtering ***************************************************
    $scope.premises = ['Premise1','Premise2','Premise3'];
    $scope.feeders = ['Feeder1','Feeder2','Feeder3'];
    $scope.zones = ['A','B','C'];

    $scope.services = [];  //complete list of services {}
    $scope.service_names = [];   //complete list of service names
    $scope.service_selection_names = [];   //list of selected service names
    $scope.service_selection_ids = [];
    //******************************************************************

    $scope.now = new Date();
    //$scope.nowDisplay = $scope.now.toLocaleFormat('%d %b %Y');
    $scope.nowDisplay = $scope.now.toString("d MMM yyyy");



    //================================
    // display saved forecast listings
    //================================

    $scope.displaySavedForecastList = function(){

        var endpoint = "/api/v1/saved_forecast_list";
 
        EnmarketServices.getSavedForecastList(endpoint)
        .then(function successCallBack(list){
            console.log("list:",list);

            $scope.forecasts = list.forecasts;
            //$scope.slots = enmarket;
            //$scope.programID = enmarket[0].ID;

        },function errorCallBack(){

        });
    };

    $scope.displaySavedForecastList();

    $scope.showForecast = function(forecast_id){
        var endpoint = "/api/v1/forecasts";

        EnmarketServices.getSavedForecastByID(endpoint,forecast_id)
        .then(function successCallBack(saved_forecast){
            console.log("saved_forecast:",saved_forecast);

            $scope.program_id = saved_forecast.program[0].ID;
            $scope.selected_forecast_id = forecast_id;
            $scope.slots = saved_forecast.program;
            $scope.show_table = true;

        },function errorCallBack(){

        });

    }

    $scope.deleteForecast = function(forecast_id){

        $scope.deleteStatus = 'deleting';
        console.log("81 delete forecast, forecast_id:",forecast_id);
        var endpoint = "/api/v1/forecasts";

        EnmarketServices.deleteSavedForecastByID(endpoint,forecast_id)
        .then(function successCallBack(){
            console.log("saved forecast deleted");
            $scope.deleteStatus = 'success';

            $timeout(function(){$scope.deleteStatus=null},2000);

            if($scope.selected_forecast_id === forecast_id){
                $scope.slots = null;
                $scope.selected_forecast_id = null;
                $scope.program_id = null;
                $scope.show_table = false;
            }

            $scope.displaySavedForecastList();

            //if($scope.programID)
            //$scope.programID = saved_forecast.program[0].ID;
            //$scope.slots = saved_forecast.program;

        },function errorCallBack(){
            $scope.deleteStatus = 'fail';
        });
    }



    //================================
    // display enmarket
    //================================

    $scope.displayEnmarket = function(){

        var endpoint = "/api/v1/enmarket";
 
        EnmarketServices.getSavedForecast(endpoint)
        .then(function successCallBack(enmarket){
            console.log("enmarket:",enmarket);

            $scope.slots = enmarket;
            $scope.program_id = enmarket[0].ID;

        },function errorCallBack(){

        });
    };

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



    /*
    $scope.showCreateCommitmentModal = function() {

        //console.log("136 showModal(),eventIDs:",eventIDs);
        console.log("121 showCreateCommitmentModal");
        
        var templateUrl='/app/views/enmarket/edisonSPA/create-commitment/create-commitment-modal.html';


        ModalService.showModal({
            templateUrl: templateUrl,
            controller: "CreateCommitmentModalController",
            //inputs: {
                //eventIDs: eventIDs
            //}
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                console.log("41 modal close");
                //$scope.message = "You said " + result;
            });
            modal.closed.then(function(result) {
                console.log("41 modal closed");
                //$scope.updateEventTable();
            });
        }).catch(function(error) {
            // error contains a detailed error message.
            console.log(error);
        });
    };*/

    /*
    function getSlotByHE(HE){
        console.log("158 getSlotByHE, HE:",HE);
        var slots = $scope.slots;
        var match;

        slots.map(function(slot){
            if(slot.HE === HE){
                match = slot
            }
        });

        return match;
    }*/


    $scope.showDispatchModal = function() {

        //console.log("136 showModal(),eventIDs:",eventIDs);
        console.log("158 dispatchModal");

        var time = new Date();
        var hr = time.getHours();
        console.log("158 hr:",hr); 
        //var time = 15.3;
        var hr_ending = Math.ceil(hr+1);

        console.log("158 hr_ending:",hr_ending);

        var HE = hr_ending+":00";
        console.log("158 HE:",HE);

        console.log("158 $scope.slots:",$scope.slots);

        var currentSlot = getSlotByHE(HE);
        console.log("158 currentSlot:",currentSlot);

        var cleared_capacity = currentSlot.cleared_capacity || 0;
        console.log("158 cleared_capacity:",cleared_capacity);



        //$scope.cleared_capacity = cleared_capacity;
        
        var templateUrl='/app/views/enmarket/edisonSPA/dispatch/dispatch-modal.html';

        /*
        if(eventIDs.eventIDs.length !== 0){
            templateUrl='/app/views/enmarket/enmarket-modal.html';
        }else{
            templateUrl='/app/views/enmarket/no-event.html';
        }*/

        ModalService.showModal({
            templateUrl: templateUrl,
            controller: "DispatchModalController",
            inputs: {
                cleared_capacity:cleared_capacity,
                HE:HE
                //eventIDs: eventIDs
            }
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                console.log("41 modal close");
                //$scope.message = "You said " + result;
            });
            modal.closed.then(function(result) {
                console.log("41 modal closed");
                //$scope.updateEventTable();
            });
        }).catch(function(error) {
            // error contains a detailed error message.
            console.log(error);
        });
    };
  

    $scope.getIconClass = function(ID){
        if(ID==='EventID'){
            return "fa fa-angle-down";
        }else{
            return null;
        }
        
    }

    $scope.getRowClass = function(ID){

        if(ID==="EventID"){
            return "event-id";
        }else if(ID==="SiteID"){
            return "site-id";
        }else{
            return "";
        }
        
    }



    //*****************filtering functions*******************************************************************************************/
    var endPoint = $rootScope.API_SERVER+'/api/v1/networks/'+ networkID;
    console.log("40 endPoint:",endPoint);

    $http.get(endPoint).success(function(data){
        console.log("43 data:",data);
        var network = data.network;
        console.log("46 network:",network);

        var services = network.services_summary;
        $scope.services = services;
        //$scope.services = network.services_summary;
        console.log("49 services:",services);

        /*
        for (var service in services_summary){
            console.log("48 service:",service);
            $scope.services.push(service.name);
        }*/

        services.map(function(service){
            console.log("58 service:",service);
            $scope.service_names.push(service.name);
        });
        console.log("65 $scope.service_names:",$scope.service_names);

        //initial selection
        $scope.service_selection_names = []; //multiselect
        $scope.service_selection_name = null;   //single select
        $scope.service_selection_ids = [];
        //$scope.service_selections = []; //NEW!!!

        var initial_service_selection = getServiceByID(serviceID,services); 
        console.log("68 initial_service_selection:",initial_service_selection);
        //console.log("68 service_selection_names:",service_selection_names);
        $scope.service_selection_names.push(initial_service_selection.name); //multiselect
        $scope.service_selection_name = initial_service_selection.name;  //single select
        $scope.service_selection_ids.push(initial_service_selection.id);
        //$scope.service_selections.push(initial_service_selection);

        console.log("79 $scope.service_selection_ids:",$scope.service_selection_ids);
        console.log("79 $scope.service_selection_names:",$scope.service_selection_names);
        console.log("79 $scope.service_selection_name:",$scope.service_selection_name);
        console.log("79 $scope.service_selection_name:",$scope.service_selection_name);

    }).error(function(response){
        console.log("response:",response);
    });

    
    $scope.$watch('service_selection_names', function() {
        //alert('hey, service_selection_names has changed!');
        console.log("87 service_selection_names changed");

        $scope.service_selection_ids = namesToIDs($scope.service_selection_names);   //namesToIDs
        console.log("87 $scope.service_selection_names:",$scope.service_selection_names);
        console.log("87 $scope.service_selection_ids:",$scope.service_selection_ids);
    });


    //single select
    $scope.$watch('service_selection_name', function() {
        //alert('hey, service_selection_names has changed!');
        console.log("105 service_selection_name changed");

        $scope.service_selection_names = [];
        $scope.service_selection_names.push($scope.service_selection_name);
        $scope.service_selection_ids = namesToIDs($scope.service_selection_names);   //namesToIDs
        console.log("105 $scope.service_selection_names:",$scope.service_selection_names);
        console.log("105 $scope.service_selection_name:",$scope.service_selection_name);
        console.log("105 $scope.service_selection_ids:",$scope.service_selection_ids);
    });

     
    var services = $scope.services_summary;

    function getServiceByID(id,services){
        console.log("104 getService,id:",id," services:",services);

        var service_found = null;

        services.map(function(service){
            console.log("95 service:",service);

            if(service.id === parseInt(id)){
                console.log("103 found, service:",service);
                //return service;
                service_found = service;
            }

        });
        console.log("118 service_found:",service_found);
        return service_found;
    }

    function namesToIDs(names){
        console.log("157 names:",names, " $scope.services:",$scope.services);
        var IDs = [];
        var id;

        //if name is a string (i.e. single select)
        if(typeof names === 'string'){

            console.log("157 names is a string");
            id = nameToID(names,$scope.services);
            IDs.push(id);
        }else if(typeof names === 'object'){   //if name is an array (i.e. multiselect)

            console.log("157 names is an object");
            
            names.map(function(name){
                id = nameToID(name,$scope.services);
                IDs.push(id);
            });
        }else{
            IDs = [];
        }
        

        console.log("157 return IDs:",IDs);
        return IDs;
    }

    function nameToID(name,services){
        console.log("157 nameToID name:",name," services:",services);
        var ID=null;

        //get service by name
        services.map(function(service){
            console.log("157 service:",service);

            if(service.name === name){
                console.log("157 found service matching name:",name);
                ID = service.id;
            }

        });
        console.log("157 return ID:",ID);
        return ID;
    }


    //if any option is deselected, deselect 'all'

    $scope.isServiceSelected = function(service_name){

        //single select
        if($scope.service_selection_name){


            if($scope.service_selection_name === service_name){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }

    }


    $scope.isZoneSelected = function(zone){
        console.log("$scope.zone_selections:",$scope.zone_selections);
        console.log("zone:",zone);

        var zone_selections = $scope.zone_selections;

        if($scope.zone_selections){


            if(zone_selections.indexOf(zone)>=0){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }

    }

    $scope.isPremiseSelected = function(premise){
        console.log("$scope.premise_selections:",$scope.premise_selections);
        console.log("premise:",premise);

        var premise_selections = $scope.premise_selections;

        if($scope.premise_selections){


            if(premise_selections.indexOf(premise)>=0){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }

    }


}]);