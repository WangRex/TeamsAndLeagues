var aboutModule = (function(am) {

    am.init = function() {
        globalModule.globalAjax(root.interFace.getGameList, null, function(result) {
            console.log(result);
            if (result.Code == 1) {
                var html = template('gameList-template', result);
                $("#gameList").append(html);
            }
        });
    }
    return am;
}(aboutModule || {}));

$(function() {
    aboutModule.init();
});