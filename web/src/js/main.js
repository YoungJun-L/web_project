var totalData = null;

$(document).ready(() => {
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/mirror/main`,
        dataType: "json",
        success: (data) => {
            totalData = data;
            display();
            endLoader();
        },
    });
});

function display() {
    for (var i = 0; i < 4; i++) {
        var appendhtml = "";
        var data = totalData[i];
        console.log(data);
        for (var j = 0; j < 10; j++) {
            var newDate = formatTime(new Date(data[j].timeUpdate));
            appendhtml += `
            <a class="post" href="${data[j].url}" target="blank">
            <span class="post_title">${data[j].title}</span>
            <span class="info_list">
            <ul>
            <li class="info good">${data[j].voteNum}</li>
            <li class="info time">${newDate}</li>
            </ul>
            </span>
            </a>
            `;
        }
        $(`.post_list`).eq(i).html(appendhtml);
    }
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

function endLoader() {
    var loader = $("div.loader");
    loader.css("display", "none");
}
