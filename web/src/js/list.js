let dataPerPage = 15;
let pageCount = 10;
let globalCurrentPage = 1;

$(document).ready(function () {
    dataPerPage = $("#dataPerPage").val();

    $.ajax({
        method: "GET",
        url: "https://localhost:3000/mirror/all?" + data,
        dataType: "json",
        success: function (d) {
            totalData = d.data.length;
        },
    });

    displayData(1, dataPerPage);
    paging(totalData, dataPerPage, pageCount, 1);
});

function displayData(currentPage, dataPerPage) {
    let chartHtml = "";

    currentPage = Number(currentPage);
    dataPerPage = Number(dataPerPage);

    for (
        var i = (currentPage - 1) * dataPerPage;
        i < (currentPage - 1) * dataPerPage + dataPerPage;
        i++
    ) {
        chartHtml +=
            "<tr><td>" +
            dataList[i].d1 +
            "</td><td>" +
            dataList[i].d2 +
            "</td><td>" +
            dataList[i].d3 +
            "</td></tr>";
    }
    $("#dataTableBody").html(chartHtml);
}

function paging(dataPerPage, pageCount, currentPage) {
    console.log("currentPage : " + currentPage);

    let pageHtml = "";

    for (var i = 0; i < 10; i++) {
        if (currentPage == i) {
            pageHtml +=
                "<li class='on'><a href='#' id='" + i + "'>" + i + "</a></li>";
        } else {
            pageHtml += "<li><a href='#' id='" + i + "'>" + i + "</a></li>";
        }
    }

    $("#pagingul").html(pageHtml);
    let displayCount = "";
    displayCount = "현재 1 - " + totalPage + " 페이지 / " + totalData + "건";
    $("#displayCount").text(displayCount);

    $("#pagingul li a").click(function () {
        let $id = $(this).attr("id");
        selectedPage = $(this).text();

        if ($id == "next") selectedPage = next;
        if ($id == "prev") selectedPage = prev;

        globalCurrentPage = selectedPage;
        paging(totalData, dataPerPage, pageCount, selectedPage);
        displayData(selectedPage, dataPerPage);
    });
}

$("#dataPerPage").change(function () {
    dataPerPage = $("#dataPerPage").val();
    paging(totalData, dataPerPage, pageCount, globalCurrentPage);
    displayData(globalCurrentPage, dataPerPage);
});
