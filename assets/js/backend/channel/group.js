define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'channel/group/index' + location.search,
                    add_url: 'channel/group/add',
                    edit_url: 'channel/group/edit',
                    del_url: 'channel/group/del',
                    multi_url: 'channel/group/multi',
                    import_url: 'channel/group/import',
                    table: 'channel_group',
                }
            });

            var table = $("#table");
            $.fn.bootstrapTable.locales[Table.defaults.locale]['formatSearch'] = function(){return "分组名称";}

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
                        {field: 'name', title: __('Name'), operate: 'LIKE'},
                        {field: 'strategy', title: __('Strategy'), searchList: {"0":__('Strategy 0'),"1":__('Strategy 1')},
                            formatter: function (value, row, index) {
                                const colorMap = {
                                    '1': '#1c221f',
                                    '0': 'green'
                                };
                                const color = colorMap[value] || '#999';  // 默认灰色
                                const content = (value === 0 ? '智能推荐' : '智能轮询');
                                return `<span class="label" style="background-color:${color};">${content}</span>`;
                            }},
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
