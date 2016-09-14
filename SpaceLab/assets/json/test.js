var data = { name: "admin", password: "admin" };
$.ajax({
    type: 'get',
    dataType: "json",
    // url: 'http://210.83.195.229:8095/api/User/login',
    url: 'http://localhost:4349/api/User/login',
    data: data,
    async: false,
    success: function(result) {

    }
});

var data = { gameId: 1, round: 1 };
$.ajax({
    type: 'get',
    dataType: "json",
    // url: 'http://210.83.195.229:8095/api/User/login',
    url: 'http://localhost:4349/api/TimeTable/findAllTimeTables',
    data: data,
    async: false,
    success: function(result) {

    }
});
