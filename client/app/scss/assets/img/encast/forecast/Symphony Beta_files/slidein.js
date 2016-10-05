// from https://codyhouse.co/gem/css-slide-in-panel/

jQuery(document).ready(function($){
	console.log("4456 slidein");
	//open the lateral panel
	$('.slide-btn').on('click', function(event){
		event.preventDefault();
		console.log("4 slidein clicked");
		$('.slide-panel').addClass('is-visible');
	});
	//close the lateral panel
	$('.slide-panel').on('click', function(event){
		event.preventDefault();
		if( $(event.target).is('.slide-panel') || $(event.target).is('.slide-panel-close') ) { 
			$('.slide-panel').removeClass('is-visible');
			//event.preventDefault();
		}
	});

});