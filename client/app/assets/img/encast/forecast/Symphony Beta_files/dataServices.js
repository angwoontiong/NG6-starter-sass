'use strict';

angular.module('EnbalaApp')

.factory('DataServices', [function() {
  
    var data = {
        navbar_title:""
    };

    function set_navbar_title(data) {
        console.log("10 navbar_title set to:",data)
        data.navbar_title = data;
    }

    /*
    function get_navbar_title() {
        console.log("15 get_navbar_title");
        return data.navbar_title;
    }*/

    function get_data(){
        return data;
    }

    return {
        set_navbar_title: set_navbar_title,
        //get_navbar_title: get_navbar_title
        get_data: get_data
    }

}]);


