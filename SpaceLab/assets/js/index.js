var indexModule = (function(im) {
    im.loadPage = function(pageName, callback) {
        $("#main-content").load(pageName + ".html", function() {
            if (callback) {
                callback();
            }
        });
    }
    im.addGame = function() {
        var data = $("#addGameForm").serializeJson();
        // console.log(data);
        //{gameTime: "", gameRule: "1", gamePrize: "", gamePlace: "", gameName: "", gameBrief: ""}
        $.ajax({
            type: 'get',
            dataType: "json",
            url: 'assets/json/addGame.json',
            data: data,
            async: false,
            success: function(result) {
                // console.log(result);
                $("#addGameContent").html(result.message);
                $("#basicModal").modal('show');
            }
        });
    }
    im.extendFunc = function() {
        console.log("This is the extend function!");
    }
    return im;
}(indexModule || {}));
