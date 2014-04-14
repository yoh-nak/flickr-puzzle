//viewport効かないブラウザ用
/*
if(parseInt(screen.width) > 320){
	monaca.viewport({
		width:320,
		height:480,
		onAdjustment:function(scale) {
			// write code something.
		}
	});	
}
*/

/*
$(window).bind('resize load', function(){
	$("html").css("zoom" , $(window).width()/320 );
	$("html").css("zoom" , $(window).height()/480 );
});
*/

$(document).on("mobileinit",function(e){
	//$.mobile.metaViewportContent = "width=320, height=480, maximum-scale=1.0, user-scalable=no";
	$.mobile.defaultPageTransition = "none";		//ページトランジションなし
	$.mobile.defaultDialogTransition = "none";		//ダイアログトランジションなし
});
