'use strict';

angular.module('EnbalaApp')

.controller('ForecastModalController', ["$scope", "$element", "$route", "$routeParams", "$location", "$http", "ModalService","close","DrServices","NetworkServices","$timeout","modal_input_selected_slot", function($scope,$element,$route,$routeParams,$location,$http,ModalService,close,DrServices,NetworkServices,$timeout,modal_input_selected_slot) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.navbarTitle = "enCast";

    var networkID = $routeParams.networkID;
    var serviceID = $routeParams.serviceID;

    console.log("forecastModalController, $routeParams:",$routeParams);

    var config = {
        container:"#cost-curve",
    };

    var costCurve = enbala_app.cost_curve(config);

    var selected_slot = modal_input_selected_slot;

    /*
    var merit_curve_json = generateMeritCurveJSON(selected_slot);

    function generateMeritCurveJSON(slot){
        console.log("generateMeritCurveJSON, slot:",slot);

        return slot.merit_curve_data;

    }
    */

    //costCurve.plot(merit_curve_json);

    generateMeritCurveJSON(selected_slot,function(err,json){
        if(err) return console.log(err);

        costCurve.plot(json);

    });

    function generateMeritCurveJSON(slot,cb){
        console.log("generateMeritCurveJSON, slot:",slot);

        cb(null,slot.merit_curve_data);

    }

    $scope.closeModal = function() {
        console.log("32 closeModal");

        //  Manually hide the modal.
        $element.modal('hide');

        //remove tooltip
        $('.d3-tip').remove();
        
        //  Now call close, returning control to the caller.
        close({}, 500); // close, but give 500ms for bootstrap to animate
    };

    $scope.dismissModal = function(result) {
        console.log("32 dismissModal");
        close(result, 200); // close, but give 200ms for bootstrap to animate
     };


}]);









