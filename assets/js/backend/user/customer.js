define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'user/customer/index' + location.search,
                    add_url: 'user/customer/add',
                    edit_url: 'user/customer/edit',
                    del_url: 'user/customer/del',
                    multi_url: 'user/customer/multi',
                    import_url: 'user/customer/import',
                    table: 'customer',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                fixedColumns: true,
                fixedRightNumber: 1,
                search:false,
                trimOnSearch:true,
                searchFormVisible: true,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id'),operate: false},
                        {field: 'email', title: __('Email'), operate: '='},
                        {field: 'phone', title: __('Phone'), operate: '='},
                        {field: 'firstname', title: __('Firstname'), operate: '='},
                        {field: 'lastname', title: __('Lastname'), operate: '='},
                        {field: 'country_code', title: __('Country_code'), operate: '='},
                        {field: 'city', title: __('City'),operate: false},
                        {field: 'state', title: __('State'),operate: false},
                        {field: 'postcode', title: __('Postcode'), operate: '='},
                        {field: 'street_address1', title: __('Street_address1'), operate: '='},
                        {field: 'street_address2', title: __('Street_address2'), operate: '='},
                        {field: 'ip', title: __('Ip'),operate: false},
                        {field: 'ip_geo_location', title: __('Ip_geo_location'),operate: false},
                        {field: 'source', title: __('Source'),operate: '='},
                        {field: 'language', title: __('Language'),operate: false},
                        {field: 'credit_score', title: __('Credit_score'), sortable: true, operate: 'BETWEEN'},
                        {field: 'order_count', title: __('Order_count'), operate: false},
                        {field: 'case_count', title: __('Case_count'), operate: false},
                        {field: 'refund_count', title: __('Refund_count'), operate: false},
                        {field: 'total_refund_amount', title: __('Total_refund_amount'), operate: false},
                        {field: 'total_order_amount', title: __('Total_order_amount'), operate: false},
                        {field: 'order_terminal', title: __('Order_terminal'), operate: false},
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
