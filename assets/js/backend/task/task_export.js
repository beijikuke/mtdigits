define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'task/task_export/index' + location.search,
                    del_url: 'task/task_export/del',
                    table: 'task_export',
                }
            });

            var table = $("#table");

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
                        {field: 'export_user', title: __('Export_user'),operate: false,visible:false},
                        {field: 'export_user_name', title: __('Export_user'),operate: false},
                        {field: 'user_role', title: __('User_role'),operate: '=', searchList: {"0":__('User_role 0'),"1":__('User_role 1')},
                            formatter:function (value, row, index) {
                                return value===0?__('User_role 0'):__('User_role 1');
                            }},
                        {field: 'task_type', title: __('Task_type'), operate: '='},
                        {field: 'download_url', title: __('Download_url'),operate: false, formatter: function (value, row, index) {
                                if(value){
                                    return '<a href="'+value +'">点击下载</a>'
                                }else{
                                    return '';
                                }

                            }},
                        {field: 'task_status', title: __('Task_status'),searchList:{"0":__('Task_status 0'),"1":__('Task_status 1'),"2":__('Task_status 2'),"3":__('Task_status 3')},
                            formatter:function (value, row, index){
                                var statusStr = '';
                                switch (value) {
                                    case 0:
                                        statusStr = __('Task_status 0');
                                        break;
                                    case 1:
                                        statusStr = '<span style="color: blue">'+__('Task_status 1')+'</span>';
                                        break;
                                    case 2:
                                        statusStr = '<span style="color: green">'+__('Task_status 2')+'</span>';
                                        break;
                                    case 3:
                                        statusStr = '<span style="color: red">'+__('Task_status 3')+'</span>';
                                        break;
                                }
                                return statusStr;
                            }
                        },
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
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
