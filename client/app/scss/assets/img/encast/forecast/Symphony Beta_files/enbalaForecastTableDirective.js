
angular.module('EnbalaApp')

.directive('enbalaForecastTable', function() {
	'use strict';
	
	return {
		restrict:'E',
		templateUrl:'app/components/forecast-table/forecast-table.html',
		link: function(scope,element,attrs){
			
			element.on('click','tr.portfolio',function(e){
				e.stopPropagation();

				var $selected = $(e.currentTarget);

				//toggle icon
				var $icon = $selected.find('td i');
				$icon.toggleClass('fa-angle-down fa-angle-up');

				//find out which group clicked element belongs to
				var $group = $selected.attr('class').match(/G\w+/g);
				$('.'+$group).toggleClass('selected-hr');

			});

			element.on('click','tr.portfolio img',function(e){
				e.stopPropagation();
			});

		}

	};
});
