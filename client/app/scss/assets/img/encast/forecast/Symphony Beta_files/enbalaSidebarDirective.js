'use strict';

angular.module('EnbalaApp')

.directive('enbalaSidebar', function() {
	return {
		restrict:'E',
		templateUrl:'app/components/sidebar/sidebar.html',

		//@: value, =: object, &: expression
		scope:{
			networkID:'@networkId',
			serviceID:'@serviceId',
			navbarTitle:'@navbarTitle'
		},
		link: function(scope, element, attrs) {

			//sidebar menu selection
			scope.isActive = function(menu_select){
				if (menu_select === scope.navbarTitle){ 
				    return true;
				} else {
				    return false;
				}
			}

			element.find('enbala-sidebar').addClass('sidebar-collapsed');

			
			element.find('#sidebar-switch').on('click',function(event){
				console.log("28 collapse sidebar now");

				event.preventDefault();
				event.stopPropagation();
    			$('enbala-sidebar').toggleClass('sidebar-collapsed');

    			$('#sidebar-switch .fa').toggleClass('fa-chevron-right fa-chevron-left ');

    			$('.sidebar--subtitle').toggleClass('invisible');
			});
	    }

	};
});
