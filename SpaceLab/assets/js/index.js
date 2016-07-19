var indexModule = (function(im) {
    im.loadPage = function(pageName, callback) {
        $("#main-content").load(pageName + ".html", function() {
            app.bread();
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
                $('.modal').on('show.bs.modal', im.fixModal);
                $(window).on('resize', im.fixModal);
                $("#addGameContent").html(result.message);
                $("#basicModal").modal('show');
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
    im.extendFunc = function() {
        console.log("This is the extend function!");
    }
    return im;
}(indexModule || {}));
