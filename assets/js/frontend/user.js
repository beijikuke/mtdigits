define(['jquery', 'bootstrap', 'frontend', 'addtabs', 'adminlte', 'form'], function ($, undefined, Frontend, undefined, AdminLTE, Form) {
    var Controller = {
        changepwd: function () {
            //为表单绑定事件
            Form.api.bindevent($("#changepwd-form"), function (data, ret) {
                if(ret.code===1){
                    Layer.alert('修改密码成功!');
                    parent.window.location.href= '/user/user/login';
                }else{
                    console.log(ret);
                    Layer.alert(ret.msg);
                }
            });
        },
    };

    return Controller;
});
