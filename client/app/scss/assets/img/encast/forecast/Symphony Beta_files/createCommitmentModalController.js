'use strict';

angular.module('EnbalaApp')

.controller('CreateCommitmentModalController', ["$scope","$rootScope","$element", "$route", "$routeParams", "$location", "$http", "ModalService","close", function($scope,$rootScope,$element, $route, $routeParams, $location, $http, ModalService,close) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.navbarTitle = "enMarket Modal";
    $scope.networkID = $routeParams.networkID;
    $scope.serviceID = $routeParams.serviceID;
    //$scope.eventIDs = $eventIDs.eventIDs;  //$eventIDs injected from parent
    //$scope.selectedEvent = $scope.eventIDs[0];  //init selected event


    //formatted for display
    /*
    $scope.event = {
        startDateTime:"",
        duration:"",
        capacity:"",
        endDateTime:"",
    };


    $scope.submission = {
        status:"",  //success,failure or warning
        message:"",
        showMessage:false,
        stage:"initial", //initial,confirm,submit,postsubmit
        mode:""
    };*/

    //when a different event ID is selected
    /*
    $scope.selectionChanged = function(){
        console.log("35 selectionChanged");
        console.log("35 $scope.selectedEvent:",$scope.selectedEvent);
        populateEventForm();   
    };*/

    
    /*
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
    }*/


    //update modal fields
    /*
    $scope.updateEvent = function(){
        console.log("101 update event, $scope.event:",$scope.event);
        console.log("101Event $scope.selectedEvent:",$scope.selectedEvent);
        //var startDateTime = $scope.event.startDateTime;

        $scope.event.duration = $scope.event.duration || 0;
        var duration = $scope.event.duration;
        $scope.event.endDateTime = getEndDateTime($scope.event.startDateTime,$scope.event.duration).toString("d-MMM-yyyy HH:mm");

        if($scope.event.startDateTime && $scope.event.duration && $scope.event.capacity){
            $scope.isFormReady = true;
        }else{
            $scope.isFormReady = false;
        }
        
    }*/


    function closeModal() {

        //  Manually hide the modal.
        $element.modal('hide');
        
        //  Now call close, returning control to the caller.
        close({}, 500); // close, but give 500ms for bootstrap to animate
    };


    /*
    $scope.getConfirmation = function(mode){

        $scope.submission = {
            status:"",  //success,failure or warning
            message:"",
            showMessage:false,
            stage:"confirm", //initial,confirm,submit,postsubmit
            mode:mode  //modify,delete
        };
    }



    $scope.deleteEvent = function(){
        //var deleteAPI = 'https://stormy-bastion-61502.herokuapp.com/api/v1/dr_events/'+$scope.selectedEvent;
        var deleteAPI = $rootScope.API_SERVER + '/api/v1/dr_events/'+$scope.selectedEvent;
        
        console.log("140 deleteAPI:",deleteAPI);

        $scope.submission.stage = "submit";


        $http({
                method:'DELETE',
                url: deleteAPI
        }).then(function successCallback(response){
                
                console.log("response:",response);

                showMessage("success","Event deleted");
                $scope.submission.stage = "postsubmit";

                setTimeout(function(){
                    //close modal window
                    closeModal();

                    //clear all fields
                    resetEventFields();

                    removeMessage();
                    $scope.submission.stage="initial";


                },3500);

            },function errorCallback(response){
                console.log("response:",response);

                showMessage("failure","Error occured. Event NOT deleted");
 
        }); 

    }

    $scope.setSubmissionStage = function(stage){
        $scope.submission.stage=stage;
    }

    $scope.getSubmissionStage = function(){
        return $scope.submission.stage;
    }

    $scope.getSubmissionMode = function(){
        return $scope.submission.mode;
    }
    
    
    $scope.submitForm = function(){
        console.log("125 submit form, $scope.event:",$scope.event);



        var capacity_kw = +$scope.event.capacity;
        var duration_s = parseInt($scope.event.duration)*3600;
        var startDateTime = Date.parse($scope.event.startDateTime);  //convert to ISO8601 format for http post

        var dataToPut = {

            //formatted according to API specs
            "dr_event":{
                    "start":startDateTime,   //ISO-8601
                    "duration_s":duration_s,    //second
                    "capacity_kw":capacity_kw,   //kw
                    "service_id":parseInt($scope.serviceID),
                    "id":$scope.selectedEvent
            }
        }

        //var API = 'https://stormy-bastion-61502.herokuapp.com/api/v1/dr_events/'+$scope.selectedEvent;
        var API = $rootScope.API_SERVER + '/api/v1/dr_events/'+$scope.selectedEvent;
        
        console.log("144 PUT API:",API);

        console.log("146 dataToPut:",dataToPut);


        $scope.submission.stage = "submit";


        $http({
                method:'PUT',
                url: API,
                data: dataToPut
        }).then(function successCallback(response){
                
                console.log("response.data:",response.data);

                showMessage("success","Dispatch submitted");
                $scope.submission.stage = "postsubmit";

                setTimeout(function(){
                    //close modal window
                    closeModal();

                    //clear all fields
                    resetEventFields();

                    removeMessage();
                    $scope.submission.stage="initial";


                },3500);

            },function errorCallback(response){
                console.log("response:",response);

                showMessage("failure","Error occured. Dispatch NOT submitted");
 
        });  

    }



    function showMessage(status,message){
        $scope.submission.status=status;
        $scope.submission.message=message;
        $scope.submission.showMessage = true;
    }

    function removeMessage(){
        $scope.submission.status="";
        $scope.submission.message="";
        $scope.submission.showMessage = false;
    }

 
    function populateEventForm(){

        //var API = 'https://stormy-bastion-61502.herokuapp.com/api/v1/dr_events/'+$scope.selectedEvent;
        var API = $rootScope.API_SERVER + '/api/v1/dr_events/'+$scope.selectedEvent;
        console.log("populateEventForm using API:",API);


        $http({
                method:'GET',
                url: API,
        }).then(function successCallback(response){


                var dr_event = response.data.dr_event;
                console.log("dr_event:",dr_event);

                $scope.event.duration = dr_event.duration_s/3600;
                $scope.event.capacity = dr_event.capacity_kw;
                //$scope.event.startDateTime = new Date(dr_event.start).toLocaleFormat('%d %b %Y %H:%m');
                $scope.event.startDateTime = new Date(dr_event.start).toString("d-MMM-yyyy HH:mm");

                console.log("67 $scope.event.startDateTime:",$scope.event.startDateTime);

                $scope.event.endDateTime = getEndDateTime($scope.event.startDateTime,$scope.event.duration).toString("d-MMM-yyyy HH:mm");

            },function errorCallback(response){
                console.log("error response:",response);
                
        }); 
    }

    populateEventForm();

     //duration in hours
    function getEndDateTime(startDateTime,duration){

        var duration_hr = parseInt(duration);
        var duration_min = (duration-duration_hr)*60;
        //var duration_sec = duration*3600; 
        
        console.log("66 duration_hr:",duration_hr, "duration_min:",duration_min);

        var _startDateTime = Date.parse(startDateTime);
        var endDateTime = _startDateTime.add({hours:duration_hr,minutes:duration_min});

        console.log("66 endDateTime:",endDateTime);
        return endDateTime;
    }

    function resetEventFields(){
        $scope.event = {
            startDateTime:"",
            duration:"",
            capacity:"",
            endDateTime:"",
        };
    }

    */




}]);







