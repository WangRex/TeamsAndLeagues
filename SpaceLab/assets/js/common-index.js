var commonIndexModule = (function(cim) {
    cim.loadGameDetailsPage = function(htmlName, gameId) {
        globalModule.loadPage("main-content", htmlName, cim.loadGameDetails, { gameId: gameId });
    }
    cim.loadGameDetails = function(params) {
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
            cim.bindGameDetails();
            $("#matchList").click();
            app.bread();
        });
    }
    cim.bindGameDetails = function() {
        var gameId = $("#gameInfo").attr("data-gameid");
        var gameRule = $("#gameInfo").attr("data-gamerule");
        var params = { gameId: gameId };
        var empty = {}
        var object = $.extend(empty, params, { round: 1 });
        $("#matchList").on("click", function() {
            globalModule.loadPage("match-content", "matchList", cim.fillinTimeTablePage, object);
        });
        $("#scoreList").on("click", function() {
            globalModule.loadPage("match-content", "scoreList", cim.loadScoreList, params);
        });
        $("#shooterList").on("click", function() {
            globalModule.loadPage("match-content", "shooterList", cim.loadShooterList, params);
        });
        $("#stopList").on("click", function() {
            globalModule.loadPage("match-content", "stopList", cim.loadStopList, params);
        });
    }

    cim.loadScoreList = function(params) {
        var gameRule = $("#gameInfo").attr("data-gamerule");
        if (gameRule.indexOf("联赛") != -1) {
            params.groupName = "B";
            var groupA = '<div class="row boardData boardTitle groupA" id="boradDataA"><div class="col-xs-1">A组</div><div class="col-xs-3">球队</div><div class="col-xs-1">轮次</div><div class="col-xs-1">胜</div><div class="col-xs-1">平</div><div class="col-xs-1">负</div><div class="col-xs-1">进球数</div><div class="col-xs-1">失球数</div><div class="col-xs-1">净胜球</div><div class="col-xs-1">积分</div></div>';
            var groupB = '<div class="row boardData boardTitle groupB" id="boradDataB"><div class="col-xs-1">B组</div><div class="col-xs-3">球队</div><div class="col-xs-1">轮次</div><div class="col-xs-1">胜</div><div class="col-xs-1">平</div><div class="col-xs-1">负</div><div class="col-xs-1">进球数</div><div class="col-xs-1">失球数</div><div class="col-xs-1">净胜球</div><div class="col-xs-1">积分</div></div>';
            $("#boradData").after(groupB);
            $("#boradData").after(groupA);
            var fillinParams = { tmplId: 'scoreDetails-template', target: $(".groupB"), way: "after" };
            globalModule.globalAjax(globalModule.globalHomeUrl + "api/MatchScore/getAllMatchScore", params, globalModule.fillinInfoFromTmpl, null, null, null, fillinParams);
            params.groupName = "A";
            fillinParams = { tmplId: 'scoreDetails-template', target: $(".groupA"), way: "after" };
            globalModule.globalAjax(globalModule.globalHomeUrl + "api/MatchScore/getAllMatchScore", params, globalModule.fillinInfoFromTmpl, null, null, null, fillinParams);
        } else {
            var group = '<div class="row boardData boardTitle" id="boradDataGroup"><div class="col-xs-1">排名</div><div class="col-xs-3">球队</div><div class="col-xs-1">轮次</div><div class="col-xs-1">胜</div><div class="col-xs-1">平</div><div class="col-xs-1">负</div><div class="col-xs-1">进球数</div><div class="col-xs-1">失球数</div><div class="col-xs-1">净胜球</div><div class="col-xs-1">积分</div></div>';
            $("#boradData").after(group);
            var fillinParams = { tmplId: 'scoreDetails-template', target: $("#boradDataGroup"), way: "after" };
            globalModule.globalAjax(globalModule.globalHomeUrl + "api/MatchScore/getAllMatchScore", params, globalModule.fillinInfoFromTmpl, null, null, null, fillinParams);

        }
    }

    cim.loadShooterList = function(params) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/MatchShooter/getAllMatchShooter", params, function(result) {
            var html = template('shooterDetails-template', result);
            $("#boradData").after(html);
        });
    }

    cim.loadStopList = function(params) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/MatchStop/getAllMatchStop", params, function(result) {
            var html = template('stopDetails-template', result);
            $("#boradData").after(html);
        });
    }
    cim.fillinTimeTablePage = function(params) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/findAllTimeTablesCommon", params, cim.fillinTimeTable, null, null, null, params);
    }
    cim.fillinTimeTable = function(result, params) {
        $("#roundsDiv").attr("data-gameid", params.gameId);
        $("#round" + params.round).find("ol").html(template("enrollGameList-template", result));
        if (params.round == 1) {
            globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/getGameRoundsCommon", params, cim.addLi, null, null, null, params);
        }
    }
    cim.addLi = function(result, params) {
        var round = result.DataTable;
        if (round > 1) {
            $("#roundUl").attr("data-li", round);
            for (var i = 2; i <= round; i++) {
                var li = "<li><a href='#round" + i + "' data-toggle='tab' data-index='" + i + "' onclick='commonIndexModule.dynamicLoadLiContent(" + params.gameId + ", " + i + ")'>第" + i + "轮</a></li>";
                $("#addTab").closest("li").before(li);
                var roundDiv = "<div class='tab-pane active' id='round" + i + "'><p><ol class='dd-list'></ol></p></div>";
                var lastOne = i - 1;
                $("#round" + lastOne).after(roundDiv);
            }
        }
    }
    cim.dynamicLoadLiContent = function(gameId, round) {
        var params = {
            gameId: gameId,
            round: round
        };
        cim.fillinTimeTablePage(params);
    }
    cim.viewGameResultPage = function(ttId, mainTeamId, subTeamId) {
        var params = { ttId: ttId, mainTeamId: mainTeamId, subTeamId: subTeamId };
        window.open("http://www.leyisports.com/gameResultPageShare.html?ttId=" + ttId);
    }
    cim.viewGameResultPageInit = function(params) {
        $("#gameResultPage-copy-right").hide();
        var fillinParams = { tmplId: 'gameResultPage-template', target: $("#gameResultPage"), way: "html" };
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/viewGameResultCommon", { ttId: params.ttId }, cim.fillinGameResultPage, null, null, null, fillinParams);
    }
    cim.fillinGameResultPage = function(result, params) {
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
    cim.viewGameComment = function(ttId) {
        globalModule.loadPage("main-content", "gameComment", function(params) {
            globalModule.globalAjax(globalModule.globalHomeUrl + "api/TimeTable/viewGameResult", { ttId: params.ttId }, function(result) {
                $("#gameCommentContent").html(result.DataTable.remark || "暂无评论");
            });
        }, { ttId: ttId });
    }
    cim.getTeamList = function(callback) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Team/getTeamListCommon", null, callback);
    }
    cim.fillinTeamList = function(result) {
        if (result.Code == 1) {
            var html = template('teamList-template', result);
            $("#boradData").after(html);
        }
    }
    cim.viewTeam = function(teamId) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Team/getTeamInfoCommon", { teamId: teamId }, cim.showTeamDetailsPage);
    }
    cim.showTeamDetailsPage = function(result) {
        globalModule.loadPage("main-content", "teamDetails", cim.showTeamDetails, result);
    }
    cim.showTeamDetails = function(result) {
        var html = template('teamDetails-template', result.DataTable);
        $("#teamDetails").html(html);
        $("#teamBrief").html(result.DataTable.teamBrief);
        var fillinParams = { tmplId: 'attendGameList-template', target: $("#attendGameList"), way: "html" };
        globalModule.globalAjax(globalModule.globalHomeUrl + 'api/EnrollGame/FindAllEnrollTeamsCommon', { teamId: result.DataTable.ID }, globalModule.fillinInfoFromTmpl, null, null, null, fillinParams);
        var teamId = $("#teamInfo").attr("data-teamid");
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Member/getMembersCommon", { teamId: teamId }, cim.showTeamMembersDetails);
    }
    cim.showTeamMembersDetails = function(result) {
        var html = template('teamMemberList-template', result);
        $("#teamMembersHead").after(html);
    }
    cim.viewMemberPage = function(memberId) {
        globalModule.loadPage("main-content", "viewMember", cim.viewMember, { memberId: memberId });
    }
    cim.viewMember = function(params) {
        globalModule.globalAjax(globalModule.globalHomeUrl + "api/Member/getMember", params, cim.fillViewMember);
    }
    cim.fillViewMember = function(result) {
        var html = template('viewMember-template', result.DataTable);
        $("#viewMember").html(html);
        $("#memberBrief").html(result.DataTable.memberBrief);
    }
    return cim;
}(commonIndexModule || {}));
