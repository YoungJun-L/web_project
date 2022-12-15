var url = new URL(document.location.href);
var params = url.searchParams;

var page = 1;
if (params.get("page") !== null) {
    page = params.get("page");
}

var sort = "timeUpdate";
if (params.get("sort") !== null) {
    sort = params.get("sort");
}
var totalData = null;

$(document).ready(() => {
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/mirror/all?page=${page}&sort=${sort}`,
        dataType: "json",
        success: (data) => {
            totalData = data;
            display();
            endLoader();
        },
    });
    paging();
});

function display() {
    var appendhtml = "";
    for (var i = 0; i < 15; i++) {
        var newDate = formatTime(new Date(totalData[i].timeUpdate));
        appendhtml += `
        <a class="post" href="${totalData[i].url}" target="blank">
        <span class="post_title">${totalData[i].title}</span>
        <span class="info_list">
        <ul>
        <li class="info hit">${totalData[i].viewNum} view</li>
        <li class="info good">${totalData[i].voteNum}</li>
        <li class="info time">${newDate}</li>
        </ul>
        </span>
        </a>
        `;
    }
    $(".post_list").html(appendhtml);
}

function formatTime(date) {
    var now = new Date();
    var utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    var KR_TIME_DIFF = 9 * 60 * 60 * 1000;

    var kr = new Date(utc + KR_TIME_DIFF);
    var newDate = "";
    if (kr.getMonth() !== date.getMonth()) {
        newDate = "1달전";
    } else if (kr.getDate() === date.getDate()) {
        if (kr.getHours() === date.getHours()) {
            newDate = `${kr.getMinutes() - date.getMinutes()}분전`;
        } else {
            newDate = `${kr.getHours() - date.getHours()}시간전`;
        }
    } else {
        newDate = `${kr.getDate() - date.getDate()}일전`;
    }
    return newDate;
}

function paging() {
    $("#page a")
        .eq(page - 1)
        .attr("class", "page_button on");

    var order = 0;
    if (sort === "vote") {
        order = 1;
    } else if (sort === "reply") {
        order = 2;
    }

    $("#sort_menu a").eq(order).attr("class", "sort_button on");
}

function link(e) {
    page = $(e).text();
    window.location.href = `list.html?sort=${params.get("sort")}&page=${page}`;
}

function endLoader() {
    var loader = $("div.loader");
    loader.css("display", "none");
}
