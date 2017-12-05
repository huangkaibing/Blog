//时间处理
Vue.filter('subListTime', function (value) {
    return moment(value).format('YYYY-MM-DD HH:MM');
});

var app = new Vue({
    el: '#ms_classify_add',
    data: {
        name: '',
        list: ''
    }, methods: {
        addClissify: function () {
            if (!this.name) {
                alert("请输入分类名称!");
                return false;
            }
            //分类新增
            axios.post('/api/classifys', {
                name: this.name
            }).then(function (response) {
                sclassifys();
                alert("新增成功!");
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
});

function sclassifys() {
    //分类查询
    axios.get('/api/classifys').then(function (response) {
        app.list = response.data;
    }).catch(function (error) {
        console.log(error);
    });
}

sclassifys();
