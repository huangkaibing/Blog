var app = new Vue({
    el: '#ms_login',
    data: {
        username: "",
        password: ""
    }, methods: {
        login: function () {
            //登录
            if (!this.username || !this.password) {
                alert("请输入用户名或密码!");
            }

            axios.post('/api/user', {
                username: this.username,
                password: this.password
            }).then(function (response) {
                var bean = response.data;
                if (bean === "fail") {
                    alert("用户名或密码错误!");
                } else {
                    sessionStorage.setItem("usrid", bean._id);
                    window.location.href = "ms_index.html";
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
});