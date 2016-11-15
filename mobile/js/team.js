var teamModule = (function(tm) {

    tm.getTeamDetails = function(teamId) {
        window.location.href='TeamDetail.html?teamId'+teamId;
    }
    return tm;
}(teamModule || {}));