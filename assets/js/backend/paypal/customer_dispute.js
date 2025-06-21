define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
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
                    index_url: 'paypal/customer_dispute/index' + location.search,
                    add_url: 'paypal/customer_dispute/add',
                    edit_url: 'paypal/customer_dispute/edit',
                    del_url: 'paypal/customer_dispute/del',
                    multi_url: 'paypal/customer_dispute/multi',
                    import_url: 'paypal/customer_dispute/import',
                    table: 'customer_dispute',
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
                trimOnSearch:true,
                searchFormVisible: true,
                search:false,
                showExport:false,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id'),operate: false},
                        {field: 'seller_transaction_id', title: __('Seller_transaction_id'), operate: '='},
                        {field: 'item_name', title: __('Item_name'), operate: false, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'dispute_id', title: __('Dispute_id'), operate: '='},
                        {field: 'dispute_create_time', title: __('Dispute_create_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false,defaultValue: this.dateRange(new Date(),7)},
                        {field: 'dispute_update_time', title: __('Dispute_update_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'custom_id', title: __('Custom_id'), operate: '='},
                        {field: 'seller_email', title: __('Seller_email'), operate: '='},
                        {field: 'seller_merchant_id', title: __('Seller_merchant_id'), operate: '='},
                        {field: 'custom_merchant_id', title: __('Custom_merchant_id'), operate: '='},
                        {field: 'buyer_transaction_id', title: __('Buyer_transaction_id'), operate: '='},
                        {field: 'transaction_status', title: __('Transaction_status'), operate: false},
                        {field: 'reason', title: __('Reason'),operate: false},
                        {field: 'status', title: __('Status'), operate: '='},
                        {field: 'outcome', title: __('Outcome'), operate: '='},
                        {field: 'dispute_life_cycle_stage', title: __('Dispute_life_cycle_stage'), operate: '='},
                        {field: 'dispute_channel', title: __('Dispute_channel'), operate: '='},
                        {field: 'dispute_flow', title: __('Dispute_flow'), operate: '='},
                        {field: 'currency_code', title: __('Currency_code'),operate: false},
                        {field: 'dispute_amount', title: __('Dispute_amount'), operate:'BETWEEN'},
                        {field: 'payer_email', title: __('Payer_email'), operate: '='},
                        {field: 'payer_id', title: __('Payer_id'), operate: false},
                        {field: 'payer_name', title: __('Payer_name'), operate: false},
                        {field: 'item_description', title: __('Item_description'), operate: false, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'evidences', title: __('evidences'), operate: false, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'messages', title: __('messages'), operate: false, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'buyer_response_due_date', title: __('Buyer_response_due_date'), operate: false},
                        {field: 'seller_response_due_date', title: __('Seller_response_due_date'), operate: false},
                        {field: 'create_time', title: __('Create_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'update_time', title: __('Update_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
            // table.off('dbl-click-row.bs.table');

            $(document).on("click", ".btn-search-dispute", function () {
                Fast.api.open('paypal/customer_dispute/searchDispute','拉取纠纷信息');
            });

            $(document).on("click", ".btn-export-selected", function () {
                const ids = Table.api.selectedids(table);
                if(!ids.length){
                    Layer.alert('请选择数据！');
                    return false;
                }
                $.post('paypal/customer_dispute/export',{export_type:'selected',ids:ids},function (res){
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
                $.post('paypal/customer_dispute/export',params,function (res){
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
        searchdispute: function () {
            Controller.api.bindevent();
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
