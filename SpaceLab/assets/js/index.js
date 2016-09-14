var indexModule = (function(im) {
    im.loadPage = function(parentId, pageName, callback, params) {
        $("#" + parentId || "main-content").load(pageName + ".html", function(response, status, xhr) {
            if (callback) {
                callback(params);
            }

        });
    }
    im.login = function() {
        var data = $("#loginForm").serializeJson();
        $.ajax({
            type: 'get',
            dataType: "json",
            url: globalModule.globalHomeUrl + 'api/User/login',
            data: data,
            async: false,
            success: function(result) {
                if (result == 1) {
                    im.loadPage("container", "main", function() { $("#userName").html(data.name); });
                }
            }
        });
    }
    im.addGame = function() {
        var data = $("#addGameForm").serializeJson();
        data.gamePlace = globalModule.arrayToString(data.gamePlace);
        $.ajax({
            type: 'post',
            dataType: "json",
            url: globalModule.globalHomeUrl + 'api/GameList/addGame',
            data: data,
            async: false,
            success: function(result) {
                $("#addGameContent").html(result.message);
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
            url: globalModule.globalHomeUrl + 'api/GameList/editGame',
            data: data,
            async: false,
            success: function(result) {
                $("#editGameContent").html(result.message);
                im.popupModal("basicModal");
            }
        });
    }
    im.enrollGame = function(gameId) {
        im.loadPage("main-content", "enrollGame", im.enrollGameInit, { gameId: gameId });
    }
    im.enrollGameInit = function(params) {
        $.ajax({
            type: 'get',
            dataType: "json",
            // url: 'assets/json/editGame.json',
            url: globalModule.globalHomeUrl + 'api/GameList/getGamePlaceByGameId',
            data: params,
            async: false,
            success: function(result) {
                var html = template('gamePlace-template', result);
                $("#gamePlace").html(html);
                app.bread();
                $('#gamePlace').selectpicker({
                    liveSearch: true
                });
                $("#enrollGameBtn").attr("data-value", params.gameId);
            }
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
        $.ajax({
            type: 'post',
            dataType: "json",
            // url: 'assets/json/editGame.json',
            url: globalModule.globalHomeUrl + 'api/EnrollGame/addEnrollGameInfo',
            data: data,
            async: false,
            success: function(result) {
                if (result.Code == 1) {
                    indexModule.loadGameDetailsPage1("gameDetails1", gameId);
                } else {
                    $("#enrollGameResult").html("报名信息添加失败！");
                }
            }
        });
    }
    im.enrollGameEnd = function(gameId) {
        im.loadPage("main-content", "addTimeTable", im.enrollGameEndInit, { gameId: gameId, round: 1 });
    }
    im.enrollGameEndInit = function(params) {
        $("#ttGameId").attr("value", params.gameId);
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
        var html = template('teamList-template', { DataTable: result });
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
        im.loadPage("main-content", "addMember", im.addTeamMember, { teamId: teamId, teamName: teamName });
    }
    im.addTeamMember = function(params) {
        $("#addTeamName").attr("value", params.teamName);
        $("#addTeamId").attr("value", params.teamId);
        $("#addTeamNameSpan").html(params.teamName);
    }
    im.addMember = function() {
        var data = $("#addMemberForm").serializeJson();
        if (globalModule.isArray(data.memberPosition)) {
            var memberPositions = "";
            for (var i = 0; i < data.memberPosition.length; i++) {
                memberPositions += "," + data.memberPosition[i];
            }
            memberPositions = memberPositions.substring(1);
            data.memberPosition = memberPositions;
        }
        $.ajax({
            type: 'post',
            dataType: "json",
            url: globalModule.globalHomeUrl + 'api/Member/addMember',
            // url: 'http://localhost:4349/api/GameList/addGame',
            data: data,
            async: false,
            success: function(result) {
                $("#addGameContent").html(result.message);
                im.viewTeam(data.teamId);
            }
        });
    }
    im.viewMemberPage = function(memberId) {
        im.loadPage("main-content", "viewMember", im.viewMember, { memberId: memberId });
    }
    im.viewMember = function(params) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Member/getMember", params, im.fillViewMember);
    }
    im.fillViewMember = function(result) {
        var html = template('viewMember-template', result.DataTable);
        $("#viewMember").html(html);
    }
    im.viewTeam = function(teamId) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Team/getTeamInfo", { teamId: teamId }, im.showTeamDetailsPage);
    }
    im.showTeamDetailsPage = function(result) {
        im.loadPage("main-content", "teamDetails", im.showTeamDetails, result);
    }
    im.showTeamDetails = function(result) {
        var html = template('teamDetails-template', result.DataTable);
        $("#teamDetails").html(html);
        var teamId = $("#teamInfo").attr("data-teamid");
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Member/getMembers", { teamId: teamId }, im.showTeamMembersDetails);
    }
    im.showTeamMembersDetails = function(result) {
        var html = template('teamMembers-template', result);
        $("#teamMembersHead").after(html);
    }
    im.addGameRule = function() {
        var data = $("#addGameRuleForm").serializeJson();
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/GameRule/addGameRule", data, null, "post");
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
        im.loadPage("main-content", "viewGameRule", im.fillinGameRule, result);
    }
    im.fillinGameRule = function(result) {
        var html = template('viewGameRule-template', result.DataTable);
        $("#viewGameRule").html(html);
    }
    im.addTimeTable = function(round) {
        var data = $("#addTimeTableForm").serializeJson();
        var ttMainTeam = data.ttMainTeam;
        data.ttMainTeamID = ttMainTeam.split(",")[0];
        data.ttMainTeam = ttMainTeam.split(",")[1];
        var ttSubTeam = data.ttSubTeam;
        data.ttSubTeamID = ttSubTeam.split(",")[0];
        data.ttSubTeam = ttSubTeam.split(",")[1];
        data.ttRound = round;
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/addTimeTable", data, im.addTimeTableDone, "post");
    }
    im.addTimeTableDone = function(result) {
        if (result.Code == 1) {
            $("#addTimeTableResult").html("添加赛程成功，可以继续添加！");
        }
    }
    im.updateGameStatus = function(gameId) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/GameList/updateGameStatus", { gameId: gameId }, im.updateGameStatusPage, null, null, null, { gameId: gameId });
    }
    im.updateGameStatusPage = function(result, params) {
        if (result.Code == 1) {
            im.loadPage("main-content", "gameDetails1", im.loadGameDetails1, params);
        }
    }
    im.addGameResultPage = function(ttId, mainTeamId, subTeamId) {
        var params = { ttId: ttId, mainTeamId: mainTeamId, subTeamId: subTeamId };
        im.loadPage("main-content", "addGameResult", im.addGameResultInit, params);
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
    }
    im.addGameResult = function() {
        var data = $("#addGameResultForm").serializeJson();
        console.log(data);

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
    im.initSelector = function(obj) {
        obj.selectpicker({
            liveSearch: true,
            multipleSeparator: '~~~'
        });
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
            url: globalModule.globalHomeUrl + 'api/GameList/getGameInfoByGameId',
            async: false,
            success: function(result) {
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
            }
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
                $.ajax({
                    type: 'post',
                    dataType: "json",
                    data: { ID: enrollId, enrollStatus: state },
                    url: globalModule.globalHomeUrl + 'api/EnrollGame/updateEnrollStatus',
                    async: false,
                    success: function(result) {
                        console.log(result);
                    }
                });
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
            globalModule.globalAjax(globalModule.globalHomeUrl + "api/EnrollGame/updateEnrollGroupName", { ID: params.enrollId, enrollGroupName: $(e.currentTarget).val()[0] }, null, "post");
        });
    }
    im.fillinTimeTablePage = function(params) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/findAllTimeTables", params, im.fillinTimeTable);
    }
    im.fillinTimeTable = function(result) {
        $("#round1").find("ol").html(template("enrollGameList-template", result));
    }
    im.bindGameDetails = function() {
        var gameId = $("#gameInfo").attr("data-gameid");
        var params = { gameId: gameId };
        var empty = {}
        var object = $.extend(empty, params, { round: 1 });
        $("#matchList").on("click", function() {
            im.loadPage("match-content", "matchList", im.fillinTimeTablePage, object);
        });
        $("#scoreList").on("click", function() {
            im.loadPage("match-content", "scoreList", im.loadScoreList, params);
        });
        $("#shooterList").on("click", function() {
            im.loadPage("match-content", "shooterList", im.loadShooterList, params);
        });
        $("#stopList").on("click", function() {
            im.loadPage("match-content", "stopList", im.loadStopList, params);
        });
    }

    im.loadScoreList = function(params) {
        var fillinParams = { tmplId: 'scoreDetails-template', target: $("#boradData"), way: "after" };
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/EnrollGame/getGameMatchScoreList", params, globalModule.fillinInfoFromTmpl, null, null, null, fillinParams);
    }

    im.loadShooterList = function(params) {
        $.ajax({
            type: 'get',
            dataType: "json",
            data: params,
            //url: 'assets/json/shooterBoard.json',
            url: globalModule.globalHomeUrl + 'api/MatchShooter/getAllMatchShooter',
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
            url: globalModule.globalHomeUrl + 'api/MatchStop/getAllMatchStop',
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
