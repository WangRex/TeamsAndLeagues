var indexModule = (function(im) {
    im.login = function() {
        var data = $("#loginForm").serializeJson();

        $.ajax({
            type: "get",
            dataType: "json",
            url: globalModule.globalHomeUrl + "api/User/login",
            data: data,
            cache: false,
            async: "false",
            success: function(result) {
                if (result.Code == 1) {
                    $.cookie("GUID", result.GUID);
                    globalModule.loadPage("container", "main", function() { $("#userName").html(result.DataTable.name); });
                }
            }
        });
    }
    im.addGame = function() {
        var data = $("#addGameForm").serializeJson();
        data.gamePlace = globalModule.arrayToString(data.gamePlace);
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/GameList/addGame", data, function(result) {
            $("#addGameContent").html(result.message);
            globalModule.loadPage("main-content", "addGameSuccess", im.addGameSuccess, { data: result.DataTable });
        }, "post");
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
    im.enrollGame = function(gameId) {
        globalModule.loadPage("main-content", "enrollGame", im.enrollGameInit, { gameId: gameId });
    }
    im.enrollGameInit = function(params) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/GameList/getGamePlaceByGameId", params, function(result) {
            var html = template('gamePlace-template', result);
            $("#gamePlace").html(html);
            app.bread();
            $('#gamePlace').selectpicker({
                liveSearch: true
            });
            $("#enrollGameBtn").attr("data-value", params.gameId);
        });
    }
    im.enrollGameInfo = function() {
        var data = $("#enrollGameInfoForm").serializeJson();
        var gameId = $("#enrollGameBtn").attr("data-value");
        data.gameId = gameId;
        if (globalModule.isArray(data.gamePlace)) {
            var gamePlaces = "";
            for (var i = 0; i < data.gamePlace.length; i++) {
                gamePlaces += "," + data.gamePlace[i];
            }
            gamePlaces = gamePlaces.substring(1);
            data.gamePlace = gamePlaces;
        }
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/EnrollGame/addEnrollGameInfo", data, function(result) {
            if (result.Code == 1) {
                indexModule.loadGameDetailsPage1("gameDetails1", gameId);
            } else {
                $("#enrollGameResult").html("报名信息添加失败！");
            }
        }, 'post');
    }
    im.enrollGameEnd = function(gameId, round) {
        round = round || 1;
        globalModule.loadPage("main-content", "addTimeTable", im.enrollGameEndInit, { gameId: gameId, round: round });
    }
    im.enrollGameEndInit = function(params) {
        $("#ttGameId").attr("value", params.gameId);
        $("#ttRound").attr("value", params.round);
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/GameList/getGameInfoByGameId", params, im.fillinEnrollGamePlace);
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/EnrollGame/getAgreedEnrollGameList", params, im.fillinEnrollGameTeamList);
    }
    im.fillinEnrollGamePlace = function(result) {
        var gamePlace = result.gamePlace.split(",");
        var html = template('ttGamePlace-template', { DataTable: gamePlace });
        $("#ttGamePlace").html(html);
        $("#ttGamePlace").selectpicker({
            liveSearch: true,
            maxOptions: 1
        });
    }
    im.fillinEnrollGameTeamList = function(result) {
        var html = template('timeTableTeamList-template', { DataTable: result });
        $("#ttMainTeam").html(html);
        $("#ttMainTeam").selectpicker({
            liveSearch: true,
            maxOptions: 1
        });
        $("#ttSubTeam").html(html);
        $("#ttSubTeam").selectpicker({
            liveSearch: true,
            maxOptions: 1
        });
    }
    im.agreeEnroll = function() {
        $("#agreeEnrollBtn").attr("disabled", "disabled");
        $("#disAgreeEnrollBtn").removeAttr("disabled");
    }
    im.disAgreeEnroll = function() {
        $("#disAgreeEnrollBtn").attr("disabled", "disabled");
        $("#agreeEnrollBtn").removeAttr("disabled");
    }
    im.addTeam = function() {

        globalModule.CKupdate();

        var data = $("#addTeamForm").serializeJson();

        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Team/addTeam", data, function(result) {
            if (result.Code == 1) {
                globalModule.loadPage("main-content", "teamList", app.bread);
            } else {
                $("#addTeamResult").html("球队信息添加失败！");
            }
        }, 'post');
    }
    im.editTeamPage = function(teamId) {
        globalModule.loadPage("main-content", "editTeam", im.editTeamInit, { teamId: teamId });
    }
    im.editTeamInit = function(params) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Team/getTeamInfo", params, function(result) {
            if (result.Code == 1) {
                var html = template('editTeam-template', result.DataTable);
                $("#editTeam").html(html);
                var teamCreateDate = result.DataTable.teamCreateDate;
                $("#teamBrief").html(result.DataTable.teamBrief);
                CKEDITOR.replace('teamBrief');
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
    im.editTeam = function() {
        globalModule.CKupdate();
        var data = $("#editTeamForm").serializeJson();
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Team/editTeam", data, function(result) {
            if (result.Code == 1) {
                globalModule.loadPage("main-content", "teamList", app.bread);
            } else {
                $("#editTeamResult").html("球队信息修改失败！");
            }
        }, 'post');
    }
    im.getTeamList = function(callback) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Team/getTeamList", null, callback);
    }
    im.fillinTeamList = function(result) {
        if (result.Code == 1) {
            var html = template('teamList-template', result);
            $("#boradData").after(html);
        }
    }
    im.addTeamMemberInit = function(teamId, teamName) {
        globalModule.loadPage("main-content", "addMember", im.addTeamMember, { teamId: teamId, teamName: teamName });
    }
    im.addTeamMember = function(params) {
        $("#addTeamName").attr("value", params.teamName);
        $("#addTeamId").attr("value", params.teamId);
        $("#addTeamNameSpan").html(params.teamName);
    }
    im.addMember = function() {
        globalModule.CKupdate();
        var data = $("#addMemberForm").serializeJson();
        if (globalModule.isArray(data.memberPosition)) {
            var memberPositions = "";
            for (var i = 0; i < data.memberPosition.length; i++) {
                memberPositions += "," + data.memberPosition[i];
            }
            memberPositions = memberPositions.substring(1);
            data.memberPosition = memberPositions;
        }
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Member/addMember", data, function(result) {
            $("#addGameContent").html(result.message);
            im.viewTeam(data.teamId);
        }, 'post');
    }
    im.viewMemberPage = function(memberId) {
        globalModule.loadPage("main-content", "viewMember", im.viewMember, { memberId: memberId });
    }
    im.viewMember = function(params) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Member/getMember", params, im.fillViewMember);
    }
    im.fillViewMember = function(result) {
        var html = template('viewMember-template', result.DataTable);
        $("#viewMember").html(html);
        $("#memberBrief").html(result.DataTable.memberBrief);
    }
    im.updateMember = function(memberId) {
        globalModule.loadPage("main-content", "editMember", im.editMemberInit, { memberId: memberId });
    }
    im.editMemberInit = function(params) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Member/getMember", params, im.editMemberFillin);
    }
    im.editMemberFillin = function(result) {
        var html = template('editMember-template', result.DataTable);
        $("#editMember").html(html);
        $("#memberBrief").html(result.DataTable.memberBrief);
        im.initSelector($("#editMemberPosition"), { title: result.DataTable.memberPosition });
        CKEDITOR.replace('memberBrief');
    }
    im.editMember = function() {
        globalModule.CKupdate();
        var data = $("#editMemberForm").serializeJson();
        if (globalModule.isArray(data.memberPosition)) {
            var memberPositions = "";
            for (var i = 0; i < data.memberPosition.length; i++) {
                memberPositions += "," + data.memberPosition[i];
            }
            memberPositions = memberPositions.substring(1);
            data.memberPosition = memberPositions;
        }
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Member/editMember", data, function(result) {
            im.viewTeam(result.DataTable.teamId);
        }, 'post');
    }
    im.viewTeam = function(teamId) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Team/getTeamInfo", { teamId: teamId }, im.showTeamDetailsPage);
    }
    im.showTeamDetailsPage = function(result) {
        globalModule.loadPage("main-content", "teamDetails", im.showTeamDetails, result);
    }
    im.showTeamDetails = function(result) {
        var html = template('teamDetails-template', result.DataTable);
        $("#teamDetails").html(html);
        $("#teamBrief").html(result.DataTable.teamBrief);
        var fillinParams = { tmplId: 'attendGameList-template', target: $("#attendGameList"), way: "html" };
        globalModule.globalAjax(globalModule.globalHomeUrl + 'api/EnrollGame/FindAllEnrollTeams', { teamId: result.DataTable.ID }, globalModule.fillinInfoFromTmpl, null, null, null, fillinParams);
        var teamId = $("#teamInfo").attr("data-teamid");
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Member/getMembers", { teamId: teamId }, im.showTeamMembersDetails);
    }
    im.showTeamMembersDetails = function(result) {
        var html = template('teamMemberList-template', result);
        $("#teamMembersBodyUl").html(html);
        $('#tj_container').gridnav({
            rows: 3,
            type: {
                mode: 'disperse',
                speed: 700,
                easing: '',
                factor: '',
                reverse: ''
            }
        });
    }
    im.addGameRule = function() {
        var data = $("#addGameRuleForm").serializeJson();
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/GameRule/addGameRule", data, null, "post");
        globalModule.loadPage("main-content", "gameRules", app.bread);
    }
    im.getGameRules = function() {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/GameRule/getGameRuleList", null, im.fillinGameRules);
    }
    im.fillinGameRules = function(result) {
        var html = template('gameRules-template', result);
        $("#boradData").after(html);
    }
    im.viewGameRule = function(ID) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/GameRule/viewGameRule", { ID: ID }, im.viewGameRulePage);
    }
    im.viewGameRulePage = function(result) {
        globalModule.loadPage("main-content", "viewGameRule", im.fillinGameRule, result);
    }
    im.fillinGameRule = function(result) {
        var html = template('viewGameRule-template', result.DataTable);
        $("#viewGameRule").html(html);
    }
    im.addTimeTable = function() {
        var data = $("#addTimeTableForm").serializeJson();
        var ttMainTeam = data.ttMainTeam;
        data.ttMainTeamID = ttMainTeam.split(",")[0];
        data.ttMainTeam = ttMainTeam.split(",")[1];
        var ttSubTeam = data.ttSubTeam;
        data.ttSubTeamID = ttSubTeam.split(",")[0];
        data.ttSubTeam = ttSubTeam.split(",")[1];
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addTimeTable", data, function(result) {
            if (result.Code == 1) {
                $("#addTimeTableResult").html("添加赛程成功，可以继续添加！");
            }
        }, "post");
    }
    im.updateGameStatus = function(gameId) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/GameList/updateGameStatus", { gameId: gameId }, im.updateGameStatusPage, null, null, null, { gameId: gameId });
    }
    im.updateGameStatusPage = function(result, params) {
        if (result.Code == 1) {
            globalModule.loadPage("main-content", "gameDetails1", im.loadGameDetails1, params);
        }
    }
    im.addGameResultPage = function(ttId, mainTeamId, subTeamId, flag) {
        if (flag == "比赛战况") {
            var params = { ttId: ttId, mainTeamId: mainTeamId, subTeamId: subTeamId };
            globalModule.loadPage("main-content", "gameResultPage", im.viewGameResultPage, params);
        } else if (flag == "战况录入") {
            var params = { ttId: ttId, mainTeamId: mainTeamId, subTeamId: subTeamId };
            globalModule.loadPage("main-content", "addGameResult", im.addGameResultInit, params);
        }
    }
    im.viewGameResultPage = function(params) {
        $("#gameResultPage-copy-right").hide();
        var fillinParams = { tmplId: 'gameResultPage-template', target: $("#gameResultPage"), way: "html" };
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/viewGameResult", { ttId: params.ttId }, im.fillinGameResultPage, null, null, null, fillinParams);
    }
    im.fillinGameResultPage = function(result, params) {
        globalModule.fillinInfoFromTmpl(result, params);

        var mainStarting = result.DataTable.mainStarting;
        if (mainStarting) {
            var mainStartingArray = new Array();
            if (mainStarting.indexOf(",") != -1) {
                mainStartingArray = mainStarting.split(",");
            } else {
                mainStartingArray.push(mainStarting);
            }
            var fillinParams = { tmplId: 'grpMembers-template', target: $("#mainStarting"), way: "after" };
            globalModule.fillinInfoFromTmpl({ DataTable: mainStartingArray }, fillinParams);
        }
        var subStarting = result.DataTable.subStarting;
        if (subStarting) {
            var subStartingArray = new Array();
            if (subStarting.indexOf(",") != -1) {
                subStartingArray = subStarting.split(",");
            } else {
                subStartingArray.push(subStarting);
            }
            fillinParams = { tmplId: 'grpMembers-template', target: $("#subStarting"), way: "after" };
            globalModule.fillinInfoFromTmpl({ DataTable: subStartingArray }, fillinParams);
        }

        var mainSubstitutes = result.DataTable.mainSubstitutes;
        if (mainSubstitutes) {
            var mainSubstitutesArray = new Array();
            if (mainSubstitutes.indexOf(",") != -1) {
                mainSubstitutesArray = mainSubstitutes.split(",");
            } else {
                mainSubstitutesArray.push(mainSubstitutes);
            }
            fillinParams = { tmplId: 'grpMembers-template', target: $("#mainSubstitutes"), way: "after" };
            globalModule.fillinInfoFromTmpl({ DataTable: mainSubstitutesArray }, fillinParams);
        }

        var subSubstitutes = result.DataTable.subSubstitutes;
        if (subSubstitutes) {
            var subSubstitutesArray = new Array();
            if (subSubstitutes.indexOf(",") != -1) {
                subSubstitutesArray = subSubstitutes.split(",");
            } else {
                subSubstitutesArray.push(subSubstitutes);
            }
            fillinParams = { tmplId: 'grpMembers-template', target: $("#subSubstitutes"), way: "after" };
            globalModule.fillinInfoFromTmpl({ DataTable: subSubstitutesArray }, fillinParams);
        }

        var mainYellowMemberNameMinute = result.DataTable.mainYellowMemberNameMinute;
        if (mainYellowMemberNameMinute) {
            var mainYellowMemberNameMinuteArray = new Array();
            if (mainYellowMemberNameMinute.indexOf(",") != -1) {
                mainYellowMemberNameMinuteArray = mainYellowMemberNameMinute.split(",");
            } else {
                mainYellowMemberNameMinuteArray.push(mainYellowMemberNameMinute);
            }
            fillinParams = { tmplId: 'grpYellowMembers-template', target: $("#mainData"), way: "prepend" };
            globalModule.fillinInfoFromTmpl({ DataTable: mainYellowMemberNameMinuteArray }, fillinParams);
        }

        var mainRedMemberNameMinute = result.DataTable.mainRedMemberNameMinute;
        if (mainRedMemberNameMinute) {
            var mainRedMemberNameMinuteArray = new Array();
            if (mainRedMemberNameMinute.indexOf(",") != -1) {
                mainRedMemberNameMinuteArray = mainRedMemberNameMinute.split(",");
            } else {
                mainRedMemberNameMinuteArray.push(mainRedMemberNameMinute);
            }
            fillinParams = { tmplId: 'grpRedMembers-template', target: $("#mainData"), way: "prepend" };
            globalModule.fillinInfoFromTmpl({ DataTable: mainRedMemberNameMinuteArray }, fillinParams);
        }

        var mainMemberNameMinute = result.DataTable.mainMemberNameMinute;
        if (mainMemberNameMinute) {
            var mainMemberNameMinuteArray = new Array();
            if (mainMemberNameMinute.indexOf(",") != -1) {
                mainMemberNameMinuteArray = mainMemberNameMinute.split(",");
            } else {
                mainMemberNameMinuteArray.push(mainMemberNameMinute);
            }
            fillinParams = { tmplId: 'grpScoreMembers-template', target: $("#mainData"), way: "prepend" };
            globalModule.fillinInfoFromTmpl({ DataTable: mainMemberNameMinuteArray }, fillinParams);
        }

        var subYellowMemberNameMinute = result.DataTable.subYellowMemberNameMinute;
        if (subYellowMemberNameMinute) {
            var subYellowMemberNameMinuteArray = new Array();
            if (subYellowMemberNameMinute.indexOf(",") != -1) {
                subYellowMemberNameMinuteArray = subYellowMemberNameMinute.split(",");
            } else {
                subYellowMemberNameMinuteArray.push(subYellowMemberNameMinute);
            }
            fillinParams = { tmplId: 'grpYellowMembers-template', target: $("#subData"), way: "prepend" };
            globalModule.fillinInfoFromTmpl({ DataTable: subYellowMemberNameMinuteArray }, fillinParams);
        }
        var subRedMemberNameMinute = result.DataTable.subRedMemberNameMinute;
        if (subRedMemberNameMinute) {
            var subRedMemberNameMinuteArray = new Array();
            if (subRedMemberNameMinute.indexOf(",") != -1) {
                subRedMemberNameMinuteArray = subRedMemberNameMinute.split(",");
            } else {
                subRedMemberNameMinuteArray.push(subRedMemberNameMinute);
            }
            fillinParams = { tmplId: 'grpRedMembers-template', target: $("#subData"), way: "prepend" };
            globalModule.fillinInfoFromTmpl({ DataTable: subRedMemberNameMinuteArray }, fillinParams);
        }

        var subMemberNameMinute = result.DataTable.subMemberNameMinute;
        if (subMemberNameMinute) {
            var subMemberNameMinuteArray = new Array();
            if (subMemberNameMinute.indexOf(",") != -1) {
                subMemberNameMinuteArray = subMemberNameMinute.split(",");
            } else {
                subMemberNameMinuteArray.push(subMemberNameMinute);
            }
            fillinParams = { tmplId: 'grpScoreMembers-template', target: $("#subData"), way: "prepend" };
            globalModule.fillinInfoFromTmpl({ DataTable: subMemberNameMinuteArray }, fillinParams);
        }

        $("#shareBtn").on("click", function() {
            $("#qrcode").html("");
            var ttId = $(this).attr("data-ttid");
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width: 96, //设置宽高
                height: 96
            });
            qrcode.makeCode("http://www.leyisports.com/gameResultPageShare.html?ttId=" + ttId);
        });

    }
    im.viewGameResultInit = function(params) {
        var fillinParams = { tmplId: 'viewGameResult-template', target: $("#viewGameResult"), way: "html", callback: im.fillinMembers, callbackParams: { mainTeamId: params.mainTeamId, subTeamId: params.subTeamId } };
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/viewGameResult", { ttId: params.ttId }, globalModule.fillinInfoFromTmpl, null, null, null, fillinParams);
    }
    im.viewGameComment = function(ttId) {
        globalModule.loadPage("main-content", "gameComment", function(params) {
            globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/viewGameResult", { ttId: params.ttId }, function(result) {
                $("#gameCommentContent").html(result.DataTable.remark || "暂无评论");
            });
        }, { ttId: ttId });
    }
    im.addGameResultInit = function(params) {
        im.initDateTimePicker("form_datetime");
        var fillinParams = { tmplId: 'addGameResult-template', target: $("#addGameResult"), way: "html", callback: im.fillinMembers, callbackParams: { mainTeamId: params.mainTeamId, subTeamId: params.subTeamId } };
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/findTimeTable", { ttId: params.ttId }, globalModule.fillinInfoFromTmpl, null, null, null, fillinParams);
    }
    im.fillinMembers = function(params) {
        var fillinParamsMain = { tmplId: 'teamMembers-template', target: $(".mainTeamMembers"), way: "html", callback: im.initTeamMembersSelector, callbackParams: 'mainTeamMembers' };
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Member/getMembers", { teamId: params.mainTeamId }, globalModule.fillinInfoFromTmpl, null, null, null, fillinParamsMain);
        var fillinParamsSub = { tmplId: 'teamMembers-template', target: $(".subTeamMembers"), way: "html", callback: im.initTeamMembersSelector, callbackParams: 'subTeamMembers' };
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Member/getMembers", { teamId: params.subTeamId }, globalModule.fillinInfoFromTmpl, null, null, null, fillinParamsSub);
        $("textarea[name='remark']").attr("id", "gameRemark");
        CKEDITOR.replace('gameRemark');
        var fillinParams = { tmplId: 'teamMembers-template', target: $(".allTeamMembers"), way: "html", callback: im.initTeamMembersSelector, callbackParams: 'allTeamMembers' };
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Member/getMembersForMVP", { mainTeamId: params.mainTeamId, subTeamId: params.subTeamId }, globalModule.fillinInfoFromTmpl, null, null, null, fillinParams);
    }
    im.addGameResult = function() {
        globalModule.CKupdate();
        var data = $("#addGameResultForm").serializeJson();
        var gameResultData = {};
        gameResultData.timeTableId = data.timeTableId;
        gameResultData.gameId = data.gameId;
        gameResultData.round = data.round;
        gameResultData.mainStarting = globalModule.arrayToString(data.mainStarting);
        gameResultData.mainSubstitutes = globalModule.arrayToString(data.mainSubstitutes);
        gameResultData.subStarting = globalModule.arrayToString(data.subStarting);
        gameResultData.subSubstitutes = globalModule.arrayToString(data.subSubstitutes);
        gameResultData.mainTeamGoal = data.mainTeamGoal;
        gameResultData.subTeamGoal = data.subTeamGoal;
        gameResultData.remark = data.remark;
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addGameResult", gameResultData, null, "post");

        if (data.mainGoalMembers) {
            if (globalModule.isArray(data.mainGoalMembers)) {
                for (var i = 0; i < data.mainGoalMembers.length; i++) {
                    var memberScoreDetailsData = {};
                    memberScoreDetailsData.timeTableId = data.timeTableId;
                    memberScoreDetailsData.gameId = data.gameId;
                    memberScoreDetailsData.round = data.round;
                    memberScoreDetailsData.memberId = data.mainGoalMembers[i];
                    memberScoreDetailsData.memberScoreDateTime = data.mainMemberScoreDateTime[i] || "";
                    globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addMemberScoreDetails", memberScoreDetailsData, null, "post");
                }
            } else {
                var memberScoreDetailsData = {};
                memberScoreDetailsData.timeTableId = data.timeTableId;
                memberScoreDetailsData.gameId = data.gameId;
                memberScoreDetailsData.round = data.round;
                memberScoreDetailsData.memberId = data.mainGoalMembers;
                memberScoreDetailsData.memberScoreDateTime = data.mainMemberScoreDateTime || "";
                globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addMemberScoreDetails", memberScoreDetailsData, null, "post");
            }

        }
        if (data.subGoalMembers) {
            if (globalModule.isArray(data.subGoalMembers)) {
                for (var i = 0; i < data.subGoalMembers.length; i++) {
                    var memberScoreDetailsData = {};
                    memberScoreDetailsData.timeTableId = data.timeTableId;
                    memberScoreDetailsData.gameId = data.gameId;
                    memberScoreDetailsData.round = data.round;
                    memberScoreDetailsData.memberId = data.subGoalMembers[i];
                    memberScoreDetailsData.memberScoreDateTime = data.subMemberScoreDateTime[i] || "";
                    globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addMemberScoreDetails", memberScoreDetailsData, null, "post");
                }
            } else {
                var memberScoreDetailsData = {};
                memberScoreDetailsData.timeTableId = data.timeTableId;
                memberScoreDetailsData.gameId = data.gameId;
                memberScoreDetailsData.round = data.round;
                memberScoreDetailsData.memberId = data.subGoalMembers;
                memberScoreDetailsData.memberScoreDateTime = data.subMemberScoreDateTime || "";
                globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addMemberScoreDetails", memberScoreDetailsData, null, "post");
            }
        }

        if (data.mainRedMembers) {
            if (globalModule.isArray(data.mainRedMembers)) {
                for (var i = 0; i < data.mainRedMembers.length; i++) {
                    var memberRedDetailsData = {};
                    memberRedDetailsData.timeTableId = data.timeTableId;
                    memberRedDetailsData.gameId = data.gameId;
                    memberRedDetailsData.round = data.round;
                    memberRedDetailsData.memberId = data.mainRedMembers[i];
                    memberRedDetailsData.memberRedDateTime = data.mainMemberRedDateTime[i] || "";
                    globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addMemberRedDetails", memberRedDetailsData, null, "post");
                }
            } else {
                var memberRedDetailsData = {};
                memberRedDetailsData.timeTableId = data.timeTableId;
                memberRedDetailsData.gameId = data.gameId;
                memberRedDetailsData.round = data.round;
                memberRedDetailsData.memberId = data.mainRedMembers;
                memberRedDetailsData.memberRedDateTime = data.mainMemberRedDateTime || "";
                globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addMemberRedDetails", memberRedDetailsData, null, "post");
            }

        }
        if (data.subRedMembers) {
            if (globalModule.isArray(data.subRedMembers)) {
                for (var i = 0; i < data.subRedMembers.length; i++) {
                    var memberRedDetailsData = {};
                    memberRedDetailsData.timeTableId = data.timeTableId;
                    memberRedDetailsData.gameId = data.gameId;
                    memberRedDetailsData.round = data.round;
                    memberRedDetailsData.memberId = data.subRedMembers[i];
                    memberRedDetailsData.memberRedDateTime = data.subMemberRedDateTime[i] || "";
                    globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addMemberRedDetails", memberRedDetailsData, null, "post");
                }
            } else {
                var memberRedDetailsData = {};
                memberRedDetailsData.timeTableId = data.timeTableId;
                memberRedDetailsData.gameId = data.gameId;
                memberRedDetailsData.round = data.round;
                memberRedDetailsData.memberId = data.subRedMembers;
                memberRedDetailsData.memberRedDateTime = data.subMemberRedDateTime || "";
                globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addMemberRedDetails", memberRedDetailsData, null, "post");
            }
        }
        if (data.mainYellowMembers) {
            if (globalModule.isArray(data.mainYellowMembers)) {
                for (var i = 0; i < data.mainYellowMembers.length; i++) {
                    var memberYellowDetailsData = {};
                    memberYellowDetailsData.timeTableId = data.timeTableId;
                    memberYellowDetailsData.gameId = data.gameId;
                    memberYellowDetailsData.round = data.round;
                    memberYellowDetailsData.memberId = data.mainYellowMembers[i];
                    memberYellowDetailsData.memberYellowDateTime = data.mainMemberYellowDateTime[i] || "";
                    globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addMemberYellowDetails", memberYellowDetailsData, null, "post");
                }
            } else {
                var memberYellowDetailsData = {};
                memberYellowDetailsData.timeTableId = data.timeTableId;
                memberYellowDetailsData.gameId = data.gameId;
                memberYellowDetailsData.round = data.round;
                memberYellowDetailsData.memberId = data.mainYellowMembers;
                memberYellowDetailsData.memberYellowDateTime = data.mainMemberYellowDateTime || "";
                globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addMemberYellowDetails", memberYellowDetailsData, null, "post");
            }

        }
        if (data.subYellowMembers) {
            if (globalModule.isArray(data.subYellowMembers)) {
                for (var i = 0; i < data.subYellowMembers.length; i++) {
                    var memberYellowDetailsData = {};
                    memberYellowDetailsData.timeTableId = data.timeTableId;
                    memberYellowDetailsData.gameId = data.gameId;
                    memberYellowDetailsData.round = data.round;
                    memberYellowDetailsData.memberId = data.subYellowMembers[i];
                    memberYellowDetailsData.memberYellowDateTime = data.subMemberYellowDateTime[i] || "";
                    globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addMemberYellowDetails", memberYellowDetailsData, null, "post");
                }
            } else {
                var memberYellowDetailsData = {};
                memberYellowDetailsData.timeTableId = data.timeTableId;
                memberYellowDetailsData.gameId = data.gameId;
                memberYellowDetailsData.round = data.round;
                memberYellowDetailsData.memberId = data.subYellowMembers;
                memberYellowDetailsData.memberYellowDateTime = data.subMemberYellowDateTime || "";
                globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addMemberYellowDetails", memberYellowDetailsData, null, "post");
            }
        }

        var params = { ttId: data.timeTableId, mainTeamId: data.mainTeamID, subTeamId: data.subTeamID };
        globalModule.loadPage("main-content", "viewGameResult", im.viewGameResultInit, params);

    }
    im.initTeamMembersSelector = function(className) {
        $("." + className).each(function() {
            if ($(this).attr("data-initial") != "false") {
                if ($(this).attr("data-width") != "") {
                    var width = $(this).attr("data-width");
                    $(this).selectpicker({
                        liveSearch: true,
                        width: $(this).attr("data-width")
                    });
                } else {
                    $(this).selectpicker({
                        liveSearch: true
                    });
                }
            }
        });
        im.initDateTimePicker();
    }
    im.initSelector = function(obj, options) {
        var option = { liveSearch: true };
        if (options) {
            $.extend(option, options || {});
        }
        obj.selectpicker(option);
        return obj;
    }
    im.initDateTimePicker = function() {
        if ($(this).attr("data-initial") != "false") {
            $('.form_datetime').datetimepicker({
                format: "dd MM yyyy - hh:ii",
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                forceParse: 0,
                minuteStep: 1,
                language: 'zh-CN'
            });
        }

    }
    im.cloneDiv = function(obj, cloneDivTmpl, initialDiv, datetimepickerId) {
        var div = $(obj).closest("div[class='form-group']");
        var cloneDiv = cloneDivTmpl.clone();
        var index = initialDiv.attr("data-index");
        index++;
        cloneDiv.attr("id", "");
        cloneDiv.removeClass("hide");
        cloneDiv.find("input[type='hidden']").attr("name", initialDiv.find("input[type='hidden']").attr("name")).attr("id", datetimepickerId + index);
        cloneDiv.find("select").attr("name", initialDiv.find("select").attr("name"));
        cloneDiv.find("select").attr("class", initialDiv.find("select").attr("class"));
        div.after(cloneDiv);
        im.initSelector(cloneDiv.find("select"));
        cloneDiv.find("div[class*='form_date']").attr("data-initial", "true").attr("data-link-field", datetimepickerId + index);
        im.initDateTimePicker();
        initialDiv.attr("data-index", index);
    }
    im.deleteCloneDiv = function(obj) {
        $(obj).closest("div[class='form-group']").remove();
    }

    im.loadGameDetailsPage1 = function(htmlName, gameId) {
        globalModule.loadPage("main-content", htmlName, im.loadGameDetails1, { gameId: gameId });
    }
    im.loadGameDetails1 = function(params) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/GameList/getGameInfoByGameId", params, function(result) {
            var html = template('gameDetails-template', result);
            $("#gameDetails").html(html);
            var gameStatus = $("#gameInfo").attr("data-gameStatus");
            if (gameStatus == '0') {
                $("#enrollBtnDiv").html($("#enrollBtns").removeClass("hide"));
                $("#enrollBtnDiv").removeClass("hide");
                globalModule.globalAjax(globalModule.globalHomeUrl + 'api/EnrollGame/getEnrollGameList', params, im.fillinEnrollGameList);
            } else {
                $("#enrollTeams").addClass("hide");
                $("#enrollBtnDiv").addClass("hide");
                $("#gameBoards").removeClass("hide");
            }
            indexModule.bindGameDetails();
            $("#matchList").click();
            app.bread();
        });
    }
    im.fillinEnrollGameList = function(result) {
        if (result.length > 0) {
            var html = "";
            for (var i = 0; i < result.length; i++) {
                var enrollTeam = result[i];
                html += template('enrollTeam-template', enrollTeam);
            }
            $("#enrollTeamsHead").after(html);
            $("#enrollTeams").removeClass("hide");

            $(".agreeBtn").each(function() {
                var enrollStatus = $(this).attr("data-value");
                if (enrollStatus == "同意") {
                    $(this).bootstrapSwitch({ 'state': true });
                    var gameruleid = $("#gameInfo").attr("data-gameruleid");
                    var switchDiv = $(this).closest("div[class*='enrollStatusSwitch']");
                    var gameGroupDetailSelect = switchDiv.closest("div[class*='operation']").find("select");
                    var enrollId = switchDiv.attr("data-enrollId");
                    var enrollGroupName = switchDiv.attr("data-enrollGroupName");
                    gameGroupDetailSelect.removeClass("hide");
                    globalModule.globalAjax(globalModule.globalHomeUrl + "api/GameRule/viewGameRule", { ID: gameruleid }, im.fillinGameGroupDetail, null, null, null, { switchDiv: switchDiv, gameGroupDetailSelect: gameGroupDetailSelect, enrollGroupName: enrollGroupName, enrollId: enrollId });
                } else {
                    $(this).bootstrapSwitch({ 'state': false });
                }
            });
            $('.switch').on('switchChange.bootstrapSwitch', function(event, state) {
                var enrollId = $(this).attr("data-enrollId");
                var gameGroupDetailSelect = $(this).closest("div").find("select");
                var switchDiv = $(this);
                // true | false
                if (state) {
                    gameGroupDetailSelect.removeClass("hide");
                    var gameruleid = $("#gameInfo").attr("data-gameruleid");
                    var enrollGroupName = switchDiv.attr("data-enrollGroupName");
                    globalModule.globalAjax(globalModule.globalHomeUrl + "api/GameRule/viewGameRule", { ID: gameruleid }, im.fillinGameGroupDetail, null, null, null, { switchDiv: switchDiv, gameGroupDetailSelect: gameGroupDetailSelect, enrollGroupName: enrollGroupName, enrollId: enrollId });
                } else {
                    gameGroupDetailSelect.addClass("hide");
                    gameGroupDetailSelect.selectpicker('destroy');
                    var select = "<select class='show-tick form-control hide' multiple name='gameGroupDetail'></select>";
                    switchDiv.append(select);
                }
                globalModule.globalAjax(globalModule.globalHomeUrl + "api/EnrollGame/updateEnrollStatus", { ID: enrollId, enrollStatus: state }, null, 'post');
            });
        }
    }
    im.fillinGameGroupDetail = function(result, params) {
        var gameGroupDetails = result.DataTable.gameGroupDetail.split(",");
        var html = template('gameGroupDetail-template', { DataTable: gameGroupDetails });
        var gameGroupDetailSelect = params.gameGroupDetailSelect;
        gameGroupDetailSelect.html(html);
        gameGroupDetailSelect.selectpicker({
            liveSearch: true,
            maxOptions: 1,
            noneSelectedText: params.enrollGroupName,
            width: "150px"
        }).on('changed.bs.select', function(e, clickedIndex, oldValue, newValue) {
            globalModule.globalAjax(globalModule.globalHomeUrl + "api/EnrollGame/updateEnrollGroupName", { ID: params.enrollId, enrollGroupName: $(e.currentTarget).val() }, null, "post");
        });
    }
    im.fillinTimeTablePage = function(params) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/findAllTimeTables", params, im.fillinTimeTable, null, null, null, params);
    }
    im.fillinTimeTable = function(result, params) {
        $("#roundsDiv").attr("data-gameid", params.gameId);
        $("#round" + params.round).find("ol").html(template("enrollGameList-template", result));
        if (params.round == 1) {
            globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/getGameRounds", params, im.addLi, null, null, null, params);
        }
    }
    im.addLi = function(result, params) {
        var round = result.DataTable;
        if (round > 1) {
            $("#roundUl").attr("data-li", round);
            for (var i = 2; i <= round; i++) {
                var li = "<li><a href='#round" + i + "' data-toggle='tab' data-index='" + i + "' onclick='indexModule.dynamicLoadLiContent(" + params.gameId + ", " + i + ")'>第" + i + "轮</a></li>";
                $("#addTab").closest("li").before(li);
                var roundDiv = "<div class='tab-pane active' id='round" + i + "'><p><ol class='dd-list'></ol></p></div>";
                var lastOne = i - 1;
                $("#round" + lastOne).after(roundDiv);
            }
        }
    }
    im.dynamicLoadLiContent = function(gameId, round) {
        var params = {
            gameId: gameId,
            round: round
        };
        im.fillinTimeTablePage(params);
    }
    im.bindGameDetails = function() {
        var gameId = $("#gameInfo").attr("data-gameid");
        var params = { gameId: gameId };
        var empty = {}
        var object = $.extend(empty, params, { round: 1 });
        $("#matchList").on("click", function() {
            globalModule.loadPage("match-content", "matchList", im.fillinTimeTablePage, object);
        });
        $("#scoreList").on("click", function() {
            globalModule.loadPage("match-content", "scoreList", im.loadScoreList, params);
        });
        $("#shooterList").on("click", function() {
            globalModule.loadPage("match-content", "shooterList", im.loadShooterList, params);
        });
        $("#stopList").on("click", function() {
            globalModule.loadPage("match-content", "stopList", im.loadStopList, params);
        });
    }

    im.loadEditGamePage = function(gameId) {
        var params = { "gameId": gameId };
        globalModule.loadPage("main-content", "editGame", im.loadEditGame, params);
    }
    im.loadEditGame = function(params) {
        $.ajax({
            type: 'get',
            dataType: "json",
            url: '/assets/json/gameInfo.json',
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
    im.extendFunc = function() {
        console.log("This is the extend function!");
    }
    return im;
}(indexModule || {}));
