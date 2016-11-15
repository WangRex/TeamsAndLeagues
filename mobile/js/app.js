var INTERFACE_URL = "http://210.83.195.229:8095";

var root = {
    interFace: {
        //登陆接口
        login: INTERFACE_URL + 'login.do',
        //获取赛事list
        getGameList: INTERFACE_URL + '/api/GameList/getGameList',
        //获取赛事信息
        getGameInfo: INTERFACE_URL + '/api/GameList/getGameInfoByGameId',
        //获取球队列表
        getTeamList: INTERFACE_URL + '/api/Team/getTeamList',
        //获取球队列表之普通用户
        getTeamListCommon: INTERFACE_URL + '/api/Team/getTeamListCommon',
        //获取球队信息之普通用户
        getTeamInfoCommon: INTERFACE_URL + '/api/Team/getTeamInfoCommon',
        //获取球队球员列表之普通用户
        getMembersCommon: INTERFACE_URL + '/api/Member/getMembersCommon',
        

        
    },
    timeout: 10000
}
