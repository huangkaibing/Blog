/**
 * system首页
 * 2017-11-14 15:43:06
 */

var usrid = sessionStorage.getItem("usrid");
if (!usrid) {
    window.location.href = "ms_login.html";
}
axios.get('/api/user/' + usrid).then(function (response) {
    var bean = response.data;
    if (bean === "fail") {
        window.location.href = "ms_login.html";
    }
}).catch(function (error) {
    console.log(error);
});

//时间处理
Vue.filter('subListTime', function (value) {
    return moment(value).format('YYYY-MM-DD HH:MM');
});

var app = new Vue({
    el: '#ms_index',
    data: {
        list: []
    }, methods: {
        articleDelete: function (articleId) {
            //文章列表查询
            axios.delete('/api/articles/' + articleId).then(function (response) {
                console.log(response);
                alert("删除成功!");
                init();
            }).catch(function (error) {
                console.log(error);
            });
        },
        goModify: function (id) {
            window.location.href = "ms_add.html?id=" + id;
        },
        goDetails: function (id) {
            window.location.href = "details.html?id=" + id;
        },
        goAdd: function () {
            window.location.href = "ms_add.html";
        },
        goClassifyAdd: function () {
            window.location.href = "ms_classify_add.html";
        }
    }
});

function init() {
//文章列表查询
    axios.get('/api/articles').then(function (response) {
        app.list = response.data;
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });
}

init();