//networksController.js

angular.module('EnbalaApp')

.controller('EncontrolController', ["$scope","$rootScope", "$route", "$routeParams", "$location", "$http","DataServices", function($scope, $rootScope, $route, $routeParams, $location, $http, DataServices) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    //$scope.navbarTitle = "Dashboard";
    //$scope.navbarTitle = "enControl";
    //DataServices.set_navbar_title("enControl");
    $scope.$emit('navbar-title', 'enControl');  

    var networkID = $routeParams.networkID;
    //var serviceType = $routeParams.serviceType;
    var serviceID = $routeParams.serviceID;

    $scope.$emit('route-params',
        {
            networkID:networkID,
            serviceID:serviceID
        }
    );

    //for sidebar
    $scope.networkID = networkID.toString();
    $scope.serviceID = serviceID.toString();
    console.log("17 $scope.networkID:",$scope.networkID);
    console.log("17 $scope.serviceID:",$scope.serviceID);


    //$location.url('/login');
    console.log("dashboardController, $routeParams:",$routeParams);
    console.log("16 $scope.$location:",$scope.$location);
    //console.log("17 serviceType:",serviceType);


    //**** filtering ***************************************************
    $scope.premises = ['Premise1','Premise2','Premise3'];
    $scope.feeders = ['Feeder1','Feeder2','Feeder3'];
    $scope.zones = ['A','B','C'];
    $scope.services = [];  //complete list of services {}
    $scope.service_names = [];   //complete list of service names
    $scope.service_selection_names = [];   //list of selected service names
    $scope.service_selection_ids = [];
    //******************************************************************


    //var endPoint = 'https://stormy-bastion-61502.herokuapp.com/api/v1/networks/'+ networkID;
    var endPoint = $rootScope.API_SERVER+'/api/v1/networks/'+ networkID;

    $http.get(endPoint).success(function(data) { 
        
        console.log("36 data:",data);
        if(data.errorMessage){
            console.log("errorMessage:",network.errorMessage);

            if(network.errorMessage=="Unauthorized"){
                console.log("Unauthorized");
                $location.url('/login');
            }else{
                console.log("error message:",network.errorMessage);
                //$route.reload();
            }
            
        }

        //console.log("35 services:",services);
        $scope.network = data.network;
        console.log("52 $scope.network:",$scope.network);

  
    }).error(function(response){
        console.log("response:",response);
    });




    //var endPoint = 'https://stormy-bastion-61502.herokuapp.com/api/v1/services/'+ serviceID;
    var endPoint = $rootScope.API_SERVER+'/api/v1/services/'+ serviceID;
    
    $http.get(endPoint).success(function(data) { 
        
        console.log("36 data:",data);
        if(data.errorMessage){
            console.log("errorMessage:",network.errorMessage);

            if(network.errorMessage=="Unauthorized"){
                console.log("Unauthorized");
                $location.url('/login');
            }else{
                console.log("error message:",network.errorMessage);
                //$route.reload();
            }
            
        }



        //console.log("35 services:",services);
        $scope.current_commitments = data.service.details.current_commitments;
        console.log("83 $scope.current_commitments:",$scope.current_commitments);

  
    }).error(function(response){
            console.log("response:",response);
    });




    (function showGraph(){
        console.log("46 showGraph()");

        //===========================================================
        // Linear graphs
        //===========================================================

        //config--------------------------------------------------
        var config = {
          container:"#graph",
          //charts:['Chart1','Chart2','Chart3','Chart4']
          charts:['Chart3','Chart4']
        };

        //select time format
        var parseDateTime = d3.time.format("%d/%m/%Y %H:%M:%S").parse;

        //real-time graph ticking  interval
        var updateInterval = 1;  //in milliseconds

        var HistoricalDataConfig = {
          method:"json",    //csv, json
          source:"/api/v1demo/SF"
        }

        console.log("107 HistoricalDataConfig:",HistoricalDataConfig);

        //---------------------------------------------------------


        var graphObj = enbala_app.graph(config);
        console.log("graphObj:",graphObj);

        
        function type(d) {
            d.datetime = parseDateTime(d.datetime);

            var i;
            var num_of_charts = config.charts.length;
            var charts = config.charts;

            for(i=0;i<num_of_charts;i++){
            var chartName = charts[i];
            //console.log("564 chartName:",chartName);
            d[chartName] = +d[chartName];
            }

            return d;
        }

        (function test(){
          var mydata = {datetime: '20/10/2015 11:59:39',
                        Chart1: '-2008.094674',
                        Chart2: '-2077.456936',
                        Chart3: '470.6743218',
                        Chart4: '-1561.061403' }
          console.log("516 mydata:",mydata);
          
          var newdata = type(mydata);
          console.log("519 newdata:",newdata);              

        })();

        function reformatData(_data){
            _data.forEach(function(d) {
                d.datetime = parseDateTime(d.datetime); //format datetime

                for(i=0;i<num_of_charts;i++){
                    var chartName = charts[i];
                    d[chartName] = +d[chartName];   //+ sign converts string to number
                }
            });

            return _data;
        }

        var i;
        var num_of_charts = config.charts.length;
        var charts = config.charts;

        console.log("132 get historical data");

        function getHistoricalData(config,cb){

            //$http.get('/api/v1demo/SF').success(function(data) {
            $http.get('/api/v1demo/FR').success(function(data) {  
        
                if(data.errorMessage){
                    console.log("errorMessage:",data.errorMessage);

                    if(data.errorMessage=="Unauthorized"){
                        console.log("Unauthorized");
                        $location.url('/login');
                    }else{
                        console.log("error message ignored. Reload page");
                        $route.reload();
                    }
                    
                }

                data = reformatData(data);  //reformat data for plotting
                graphObj.plot(data);   //plot data

          
            }).error(function(response){
                    console.log("response:",response);
            });

          
        }

        getHistoricalData(HistoricalDataConfig, function(err,data){
            console.log("146 getHistoricalData, data:",data);
          if(err) return console.log("err:",err);
          console.log("145 data:",data);
        });  



    })();  







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