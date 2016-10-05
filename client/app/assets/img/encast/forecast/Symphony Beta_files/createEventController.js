//networksController.js

angular.module('EnbalaApp')

.controller('CreateEventController', ["$scope","$rootScope","$timeout","$route", "$routeParams", "$location", "$http", "ModalService","DrServices","NetworkServices", function($scope,$rootScope,$timeout,$route,$routeParams, $location, $http, ModalService,DrServices,NetworkServices) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    //$scope.navbarTitle = "enCast";
    $scope.$emit('navbar-title', "enCast");  

    var networkID = $routeParams.networkID;
    //var serviceType = $routeParams.serviceType;
    var serviceID = $routeParams.serviceID;

    //for sidebar
    $scope.networkID = networkID.toString();
    $scope.serviceID = serviceID.toString();

    //$scope.options = ['All','Alpha', 'Bravo', 'Charlie', 'Delta','Echo','Fuch'];

    //selected option
    //$scope.selections
    //if 'all' is selected, select all options


    //if any option is deselected, deselect 'all'



    var networkID = $routeParams.networkID;
    var serviceID = $routeParams.serviceID;

    //$scope.updateSelection = function(){
    //    console.log("35 updateSelection");
    //}

    //for display
    $scope.event = {
        startDateTime:"",
        duration:"",
        capacity:"",
        endDateTime:"",
    };

    $scope.submission = {
        status:"",  //success,failure or warning
        message:"",
        showMessage:false
    };

    //multiselect dropdown
    $scope.isSelected = function(option){
        console.log("$scope.selections:",$scope.selections);
        console.log("option:",option);

        var selections = $scope.selections;

        if($scope.selections){


            if(selections.indexOf(option)>=0){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }

        
        //return true;
    }

    $scope.getStyleClass = function(){
        var styleClass;

        if($scope.submission.status === "success"){
            styleClass = 'alert alert-success';
        }else if($scope.submission.status === "failure"){
            styleClass = 'alert alert-danger';
        }else if($scope.submission.status === "warning"){
            styleClass = 'alert alert-warning';
        }else{
            styleClass = '';
        }
        return styleClass;
    }

    $scope.updateEvent = function(){

        console.log("92 updateEvent");
        console.log("92 $scope.service_selection_names:",$scope.service_selection_names);
        console.log("92 $scope.service_selection_name:",$scope.service_selection_name);
        console.log("92 $scope.service_selection_ids:",$scope.service_selection_ids);

        var startDateTime = $scope.event.startDateTime;

        //$scope.event.duration = $scope.event.duration || 0;
        var duration = $scope.event.duration;

        //end date time
        if(startDateTime && duration){
            $scope.event.endDateTime = getEndDateTime(startDateTime,duration).toString("d-MMM-yyyy HH:mm");
        }
        

        if($scope.event.startDateTime && $scope.event.duration){
            $scope.showEndDateTime = true;
        }else{
            $scope.showEndDateTime = false;
        }



        if($scope.event.startDateTime && $scope.event.duration && $scope.event.capacity){
            $scope.isCreateEventFormReady = true;
        }else{
            $scope.isCreateEventFormReady = false;
        }


        if($scope.event.startDateTime || $scope.event.duration || $scope.event.capacity){
            $scope.isCancelReady = true;
        }else{
            $scope.isCancelReady = false;
        }
        
    }

    $scope.resetInput = function(){
        console.log("123 resetInput");

        $scope.event = {
            startDateTime:"",
            duration:"",
            capacity:"",
            endDateTime:"",
        };

        $scope.showEndDateTime = false;
    }
 
    $scope.submitForm = function(){

        var capacity_kw = +$scope.event.capacity;
        var duration_s = parseInt($scope.event.duration)*3600;
        var startDateTime = Date.parse($scope.event.startDateTime);  //convert to ISO8601 format for http post

        //target service ID single select
        var targetServiceID = $scope.service_selection_ids[0];
        console.log("160 targetServiceID:",targetServiceID);

        var eventToCreate = {

            "dr_event":{
                    "start":startDateTime,   //ISO-8601
                    "duration_s":duration_s,    //second
                    "capacity_kw":capacity_kw,   //kw
                    "service_id":parseInt(targetServiceID)
            }
        }

        //var API = '/api/v1/dr_events';
        console.log("160 eventToCreate:",eventToCreate);
        
        //var API = 'https://stormy-bastion-61502.herokuapp.com/api/v1/dr_events';
        var API = $rootScope.API_SERVER+'/api/v1/dr_events';

        DrServices.createDrEvent(eventToCreate,API)
            .then(function successCallback(response){


                if(response.data){
                    console.log("data:",response.data)

                    $scope.submission = {
                        status:"success",
                        message:"Dispatch submitted",
                        showMessage:true
                    }

                    console.log("149 successCallback");

                    $timeout(function(){

                        //clear all fields
                        $scope.event = {
                            startDateTime:"",
                            duration:"",
                            capacity:"",
                            endDateTime:"",
                        };

                        //clear message
                        $scope.submission = {
                            status:"",
                            message:"",
                            showMessage:false
                        }

                        $scope.showEndDateTime = false;
                        $scope.isCreateEventFormReady = false;
                        $scope.isCancelReady = false;

                    },2000);
      
                }

                

            },function errorCallback(response){
                console.log("response:",response);

                $scope.submission = {
                    status:"failure",
                    message:"Error occured. Dispatch NOT submitted",
                    showMessage:true
                }

                $timeout(function(){
                    $scope.submission = {
                        status:"",
                        message:"",
                        showMessage:false
                    }
                },2000);

                
        })
  
    }

    //duration in hours
    function getEndDateTime(startDateTime,duration){

        var duration_hr = parseInt(duration);
        var duration_min = (duration-duration_hr)*60;
        
        //var _startDateTime = Date.parse(startDateTime);
        //var endDateTime = _startDateTime.add({hours:duration_hr,minutes:duration_min});

        var _startDateTime, _endDateTime;

        if(startDateTime){
            _startDateTime = Date.parse(startDateTime);
            _endDateTime = _startDateTime.add({hours:duration_hr,minutes:duration_min});
        }else{
            _endDateTime = null;
        }

        return _endDateTime;
    }




}]);






