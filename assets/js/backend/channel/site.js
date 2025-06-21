define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'channel/site/index' + location.search,
                    add_url: 'channel/site/add',
                    edit_url: 'channel/site/edit',
                    del_url: 'channel/site/del',
                    multi_url: 'channel/site/multi',
                    import_url: 'channel/site/import',
                    table: 'channel_site',
                }
            });

            var table = $("#table");
            $.fn.bootstrapTable.locales[Table.defaults.locale]['formatSearch'] = function(){return "通道名称";}
            //在普通搜索渲染后
            table.on('post-common-search.bs.table', function (event, table) {
                var form = $("form", table.$commonsearch);
                $("input[name='group_id']", form).addClass("selectpage").data("source", "channel/group/selectpage").data("primaryKey", "id").data("field", "name").data("orderBy", "id desc");
                $("input[name='paypal_id']", form).addClass("selectpage").data("source", "paypal/account/selectpage").data("primaryKey", "id").data("field", "account_email").data("orderBy", "id desc");
                Form.events.cxselect(form);
                Form.events.selectpage(form);
            });

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                fixedColumns: true,
                fixedRightNumber: 1,
                trimOnSearch:true,
                searchFormVisible: true,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id'),operate: false},
                        {field: 'name', title: __('Name'), operate: 'LIKE'},
                        {field: 'group_id', title: __('Group_id'),operate: '=',visible:false},
                        {field: 'group_name', title: __('Group_id'),operate: false},
                        {field: 'paypal_id', title: __('Paypal_id'),operate: '=',visible:false},
                        {field: 'paypal_name', title: __('Paypal_id'),operate: false},
                        {field: 'url', title: __('Url'), operate: 'like', formatter: Table.api.formatter.url},
                        {field: 'first_order_time', title: __('First_order_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'last_order_time', title: __('Last_order_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'deal_amount', title: __('Deal_amount'), operate:'BETWEEN'},
                        {field: 'deal_count', title: __('Deal_count'),operate: false},
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

            $(document).on("click", ".btn-check-webhook", function () {
                var selectedData = Table.api.selecteddata(table);
                if(selectedData.length>1){
                    Layer.alert('请选择一条数据！');
                    return false;
                }
                $.getJSON('channel/site/checkWebhook?ids='+selectedData[0]['id'],function (ret) {
                    if(ret.code==1){
                        Layer.alert(ret.msg)
                    }else{
                        console.log(ret.msg);
                        Layer.alert(ret.msg)
                        return false;
                    }
                })
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
