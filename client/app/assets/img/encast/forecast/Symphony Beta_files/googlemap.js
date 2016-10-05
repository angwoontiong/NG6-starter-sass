angular.module('EnbalaApp')

.factory('gService', function($http){

    // Initialize Variables
    var googleMapService = {};   //Service our factory will return
    var locations = []; //location array from server
    var infoWindow;
    var markers = [];   //markers to be placed on map
    var map;
    var bounds;

    var styles = [
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f7f1df"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#d0e3b4"
                }
            ]
        },
        {
            "featureType": "landscape.natural.terrain",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.medical",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#fbd3da"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#bde6ab"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#ffe15f"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#efd151"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#fff"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "black"
                }
            ]
        },
        {
            "featureType": "transit.station.airport",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#cfb2db"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#199ad6"
                }
            ]
        }
    ];




    // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
    googleMapService.showMap = function(latitude, longitude, locations, elementID){
        map = initMap(elementID);
        locations = locations;
        console.log("50 locations:",locations);

        //create markers
        markers = createMarkers(locations);

        //add clustering feature
        var markerCluster = new MarkerClusterer(map, markers);

    };


    //==========================================================
    //private functions
    //===========================================================
    function initMap(elementID){

        //initialize bounds
        bounds = new google.maps.LatLngBounds();

        var mapOptions = {
            //zoom: 3,
            mapTypeId: 'roadmap',
            mapTypeControl: false,
            streetViewControl: false,
            center: {lat: 39.5, lng: -98.35}
        };

        // Create a new map and place in the index.html page
        map = new google.maps.Map(document.getElementById(elementID), mapOptions);
        map.setTilt(45);
        map.setOptions({styles: styles}); 

        return map;
    };

    //create markers
    function createMarkers(locations){
        console.log("createMarkers, map:",map);
        var markers = [];

        // Loop through locations
        for(var i= 0; i < locations.length; i++) {
            var location = locations[i];
            var marker = createMarker(location);
            markers.push(marker);
        }


        return markers;
    }


    //create one marker
    function createMarker(location){
        var title = location.title;
        var position = new google.maps.LatLng(location.latitude, location.longitude);
        var markerColor = location.color;

        //update bounds to include current marker
        bounds.extend(position);

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            //icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"//,
            icon: 'https://maps.google.com/mapfiles/ms/icons/' + markerColor + '.png',
        });  


        //infoWindow
        infoWindow = createInfoWindow(location);
        
        //on 'click', display infoWindow    
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });

        map.fitBounds(bounds);


        // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            console.log("159 bounds changed");
            this.setZoom(4);
            google.maps.event.removeListener(boundsListener);
        });

        return marker;
    }

    
    function createInfoWindow(location){

        var contentString = 
                "<h4>" + location.title + "</h4>" + 
                "<ul>" + 
                "<li>Resources: " + location.resource1 + ", " + location.resource2 + ", " + location.resource3 + "</li>" +
                "<li>Capacity (kW):" + location.capacity + "</li>" +
                "</ul>" +
                "<p><a href='" + location.url + "'>" + "View Details <i class='fa fa-angle-right'></i></a></p>";  

        _infoWindow = new google.maps.InfoWindow({
            content: contentString
        });

        return _infoWindow;
    }

    return googleMapService;
})
