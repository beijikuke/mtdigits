define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'risk/blacklist/index' + location.search,
                    add_url: 'risk/blacklist/add',
                    edit_url: 'risk/blacklist/edit',
                    del_url: 'risk/blacklist/del',
                    multi_url: 'risk/blacklist/multi',
                    import_url: 'risk/blacklist/import',
                    table: 'risk_black_list',
                }
            });

            var table = $("#table");
            $.fn.bootstrapTable.locales[Table.defaults.locale]['formatSearch'] = function(){return "风控内容";}
            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                trimOnSearch:true,
                searchFormVisible: true,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id'),operate: false},
                        {field: 'strategy', title: __('Strategy'), searchList: {"0":__('Strategy 0'),"1":__('Strategy 1')},
                            formatter: function (value, row, index) {
                                const content = (value === 0 ? __('Strategy 0') : __('Strategy 1'));
                                return `<span style="color: #333333;font-size:14px;font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;">${content}</span>`;
                            }},
                        {field: 'type', title: __('Type'),searchList: {'0':'电话','1':'邮箱','2':'IP','3':'地址','4':'地区'},
                            formatter: function (value, row, index) {
                                var str  = '';
                                switch (value) {
                                    case 0:
                                        str = '电话';
                                        break;
                                    case 1:
                                        str = '邮箱';
                                        break;
                                    case 2:
                                        str = 'IP';
                                        break;
                                    case 3:
                                        str = '地址';
                                        break;
                                    case 4:
                                        str = '地区';
                                        break;
                                }
                                return `<span style="color: #333333;font-size:14px;font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;">${str}</span>`;
                            }},
                        {field: 'handle', title: __('Handle'), searchList: {"0":__('Handle 0'),"1":__('Handle 1')},
                            formatter: function (value, row, index) {
                                const content = (value === 0 ? __('Handle 0') : __('Handle 1'));
                                return `<span style="color: #333333;font-size:14px;font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;">${content}</span>`;
                            }},
                        {field: 'content', title: __('Content'), operate: '=', table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'remark', title: __('Remark'), operate: false, table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'create_time', title: __('Create_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'update_time', title: __('Update_time'), operate:false, addclass:'datetimerange', autocomplete:false},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },

        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
