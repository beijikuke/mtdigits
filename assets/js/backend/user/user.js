define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'user/user/index',
                    add_url: 'user/user/add',
                    edit_url: 'user/user/edit',
                    del_url: 'user/user/del',
                    multi_url: 'user/user/multi',
                    table: 'user',
                }
            });

            var table = $("#table");
            $.fn.bootstrapTable.locales[Table.defaults.locale]['formatSearch'] = function(){return "用户名";}
            //在普通搜索渲染后
            table.on('post-common-search.bs.table', function (event, table) {
                var form = $("form", table.$commonsearch);
                $("input[name='group_id']", form).addClass("selectpage").data("source", "user/group/selectpage").data("primaryKey", "id").data("field", "name").data("orderBy", "id desc");
                Form.events.cxselect(form);
                Form.events.selectpage(form);
            });
            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'user.id',
                fixedColumns: true,
                fixedRightNumber: 1,
                trimOnSearch:true,
                searchFormVisible: true,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id'), sortable: true,operate: false},
                        {field: 'group_id', title: __('Group_name'), sortable: true,operate: '=',visible:false},
                        {field: 'group_name', title: __('Group_name'), operate: false},
                        {field: 'username', title: __('Username'), operate: 'LIKE'},
                        {field: 'email', title: __('Email'), operate: '='},
                        {field: 'mobile', title: __('Mobile'), operate: '='},
                        {field: 'app_id', title: __('App_id'), operate: '='},
                        {field: 'app_key', title: __('App_key'), operate: false,
                            formatter: function (value, row, index) {
                                return '<span>***************</span><i class="fa fa-eye btn-app-key"></i><span style="display: none;">'+value+'</span>';
                            }},
                        {field: 'enabled_flag', title: __('Enabled_flag'), searchList: {"1":__('Yes'),"0":__('No')}, table: table, formatter: Table.api.formatter.toggle},
                        {field: 'login_time', title: __('Login_time'), formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'create_time', title: __('Create_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'update_time', title: __('Update_time'), operate:false, addclass:'datetimerange', autocomplete:false},
                        {field: 'remark', title: __('Remark'), operate: false, table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

            $(document).on("click", ".btn-app-key", function () {
                var next = $(this).next();
                var nextElemVal = next.text();
                console.log(nextElemVal);
                var prev = $(this).prev();
                var prevElemVal = prev.text();
                console.log(prevElemVal);
                const str = '***************';
                if(prevElemVal==str){
                    prev.text(nextElemVal);
                    $(this).removeClass('fa-eye');
                    $(this).addClass('fa fa-eye-slash');
                }else{
                    prev.text(str);
                    $(this).removeClass('fa-eye-slash');
                    $(this).addClass('fa-eye');
                }

            });
        },
        add: function () {
            this.trim();
            Controller.api.bindevent();
        },
        edit: function () {
            this.trim();
            Controller.api.bindevent();
        },
        trim: function (){
            $(document).on('blur', 'input, textarea', function() {
                var value = $(this).val();
                if (typeof value === 'string') {
                    $(this).val(value.trim());
                }
            });
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});