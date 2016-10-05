//networksController.js

angular.module('EnbalaApp')

.controller('EncastController', ["$scope","$rootScope","$route", "$routeParams", "$location", "$http", "ModalService","DrServices","NetworkServices", function($scope,$rootScope, $route, $routeParams, $location, $http, ModalService,DrServices,NetworkServices) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    //$scope.navbarTitle = "enCast";
    $scope.$emit('navbar-title', "enCast");  

    //variables from URL
    var networkID = $routeParams.networkID;
    var serviceID = $routeParams.serviceID;

    //for sidebar
    $scope.networkID = networkID.toString();
    $scope.serviceID = serviceID.toString();


    //mock
    /*
    $scope.serviceDetails = [
        {id:1,name:'NYISO: conEdison CSRP'},
        {id:2,name:'NYISO: conEdison DLRP'}
    ];*/


    //$scope.services_summary = [];
    
    //demo-------------------------
    $scope.premises = ['Premise1','Premise2','Premise3'];
    $scope.feeders = ['Feeder1','Feeder2','Feeder3'];
    $scope.zones = ['A','B','C'];


    //load from api
    //$scope.services = ['NYISO: conEdison CSRP','NYISO:conEdison DLRP'];
    $scope.services = [];  //complete list of services {}
    $scope.service_names = [];   //complete list of service names
    $scope.service_selection_names = [];   //list of selected service names
    $scope.service_selection_ids = [];


    var endPoint = $rootScope.API_SERVER+'/api/v1/networks/'+ networkID;
    //console.log("40 endPoint:",endPoint);

    $http.get(endPoint).success(function(data){
        //console.log("43 data:",data);
        var network = data.network;
        //console.log("46 network:",network);

        var services = network.services_summary;
        $scope.services = services;
        //$scope.services = network.services_summary;
        //console.log("49 services:",services);

        /*
        for (var service in services_summary){
            console.log("48 service:",service);
            $scope.services.push(service.name);
        }*/

        services.map(function(service){
            //console.log("58 service:",service);
            $scope.service_names.push(service.name);
        });
        //console.log("65 $scope.service_names:",$scope.service_names);

        //initial selection
        $scope.service_selection_names = []; //multiselect
        $scope.service_selection_name = null;   //single select
        $scope.service_selection_ids = [];
        //$scope.service_selections = []; //NEW!!!

        var initial_service_selection = getServiceByID(serviceID,services); 
        //console.log("68 initial_service_selection:",initial_service_selection);
        //console.log("68 service_selection_names:",service_selection_names);
        $scope.service_selection_names.push(initial_service_selection.name); //multiselect
        $scope.service_selection_name = initial_service_selection.name;  //single select
        $scope.service_selection_ids.push(initial_service_selection.id);
        //$scope.service_selections.push(initial_service_selection);

        //console.log("79 $scope.service_selection_ids:",$scope.service_selection_ids);
        //console.log("79 $scope.service_selection_names:",$scope.service_selection_names);
        //console.log("79 $scope.service_selection_name:",$scope.service_selection_name);
        //console.log("79 $scope.service_selection_name:",$scope.service_selection_name);

    }).error(function(response){
        console.log("response:",response);
    });

    
    $scope.$watch('service_selection_names', function() {
        //alert('hey, service_selection_names has changed!');
        //console.log("87 service_selection_names changed");

        $scope.service_selection_ids = namesToIDs($scope.service_selection_names);   //namesToIDs
        //console.log("87 $scope.service_selection_names:",$scope.service_selection_names);
        //console.log("87 $scope.service_selection_ids:",$scope.service_selection_ids);
    });


    //single select
    $scope.$watch('service_selection_name', function() {
        //alert('hey, service_selection_names has changed!');
        //////console.log("105 service_selection_name changed");

        $scope.service_selection_names = [];
        $scope.service_selection_names.push($scope.service_selection_name);
        $scope.service_selection_ids = namesToIDs($scope.service_selection_names);   //namesToIDs
        //////console.log("105 $scope.service_selection_names:",$scope.service_selection_names);
        //////console.log("105 $scope.service_selection_name:",$scope.service_selection_name);
        //////console.log("105 $scope.service_selection_ids:",$scope.service_selection_ids);
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
        //console.log("118 service_found:",service_found);
        return service_found;
    }

    function namesToIDs(names){
        //console.log("157 names:",names, " $scope.services:",$scope.services);
        var IDs = [];
        var id;

        //if name is a string (i.e. single select)
        if(typeof names === 'string'){

            ////console.log("157 names is a string");
            id = nameToID(names,$scope.services);
            IDs.push(id);
        }else if(typeof names === 'object'){   //if name is an array (i.e. multiselect)

            ////console.log("157 names is an object");
            
            names.map(function(name){
                id = nameToID(name,$scope.services);
                IDs.push(id);
            });
        }else{
            IDs = [];
        }
        

        //console.log("157 return IDs:",IDs);
        return IDs;
    }

    function nameToID(name,services){
        //console.log("157 nameToID name:",name," services:",services);
        var ID=null;

        //get service by name
        services.map(function(service){
            //console.log("157 service:",service);

            if(service.name === name){
                //console.log("157 found service matching name:",name);
                ID = service.id;
            }

        });
        //console.log("157 return ID:",ID);
        return ID;
    }


    //if any option is deselected, deselect 'all'

    $scope.isServiceSelected = function(service_name){

        //multiselect
        /*
        if($scope.service_selection_names){


            if($scope.service_selection_names.indexOf(service_name)>=0){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }*/


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
        ////console.log("$scope.zone_selections:",$scope.zone_selections);
        ////console.log("zone:",zone);

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




    $scope.isFeederSelected = function(feeder){
        //console.log("$scope.feeder_selections:",$scope.feeder_selections);
        //console.log("feeder:",feeder);

        var feeder_selections = $scope.feeder_selections;

        if($scope.feeder_selections){


            if(feeder_selections.indexOf(feeder)>=0){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }

    }


    $scope.isPremiseSelected = function(premise){
        ////console.log("$scope.premise_selections:",$scope.premise_selections);
        ////console.log("premise:",premise);

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




    //==========================
    //Dropzone
    //==========================
    //Set options for dropzone
    //Visit http://www.dropzonejs.com/#configuration-options for more options
    
    $scope.dzOptions = {
        url : '/api/v1/fileupload',
        paramName : 'csv',
        maxFilesize : '0.01',
        //acceptedFiles : 'image/jpeg, images/jpg, image/png',
        acceptedFiles : '.csv',
        addRemoveLinks : true,
        addDownloadLinks: true   //woon
    };


    $scope.uploaded = [];

    
    //Handle events for dropzone
    //Visit http://www.dropzonejs.com/#events for more events
    $scope.dzCallbacks = {
        'addedfile' : function(file){
            console.log("added file:",file);

            $scope.newFile = file;
        },
        'success' : function(file, xhr){
            console.log("success...file:",file," xhr:",xhr);

            var remote_filename = xhr.filename;
            console.log("remote_filename:",remote_filename);

            file.serverFileID = remote_filename;

            $scope.uploaded.push(remote_filename);
            console.log("$scope.uploaded:",$scope.uploaded);

        },
        'removedfile': function(file){
            console.log("removedfile, file:",file);
            //$scope.removeNewFile(file);
            $scope.removeFileOnServer(file);
        }
        
    };


    //Apply methods for dropzone
    //Visit http://www.dropzonejs.com/#dropzone-methods for more methods
    $scope.dzMethods = {};
    $scope.removeNewFile = function(){
        console.log("324 remove file");
        $scope.dzMethods.removeFile($scope.newFile); //We got $scope.newFile from 'addedfile' event callback
    }
    $scope.removeFileOnServer = function(file){
        console.log("346 file:",file);
        var serverFileID = file.serverFileID;
        console.log("removing serverFileID:",serverFileID);

        var params = {serverFileID:serverFileID};

        $http({
            method:'POST',
            url:'/api/v1/fileremove',
            data: params,
            headers:{'Content-Type':'application/json'}
        })
        .then(function successCallback(){
            console.log("359 success");
        },function errorCallback(){
            console.log("361 error");
        });
    }

    
    $scope.downloadFile = function(){

        var serverFileID = "29124-1s7exq1.csv";
        console.log("downloading serverFileID:",serverFileID);
        var params = {serverFileID:serverFileID};

  
        $.fileDownload('/api/v1/download',{
            httpMethod : "POST",
            data : params
        }).done(function(e, response){
            // success
            console.log("380 success");
        }).fail(function(e, response){
            // failure
            console.log("380 failure");
        });
        

        //var params = {serverFileID:serverFileID};
        /*
        $http({
            method:'POST',
            url:'/api/v1/fileremove',
            data: params,
            headers:{'Content-Type':'application/json'}
        })
        .then(function successCallback(){
            console.log("359 success");
        },function errorCallback(){
            console.log("361 error");
        });*/
    }
}]);






