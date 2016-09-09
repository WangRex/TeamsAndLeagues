var globalModule = (function(gm) {
    gm.globalAjax = function(url, data, successCallback, type, dataType, async) {
        $.ajax({
            type: type || "get",
            dataType: dataType || "json",
            url: url,
            data: data || {},
            async: async || "false",
            success: function(result) {
            	if(successCallback) {
            		successCallback(result);
            	}
            }
        });
    }
    gm.getSessionUser =  function(userName) {
    	gm.globalAjax("http://210.83.195.229:8095/api/User/getSessionUser", {userName: userName});
    }
    return gm;
}(globalModule || {}));
