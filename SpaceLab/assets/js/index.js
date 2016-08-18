var indexModule = (function(im) {
    im.loadPage = function(parentId, pageName, callback, params) {
        $("#" + parentId || "main-content").load(pageName + ".html", function(response, status, xhr) {
            app.bread();
            if (callback) {
                callback(params);
            }

        });
    }
    im.addGame = function() {
        var data = $("#addGameForm").serializeJson();
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/addGame.json',
            data: data,
            async: false,
            success: function(result) {
                $("#addGameContent").html(result.message);
                $(".complete-sign").show(1000);
                $(".complete-sign").hide(1000);
                // im.popupModal("basicModal");
            }
        });
    }
    im.editGame = function() {
        var data = $("#editGameForm").serializeJson();
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/editGame.json',
            data: data,
            async: false,
            success: function(result) {
                $("#editGameContent").html(result.message);
                im.popupModal("basicModal");
            }
        });
    }
    im.fixModal = function() {
        $('.modal').each(function(i) {
            var $clone = $(this).clone().css('display', 'block').appendTo('body');
            var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
            top = top > 0 ? top : 0;
            $clone.remove();
            $(this).find('.modal-content').css("margin-top", top);
        });
    }
    im.popupModal = function(modalId) {
        $('.modal').on('show.bs.modal', im.fixModal);
        $(window).on('resize', im.fixModal);
        $("#" + modalId).modal('show');
    }
    im.loadGameDetailsPage = function(gameId) {
        im.loadPage("main-content", "gameDetails", im.loadGameDetails);
    }
    im.loadGameDetails = function() {
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/gameInfo.json',
            async: false,
            success: function(result) {
                var html = template('gameDetails-template', result.gameInfo);
                $("#gameDetails").html(html);
            }
        });

        var settings = {
            "ajax": "assets/json/gameDetails.json",
            "columns": [{
                "data": "teamA"
            }, {
                "data": "teamB"
            }, {
                "data": "status"
            }, {
                "data": "result"
            }, {
                "data": "matchId"
            }],
            "columnDefs": [{
                "targets": [0],
                "render": function(data, type, full) {
                    var str = "<a href='javascript:void(0);' onclick='indexModule.getTeamBrief(" + '"teamBriefModal"' + "," + full.matchId + "," + '"A"' + ");'>" + data + "</a>";
                    return str;
                }
            }, {
                "targets": [1],
                "render": function(data, type, full) {
                    var str = "<a href='javascript:void(0);' onclick='indexModule.getTeamBrief(" + '"teamBriefModal"' + "," + full.matchId + "," + '"B"' + ");'>" + data + "</a>";
                    return str;
                }
            }, {
                "targets": [2],
                "render": function(data, type, full) {
                    var str = "未进行";
                    if (data == "1") {
                        str = "进行中";
                    } else if (data == "2") {
                        str = "已结束";
                    } else if (data == "3") {
                        str = "已完结";
                    }
                    return str;
                }
            }, {
                "targets": [3],
                "render": function(data, type, full) {
                    var str = "无比分";
                    if (data) {
                        str = full.result;
                    }
                    return str;
                }
            }, {
                "targets": [4],
                "render": function(data, type, full) {
                    var str = "<a href='javascript:void(0);' onclick='indexModule.getMatchDetails(" + '"matchDetailsModal"' + "," + full.matchId + ");'><i class='fa fa-eye' aria-hidden='true' title='查看'></i></a>";
                    if (full.status == "0") {
                        str = "<a href='javascript:void(0);' onclick='indexModule.allocateStaffInit(" + '"allocateStaffInitModal"' + "," + data + ");'><i class='fa fa-user' aria-hidden='true' title='人员分配'></i></a>";
                    } else if (full.status == "2") {
                        str = "<a href='javascript:void(0);' onclick='indexModule.addMatchDetailsInit(" + '"addMatchDetailsInitModal"' + "," + data + ");'><i class='fa fa-file-text-o' aria-hidden='true' title='比赛录入'></i></a>";
                    }
                    return str;
                }
            }]
        };

        im.initDataTable("gameDetails-table", settings);
    }

    im.loadGameDetailsPage1 = function(gameId) {
        im.loadPage("main-content", "gameDetails1", im.loadGameDetails1);
    }
    im.loadGameDetails1 = function() {
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/gameInfo.json',
            async: false,
            success: function(result) {
                var html = template('gameDetails-template', result.gameInfo);
                $("#gameDetails").html(html);
            }
        });
    }

    im.bindGameDetails = function() {
        $("#matchList").on("click", function() {
            im.loadPage("match-content", "matchList");
        });
        $("#scoreList").on("click", function() {
            im.loadPage("match-content", "scoreList");
        });
    }

    im.loadEditGamePage = function(gameId) {
        var params = { "gameId": gameId };
        im.loadPage("main-content", "editGame", im.loadEditGame, params);
    }
    im.loadEditGame = function(params) {
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/gameInfo.json',
            data: { gameId: params.gameId },
            async: false,
            success: function(result) {
                var html = template('editGame-template', result.gameInfo);
                $("#editGame").html(html);
                $('.form_date').datetimepicker({
                    weekStart: 1,
                    todayBtn: 1,
                    autoclose: 1,
                    todayHighlight: 1,
                    startView: 2,
                    minView: 2,
                    language: 'zh-CN', //汉化 
                    forceParse: 0
                });
            }
        });
    }

    im.getMatchDetails = function(modalId, matchId) {
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/matchDetails.json',
            data: { matchId: matchId },
            async: false,
            success: function(result) {
                var html = template('matchDetails-div-template', result);
                $("#matchDetails-div").html(html);
                im.popupModal(modalId);
            }
        });
    }

    im.addMatchDetailsInit = function(modalId, matchId) {
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/addMatchDetailsInit.json',
            data: { matchId: matchId },
            async: false,
            success: function(result) {
                var html = template('add-matchDetails-init-template', result);
                $("#addMatchDetailsTeamName").html(html);
            }
        });
        im.popupModal(modalId);
    }

    im.addMatchDetails = function(modalId, matchId) {
        var data = $("#addMatchDetailsForm").serializeJson();
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/addMatchDetails.json',
            data: data,
            async: false,
            success: function(result) {
                $('.modal').on('show.bs.modal', im.fixModal);
                $(window).on('resize', im.fixModal);
                $("#addMatchDetailsContent").html(result.message);
                $("#addMatchDetailsModal").modal('show');
            }
        });
    }

    im.initDataTable = function(id, settings) {
        var defaultOptions = {
            language: {
                "sProcessing": "处理中...",
                "sLengthMenu": "显示 _MENU_ 项结果",
                "sZeroRecords": "没有匹配结果",
                "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix": "",
                "sSearch": "搜索:",
                "sUrl": "",
                "sEmptyTable": "表中数据为空",
                "sLoadingRecords": "载入中...",
                "sInfoThousands": ",",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "上页",
                    "sNext": "下页",
                    "sLast": "末页"
                },
                "oAria": {
                    "sSortAscending": ": 以升序排列此列",
                    "sSortDescending": ": 以降序排列此列"
                }
            }
        };
        var options = $.extend({}, defaultOptions, settings);
        $("#" + id).dataTable(options);
    }

    im.getTeamBrief = function(modalId, matchId, teamFlag) {
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/teamBrief.json',
            data: { matchId: matchId, teamFlag: teamFlag },
            async: false,
            success: function(result) {
                $("#teamBriefContent").html(result.teamBrief);
                im.popupModal(modalId);
            }
        });
    }

    im.addStaff = function() {
        var data = $("#addStaffForm").serializeJson();
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/addStaff.json',
            data: data,
            async: false,
            success: function(result) {
                $("#addStaffContent").html(result.message);
                im.popupModal("basicModal");
            }
        });
    }

    im.loadStaffPage = function(staffId) {
        var params = { "staffId": staffId };
        im.loadPage("main-content", "editStaff", im.loadStaff, params);
    }
    im.loadStaff = function(params) {
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/staff.json',
            data: params,
            async: false,
            success: function(result) {
                var html = template('staffInfo-template', result);
                $("#staffInfo").html(html);
                $('#editStaffRole').selectpicker({
                    liveSearch: true,
                    noneSelectedText: result.staffRole,
                    maxOptions: 1
                });
            }
        });
    }

    im.getStaff = function(staffId) {
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/staff.json',
            data: { staffId: staffId },
            async: false,
            success: function(result) {
                var html = template('staff-template', result);
                $("#staffContent").html(html);
                im.popupModal("showStaffModal");
            }
        });
    }

    im.editStaff = function(staffId) {
        var data = $("#editStaffForm").serializeJson();
        data.staffId = staffId;
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/editStaff.json',
            data: data,
            async: false,
            success: function(result) {
                $("#editStaffContent").html(result.message);
                im.popupModal("basicModal");
            }
        });
    }

    im.allocateStaffInit = function(modalId, matchId, teamFlag) {
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/matchInfo.json',
            data: { matchId: matchId, teamFlag: teamFlag },
            async: false,
            success: function(result) {
                var html = template('match-info-template', result);
                $("#matchInfo").html(html);
                $("#allocateStaffBtn").on("click", function() {
                    im.allocateStaff(matchId);
                    $("#allocateStaffInitModal").modal("hide");
                });
                im.popupModal(modalId);
            }
        });
    }

    im.allocateStaff = function(matchId) {
        var data = $("#allocateStaffForm").serializeJson();
        data.matchId = matchId;
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/allocateStaff.json',
            data: data,
            async: false,
            success: function(result) {
                $("#modal-content-div").html(result.message);
                im.popupModal("allocateStaffModal");
            }
        });
    }
    im.extendFunc = function() {
        console.log("This is the extend function!");
    }
    return im;
}(indexModule || {}));
