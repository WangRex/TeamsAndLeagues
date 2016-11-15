var globalModule = (function(gm) {

    /*
     *   ajax
     */
    gm.globalAjax = function(url, data, successCallback, type, async, params) {
        
        console.log('接口:' + url);
        console.log('类型:' + type || "get");
        console.log('输入:' + JSON.stringify(data));

        var guid = { GUID: $.cookie("GUID") };
        if (data) {
            $.extend(data, guid);
        }
        //如果token为空，则跳转到登录页面。
        /*if (token) {
            window.location.replace("login.html");
        }
        if (data) {
            $.extend(data, token);
        }*/
        $.ajax({
            type: type || "get",
            url: url,
            data: data || guid,
            cache: false,
            async: async || "false",
            dataType: "json",
            timeout: root.timeout,
            beforeSend: function(request) {
                // gm.loading('open');
            },
            success: function(result) {
                if (result.errorCode == 100) {
                    window.location.replace("login.html");
                }
                if (successCallback) {
                    successCallback(result, params || {});
                }
            },
            complete: function() {
                // gm.loading('close');
            },
            error: function(xhr, type, errorThrown) {
                console.log(xhr);
                // gm.alert('通讯错误，请重试。');
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
    gm.getParameter = function(param) {
            //获取URL地址中？后的所有字符 
            var query = window.location.search;
            //获取你的参数名称长度   
            var iLen = param.length;
            //获取你该参数名称的其实索引  
            var iStart = query.indexOf(param);
            //-1为没有该参数  
            if (iStart == -1)
                return "";
            iStart += iLen + 1;
            //获取第二个参数的其实索引
            var iEnd = query.indexOf("&", iStart);
            //只有一个参数 
            if (iEnd == -1)
            //获取单个参数的参数值 
                return query.substring(iStart);
            //获取第二个参数的值  
            return query.substring(iStart, iEnd);
        }
        /*gm.alert = function(content) {
            //用jquery获取模板
            var tpl = $("#alert-tpl").html();
            //预编译模板
            var template = Handlebars.compile(tpl);
            //模拟json数据
            var context = { title: "友情提醒", content: content };
            //匹配json内容
            var html = template(context);
            //输入模板
            $("#my-alert").html(html).modal('open');
        }
        gm.loading = function(action) {
            //输入模板
            $("#my-modal-loading").modal(action);
        }*/
    return gm;
}(globalModule || {}));
