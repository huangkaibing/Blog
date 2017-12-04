/**
 *web详情
 */

//时间处理
Vue.filter('subTime', function (value) {
    return moment(value).format('YYYY-MM-DD');
});

var app = new Vue({
    el: '#details',
    data: {
        title: '',
        content: '',
        author: '',
        createtime: '',
        classify_name: '',
        lastArticleTitle: '',
        nextArticleTitle: '',
        last_id: '',
        next_id: ''
    }, methods: {
        goDetails: function (id) {
            window.location.href = "details.html?id=" + id;
        }
    }
});


var params = new UrlSearch(); //实例化

//文章列表查询
axios.get('/api/articles/' + params.id).then(function (response) {
    var data = response.data[0];
    app.title = data.title;
    app.content = data.previewedHTML;
    // app.content = data.markdown;
    app.author = data.author;
    app.createtime = data.createtime;
    app.classify_name = data.classify_name;

    // $("#content").html(data.markdown);

    //上一篇.下一篇
    axios.get('/api/articles/3/' + data.createtime).then(function (response) {
        // app.articles = response.data;
        // console.log(response);
        var bean = response.data;
        if (bean.lastArticle) {
            app.lastArticleTitle = bean.lastArticle.title;
            app.last_id = bean.lastArticle._id;
        }

        if (bean.nextArticle) {
            app.nextArticleTitle = bean.nextArticle.title;
            app.next_id = bean.nextArticle._id;
        }
    }).catch(function (error) {
        console.log(error);
    });

}).catch(function (error) {
    console.log(error);
});

//浏览量新增
axios.put('/api/articles/' + params.id).then(function (response) {
    console.log(response);
}).catch(function (error) {
    console.log(error);
});

function UrlSearch() {
    var name, value;
    var str = location.href; //取得整个地址栏
    var num = str.indexOf("?");
    str = str.substr(num + 1); //取得所有参数

    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = value;
        }
    }
}

