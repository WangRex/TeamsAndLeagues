var indexModule = (function(im) {
	im.loadPage = function(pageName, callback) {
		$("#main-content").load(pageName+".html", function() {
			if(callback) {
				callback();
			}
		});
	}
    im.extendFunc = function() {
        console.log("This is the extend function!");
    }
    return im;
}(indexModule || {}));