define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        //定义方法返回今日开始结束日期
        today: function () {
            const dd = new Date();
            const y = dd.getFullYear();// 获取今日年份
            const m = String(dd.getMonth() + 1).padStart(2, '0'); // 获取今日月份
            const d = String(dd.getDate()).padStart(2, '0'); // 获取今日日期

            const startOfDay = `${y}-${m}-${d} 00:00:00`;
            const endOfDay = `${y}-${m}-${d} 23:59:59`;

            return startOfDay + ' - ' + endOfDay;
        },
        dateRange: function (date,offset){
            // 复制原始日期避免污染
            const baseDate = new Date(date);
            // 计算偏移后的开始日期（如 offset=1 则从昨天开始）
            const startDate = new Date(baseDate);
            startDate.setDate(startDate.getDate() - offset);

            // 结束日期始终为原始日期的当天 23:59:59
            const endDate = new Date(baseDate);

            // 格式化日期为 YYYY-MM-DD HH:mm:ss
            const format = (dateObj) => {
                const y = dateObj.getFullYear();
                const m = String(dateObj.getMonth() + 1).padStart(2, '0');
                const d = String(dateObj.getDate()).padStart(2, '0');
                const hours = dateObj === startDate ? '00:00:00' : '23:59:59';
                return `${y}-${m}-${d} ${hours}`;
            };

            return `${format(startDate)} - ${format(endDate)}`;
        },
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'paypal/transaction_detail/index' + location.search,
                    add_url: 'paypal/transaction_detail/add',
                    edit_url: 'paypal/transaction_detail/edit',
                    del_url: 'paypal/transaction_detail/del',
                    multi_url: 'paypal/transaction_detail/multi',
                    import_url: 'paypal/transaction_detail/import',
                    table: 'pp_transaction_detail',
                }
            });

            var table = $("#table");
            $.fn.bootstrapTable.locales[Table.defaults.locale]['formatSearch'] = function(){return "付款人PayPal账户";}
            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                fixedColumns: true,
                fixedRightNumber: 1,
                trimOnSearch:true,
                searchFormVisible: true,
                search:false,
                showExport:false,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id'),operate: false},
                        {field: 'transaction_id', title: __('Transaction_id'), operate: '='},
                        {field: 'paypal_reference_id', title: __('Paypal_reference_id'), operate: '='},
                        {field: 'paypal_reference_id_type', title: __('Paypal_reference_id_type'), operate: false},
                        {field: 'item_name', title: __('Item_name'), operate: false, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'transaction_event_code', title: __('Transaction_event_code'), operate: false},
                        {field: 'account_email', title: __('Account_email'), operate: '='},
                        {field: 'account_number', title: __('Account_number'), operate: false},
                        {field: 'custom_merchant_id', title: __('Custom_merchant_id'), operate: '='},
                        {field: 'custom_field', title: __('Custom_field'), operate: '='},
                        {field: 'transaction_initiation_date', title: __('Transaction_initiation_date'), operate:'RANGE', addclass:'datetimerange', autocomplete:false,defaultValue: this.dateRange(new Date(),7)},
                        {field: 'transaction_updated_date', title: __('Transaction_updated_date'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'transaction_amount_value', title: __('Transaction_amount_value'), operate:false},
                        {field: 'transaction_amount_currency_code', title: __('Transaction_amount_currency_code'), operate: false},
                        {field: 'fee_amount_value', title: __('Fee_amount_value'), operate:false},
                        {field: 'fee_amount_currency_code', title: __('Fee_amount_currency_code'), operate: false},
                        {field: 'ending_balance_value', title: __('Ending_balance_value'), operate:false},
                        {field: 'ending_balance_currency_code', title: __('Ending_balance_currency_code'), operate: false},
                        {field: 'available_balance_value', title: __('Available_balance_value'), operate:false},
                        {field: 'available_balance_currency_code', title: __('Available_balance_currency_code'), operate: false},
                        {field: 'discount_amount_value', title: __('Discount_amount_value'), operate:false},
                        {field: 'discount_amount_current_code', title: __('Discount_amount_current_code'), operate: false},
                        {field: 'item_description', title: __('Item_description'), operate: false, class: 'autocontent', formatter: Table.api.formatter.content},
                        // {field: 'account_id', title: __('Account_id'), operate: '='},
                        // {field: 'email_address', title: __('Email_address'), operate: false, table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        // {field: 'phone_country_code', title: __('Phone_country_code'), operate: false},
                        // {field: 'phone_national_number', title: __('Phone_national_number'), operate: false},
                        // {field: 'address_status', title: __('Address_status'), operate: false},
                        // {field: 'payer_status', title: __('Payer_status'), operate: false},
                        // {field: 'payer_given_name', title: __('Payer_given_name'), operate: '='},
                        // {field: 'payer_surname', title: __('Payer_surname'), operate: '='},
                        // {field: 'payer_alternate_full_name', title: __('Payer_alternate_full_name'), operate: false, table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        // {field: 'payer_country_code', title: __('Payer_country_code'), operate: false},
                        // {field: 'shipping_name', title: __('Shipping_name'), operate: false, table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        // {field: 'shipping_address_line1', title: __('Shipping_address_line1'), operate: false, table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        // {field: 'shipping_address_line2', title: __('Shipping_address_line2'), operate: false, table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        // {field: 'shipping_address_city', title: __('Shipping_address_city'), operate: false},
                        // {field: 'shipping_address_state', title: __('Shipping_address_state'), operate: false},
                        // {field: 'shipping_address_country_code', title: __('Shipping_address_country_code'), operate: false},
                        // {field: 'shipping_address_postal_code', title: __('Shipping_address_postal_code'), operate: false},
                        {field: 'remark', title: __('Remark'), operate: false, table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'create_time', title: __('Create_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'update_time', title: __('Update_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 或者在表格初始化后绑定事件
            table.on('dbl-click-row.bs.table', function(e, row, $element) {
                // 阻止默认行为
                e.preventDefault();
                return false;
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

            $(document).on("click", ".btn-search-transaction", function () {
                Fast.api.open('paypal/transaction_detail/searchTransaction','拉取交易信息');
            });

            $(document).on("click", ".btn-export-selected", function () {
                const ids = Table.api.selectedids(table);
                if(!ids.length){
                    Layer.alert('请选择数据！');
                    return false;
                }
                $.post('paypal/transaction_detail/export',{export_type:'selected',ids:ids},function (res){
                    if(res.code===1){
                        Toastr.info(res.msg)
                    }else{
                        console.log(res);
                        Toastr.error(res.msg);
                    }
                });
            });

            // 指定搜索条件
            $(document).on("click", ".btn-export-all", function () {
                const options = table.bootstrapTable('getOptions');
                const queryParams = options.queryParams;
                const params = queryParams({});
                params.export_type = 'all';
                params.sort = options.sortName;
                params.order = options.sortOrder;
                $.post('paypal/transaction_detail/export',params,function (res){
                    if(res.code===1){
                        Toastr.info(res.msg)
                    }else{
                        console.log(res);
                        Toastr.error(res.msg);
                    }
                });
                return false;
            });
        },
        searchtransaction: function () {
            Controller.api.bindevent();
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
