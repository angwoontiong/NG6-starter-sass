'use strict';

angular.module('EnbalaApp')

.directive('timepicker', function() {
	return {
	    restrict: 'AE',
	    replace: true,
	    template: '<input placeholder="Hour Ending" type="text" class="form-control">',
	    link: function(scope, elem, attrs) {

	        elem.datetimepicker({
	          	datepicker:false,
  				format:'H:i'
	        });
	    }
	};
});


