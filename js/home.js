var Media = document.getElementById('video_player');
let i=0;
window.onload =function (){
    //generate uuid
    let storage = window.localStorage;
    let token = storage.getItem("cookie_token");
    if(!token){
        token = _getRandomString(32);
        storage.setItem("cookie_token", token);
    }
    //set cookie
    document.cookie = "cookie_token=" + token;
    let xhr = new XMLHttpRequest ();
    xhr.open("GET", "https://home.jahe.io:18080/v1/list_videos");
    xhr.onload = function(e) {
        if(this.status === 200){
            let resp = JSON.parse(this.responseText);
            console.log(resp['msg']);
            loadVideoList(resp);
        }
    };
    xhr.send();


    document.addEventListener("fullscreenchange", function (event){
        console.log(event);
        i = i+1;
        let target = event.target;
        if (i % 2 === 0) {
            console.log("exit full screen");
            target.pause();
            $(Media).css("display", "none");
        }
    })

}

function loadVideoList(data){
    console.log(data);
    if("success" === data["msg"]){
        for(let video of data["data"]){
            addVideo(video);
        }
    }else{
        $("#app").append("<h1>"+data+"</h1>");
    }
}
function addVideo(video){
    let div= "  <div class='col-xs-12 col-md-6 col-lg-4'>" +
            "    <a href='#' class='thumbnail play-btn' onclick=playVideo('https://home.jahe.io:18080"+video["streamUrl"]+"')>" +
            "      <img src='https://home.jahe.io:18080"+video["coverUrl"]+"' alt='' style='object-fit: fill; height: 250px'>" +
            "    </a>" +
            "    <h3>"+video["vedioName"]+"</h3><hr/>" +
            "  </div>";
    $("#app").append(div);
}

function playVideo(url){
    $(Media).attr("src", url);
    $(Media).css("display", "block");
    full(Media);
    Media.play();
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        console.log('isIOS');
        return;
    } else if (/(Android)/i.test(navigator.userAgent)) {
        console.log('isAndroid');
    } else {
        console.log('isPC');
    }
}

function get(uri, onSuccess){
    $.ajax({url: uri, success: onSuccess})
}
function _getRandomString(len) {
    len = len || 32;
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    let maxPos = $chars.length;
    let pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function full(ele){
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && ele.webkitEnterFullscreen) {
        console.log('isIOS');
        ele.webkitEnterFullscreen();
    } else if (/(Android)/i.test(navigator.userAgent) && ele.requestFullscreen) {
        console.log('isAndroid');
        ele.requestFullscreen();
    } else {
        console.log('isPC');
    }
    ele.requestFullscreen();
}
function exitFullscreen(){
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}