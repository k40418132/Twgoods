var areaNow;
var articleNow;
var resetClick = 0;
var timeOut;
$(document).ready(function() {
    if (!localStorage.getItem('area0')) resetData();
    setNavbar();

    $("#content li").hover(function() {
        $("#content li").removeClass("active");
        if ($(this).index() < 3) {
            $(this).addClass("active");
        }
    });

    $("#content li").click(function() {
        var $index = $(this).index();
        changePage($(".intro-ul"));
        areaNow = $index;
        setIntro(areaNow);
    });

    $(".home").click(function() {
        changePage($("#content"));
    });

    $("#change-btn li").click(function() {
        if ($(this).index() == 0) {
            if ($(".change-title input").attr('value') == "") {
                alert("景點名稱不能為空!");
                return;
            }
            saveChange(articleNow);
        }
        changePage($("#content"));
    });

    $(".add").click(function() {
        clearChange();
        getPosition();
        changePage($("#change"));
        articleNow = -1;
    });

    $(".title").click(function() {
        clearTimeout(timeOut);
        resetClick++;
        if (resetClick > 7) {
            resetData();
            setNavbar();
            alert('景點已重設!');
            resetClick = 0;
        }
        timeOut = setTimeout(function() {
            resetClick = 0;
        }, 800);
    })

    $("#article-btn li").click(function() {
        if ($(this).index() == 0) {
            getArticle(articleNow);
            changePage($("#change"));
        } else {
            if (confirm("確定要刪除景點?")) {
                deleteArticle(articleNow);
                changePage($("#content"));
            }
        }
    });

    $(".article-back").click(function() {
        changePage($(".intro-ul"));
    });

    $(".article-back").hover(function() {
        $(this).toggleClass("btn_hover");
    });

    $(".article-top").click(function() {
        $('body,html').animate({
            scrollTop: 0
        }, 400)
    });

    $(".article-top").hover(function() {
        $(this).toggleClass("btn_hover");
    });

});

function getArticle(index) {
    var article = new Array();
    for (var i = 0; i < 10; i++) article.push(localStorage.getItem("article" + index + "[" + i + "]"));
    $(".change-area select").attr('value', article[0]);
    $(".change-title input").attr('value', article[1]);
    $(".change-intro textarea").val(article[2]);
    $(".change-mainphoto img").attr('src', article[3]);
    $(".change-traffic textarea").val(article[5]);
    $(".change-lat input").attr('value', article[6]);
    $(".change-lng input").attr('value', article[7]);
    $(".change-about textarea").val(article[8]);
    $(".change-title2 input").attr('value', article[9]);
    $(".change-photo ul").html("");
    var photo = article[4].split("|");
    for (var i = 0; i < photo.length; i++) {
        $(".change-photo ul").append("<li><img src='" + photo[i] + "'><br><button type='button' onclick='clearPhoto(this)'>刪除</button></li>");
    }
}

function setArticle(index) {
    clearArticle();
    var article = new Array();
    var photo = new Array();
    for (var i = 0; i < 10; i++) article.push(localStorage.getItem("article" + index + "[" + i + "]"));
    photo = article[4].split("|");
    $(".article-title span").eq(0).html(article[1]);
    $(".article-content p").eq(0).html(article[2]);
    $(".article-img").css('background-image', "url(" + photo[0] + ")");
    $(".article-content p").eq(1).html(article[5]);
    $(".article-content p").eq(2).html(article[8]);
    for (var i = 0; i < photo.length; i++) {
        $(".article-photo ul").append("<li><img src='" + photo[i] + "'></li>");
    }
    $(".article-photo li").eq(0).addClass('article-photo-active');
    $(".article-photo-main").attr('src', photo[0]);
    setMap(article[1], article[6], article[7]);
    $(".article-photo li").hover(function() {
        $(".article-photo li").removeClass('article-photo-active');
        $(this).addClass('article-photo-active');
        $(".article-photo-main").attr('src', $(this).children().attr('src'));
    });
}

function clearArticle() {
    $(".article-title span").eq(0).html();
    $(".article-content p").eq(0).html();
    $(".article-img").css('background-image', "");
    $(".article-content p").eq(1).html();
    $(".article-content p").eq(2).html();
    $(".article-photo ul").children().remove();
    $(".article-photo-main").attr('src', "");
}

function clearChange() {
    $(".change-area select").attr('value', "0");
    $(".change-title input").attr('value', "");
    $(".change-intro textarea").val("");
    $(".change-mainphoto img").attr('src', "");
    $(".change-traffic textarea").val("");
    $(".change-lat input").attr('value', "");
    $(".change-lng input").attr('value', "");
    $(".change-about textarea").val("");
    $(".change-title2 input").attr('value', "");
    $(".change-photo ul").html("");
}

function saveChange(index) {
    if (index == -1) {
        index = getArticleId();
    }

    var img = $(".change-photo img");
    var photo = "";
    for (var i = 0; i < img.length; i++) {
        if (photo != "") {
            photo = photo + "|" + $(".change-photo img").eq(i).attr('src');
        } else {
            photo = $(".change-photo img").eq(i).attr('src');
        }
    }

    var article = new Array();
    article.push($(".change-area select").attr('value'));
    article.push($(".change-title input").attr('value'));
    article.push($(".change-intro textarea").val());
    article.push($(".change-mainphoto img").attr('src'));
    article.push(photo);
    article.push($(".change-traffic textarea").val());
    article.push($(".change-lat input").attr('value'));
    article.push($(".change-lng input").attr('value'));
    article.push($(".change-about textarea").val());
    article.push($(".change-title2 input").attr('value'));

    for (var i = 0; i < 10; i++) localStorage.removeItem("article" + index + "[" + i + "]");
    for (var i = 0; i < 10; i++) localStorage.setItem("article" + index + "[" + i + "]", article[i]);

    refreshArea(index.toString(), $(".change-area select").attr('value').toString());
    setNavbar();
}

function getArticleId() {
    var allArticle = new Array;
    var area0 = localStorage.getItem("area0");
    var area1 = localStorage.getItem("area1");
    var area2 = localStorage.getItem("area2");
    var area3 = localStorage.getItem("area3");
    area0 = area0.split(',');
    area1 = area1.split(',');
    area2 = area2.split(',');
    area3 = area3.split(',');
    for (var i = 0; i < area0.length; i++) {
        if (area0[i] != "") allArticle.push(area0[i]);
    }
    for (var i = 0; i < area1.length; i++) {
        if (area1[i] != "") allArticle.push(area1[i]);
    }
    for (var i = 0; i < area2.length; i++) {
        if (area2[i] != "") allArticle.push(area2[i]);
    }
    for (var i = 0; i < area3.length; i++) {
        if (area3[i] != "") allArticle.push(area3[i]);
    }
    var id = 0;
    var flag = false;
    while (1) {
        for (var i = 0; i < allArticle.length; i++) {
            if (allArticle[i] == id) flag = true;
        }
        if (flag) {
            id++;
            flag = false;
        } else break;
    }
    return id;
}

function deleteArticle(index) {
    for (var i = 0; i < 10; i++) {
        localStorage.removeItem("article" + index + "[" + i + "]");
    }
    refreshArea(index, -1);
    setNavbar();
}

function refreshArea(index, area) {
    var flag = false;
    var area0 = localStorage.getItem("area0");
    var area1 = localStorage.getItem("area1");
    var area2 = localStorage.getItem("area2");
    var area3 = localStorage.getItem("area3");
    area0 = area0.split(',');
    area1 = area1.split(',');
    area2 = area2.split(',');
    area3 = area3.split(',');
    for (var i = 0; i < area0.length; i++) {
        if (index == area0[i] && area != 0) area0.splice(i, 1);
        if (index == area0[i] && area == 0) flag = true;
    }
    for (var i = 0; i < area1.length; i++) {
        if (index == area1[i] && area != 1) area1.splice(i, 1);
        if (index == area1[i] && area == 1) flag = true;
    }
    for (var i = 0; i < area2.length; i++) {
        if (index == area2[i] && area != 2) area2.splice(i, 1);
        if (index == area2[i] && area == 2) flag = true;
    }
    for (var i = 0; i < area3.length; i++) {
        if (index == area3[i] && area != 3) area3.splice(i, 1);
        if (index == area3[i] && area == 3) flag = true;
    }

    if (area != -1 && !flag) {
        switch (area) {
            case "0":
                area0.push(index);
                break;
            case "1":
                area1.push(index);
                break;
            case "2":
                area2.push(index);
                break;
            case "3":
                area3.push(index);
                break;
        }
    }
    var tmp;
    tmp = "";
    for (var i = 0; i < area0.length; i++) {
        if (area0[i] != "") {
            if (tmp == "") {
                tmp = area0[i];
            } else tmp = tmp + "," + area0[i];
        }
    }
    localStorage.setItem("area0", tmp);
    tmp = "";
    for (var i = 0; i < area1.length; i++) {
        if (area1[i] != "") {
            if (tmp == "") {
                tmp = area1[i];
            } else tmp = tmp + "," + area1[i];
        }
    }
    localStorage.setItem("area1", tmp);
    tmp = "";
    for (var i = 0; i < area2.length; i++) {
        if (area2[i] != "") {
            if (tmp == "") {
                tmp = area2[i];
            } else tmp = tmp + "," + area2[i];
        }
    }
    localStorage.setItem("area2", tmp);
    tmp = "";
    for (var i = 0; i < area3.length; i++) {
        if (area3[i] != "") {
            if (tmp == "") {
                tmp = area3[i];
            } else tmp = tmp + "," + area3[i];
        }
    }
    localStorage.setItem("area3", tmp);
}

function getMainPhoto() {
    var url = prompt('輸入圖片連結');
    if (url) {
        $(".change-mainphoto img").attr('src', url);
        console.log(url);
    }
}

function getPhoto() {
    var url = prompt('輸入圖片連結');
    if (url) {
        $(".change-photo ul").append("<li><img src='" + url + "'><br><button type='button' onclick='clearPhoto(this)'>刪除</button></li>");
    }
}

function clearPhoto(obj) {
    var index = $(obj).parent("li").index();
    $(".change-photo ul li").eq(index).remove();
}

function setIntro(area) {
    $(".intro-ul").html("");
    var article = localStorage.getItem("area" + area);
    article = article.split(",");
    for (var i = 0; i < article.length; i++) {
        var title = localStorage.getItem("article" + article[i] + "[1]");
        var intro = localStorage.getItem("article" + article[i] + "[9]");
        var bg = localStorage.getItem("article" + article[i] + "[3]");
        $(".intro-ul").append("<li><div class='intro-content' id='" + article[i] + "'><h1 class='intro-h1'>" + title + "</h1><p>" + intro + "</p><div class='intro-btn'>前往拜訪</div></div><img src='" + bg + "'></li>");
    }
    $(".intro-btn").click(function() {
        var article = localStorage.getItem("area" + areaNow);
        article = article.split(",");
        var index = $(this).parent().attr('id');
        setArticle(index);
        articleNow = index;
        changePage($(".article"));
    });
    $(".intro-btn").hover(function() {
        var $h1 = $(this).prev().prev();
        $h1.toggleClass("btn_hover");
    });
}

function setMap(title, lat, lng) {
    if ($("#article-map").children().length == 0) {
        var latlng = new google.maps.LatLng(lat, lng);
        var mapOptions = {
            zoom: 16,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(
            document.getElementById("article-map"), mapOptions);

        marker = new google.maps.Marker({
            position: latlng,
            title: title,
            map: map
        });
    } else {
        var latlng = new google.maps.LatLng(lat, lng);
        marker.setPosition(latlng);
        marker.setTitle(title);
        map.setCenter(latlng);
    }
}

function getPosition() {
    if (window.navigator.geolocation) {
        var geolocation = window.navigator.geolocation;
        geolocation.getCurrentPosition(getPositionSuccess);
    } else {
        alert("你的瀏覽器不支援地理定位");
    }
}

function getPositionSuccess(position) {
    $(".change-lat input").attr('value', position.coords.latitude);
    $(".change-lng input").attr('value', position.coords.longitude);
}

function changePage(page) {
    var oldPage;
    if (!$("#content").hasClass('hide')) {
        oldPage = $("#content");
        $("#content").addClass('hide');
    } else if (!$(".intro-ul").hasClass('hide')) {
        oldPage = $(".intro-ul");
        $(".intro-ul").addClass('hide');
    } else if (!$(".article").hasClass('hide')) {
        oldPage = $(".article");
        $(".article").addClass('hide');
    } else if (!$("#change").hasClass('hide')) {
        oldPage = $("#change");
        $("#change").addClass('hide');
    }
    page.removeClass('display');
    $('body').animate({
        scrollTop: 0
    }, 150, function() {
        oldPage.addClass('display');
        if (page.selector == ".article") var center = map.getCenter();
        page.removeClass('hide display');
        if (page.selector == ".article") {
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        }
    });
}

function setNavbar() {
    $(".inner-ul").html("");
    for (var i = 0; i < 4; i++) {
        var article = localStorage.getItem("area" + i);
        article = article.split(",");
        for (var j = 0; j < article.length; j++) {
            var title = localStorage.getItem("article" + article[j] + "[1]")
            $(".inner-ul").eq(i).append("<li id='" + article[j] + "'><i class='fa fa-map-marker'></i>" + title + "</li>");
        }
    }
    $(".inner-ul li").click(function() {
        var index = $(this).attr('id');
        setArticle(index);
        articleNow = index;
        changePage($(".article"));
    });
}

function resetData() {
    localStorage.clear();
    for (var i = 0; i < allArticle.length; i++) {
        for (var j = 0; j < 10; j++) {
            var tmp = allArticle[i];
            localStorage.setItem("article" + i + "[" + j + "]", tmp[j]);
        }
    }
    localStorage.setItem("area0", "0,1,2");
    localStorage.setItem("area1", "3,4,5");
    localStorage.setItem("area2", "6,7,8");
    localStorage.setItem("area3", "9,10,11");
}
