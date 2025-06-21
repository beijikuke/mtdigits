define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {

        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'paypal/account_association/index' + location.search,
                    add_url: 'paypal/account_association/add',
                    edit_url: 'paypal/account_association/edit',
                    del_url: 'paypal/account_association/del',
                    multi_url: 'paypal/account_association/multi',
                    import_url: 'paypal/account_association/import',
                    table: 'pp_account_association',
                }
            });

            var table = $("#table");

            //在普通搜索渲染后
            table.on('post-common-search.bs.table', function (event, table) {
                var form = $("form", table.$commonsearch);
                $("input[name='parent_account_id']", form).addClass("selectpage").data("source", "paypal/main_account/selectpage").data("primaryKey", "id").data("field", "account_email").data("orderBy", "id desc");
                $("input[name='account_id']", form).addClass("selectpage").data("source", "paypal/account/selectpage").data("primaryKey", "id").data("field", "account_email").data("orderBy", "id desc");
                Form.events.cxselect(form);
                Form.events.selectpage(form);
            });

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                search:false,
                trimOnSearch:true,
                searchFormVisible: true,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id'),operate: false},
                        {field: 'parent_account_id', title: __('Parent_account_email'),operate: '=',visible:false},
                        {field: 'parent_account_email', title: __('Parent_account_email'),operate: false},
                        {field: 'account_id', title: __('Account_email'),operate: '=',visible:false},
                        {field: 'account_email', title: __('Account_email'),operate: false},
                        {field: 'remark', title: __('Remark'), operate: false, table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'create_time', title: __('Create_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'update_time', title: __('Update_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        recyclebin: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    'dragsort_url': ''
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: 'paypal/account_association/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {
                            field: 'deletetime',
                            title: __('Deletetime'),
                            operate: 'RANGE',
                            addclass: 'datetimerange',
                            formatter: Table.api.formatter.datetime
                        },
                        {
                            field: 'operate',
                            width: '140px',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            buttons: [
                                {
                                    name: 'Restore',
                                    text: __('Restore'),
                                    classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'paypal/account_association/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'paypal/account_association/destroy',
                                    refresh: true
                                }
                            ],
                            formatter: Table.api.formatter.operate
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
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
