define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'order/risk_order/index' + location.search,
                    del_url: 'order/risk_order/del',
                    table: 'risk_order',
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
                        {field: 'merchant_site_url', title: __('Website'), operate: '='},
                        {field: 'merchant_order_id', title: __('Merchant_order_id'), operate: '='},
                        {field: 'risk_type', title: __('Risk_type'), operate: '=',searchList:{'0':'系统风控','1':'黑名单'},formatter: function (value, row, index){
                                return '<span>'+(value===0?'系统风控':'黑名单')+'</span>'
                            }},
                        {field: 'risk_reason', title: __('Risk_reason'), class: 'autocontent', operate: false, formatter: Table.api.formatter.content},
                        {field: 'customer_email', title: __('Customer_email'), operate: '='},
                        {field: 'customer_phone', title: __('Customer_phone'), operate: '='},
                        {field: 'firstname', title: __('Firstname'), operate: '='},
                        {field: 'lastname', title: __('Lastname'), operate: '='},
                        {field: 'country_code', title: __('Country_code'), operate: false},
                        {field: 'city', title: __('City'), operate: false},
                        {field: 'state', title: __('State'), operate: false},
                        {field: 'postcode', title: __('Postcode'), operate: false},
                        {field: 'street_address1', title: __('Street_address1'), operate: '='},
                        {field: 'street_address2', title: __('Street_address2'), operate: '='},
                        {field: 'customer_ip', title: __('Customer_ip'), operate: '='},
                        {field: 'customer_ip_geo_location', title: __('Customer_ip_geo_location'), operate: false},
                        {field: 'order_amount', title: __('Order_amount'), operate:false},
                        {field: 'currency', title: __('Currency'), operate: false},
                        {field: 'order_amount_usd', title: __('Order_amount_usd'), operate:false},
                        {field: 'exchange_rate', title: __('Exchange_rate'), operate: false},
                        {field: 'payment_option', title: __('Payment_option'), operate: false},
                        {field: 'order_terminal', title: __('Order_terminal'), operate: false},
                        {field: 'order_info', title: __('Order_info'), operate: false, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'create_time', title: __('Create_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
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
