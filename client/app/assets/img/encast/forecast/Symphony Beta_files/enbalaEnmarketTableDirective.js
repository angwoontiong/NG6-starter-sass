
angular.module('EnbalaApp')

.directive('enbalaEdisonEnmarketTable', function() {
	'use strict';
	
	return {
		restrict:'E',
		templateUrl:'app/components/enmarket-table/edisonSPA/enmarket-table.html',
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




/*
'use strict';

angular.module('EnbalaApp')

.directive('enbalaEdisonEnmarketTable', function() {
	return {
		restrict:'E',
		templateUrl:'app/components/enmarket-table/edisonSPA/enmarket-table.html',
		link: function(scope,element,attrs){
	
			element.on('click','tr.event-id',function(e){
				e.stopPropagation();
				console.log("19 tr clicked");

				var $selected = $(e.currentTarget);

				var $icon = $selected.find('th i');
				$icon.toggleClass('fa-angle-down fa-angle-up');

				$selected.toggleClass('selected-hr');

				$selected.nextUntil('tr.event-id').toggleClass('site-display');

			});

			element.on('click','tr.portfolio img',function(e){
				console.log("36 image clicked");
				e.stopPropagation();
			});

		}

	};
});
*/