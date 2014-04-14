//phonegap初期化
if(typeof device === 'undefined'){
	document.addEventListener("deviceready", onDeviceReady, false);
}
else{
	 onDeviceReady();
	 
	//初回だけcanvasに反映しないために裏でリロード
	//$.mobile.changePage("#index", { transition: "none",allowSamePageTransition : true, reloadPage: true });
}

function onDeviceReady() {
	
	gapFlg = true;
	
	//初回だけcanvasに反映しないために裏でリロード
	$.mobile.changePage("#index", { transition: "none",allowSamePageTransition : true, reloadPage: true });
}

//カメラ起動
function capture(){

	navigator.camera.getPicture(
		pictureSuccess,
		pictureError,
		{quality:50, destinationType: Camera.DestinationType.FILE_URI,sourceType: Camera.PictureSourceType.CAMERA}
	);
	
	//初回だけcanvasに反映しないために裏でリロード
	//$.mobile.changePage("#index", { transition: "none",allowSamePageTransition : true, reloadPage: true });
}

function gallery(){
	
	navigator.camera.getPicture(
		pictureSuccess,
		pictureError,
		{quality:50, destinationType:Camera.DestinationType.FILE_URI, sourceType: Camera.PictureSourceType.PHOTOLIBRARY}
	);
	
	//初回だけcanvasに反映しないために裏でリロード
	//$.mobile.changePage("#index", { transition: "none",allowSamePageTransition : true, reloadPage: true });
}

//画像取得成功
function pictureSuccess(url){
	
	//alert("pictureSuccess: " + url);
	
	camera_image = url;
	
	//撮影した画像のフルパスを調べる（デバッグ用）
	//window.resolveLocalFileSystemURI(url, successUri2Path, failUri2Path);
	
	$.mobile.changePage("#index", { transition: "none",allowSamePageTransition : true, reloadPage: true });
}

//撮影した画像のフルパスを調べる（成功）
function successUri2Path(FileEntry){
	alert(FileEntry.fullPath);
}
//撮影した画像のフルパスを調べる（失敗）
function failUri2Path(evt){
	alert("error:" + evt.code);
}
	
	
//画像取得失敗
function pictureError(error){
	
	//alert("pictureError:" + error);
	
	$.mobile.changePage('#error3', {
		 transition: 'none',
		 role: 'dialog'
	});
}