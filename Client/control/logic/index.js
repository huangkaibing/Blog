/**
 *web首页
 * 2017-11-14 15:43:06
 */

//时间处理
Vue.filter('subListTime', function (value) {
    return moment(value).format('YYYY-MM-DD HH:MM:ss');
});

Vue.filter('subLiveTime', function (value) {
    return moment(value).year() + "年" + (moment(value).month() + 1) + "月";
});

var app = new Vue({
    el: '#index',
    data: {
        articles: [],
        tags: [],
        lives: []
    }, methods: {
        goDetails: function (id) {
            window.location.href = "details.html?id=" + id;
        },
        sArticlesByType: function (type, arg) {
            axios.get('/api/articles/' + type + '/' + arg).then(function (response) {
                app.articles = response.data;
                console.log(response);
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
})

//文章列表查询
axios.get('/api/articles').then(function (response) {
    app.articles = response.data;
    console.log(response);
}).catch(function (error) {
    console.log(error);
});

//标签查询
axios.get('/api/tags').then(function (response) {
    app.tags = response.data;
    console.log(response);
}).catch(function (error) {
    console.log(error);
});

//历程查询
axios.get('/api/articles/lives').then(function (response) {
    app.lives = response.data;
    console.log(response);
}).catch(function (error) {
    console.log(error);
});

