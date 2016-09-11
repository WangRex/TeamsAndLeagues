var globalModule = (function(gm) {
    gm.globalHomeUrl = "http://210.83.195.229:8095/";
    // gm.globalHomeUrl = "http://localhost:4349/";
    gm.globalAjax = function(url, data, successCallback, type, dataType, async, params) {
        $.ajax({
            type: type || "get",
            dataType: dataType || "json",
            url: url,
            data: data || {},
            async: async || "false",
            success: function(result) {
            	if(successCallback) {
            		successCallback(result, params || {});
            	}
            }
        });
    }
    gm.getSessionUser =  function(userName) {
    	gm.globalAjax(gm.globalHomeUrl + "api/User/getSessionUser", {userName: userName});
    }
    gm.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    return gm;
}(globalModule || {}));
