var INTERFACE_URL = "http://210.83.195.229:8095/";

var root = {
    interFace: {
        //登陆接口
        login: INTERFACE_URL + 'login.do',
        //获取赛事list
        getGameList: INTERFACE_URL + 'api/GameList/getGameList',
    },
    timeout: 10000
}
