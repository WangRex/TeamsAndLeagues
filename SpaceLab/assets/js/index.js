var indexModule = (function(im) {
    im.loadPage = function(parentId, pageName, callback, params) {
        $("#" + parentId || "main-content").load(pageName + ".html", function(response, status, xhr) {
            if (callback) {
                callback(params);
            }

        });
    }
    im.addGame = function() {
        var data = $("#addGameForm").serializeJson();
        if (data.gamePlace.length > 1) {
            var gamePlaces = "";
            for (var i = 0; i < data.gamePlace.length; i++) {
                gamePlaces += "," + data.gamePlace[i];
            }
            gamePlaces = gamePlaces.substring(1);
            data.gamePlace = gamePlaces;
        }
        $.ajax({
            type: 'post',
            dataType: "json",
            url: 'http://210.83.195.229:8095/api/GameList/addGame',
            // url: 'http://localhost:4349/api/GameList/addGame',
            data: data,
            async: false,
            success: function(result) {
                $("#addGameContent").html(result.message);
                //$(".complete-sign").show(1000);
                //$(".complete-sign").hide(1000);
                im.loadPage("main-content", "addGameSuccess", im.addGameSuccess, { data: result.DataTable });
            }
        });
    }
    im.addGameSuccess = function(params) {
        var html = template('addGameSuccess-template', params.data);
        $("#addGameSuccessDiv").html(html);
        app.bread();
    }
    im.addGamePlace = function() {
        var gamePlaceDivClone = $("#gamePlaceDivClone").clone();
        gamePlaceDivClone.attr("id", "");
        gamePlaceDivClone.removeClass("hide");
        gamePlaceDivClone.find("input[type='text']").attr("name", "gamePlace");
        $("#gamePlaceDiv").after(gamePlaceDivClone);
    }
    im.deleteGamePlace = function(obj) {
        $(obj).closest("div[class='form-group']").remove();
    }
    im.editGame = function() {
        var data = $("#editGameForm").serializeJson();
        $.ajax({
            type: 'get',
            dataType: "json",
            // url: 'assets/json/editGame.json',
            url: 'http://210.83.195.229:8095/api/GameList/editGame',
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

    im.loadGameDetailsPage1 = function(htmlName, gameId) {
        im.loadPage("main-content", htmlName, im.loadGameDetails1, { gameId: gameId });
    }
    im.loadGameDetails1 = function(params) {
        $.ajax({
            type: 'get',
            dataType: "json",
            data: params,
            url: 'http://210.83.195.229:8095/api/GameList/getGameInfoByGameId',
            async: false,
            success: function(result) {
                var html = template('gameDetails-template', result);
                $("#gameDetails").html(html);
                app.bread();
            }
        });
    }

    im.bindGameDetails = function() {
        $("#matchList").on("click", function() {
            im.loadPage("match-content", "matchList");
        });
        $("#scoreList").on("click", function() {
            var gameId = $("#gameInfo").attr("data-gameid");
            var params = { gameId: gameId };
            im.loadPage("match-content", "scoreList", im.loadScoreList, params);
        });
        $("#shooterList").on("click", function() {
            var gameId = $("#gameInfo").attr("data-gameid");
            var params = { gameId: gameId };
            im.loadPage("match-content", "shooterList", im.loadShooterList, params);
        });
        $("#stopList").on("click", function() {
            var gameId = $("#gameInfo").attr("data-gameid");
            var params = { gameId: gameId };
            im.loadPage("match-content", "stopList", im.loadStopList, params);
        });
    }

    im.loadScoreList = function(params) {
        $.ajax({
            type: 'get',
            dataType: "json",
            data: params,
            //url: 'assets/json/scoreBoard.json',
            url: 'http://210.83.195.229:8095/api/MatchScore/getAllMatchScore',
            async: false,
            success: function(result) {
                console.log(result);
                var html = template('scoreDetails-template', result);
                $("#boradData").after(html);
            }
        });
    }

    im.loadShooterList = function(params) {
        $.ajax({
            type: 'get',
            dataType: "json",
            data: params,
            //url: 'assets/json/shooterBoard.json',
            url: 'http://210.83.195.229:8095/api/MatchShooter/getAllMatchShooter',
            async: false,
            success: function(result) {
                var html = template('shooterDetails-template', result);
                $("#boradData").after(html);
            }
        });
    }

    im.loadStopList = function(params) {
        $.ajax({
            type: 'get',
            dataType: "json",
            data: params,
            //url: 'assets/json/stopBoard.json',
            url: 'http://210.83.195.229:8095/api/MatchStop/getAllMatchStop',
            async: false,
            success: function(result) {
                var html = template('stopDetails-template', result);
                $("#boradData").after(html);
            }
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
