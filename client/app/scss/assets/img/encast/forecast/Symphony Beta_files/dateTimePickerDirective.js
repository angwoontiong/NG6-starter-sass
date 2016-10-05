'use strict';

angular.module('EnbalaApp')

.directive('datetimepicker', function() {
	return {
	    restrict: 'AE',
	    replace: true,
	    template: '<input ng-model="event.startDateTime" ng-change="updateEvent()" placeholder="Start Date & Time" type="text" id="calPicker" class="form-control">',
	    link: function(scope, elem, attrs) {

	        elem.datetimepicker({
	          format:'d M Y H:i',
	        });
	    }
	};
})
.directive('datetimepickerstart', function() {
	return {
	    restrict: 'AE',
	    replace: true,
	    template: '<input ng-model="param.start" placeholder="Start Date & Time" type="text" class="form-control">',
	    link: function(scope, elem, attrs) {

	        elem.datetimepicker({
	          format:'d M Y H:i',
	        });
	    }
	};
})
.directive('datetimepickerend', function() {
	return {
	    restrict: 'AE',
	    replace: true,
	    template: '<input ng-model="param.end" placeholder="End Date & Time" type="text" class="form-control">',
	    link: function(scope, elem, attrs) {

	        elem.datetimepicker({
	          format:'d M Y H:i',
	        });
	    }
	};
});


