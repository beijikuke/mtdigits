define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'paypal/account/index' + location.search,
                    add_url: 'paypal/account/add',
                    edit_url: 'paypal/account/edit',
                    del_url: 'paypal/account/del',
                    multi_url: 'paypal/account/multi',
                    import_url: 'paypal/account/import',
                    get_payment_method_url: 'paypal/account/getPaymentMethodList',
                    table: 'pp_account',
                }
            });

            var table = $("#table");
            $.fn.bootstrapTable.locales[Table.defaults.locale]['formatSearch'] = function(){return "PayPal邮箱";}
            //在普通搜索渲染后
            table.on('post-common-search.bs.table', function (event, table) {
                var form = $("form", table.$commonsearch);
                $("input[name='payment_method']", form).addClass("selectpage").data("source", "paypal/account/getPaymentMethodList").data("primaryKey", "id").data("field", "name");
                Form.events.cxselect(form);
                Form.events.selectpage(form);
            });
            const paymentMethod = JSON.parse(paymentMethodJson);
            const paymentMethodMap = new Map();
            paymentMethod.forEach(function (item,index){
                paymentMethodMap.set(item['id'],item['name']);
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
                        {field: 'account_email', title: __('Account_email'), operate: 'LIKE'},
                        {field: 'merchant_id', title: __('Merchant_id'), operate: '='},
                        {field: 'custom_merchant_id', title: __('Custom_merchant_id'), operate: '='},
                        {field: 'payment_method', title: __('Payment_method'),operate: 'LIKE',
                            formatter: function (value,row,index){

                                const colorMap = {
                                    'PayPal': '#f8d8b8',
                                    'Card': '#02bedb',
                                    'PayLater': '#007aef',
                                    'Invoicing': '#fddcc9',
                                    'GooglePay': '#df8797',
                                    'ApplePay': '#afcde9',
                                };
                                var content = "";
                                if(value){
                                    value.split(",").forEach((val,index)=>{
                                        content = content +'<span class="label" style="color:black;background-color:'+(colorMap[val] || '#999')+';">'+(paymentMethodMap.get(val) || '')+'</span> ';
                                    });
                                }
                                return content;

                            }},
                        {field: 'account_type', title: __('Account_type'),searchList: {"0":"sandbox","1":"live"},
                            formatter: function (value, row, index) {
                                const colorMap = {
                                    '1': '#18bc9c',  // 绿色
                                    '0': '#4397fd'   // 红色
                                };
                                const color = colorMap[value] || '#999';  // 默认灰色
                                const content = (value === 0 ? 'sandbox' : 'live');
                                return `<span class="label" style="color:black;background-color:${color};">${content}</span>`;
                        }},
                        {field: 'farming_mode', title: __('Farming_mode'), searchList: {"1":__('Yes'),"0":__('No')}, table: table, formatter: Table.api.formatter.toggle},
                        {field: 'enabled_flag', title: __('Enabled_flag'), searchList: {"1":__('Yes'),"0":__('No')}, table: table, formatter: Table.api.formatter.toggle},
                        {field: 'pull_transactions_flag', title: __('Pull_transactions_flag'), searchList: {"1":__('Yes'),"0":__('No')}, table: table, formatter: Table.api.formatter.toggle},
                        {field: 'weigh', title: __('Weigh'), operate:false},
                        {field: 'bn_code', title: __('Bn_code'), operate: '='},
                        {field: 'min_per_txn_amount', title: __('Min_per_txn_amount'), operate:false},
                        {field: 'max_per_txn_amount', title: __('Max_per_txn_amount'), operate:false},
                        {field: 'daily_amount_limit', title: __('Daily_amount_limit'), operate:false},
                        {field: 'monthly_amount_limit', title: __('Monthly_amount_limit'), operate:false},
                        {field: 'daily_count_limit', title: __('Daily_count_limit'), operate:false},
                        {field: 'monthly_count_limit', title: __('Monthly_count_limit'), operate:false},
                        {field: 'daily_received_amount', title: __('Daily_received_amount'), operate:false},
                        {field: 'monthly_received_amount', title: __('Monthly_received_amount'), operate:false},
                        {field: 'daily_received_count', title: __('Daily_received_count'), operate:false},
                        {field: 'monthly_received_count', title: __('Monthly_received_count'), operate:false},
                        {field: 'request_proxy', title: __('Request_proxy'), operate: false},
                        {field: 'custom_merchant_name', title: __('Custom_merchant_name'), operate: false},
                        {field: 'custom_product_desc', title: __('Custom_product_desc'), operate: false},
                        {field: 'remark', title: __('Remark'), operate: false, table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'create_time', title: __('Create_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'update_time', title: __('Update_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate,
                            buttons: [
                                {
                                    name: 'webhook-info',
                                    title: __('webhook信息'),
                                    classname: 'btn btn-xs btn-info btn-dialog',
                                    icon: 'fa fa-list-alt',
                                    url: 'paypal/account/listWebhook?ids={id}',
                                }
                            ],
                            formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
            // webhook
            $(document).on("click", ".btn-list-webhook", function () {
                var selectedData = Table.api.selecteddata(table);
                if(selectedData.length>1){
                    Layer.alert('请选择一条数据！');
                    return false;
                }
                var id = selectedData[0]['id'];
                Fast.api.open('paypal/account/listWebhook?ids='+id,'webhook信息');
            });
        },
        listwebhook: function () {
            var table = $('#table');
            var id = $('#ids').val();
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'paypal/account/listWebhook?ids='+id,
                    add_url: 'paypal/account/addWebhook',
                    edit_url: 'paypal/account/editWebhook',
                    del_url: 'paypal/account/delWebhook',
                }
            });

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                commonSearch:false,
                showExport: false,
                search:false,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: 'ID',visible:false},
                        {field: 'webhook_id', title: 'Webhook Id', operate: false},
                        {field: 'url', title: 'URL', formatter: Table.api.formatter.url, operate: false},
                        {field: 'event_types', title: '事件', table: table, class: 'autocontent', formatter: Table.api.formatter.content, operate: false},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate,
                            buttons: [
                                {
                                    name: 'webhook-info',
                                    title: __('编辑webhook'),
                                    classname: 'btn btn-xs btn-info btn-dialog',
                                    icon: 'fa fa-pencil',
                                    url: $.fn.bootstrapTable.defaults.extend.edit_url+'?webhookId={webhook_id}',
                                    callback: function (data) {
                                        Layer.alert("接收到回传数据：" + JSON.stringify(data), {title: "回传数据"});
                                    }
                                },
                                {
                                    name: 'ajax',
                                    title: __('删除webhook'),
                                    classname: 'btn btn-xs btn-danger btn-magic btn-ajax',
                                    icon: 'fa fa-trash',
                                    confirm: '确定要删除该webhook吗？',
                                    url: $.fn.bootstrapTable.defaults.extend.del_url+'?webhookId={webhook_id}',
                                    success: function (data, ret) {
                                        if(ret.code==1){
                                            table.bootstrapTable('refresh');
                                        }else{
                                            console.log(ret.msg);
                                            Layer.alert(ret.msg)
                                            return false;
                                        }
                                    },
                                    error: function (data, ret) {
                                        console.log(ret);
                                        Layer.alert(ret.msg);
                                        return false;
                                    }
                                }
                            ],
                            formatter: Table.api.formatter.operate
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

            $(document).on("click", ".btn-add-webhook", function () {
                var id = $('#ids').val();
                Fast.api.open('paypal/account/addWebhook?ids='+id,'添加Webhook');
            });
            $(document).on("click", ".btn-edit-webhook", function () {
                var selectedData = Table.api.selecteddata(table);
                if(selectedData.length>1){
                    Layer.alert('请选择一条数据！');
                    return false;
                }
                var id = $('#ids').val();
                var webhook_id = selectedData[0]['webhook_id'];
                Fast.api.open('paypal/account/editWebhook?ids='+id+'&webhookId='+webhook_id,'修改Webhook');
            });
            $(document).on("click", ".btn-del-webhook", function () {
                var selectedData = Table.api.selecteddata(table);
                if(selectedData.length>1){
                    Layer.alert('请选择一条数据！');
                    return false;
                }
                Layer.confirm('您确认要删除该数据吗？',function (index){
                    var id = $('#ids').val();
                    var webhook_id = selectedData[0]['webhook_id'];
                    Fast.api.ajax({
                        url: 'paypal/account/delWebhook',
                        data: {
                            ids: id,
                            webhookId: webhook_id
                        }
                    },function (data, ret) {
                        if(ret.code==1){
                            table.bootstrapTable('refresh');
                        }else{
                            console.log(ret.msg);
                            Layer.alert(ret.msg)
                            return false;
                        }
                    },function (data,ret){
                        console.log(ret);
                        Layer.alert(ret.msg);
                        return false;
                    });
                    Layer.close(index);
                });
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
        addwebhook: function () {
            Controller.api.bindevent();
        },
        editwebhook: function () {
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
