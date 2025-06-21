define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'merchant/site/index' + location.search,
                    add_url: 'merchant/site/add',
                    edit_url: 'merchant/site/edit',
                    del_url: 'merchant/site/del',
                    multi_url: 'merchant/site/multi',
                    import_url: 'merchant/site/import',
                    table: 'merchant_site',
                }
            });

            var table = $("#table");
            $.fn.bootstrapTable.locales[Table.defaults.locale]['formatSearch'] = function(){return "商户站地址";}
            //在普通搜索渲染后
            table.on('post-common-search.bs.table', function (event, table) {
                var form = $("form", table.$commonsearch);
                $("input[name='group_id']", form).addClass("selectpage").data("source", "merchant/group/selectpage").data("primaryKey", "id").data("field", "name").data("orderBy", "id desc");
                Form.events.cxselect(form);
                Form.events.selectpage(form);
            });

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
                        {field: 'group_id', title: __('Group_id'),operate: '=',visible:false},
                        {field: 'group_name', title: __('Group_id'),operate: false},
                        {field: 'url', title: __('Url'), operate: 'LIKE', formatter: Table.api.formatter.url},
                        {field: 'enabled_flag', title: __('Enabled_flag'), searchList: {"1":__('Yes'),"0":__('No')}, table: table, formatter: Table.api.formatter.toggle},
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
