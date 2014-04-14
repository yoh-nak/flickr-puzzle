//************************************
//【最初にチェック】
//************************************
var appFlg = true;	//アプリ版の時true、Web版の時false
//closureの場合、アプリ版の時：0、Web版の時：1

//************************************
//【グローバル変数】
//************************************

var gapFlg = false;	//デバイスの準備ができているか
var title;				//タイトル画像用キャンバスコンテキスト
var main_image;			//キャンバス描画用
var flickr_image		//フリッカーから取得した画像
var camera_image;		//実機から取得した画像
var image;				//読み込み画像用キャンバスコンテキスト
var keyword;			//検索キーワード
var name = "";				//お名前
var canvas				//キャンバス
var con;				//キャンバスコンテクスト
var image_per;
var cell_w;
var cell_h;
var panels = [];		//パネル配列
var pos_array = [];
var col,row,col2,col2;
var no;					//パネル番号
var gameFlg = false;	//ゲーム中かどうか
var clearFlg;			//ゲームにクリアしたかどうか
var clearTime;			//クリア時間
var watchFlg = 0;

//flickr取得用配列
var aryFlickrImage = new Array();	//画像
var aryFlickrTitle = new Array();	//タイトル

//************************************
//【ネットワーク接続】
//************************************

//起動時のネットワーク状態
var netFlg;
if(navigator.onLine){
	netFlg = true;
}
else{
	netFlg = false;
}

//************************************
//【設定の読み込み】
//************************************

//画像枚数
var numImage;
if(localStorage["numImage"]){
	numImage = localStorage["numImage"];
}
else{
	numImage = 10;
}		
	
//完成画像表示時間
var timeClearImg;
if(localStorage["timeClearImg"]){
	timeClearImg = localStorage["timeClearImg"];
}
else{
	timeClearImg = 3000;
}

//パネル番号表示
var showPanelNoFlg;
if(localStorage["showPanelNoFlg"]){
	showPanelNoFlg = localStorage["showPanelNoFlg"];
}
else{
	showPanelNoFlg = false;
	localStorage["showPanelNoFlg"] = showPanelNoFlg;
}

//パネル番号透明度
var alphaPanelNo;
if(localStorage["alphaPanelNo"]){
	alphaPanelNo = localStorage["alphaPanelNo"];
}
else{
	alphaPanelNo = 0.8;
}

//パネル番号色
var colorPanelNoR;
if(localStorage["colorPanelNoR"]){
	colorPanelNoR = localStorage["colorPanelNoR"];
}
else{
	colorPanelNoR = 255;
}

var colorPanelNoG;
if(localStorage["colorPanelNoG"]){
	colorPanelNoG = localStorage["colorPanelNoG"];
}
else{
	colorPanelNoG = 0;
}

var colorPanelNoB;
if(localStorage["colorPanelNoB"]){
	colorPanelNoB = localStorage["colorPanelNoB"];
}
else{
	colorPanelNoG = 132;
}

//空白パネル色
var colorBlankPanelR;
if(localStorage["colorBlankPanelR"]){
	colorBlankPanelR = localStorage["colorBlankPanelR"];
}
else{
	colorBlankPanelR = 0;
}

var colorBlankPanelG;
if(localStorage["colorBlankPanelG"]){
	colorBlankPanelG = localStorage["colorBlankPanelG"];
}
else{
	colorBlankPanelG = 99;
}

var colorBlankPanelB;
if(localStorage["colorBlankPanelB"]){
	colorBlankPanelB = localStorage["colorBlankPanelB"];
}
else{
	colorBlankPanelB = 220;
}

var ranking = new Array();

if(localStorage["ranking"]){
	ranking = JSON.parse(localStorage["ranking"]);
	
	//console.log(ranking);
}





//************************************
//【グローバル関数】
//************************************

//***タイトル画像描画***//
function drawTitle(){
	
	//alert("drawTitle");
	
	//アプリ版の時
	if(appFlg == true){
		
		//alert("app");
		//navigator.splashscreen.show();
		
		if(gapFlg == true){
			canvas = document.getElementById("game_canvas");
			con = canvas.getContext("2d");
			title = new Image();
			title.src = "title.png";
			
			title.onload = function(){
				con.drawImage(title, 0, 0);	
				
				//$("#search").addClass("ui-enabled");
			}
		}
	}
	//Web版のとき
	else{
		
		//alert("web");
		
		//フルスクリーン
		/*
		if(jQuery.browser.msie){
            //
        }
        else if(jQuery.browser.mozilla){
            document.querySelector("body").mozRequestFullScreen();
        }
        else if(jQuery.browser.webkit){
            document.querySelector("body").webkitRequestFullScreen();
        }
        else if(jQuery.browser.opera){
            //
        }
		*/
		
		canvas = document.getElementById("game_canvas");
		con = canvas.getContext("2d");
		title = new Image();
		title.src = "title.png";
		
		title.onload = function(){
			con.drawImage(title, 0, 0);	
			
			//$("#search").addClass("ui-enabled");
		}	
	}
}


// 画像検索を行う関数
function photo_search ( param ) {
	
	//alert("photo_search");
	
	if(navigator.onLine){
		// APIリクエストパラメタの設定
		//param.api_key  = '339f7f7c281770607e9ee08974d17c45';
		param.api_key  = 'f1ceb9f9e8a2ec81323fc616ae12f037';
		param.method   = 'flickr.photos.search';
		
		//取得枚数
		param.per_page = numImage;
		
		param.sort     = 'date-posted-desc';
		param.format   = 'json';
		param.jsoncallback = 'jsonFlickrApi';
	
		// APIリクエストURLの生成(GETメソッド)
		var url = 'http://www.flickr.com/services/rest/?' + obj2query(param);
	
		// script 要素の発行
		var script  = document.createElement('script');
		script.type = 'text/javascript';
		script.src  = url;
		document.body.appendChild(script);
	}
	else{
		$.mobile.changePage('#error6', {
			 transition: 'none',
			 role: 'dialog'
		});
	}
}


// 現在の表示内容をクリアする
function remove_children (id) {
	
	//alert("remove_children");
	
    var div = document.getElementById( id );
    while ( div.firstChild ) { 
        div.removeChild( div.lastChild );
    }
}

// オブジェクトからクエリー文字列を生成する関数
function obj2query (obj) {
	
	//alert("obj2query");
	
    var list = [];
    for( var key in obj ) {
        var k = encodeURIComponent(key);
        var v = encodeURIComponent(obj[key]);
        list[list.length] = k+'='+v;
    }
    var query = list.join( '&' );
    return query;
}

function checkPanelXY(sx, sy){
		
	
	//alert("checkPanelXY");
	
	col = Math.floor(sx / cell_w);
	row = Math.floor((sy-20) / cell_h);
	
	//パネル番号
	no = row * 4 + col;
	
	//クリックしたパネル番号
	//alert("クリックしたパネルの位置" + no);
	
	//パネルの本来の位置
	//alert("パネルの本来の位置" + panels[no]);
	
	if(panels[no] == 15){
		return;	
	}
	
	/*
	if(no == panels[no]){
		alert("OK");
	}
	*/
	
	//pos_array.length = 4
	for(var i = 0; i < pos_array.length; i++){
		row2 = pos_array[i][0] + row;
		col2 = pos_array[i][1] + col;
		
		//周囲のパネルのチェック
		var check = getPanelNo(row2, col2);
		
		//周囲のパネルに15があったら交換
		if(check == 15){
			swapPanel(row, col, row2, col2);
		}
	}

}

//隣り合ったパネル番号のチェック
function getPanelNo(row, col){
	
	//alert("getPanelNo");
	
	//キャンバスからはみ出す周囲のパネル
	if(col < 0 || row < 0 || col >= 4 || row >= 4){
		return -1;
	}
	
	return panels[row * 4 + col];
}

function swapPanel(row1, col1, row2, col2){
	
	//alert("swapPanel");
	
	var index1 = row1 * 4 + col1;
	var index2 = row2 * 4 + col2;
	
	var tmp = panels[index1];
	
	//パネル15
	panels[index1] = panels[index2];
	//クリックしたパネル
	panels[index2] = tmp;
	
	drawPanels();
	
	//正しい位置のパネル数
	//alert("正しい位置のパネル数" + clearFlg);
	
	//仮想クリア
	//clearFlg = 16;
	
	//正しい位置のパネルが15個になったときクリア
	if(clearFlg == 16){
		
		//alert("クリア");
		
		gameFlg = false;
		
		//タイマーストップ
		myWatch(0);
		
		localStorage["clearTime"] = clearTime;
		
		$.mobile.changePage("#clear", { transition: "none"});
	}
}

function shufflePanel(){

	//alert("shufflePanel");
	
	//検索ボックス無効
	//$("#search").addClass("ui-disabled");	
	
	for(var i = 0; i < 16; i++){
		panels[i] = i	
	}

	for(var j = 0; j < 16; j++){
		var r = Math.floor(Math.random()*16);
		
		var tmp = panels[r];
		
		panels[r] = panels[j];
		
		panels[j] = tmp;	
	}

	drawPanels();
	
	//ボタン非表示
	//$("#index .ui-header .ui-btn").hide();
		
	//タイマースタート
	myWatch(0);
}

function drawPanels(){
	
	//alert("drawPanels");
	
	//クリアフラグリセット
	clearFlg = 0;

	for(var i = 0; i < 16; i++){
		var no = panels[i];
		
		//クリアフラグ繰り上げ（15になったらクリア）
		if(i == no){
			clearFlg++;
		}
		
		var pcol = no % 4;
		var prow = Math.floor(no / 4);
		
		var px = pcol * cell_w;
		var py = prow * cell_h;
		
		var tx = (i % 4) * cell_w;
		var ty = Math.floor(i / 4) * cell_h;
		
		if(no == 15){
			con.beginPath();
			
			con.fillStyle = "rgba(" + colorBlankPanelR + ", " + colorBlankPanelG + ", " + colorBlankPanelB + ", 1.0)";
			
			con.fillRect(tx, ty, cell_w, cell_h);
				
		}
		else{
		
			/*
			con.drawImage(image,
			px, py, cell_w, cell_h,
			tx, ty, cell_w, cell_h)	
			*/
			
			con.drawImage(image,
			 px * image_per, py * image_per,
			 image_w / 4, image_w / 4,
			 tx, ty, cell_w, cell_w);
			 
			 $.mobile.hidePageLoadingMsg();
		}
		
		
		if(showPanelNoFlg == "true" || showPanelNoFlg == true){
			
			con.font = 60 + "px Osaka";
			con.fillStyle = 'rgba(' + colorPanelNoR + ', ' + colorPanelNoG + ', ' + colorPanelNoB + ', '+ alphaPanelNo +')';
			
			if(no < 10){
				con.fillText(no, tx+24, ty+60);
			}
			else{
				con.fillText(no, tx+8, ty+60);
			}

		}

		con.beginPath();
		con.moveTo(tx + cell_w, ty);
		con.lineTo(tx, ty);
		con.lineTo(tx, ty + cell_h);
		con.strokeStyle = "#999999";
		con.stroke();
		
	}
	
	//e.preventDefault();
		
}


// Flickr検索終了後のコールバック関数
function jsonFlickrApi ( data ) {
	
	//alert("jsonFlickrApi");
	
    // データが取得できているかチェック
	if($("#search").val() == ""){
		$.mobile.changePage('#error2', {
			 transition: 'none',
			 role: 'dialog'
		});
	}
	else if (!data){
		$.mobile.changePage('#error1', {
			 transition: 'none',
			 role: 'dialog'
		});
		
		return;
	}
	else if (!data.photos){
		$.mobile.changePage('#error1', {
			 transition: 'none',
			 role: 'dialog'
		});
		
		return;
	}
	else{
		var list = data.photos.photo;
		
		//console.log(list);
		
		if (!list){
			$.mobile.changePage('#error1', {
				 transition: 'none',
				 role: 'dialog'
			});
			
			 return;
		}
		else if (!list.length){
			$.mobile.changePage('#error1', {
				 transition: 'none',
				 role: 'dialog'
			});
			
			 return;
		}
	}

    // 現在の表示内容（Loading...）をクリアする
    //remove_children( 'photos_here' );

    // 各画像を表示する
    //var div = document.getElementById( 'photos_here' );
    
	//flickrから取得した画像配列
	//var aryFlickrImage = new Array();
	
	//配列例セット
	aryFlickrImage.length = 0;
	aryFlickrTitle.length = 0;
	
	for( var i=0; i<list.length; i++ ) {
        var photo = list[i];

        // a 要素の生成
        var atag = document.createElement( 'a' );
        atag.href = 'http://www.flickr.com/photos/'+
                    photo.owner+'/'+photo.id+'/';

        // img 要素の生成
        var img = document.createElement( 'img' );
		
		//取得画像サイズ
        //img.src = 'http://static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_s.jpg';
		//img.src = 'http://static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
		img.src = 'http://static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';
		
		//配列に格納
		aryFlickrImage.push(img.src);
		aryFlickrTitle.push(photo.title);
		
		
		//imgタグ反映
		/*
        img.style.border = '0';
        atag.appendChild( img );
        div.appendChild( atag );
		*/
	}
	
	//console.log(aryFlickrImage);
	
	$.mobile.changePage("#photo", { transition: "none"});
		
}

function getFlickrImage(){
	
	//本番用
	main_image = flickr_image;
	//ダミー画像
	//main_image = "dummy.png";
	
	//完成画像セット
	$(".popphoto").attr("src",main_image);

	//var panels = [];
	
	cell_w = 320 / 4;
	cell_h = 320 / 4;
	
	pos_array = [[-1,0],[1,0],[0,-1],[0,1]];
	
	canvas = document.getElementById("game_canvas");
	
	con = canvas.getContext("2d");
		
	image = new Image();
	
	image.src = main_image;
	
	image.onload = function(){
		
		var per_w = image.width / 320;
		var per_h = image.height / 320;
		
		image_per = per_h;
		
		image_w = image.height;
		
		if(per_w < per_h){
			image_per = per_w;
			image_w = image.width;
		}
		
		con.drawImage(image, 0, 0, image_w, image_w, 0, 0, 320, 320);
		
		flickr_image = null;
		
		//完成画像を一定時間表示
		setTimeout(shufflePanel, timeClearImg);
		
	}
	
}

function getCameraImage(){
	
	//alert("getCameraImage");
	
	//キャンバスに画像セット
	
	//本番用
	main_image = camera_image;
	//ダミー画像
	//main_image = "dummy.png";
	
	//完成画像セット
	$(".popphoto").attr("src",main_image);

	//var panels = [];
	
	cell_w = 320 / 4;
	cell_h = 320 / 4;
	
	pos_array = [[-1,0],[1,0],[0,-1],[0,1]];
	
	canvas = document.getElementById("game_canvas");
	
	con = canvas.getContext("2d");
	
	image = new Image();
	
	image.src = main_image;
	
	image.onload = function(){
		
		var per_w = image.width / 320;
		var per_h = image.height / 320;
		
		image_per = per_h;
		
		image_w = image.height;
		
		if(per_w < per_h){
			image_per = per_w;
			image_w = image.width;
		}
		
		con.drawImage(image, 0, 0, image_w, image_w, 0, 0, 320, 320);
		
		//カメラ、ギャラリー写真リセット
		camera_image = null;
		
		
		//完成画像を一定時間表示
		setTimeout(shufflePanel, 3000);
	}	
}
//************************************
//【グローバルページイベント】
//************************************

$(document).on("pagebeforechange",function(e){
	//alert('グローバル：pagebeforechange');
});

$(document).on("pagebeforeload",function(e){
	//alert('グローバル：pagebeforeload');
});

$(document).on("pageload",function(e){
	//alert('グローバル：pageload');
});

$(document).on("pagechange",function(e){
	//alert('グローバル：pagechange');
});


//************************************
//【個別ページイベント】
//************************************

	
//************************************
//【#index】
//************************************

$(document).on("pagebeforecreate","#index",function(e){
	//alert('#index：pagebeforecreate');
});

$(document).on("pagecreate","#index",function(e){
	//alert('#index：pagecreate');
	
});

$(document).on("pageinit","#index",function(e){
	
	//alert('#index：pageinit');
	
	$("#panel,#panel-popup").on({
		popupbeforeposition: function() {
			
			var h = $( window ).height();
			
			$( "#panel" ).css( "height", h );
			
			//alert(navigator.userAgent);
			
		},
		popupafteropen:function(){
						
			//サイドパネル設定読み込み
			
			//パネル番号表示			
			if(showPanelNoFlg == "true" || showPanelNoFlg == true){
				$(".show-panel-no").val("on");
			}
			else{
				$(".show-panel-no").val("off");
			}
			
			$(".show-panel-no").slider('refresh');
			
			//パネル番号透明
			if(localStorage["alphaPanelNo"]){
				$(".alpha-panel-no").val(localStorage["alphaPanelNo"] * 10);
			}
			else{
				$(".alpha-panel-no").val("8");
			}
			
			
			$(".alpha-panel-no").slider('refresh');
			
			
			//パネル番号色
			if(localStorage["colorPanelNoR"]){
				$(".color-panel-no-r").val(localStorage["colorPanelNoR"]);
			}
			else{
				$(".color-panel-no-r").val("255");
			}
			
			$(".color-panel-no-r").slider('refresh');
			
			if(localStorage["colorPanelNoG"]){
				$(".color-panel-no-g").val(localStorage["colorPanelNoG"]);
			}
			else{
				$(".color-panel-no-g").val("0");
			}
			
			$(".color-panel-no-g").slider('refresh');
			
			if(localStorage["colorPanelNoB"]){
				$(".color-panel-no-b").val(localStorage["colorPanelNoB"]);
			}
			else{
				$(".color-panel-no-b").val("132");
			}
			
			$(".color-panel-no-b").slider('refresh');
			
			//空白パネル色
			if(localStorage["colorBlankPanelR"]){
				$(".color-blank-panel-r").val(localStorage["colorBlankPanelR"]);
			}
			else{
				$(".color-blank-panel-r").val("0");
			}
			
			$(".color-blank-panel-r").slider('refresh');
			
			if(localStorage["colorBlankPanelG"]){
				$(".color-blank-panel-g").val(localStorage["colorBlankPanelG"]);
			}
			else{
				$(".color-blank-panel-g").val("99");
			}
			
			$(".color-blank-panel-g").slider('refresh');
			
			if(localStorage["colorBlankPanelB"]){
				$(".color-blank-panel-b").val(localStorage["colorBlankPanelB"]);
			}
			else{
				$(".color-blank-panel-b").val("99");
			}
			
			$(".color-blank-panel-b").slider('refresh');	
		},
		popupafterclose:function(){
			
		}
	});
});

$(document).on("pagebeforehide","#index",function(e){
	
	//alert('#index：pagebeforehide');
});

$(document).on("pagemove","#index",function(e){
	
	//alert('#index：pagemove');
});

$(document).on("pagehide","#index",function(e){
	
	//alert('#index：pagehide');
});

$(document).on("pagebeforeshow","#index",function(e){
	
	//alert('#index：pagebeforeshow');
});


$(document).on("pageshow","#index",function(e){
	
	//alert('#index：pageshow');
	
	//ゲーム停止中
	gameFlg = false;
	
	//ヘッダーボタン表示・非表示
	$("#index .ui-header a.ui-btn[href='#about'], #index .ui-header a.ui-btn[href='#setting']").show();
	$("#index .ui-header a.ui-btn[href='#complete'], #index .ui-header a.ui-btn[href='#panel']").hide();
	
	if(flickr_image){
		//ローディング画像
		$.mobile.showPageLoadingMsg();
		
		//ゲーム開始
		gameFlg = true;
		
		//検索ボックス無効
		$("#search").addClass("ui-disabled");
		
		//ヘッダーボタン表示・非表示
		$("#index .ui-header a.ui-btn[href='#about'], #index .ui-header a.ui-btn[href='#setting']").hide();
		$("#index .ui-header a.ui-btn[href='#complete'], #index .ui-header a.ui-btn[href='#panel']").show();
		
		getFlickrImage();
	}
	else if(camera_image){
		//ローディング画像
		$.mobile.showPageLoadingMsg();
		
		//ゲーム開始
		gameFlg = true;
		
		//検索ボックス無効
		$("#search").addClass("ui-disabled");	
		
		//ヘッダーボタン表示・非表示
		$("#index .ui-header a.ui-btn[href='#about'], #index .ui-header a.ui-btn[href='#setting']").hide();
		$("#index .ui-header a.ui-btn[href='#complete'], #index .ui-header a.ui-btn[href='#panel']").show();
		
		getCameraImage();
		
	}
	else{
		
		//タイトル表示
		//drawTitle();
		
		//タイトル表示を遅らせる
		setTimeout(drawTitle, 1000);	
	}
	
});


//************************************
//【#photo】
//************************************

$(document).on("pageshow","#photo",function(e){
	
	//ゲーム停止中
	gameFlg = false;
	
	var html = "<li data-role='list-divider'>" + keyword + "</li>";
	
	for(var i = 0; i < aryFlickrImage.length; i++){
		//alert(aryFlickrImage[i])
		
		html += "<li  data-icon='false'><a href='#'><img src='"+aryFlickrImage[i]+"'><h3 class='wordbreak'>"+ aryFlickrTitle[i] +"</h3></a></li>"
	}
	
	$("#photo-list").html(html).listview("refresh");
	
	//$("ul").listview('refresh');
	
});

//************************************
//【#clear】
//************************************

$(document).on("pageshow","#clear",function(e){
	
	//ゲーム停止中
	gameFlg = false;
	
	//var html = clearTime;
	
	var html = localStorage["clearTime"];
	
	$("#clear-time").html(html);
	
	//clearTime = null;
	
});


//************************************
//【#ranking】
//************************************

$(document).on("pageshow","#ranking",function(e){
	
	//ゲーム停止中
	gameFlg = false;
	
	if(localStorage["clearTime"] != "" && localStorage["clearTime"] && name != ""){
		
		ranking.push({"name":name,"time":localStorage["clearTime"]});
		
		//ランキングの並べ替え
		ranking.sort(
			function(a, b){
				var aTime = a["time"];
				var bTime = b["time"];
				if(aTime < bTime) return -1;
				if(aTime > bTime) return 1;
				return 0;
			}
		);
		
		//配列の入れ替え（10件まで）
		var buff = new Array();
		var html = "";
		
		for(var i = 0; i < ranking.length; i++){
			
			if(i == 10){
				break;
			}
			
			html += "\
				<li data-icon='false'>\
				<span class='ui-li-count'>" + (i + 1) + "</span>\
				<a href='#'>\
				<h3 class='wordbreak'>" + ranking[i].time + " / " + ranking[i].name + "</h3>\
				</a>\
				</li>"
			
			buff.push({"name":ranking[i].name,"time":ranking[i].time});
		}
		
		$("#ranking-list").html(html).listview("refresh");
		
		ranking = buff;
		
		localStorage["ranking"] = JSON.stringify(ranking);
		
		clearTime = "";
		localStorage["clearTime"] = "";
		name = "";
		
	}
	else if(localStorage["ranking"]){
		
		var html = "";
		
		for(var i = 0; i < ranking.length; i++){
			
			if(i == 10){
				break;
			}
			
			html += "\
				<li data-icon='false'>\
				<span class='ui-li-count'>" + (i + 1) + "</span>\
				<a href='#'>\
				<h3 class='wordbreak'>" + ranking[i].time + " / " + ranking[i].name + "</h3>\
				</a>\
				</li>"
		}
		
		$("#ranking-list").html(html).listview("refresh");
		
		clearTime = "";
		localStorage["clearTime"] = "";
		name = "";
		
	}
	else{
		
		clearTime = "";
		localStorage["clearTime"] = "";
		name = "";
		
		$.mobile.changePage('#error5', {
			 transition: 'none',
			 role: 'dialog'
		});
	}
	
});


//************************************
//【#setting】
//************************************

$(document).on("pageshow","#setting",function(e){
	
	//ゲーム停止中
	gameFlg = false;
	
	//flickr画像取得件数
	if(localStorage["numImage"] == 10){
		$('#num-image-10').attr('checked', true).checkboxradio('refresh');
		$('#num-image-20').attr('checked', false).checkboxradio('refresh');
		$('#num-image-30').attr('checked', false).checkboxradio('refresh');
	}
	else if(localStorage["numImage"] == 20){
		$('#num-image-10').attr('checked', false).checkboxradio('refresh');
		$('#num-image-20').attr('checked', true).checkboxradio('refresh');
		$('#num-image-30').attr('checked', false).checkboxradio('refresh');
	}
	else{
		$('#num-image-10').attr('checked', false).checkboxradio('refresh');
		$('#num-image-20').attr('checked', false).checkboxradio('refresh');
		$('#num-image-30').attr('checked', true).checkboxradio('refresh');
	}
	
	
	//完成画像表示時間
	if(localStorage["timeClearImg"]){
		$("#time-clear-img").val(localStorage["timeClearImg"]);
	}
	else{
		$("#time-clear-img").val("3000");
	}
	
	$("#time-clear-img").slider('refresh');
	
	
	//パネル番号表示
	if(showPanelNoFlg == "true" || showPanelNoFlg == true){
		$(".show-panel-no").val("on");
	}
	else{
		$(".show-panel-no").val("off");
	}
	
	$(".show-panel-no").slider('refresh');
	
	//パネル番号透明度
	/*
	if(localStorage["alphaPanelNo"]){
		$("#alpha-panel-no").val(localStorage["alphaPanelNo"] * 10);
	}
	else{
		$("#alpha-panel-no").val("8");
	}
	
	$("#alpha-panel-no").slider('refresh');
	*/
	
	if(localStorage["alphaPanelNo"]){
		$(".alpha-panel-no").val(localStorage["alphaPanelNo"] * 10);
	}
	else{
		$(".alpha-panel-no").val("8");
	}
	
	$(".alpha-panel-no").slider('refresh');
	
	
	//パネル番号色
	if(localStorage["colorPanelNoR"]){
		$(".color-panel-no-r").val(localStorage["colorPanelNoR"]);
	}
	else{
		$(".color-panel-no-r").val("255");
	}
	
	$(".color-panel-no-r").slider('refresh');
	
	if(localStorage["colorPanelNoG"]){
		$(".color-panel-no-g").val(localStorage["colorPanelNoG"]);
	}
	else{
		$(".color-panel-no-g").val("0");
	}
	
	$(".color-panel-no-g").slider('refresh');
	
	if(localStorage["colorPanelNoB"]){
		$(".color-panel-no-b").val(localStorage["colorPanelNoB"]);
	}
	else{
		$(".color-panel-no-b").val("132");
	}
	
	$(".color-panel-no-b").slider('refresh');
	
	
	//空白パネル色
	if(localStorage["colorBlankPanelR"]){
		$(".color-blank-panel-r").val(localStorage["colorBlankPanelR"]);
	}
	else{
		$(".color-blank-panel-r").val("0");
	}
	
	$(".color-blank-panel-r").slider('refresh');
	
	if(localStorage["colorBlankPanelG"]){
		$(".color-blank-panel-g").val(localStorage["colorBlankPanelG"]);
	}
	else{
		$(".color-blank-panel-g").val("99");
	}
	
	$(".color-blank-panel-g").slider('refresh');
	
	if(localStorage["colorBlankPanelB"]){
		$(".color-blank-panel-b").val(localStorage["colorBlankPanelB"]);
	}
	else{
		$(".color-blank-panel-b").val("220");
	}
	
	$(".color-blank-panel-b").slider('refresh');

	
});


//*** 操作イベント ***//

//************************************
//【vclick系】
//************************************


$(document).on("vclick", "#game_canvas",function(e){
	
	//alert("vclick #game_canvas");
	
	checkPanelXY(e.clientX, e.clientY);	
});
	
$(document).on('vclick',".home", function(e){
	
	//alert("vlick .home");
	
	e.preventDefault();
	
	$.mobile.changePage("#index", { transition: "none",allowSamePageTransition : true, reloadPage: true });
	
});

$(document).on('vclick',".camera", function(e){
	
	//alert("vlick .camera");
	
	if(gapFlg == true){
		
		e.preventDefault();
		
		capture();
	}
	else{
		$.mobile.changePage('#error7', {
			 transition: 'none',
			 role: 'dialog'
		});
	}
	
	//$.mobile.changePage("#index", { transition: "fade",allowSamePageTransition : true, reloadPage: true });
	
});

$(document).on('vclick',".gallery", function(e){
	
	//alert("vlick .gallery");
	
	if(gapFlg == true){
		
		e.preventDefault();
		
		gallery();
	}
	else{
		$.mobile.changePage('#error7', {
			 transition: 'none',
			 role: 'dialog'
		});
	}
	
	//$.mobile.changePage("#index", { transition: "fade",allowSamePageTransition : true, reloadPage: true });
	
});

$(document).on('vclick',".exit", function(e){
	
	//alert("vlick .exit");
	
	if(appFlg == true){
		
		e.preventDefault();
			
		navigator.app.exitApp(); 
	}
	else{
		$.mobile.changePage('#error7', {
			 transition: 'none',
			 role: 'dialog'
		});	
	}
	
	//$.mobile.changePage("#index", { transition: "none",allowSamePageTransition : true, reloadPage: true });
	
});

$(document).on('vclick',"#photo-list a", function(e){
	
	flickr_image = $("img",this).attr("src");

	$.mobile.changePage("#index", { transition: "none"});
	
});

$(document).on('vclick',"#ranking-clear", function(e){
	
	//alert("vlick #ranking-clear");
	
	//ランキングを空にする
	localStorage["ranking"] = "";
	
	//ランキングページをリロード
	$.mobile.changePage("#ranking", { transition: "none",allowSamePageTransition : true, reloadPage: false });
	
	//リロードしないとストレージが消えないのでNG
	//$("#ranking-list").listview("refresh");
	
});


//初期値
$(document).on('vclick',"#set-default", function(e){
	
	//flickr画像取得件数
	numImage = 10;
	localStorage["numImage"] = numImage;
	$('#num-image-10').attr('checked', true).checkboxradio('refresh');
	$('#num-image-20').attr('checked', false).checkboxradio('refresh');
	$('#num-image-30').attr('checked', false).checkboxradio('refresh');
	
	
	//完成画像表示時間
	timeClearImg = 3000;
	localStorage["timeClearImg"] = timeClearImg;
	$("#time-clear-img").val(timeClearImg);
	$("#time-clear-img").slider('refresh');
	
	//パネル番号表示
	showPanelNoFlg = false;
	localStorage["showPanelNoFlg"] = showPanelNoFlg;
	$(".show-panel-no").val(showPanelNoFlg);
	$(".show-panel-no").slider('refresh');
	
	//パネル番号透明度
	alphaPanelNo = 0.8;
	localStorage["alphaPanelNo"] = alphaPanelNo;
	$(".alpha-panel-no").val(alphaPanelNo * 10);
	$(".alpha-panel-no").slider('refresh');
	
	//パネル番号色
	colorPanelNoR = 255;
	localStorage["colorPanelNoR"] = colorPanelNoR;
	$(".color-panel-no-r").val(colorPanelNoR);
	$(".color-panel-no-r").slider('refresh');
	
	colorPanelNoG = 0;
	localStorage["colorPanelNoG"] = colorPanelNoG;
	$(".color-panel-no-g").val(colorPanelNoG);
	$(".color-panel-no-g").slider('refresh');
	
	colorPanelNoB = 132;
	localStorage["colorPanelNoB"] = colorPanelNoB;
	$(".color-panel-no-b").val(colorPanelNoB);
	$(".color-panel-no-b").slider('refresh');
	
	
	//空白パネル色
	colorBlankPaneleR = 0;
	localStorage["colorBlankPaneleR"] = colorBlankPaneleR;
	$(".color-blank-panel-r").val(colorBlankPaneleR);
	$(".color-blank-panel-r").slider('refresh');
	
	colorBlankPaneleG = 99;
	localStorage["colorBlankPaneleG"] = colorBlankPaneleG;
	$(".color-blank-panel-g").val(colorBlankPaneleG);
	$(".color-blank-panel-g").slider('refresh');
	
	colorBlankPaneleB = 220;
	localStorage["colorBlankPaneleB"] = colorBlankPaneleB;
	$(".color-blank-panel-b").val(colorBlankPaneleB);
	$(".color-blank-panel-b").slider('refresh');
	
	
});


//************************************
//【keypress系】
//************************************

$(document).on("keypress","#search",function(e){

	if(e.keyCode == $.mobile.keyCode.ENTER){
		
		//alert("keypress #search");
		
		if(navigator.onLine){
			photo_search({text:this.value});
			
			keyword = this.value;
			
			$("#search").addClass("ui-disabled");	
			this.blur();
			
			$.mobile.showPageLoadingMsg();
		}
		else{
			$.mobile.changePage('#error6', {
				 transition: 'none',
				 role: 'dialog'
			});
		}
	}
});

$(document).on("keypress","#name",function(e){

	if(e.keyCode == $.mobile.keyCode.ENTER){
		
		//alert("keypress #name");

		name = this.value;
		
		if(name == ""){
			$.mobile.changePage('#error4', {
				 transition: 'none',
				 role: 'dialog'
			});
		}
		else{
			$.mobile.changePage("#ranking", { transition: "none"});
		}
	}
});



//************************************
//【keypress系】
//************************************

$(document).on("swipeleft", "#about", function(){
	$.mobile.changePage("#about2", { transition: "none"});
});

$(document).on("swiperight", "#about2", function(){
	$.mobile.changePage("#about", { transition: "none"});	
});

$(document).on("swipeleft", "#about2", function(){
	$.mobile.changePage("#about3", { transition: "none"});
});

$(document).on("swiperight", "#about3", function(){
	$.mobile.changePage("#about2", { transition: "none"});
});
  
  
  
  
  

//************************************
//【設定】
//************************************

//flickr画像表示件数
$(document).on('change',":radio[name='num-image']", function(e){
	
	if($("[name='num-image']:checked").val() == "10"){
		numImage = 10;	
	}
	else if($("[name='num-image']:checked").val() == "20"){
		numImage = 20;
	}
	else{
		numImage = 30;
	}
	
	localStorage["numImage"] = numImage;
});

//数字表示・非表示
$(document).on('change',".show-panel-no", function(e){
	
	if($(this).val() == "on"){
		showPanelNoFlg = true;	
	}
	else{
		showPanelNoFlg = false;
	}
	
	localStorage["showPanelNoFlg"] = showPanelNoFlg;
	
	if(gameFlg == true){
		//キャンバス描き直し
		drawPanels();
	}
	
});

//数字の透明度
$(document).on('change',".alpha-panel-no", function(e){
	
	alphaPanelNo = $(this).val() / 10;
	
	localStorage["alphaPanelNo"] = alphaPanelNo;
	
	if(gameFlg == true){
		//キャンバス描き直し
		drawPanels();
	}
});


//完成画像表示時間
$(document).on('change',"#time-clear-img", function(e){
	
	timeClearImg = $("#time-clear-img").val();
	
	localStorage["timeClearImg"] = timeClearImg;
	
});

//パネル番号赤
$(document).on('change',".color-panel-no-r", function(e){
	
	colorPanelNoR = $(this).val();
	
	$(".color-panel-no").css("background-color","rgba("+ colorPanelNoR + ","+ colorPanelNoG +","+ colorPanelNoB +",1.0)");
	
	console.log($(".color-panel-no").css("background-color"));
	
	localStorage["colorPanelNoR"]  =colorPanelNoR;
	
	if(gameFlg == true){
		//キャンバス描き直し
		drawPanels();
	}
	
});

//パネル番号緑
$(document).on('change',".color-panel-no-g", function(e){
	
	colorPanelNoG = $(this).val();
	
	$(".color-panel-no").css("background-color","rgba("+ colorPanelNoR + ","+ colorPanelNoG +","+ colorPanelNoB +",1.0)");
	
	localStorage["colorPanelNoG"] = colorPanelNoG;
	
	if(gameFlg == true){
		//キャンバス描き直し
		drawPanels();
	}
	
});

//パネル番号青
$(document).on('change',".color-panel-no-b", function(e){
	
	colorPanelNoB = $(this).val();
	
	$(".color-panel-no").css("background-color","rgba("+ colorPanelNoR + ","+ colorPanelNoG +","+ colorPanelNoB +",1.0)");
	
	localStorage["colorPanelNoB"] = colorPanelNoB;
	
	if(gameFlg == true){
		//キャンバス描き直し
		drawPanels();
	}
	
});

//パネルの色・赤
$(document).on('change',".color-blank-panel-r", function(e){
	
	colorBlankPanelR = $(this).val();
	
	$(".color-blank-panel").css("background-color","rgba("+ colorBlankPanelR + ","+ colorBlankPanelG +","+ colorBlankPanelB +",1.0)");
	
	localStorage["colorBlankPanelR"] = colorBlankPanelR;
	
	if(gameFlg == true){
		//キャンバス描き直し
		drawPanels();
	}

});

//パネルの色・緑
$(document).on('change',".color-blank-panel-g", function(e){
	
	colorBlankPanelG = $(this).val();
	
	$(".color-blank-panel").css("background-color","rgba("+ colorBlankPanelR + ","+ colorBlankPanelG +","+ colorBlankPanelB +",1.0)");
	
	localStorage["colorBlankPanelG"] = colorBlankPanelG;
	
	if(gameFlg == true){
		//キャンバス描き直し
		drawPanels();
	}
	
});

//パネルの色・青
$(document).on('change',".color-blank-panel-b", function(e){
	
	colorBlankPanelB = $(this).val();
	
	$(".color-blank-panel").css("background-color","rgba("+ colorBlankPanelR + ","+ colorBlankPanelG +","+ colorBlankPanelB +",1.0)");
	
	localStorage["colorBlankPanelB"] = colorBlankPanelB;
	
	if(gameFlg == true){
		//キャンバス描き直し
		drawPanels();
	}
	
});



//************************************
//【ダイアログ】
//************************************

//検索キーワードがみつかりませんでした
$(document).on("vclick",".ui-dialog .error1", function() {		
	$("[data-role='dialog']").dialog("close");
	
	$.mobile.changePage("#index", { transition: "none"});
	//$.mobile.changePage("#index", { transition: "none",allowSamePageTransition : true, reloadPage: true });
	
	$("#search").removeClass("ui-disabled");
});

//検索キーワード未入力
$(document).on("vclick",".ui-dialog .error2", function() {		
	$("[data-role='dialog']").dialog("close");
	
	$("#search").removeClass("ui-disabled");	
});

//画像がカメラ、ギャラリーから取得できませんでした
$(document).on("vclick",".ui-dialog .error3", function() {		
	//$("[data-role='dialog']").dialog("close");
	
	$.mobile.changePage("#index", { transition: "none"});
	
	$("#search").removeClass("ui-disabled");	
});

//名前が未入力
$(document).on("vclick",".ui-dialog .error4", function() {
	
	//$.mobile.changePage("#index", { transition: "none"});	
	
	$("[data-role='dialog']").dialog("close");	
	
});

//ランキングなし
$(document).on("vclick",".ui-dialog .error5", function() {		
	
	//$("[data-role='dialog']").dialog("close");
	
	$.mobile.changePage("#index", { transition: "none"});
	
	$("#search").removeClass("ui-disabled");	
	
});

//ネットワーク未接続
$(document).on("vclick",".ui-dialog .error6", function() {		
	
	//$("[data-role='dialog']").dialog("close");
	
	$.mobile.changePage("#index", { transition: "none"});
	
	$("#search").removeClass("ui-disabled");	
	
});

//Web版未対応
$(document).on("vclick",".ui-dialog .error7", function() {		
	
	//$("[data-role='dialog']").dialog("close");
	
	$.mobile.changePage("#index", { transition: "none"});
	
	$("#search").removeClass("ui-disabled");	
	
});


//************************************
//【タイマー】
//************************************

function myWatch(flug){
	if (watchFlg == 0){ 
		Start = new Date();
		
		watchFlg = 1;
		
		myInterval = setInterval("myWatch(1)", 1);
	}
	else{
		
		if (flug == 0){
			
			watchFlg = 0;
			
			clearInterval( myInterval ); 
		}
		
		Stop = new Date();
		
		T = Stop.getTime() - Start.getTime();
		H = Math.floor(T/(60*60*1000));
		T = T-(H*60*60*1000);
		M = Math.floor(T/(60*1000));
		T = T-(M*60*1000);
		S = Math.floor(T/1000); 
		Ms = T%1000; 
		
		//console.log(H+":"+M+":"+S+":"+Ms);
		
		
		if(Ms < 10){
			Ms = "00" + Ms;
		}
		else if(Ms < 100){
			Ms = "0" + Ms;
		}
		
		if(S < 10){
			S = "0" + S;
		}
		
		if(M < 10){
			M = "0" + M;
		}
		
		//クリア時間
		clearTime = H+":"+M+":"+S+":"+Ms;
		
	}
}
