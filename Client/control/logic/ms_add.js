var params = new UrlSearch(); //实例化
var Editor = null;
var app = new Vue({
    el: '#ms_add',
    data: {
        title: '',
        tags: '',
        classifys: null,
        selected: '',
        selectedid: '',
        content: ''
    }, methods: {
        selectClassify: function (classify_name, classify_id) {
            this.selected = classify_name;
            this.selectedid = classify_id
        },
        articleSave: function (type) {
            var markdown = Editor.getMarkdown();
            if (!this.title || !this.tags || !this.selected || !markdown) {
                alert("请完善信息");
                return false;
            }
            //文章新增
            axios.post('/api/articles', {
                id: params.id,
                title: this.title,
                classify_name: this.selected,
                classify_id: this.selectedid,
                tags: this.tags,
                ispublished: type,
                markdown: markdown,
                previewedHTML: Editor.getPreviewedHTML()
            }).then(function (response) {
                if (type === 1) {
                    window.location.href = "ms_index.html";
                } else {
                    window.location.href = "details.html?id=" + response.data;
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
});

//分类查询
axios.get('/api/classifys').then(function (response) {
    app.classifys = response.data;
    console.log(response);
}).catch(function (error) {
    console.log(error);
});


if (params.id) {
    //文章详情查询
    axios.get('/api/articles/' + params.id).then(function (response) {
        var data = response.data[0];
        app.title = data.title;
        app.content = data.markdown;
        app.selected = data.classify_name;
        Editor = editormd("editormd", {
            width: "100%",
            height: 640,
            // syncScrolling: "single",
            taskList: true,
            path: "../lib/editor.md/lib/"
        });
    }).catch(function (error) {
        console.log(error);
    });

    //文章标签查询
    axios.get('/api/tags/' + params.id).then(function (response) {
        var data = response.data;
        app.tags = data;
        console.log(data);
    }).catch(function (error) {
        console.log(error);
    });

} else {
    Editor = editormd("editormd", {
        width: "100%",
        height: 640,
        taskList: true,
        syncScrolling: "single",
        path: "../lib/editor.md/lib/"
    });
}


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
