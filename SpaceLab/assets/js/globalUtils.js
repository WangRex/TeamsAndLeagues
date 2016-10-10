var globalModule = (function(gm) {
    gm.globalHomeUrl = "http://210.83.195.229:8095/";
    // gm.globalHomeUrl = "http://localhost:4349/";
    gm.devUrl = "http://localhost:8081/";
    gm.proUrl = "http://www.leyisports.com/";
    gm.globalAjax = function(url, data, successCallback, type, dataType, async, params) {
        var guid = { GUID: $.cookie("GUID") };
        if (data) {
            $.extend(data, guid);
        }
        $.ajax({
            type: type || "get",
            dataType: dataType || "json",
            url: url,
            data: data || guid,
            cache: false,
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
                case "prepend":
                    params.target.prepend(html);
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
        var result = array;
        if (gm.isArray(array) && array.length > 1) {
            result = "";
            for (var i = 0; i < array.length; i++) {
                result += "," + array[i];
            }
            result = result.substring(1);
        }
        return result;
    }
    gm.stringToArray = function(string) {
        var result = new Array();
        if (string) {
            if (string.indexOf(',') != -1) {
                result = string.split(',');
            } else {
                result = result.push(string);
            }
        }
        return result;
    }
    gm.CKupdate = function() {
        for (instance in CKEDITOR.instances)
            CKEDITOR.instances[instance].updateElement();
    }
    gm.loadPage = function(parentId, pageName, callback, params) {
        $("#" + parentId || "main-content").load(pageName + ".html", function(response, status, xhr) {
            if (callback) {
                callback(params);
            }

        });
    }
    return gm;
}(globalModule || {}));
