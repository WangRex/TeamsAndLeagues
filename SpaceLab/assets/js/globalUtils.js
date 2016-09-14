var globalModule = (function(gm) {
    gm.globalHomeUrl = "http://210.83.195.229:8095/";
    gm.globalHomeUrl = "http://localhost:4349/";
    gm.globalAjax = function(url, data, successCallback, type, dataType, async, params) {
        $.ajax({
            type: type || "get",
            dataType: dataType || "json",
            url: url,
            data: data || {},
            async: async || "false",
            success: function(result) {
                if (result.Code == 2) {
                    window.location.href = window.location.href;
                }
                if (successCallback) {
                    successCallback(result, params || {});
                }
            }
        });
    }
    gm.getSessionUser = function(userName) {
        gm.globalAjax(gm.globalHomeUrl + "api/User/getSessionUser", { userName: userName });
    }
    gm.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    gm.getNowFormatDate = function() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        return currentdate;
    }
    gm.fillinInfoFromTmpl = function(result, params) {
        if (result.DataTable) {
            var html = template(params.tmplId, result);
            switch (params.way) {
                case "after":
                    params.target.after(html);
                    break;
                case "append":
                    params.target.append(html);
                    break;
                case "appendTo":
                    params.target.appendTo(html);
                    break;
                case "html":
                    params.target.html(html);
                    break;
                default:
                    break;
            }
        }
        if (params.callback) {
            if (params.callbackParams) {
                params.callback(params.callbackParams);
            } else {
                params.callback();
            }
        }
    }
    gm.arrayToString = function(array) {
        var result = "";
        if (array.length > 1) {
            for (var i = 0; i < array.length; i++) {
                result += "," + array[i];
            }
            result = result.substring(1);
        }
        return result;
    }
    return gm;
}(globalModule || {}));
