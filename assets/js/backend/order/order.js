define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'order/order/index' + location.search,
                    add_url: 'order/order/add',
                    edit_url: 'order/order/edit',
                    del_url: 'order/order/del',
                    multi_url: 'order/order/multi',
                    import_url: 'order/order/import',
                    detail_url: 'order/order/detail',
                    refundCheck_url: 'order/order/refundCheck',
                    tracking_url: 'order/order/tracking',
                    notify_url: 'order/order/notify',
                    addTracking_url: 'order/order/addTracking',
                    table: 'order',
                }
            });
            var table = $("#table");

            //在普通搜索渲染后
            table.on('post-common-search.bs.table', function (event, table) {
                var form = $("form", table.$commonsearch);
                $("input[name='payment_method']", form).addClass("selectpage").data('multiple','true').data("source", "/api/order/getPaymentMethodList").data("primaryKey", "id").data("field", "name");
                $("input[name='order_status']", form).addClass("selectpage").data('multiple','true').data("source", '/api/order/getOrderStatusList').data("primaryKey", "id").data("field", "name");
                $("input[name='payment_status']", form).addClass("selectpage").data('multiple','true').data("source", '/api/order/getPaymentStatusList').data("primaryKey", "id").data("field", "name");
                $("input[name='user_id']", form).addClass("selectpage").data("source", "user/user/selectpage").data("primaryKey", "id").data("field", "username");
                $("input[name='merchant_site_url']", form).addClass("selectpage").data("source", "merchant/site/selectpage").data("primaryKey", "url").data("field", "url");
                $("input[name='merchant_group_name']", form).addClass("selectpage").data("source", "merchant/group/selectpage").data("primaryKey", "name").data("field", "name");
                $("input[name='channel_site_url']", form).addClass("selectpage").data("source", "channel/site/selectpage").data("primaryKey", "url").data("field", "url");
                $("input[name='channel_group_name']", form).addClass("selectpage").data("source", "channel/group/selectpage").data("primaryKey", "name").data("field", "name");
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
                search:false,
                trimOnSearch:true,
                showExport:false,
                striped:true,
                showColumns:false,
                // searchFormVisible: true,
                searchOnEnterKey: true,
                queryParams: function (params) {
                    //这里可以追加搜索条件
                    var filter = params.filter ? JSON.parse(params.filter) : {};
                    var op = params.op ? JSON.parse(params.op) : {};
                    //这里可以动态赋值;
                    var createTime = filter.create_time;
                    if (createTime) {
                        var dates = createTime.split(' - ');
                        if (dates.length === 2) {
                            var start = new Date(dates[0]);
                            var end = new Date(dates[1]);
                            var diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                            if (diffMonths > 3) {
                                Toastr.error('下单时间范围不能超过3个月');
                                return false;
                            }
                        }
                    }
                    if(filter.order_status){
                        filter.order_status = filter.order_status.split(',');
                    }
                    if(filter.payment_method){
                        filter.payment_method = filter.payment_method.split(',');
                    }

                    params.filter = JSON.stringify(filter);
                    params.op = JSON.stringify(op);
                    return params;
                },
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id'),operate: false,visible: false},
                        {field: 'risk_flag', title: __('Risk_flag'),operate: '=',visible: false, searchList: {"1":__('Yes'),"0":__('No')}},
                        {field: 'duplicate_flag', title: __('Duplicate_flag'),operate: '=',visible: false, searchList: {"1":__('Yes'),"0":__('No')}},
                        {field: 'risk_Info', title: __('Risk_flag'), operate: false,
                            formatter: function (value,row,index){
                                if(row.risk_flag===0){
                                    return '<span style="color: green"><i class="fa fa-check"></i></span>';
                                }else{
                                    return '<span style="color: red;cursor: pointer"><i class="fa fa-warning" data-toggle="tooltip" data-placement="top" title="'+row.risk_reason+'"></i></span>';
                                }
                            }},
                        {field: 'notify_result_info', title: __('Notify_result'), operate: false,
                            formatter: function (value,row,index){
                                if(row.notify_flag===0){
                                    return '';
                                }
                                if(row.notify_flag===1){
                                    return '<span style="color: green"><i class="fa fa-check"></i></span>';
                                }else{
                                    return '<span style="color: red;cursor: pointer"><i class="fa fa-warning" data-toggle="tooltip" data-placement="top" title="异常原因：['+row.notify_result+']，通知次数：['+row.notify_times+']"></i></span>';
                                }
                            }},
                        {field: 'order_id', title: '系统/商户订单号',operate: false,align:'middle',halign:'center',
                            formatter: function (value, row, index){
                                return '<span>'+row.system_order_id_text+'</span> <i class="fa fa-copy" style="cursor: pointer"></i>' +
                                    '<br/><span>'+row.merchant_order_id+'</span> <i class="fa fa-copy" style="cursor: pointer"></i>';
                            }},

                        {field: 'system_order_id', title: __('System_order_id'),operate: '=',visible: false},
                        {field: 'merchant_order_id', title: __('Merchant_order_id'), operate: '=',visible: false},
                        {field: 'order_amount', title: __('Order_amount'), operate:'BETWEEN',align:'middle',halign:'center',
                            formatter:function (value, row, index){
                                let content = '<span style="color: red">' + (row.order_amount) + ' ' + row.currency + '</span>';
                                if(row.currency!=='USD'){
                                    //显示美元标准金额
                                    content += '<br/><span style="color: green">'+row.order_amount_usd+' USD</span>'
                                }
                                return content;
                            }},
                        {field: 'payment_status', title: __('Payment_status'),operate: 'IN',formatter:function (value){
                                var content = value;
                                var color = '#0dcaf0';
                                if(value.toLowerCase()==='completed'){
                                    content = 'Completed';
                                    color = '#198754';
                                }else if(value.toLowerCase()==='failed'){
                                    content = 'Failed';
                                    color = '#dc3545';
                                }else if(value.toLowerCase().includes('pending')){
                                    content = 'Pending';
                                    color = '#ffc107';
                                }
                                return '<span style="color: '+color+'">'+content+'</span>';
                            }},
                        {field: 'order_status', title: __('Order_status'),operate: 'IN'},
                        {field: 'payment_method_info', title: '支付选择/方式', operate: false, align:'middle',halign:'center',
                            formatter:function (value, row, index){
                                return '<span>'+row.payment_option+'</span>' +
                                    '<br/><span>'+row.payment_method+'</span>';
                            }},
                        {field: 'user_id', title: __('Username'),operate: '=',visible:false},
                        {field: 'merchant_info', title: '商户信息',operate:false,align:'middle',halign:'center',
                            formatter:function (value, row, index){
                                return '<span>所属用户：'+row.username+'</span>' +
                                    '<br/><span>分组名称：'+row.merchant_group_name+'</span>'+
                                    '<br/><span>网址：</span><span>'+row.merchant_site_url+'</span> <i class="fa fa-copy" style="cursor: pointer"></i>';
                            }},
                        {field: 'merchant_site_url', title: __('Merchant_site'), operate: '=',visible:false},
                        {field: 'merchant_group_name', title: __('Merchant_group'), operate: '=',visible:false},
                        {field: 'channel_site_url', title: __('Channel_site'), operate: '=',visible:false},
                        {field: 'channel_group_name', title: __('Channel_group'), operate: '=',visible:false},
                        {field: 'channel_info', title: '通道信息',operate:false,align:'middle',halign:'center',
                            formatter:function (value, row, index){
                                return '<span>分组：'+(row.channel_group_name)+'</span>' +
                                    '<br/><span>网址：</span><span>'+(row.channel_site_url)+'</span> <i class="fa fa-copy" style="cursor: pointer"></i>'+
                                    '<br/><span>收款账号：</span><span>'+(row.payment_account)+'</span> <i class="fa fa-copy" style="cursor: pointer"></i>';
                            }},
                        {field: 'customer_info', title: '客户信息', operate: false,align:'middle',halign:'center',
                            formatter:function (value, row, index){
                                return '<span>邮箱：</span><span>'+(row.customer_email)+'</span> <i class="fa fa-copy" style="cursor: pointer"></i>' +
                                    '<br/><span>电话：</span><span>'+(row.customer_phone)+'</span>'+
                                    '<br/><span>IP：</span><span>'+(row.customer_ip)+'-'+row.customer_ip_geo_location+'</span>'+
                                    '<br/><span>终端：</span><span>'+(row.order_terminal)+'</span>';
                            }},
                        {field: 'paypal_id', title: 'PayPal订单号/交易号', operate: false, align:'middle',halign:'center',
                            formatter:function (value, row, index){
                                let content = '';
                                if(row.paypal_order_id){
                                    content = '<span>' + row.paypal_order_id+ '</span> <i class="fa fa-copy" style="cursor: pointer"></i>';
                                }
                                if(row.transaction_id){
                                    content += '<br/><span>'+row.transaction_id+'</span> <i class="fa fa-copy" style="cursor: pointer"></i>';
                                }
                                return content;
                            }},
                        {field: 'customer_email', title: __('Customer_email'), operate: '=',visible: false},
                        {field: 'customer_phone', title: __('Customer_phone'), operate: '=',visible: false},
                        {field: 'customer_ip', title: __('Customer_ip'), operate: '=',visible: false},
                        {field: 'order_terminal', title: __('Order_terminal'), operate: '=',visible: false},
                        {field: 'payment_method', title: __('Payment_method'), operate: 'IN',visible: false},
                        {field: 'failure_reason', title: __('Failure_reason'), operate: false, table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'transaction_id', title: __('Transaction_id'), operate: '=',visible: false},
                        {field: 'paypal_order_id', title: __('Paypal_order_id'), operate: '=',visible: false},
                        {field: 'time', title: '时间', operate: false, align:'middle',halign:'center',
                            formatter:function (value, row, index){
                                let content = '<span>下单：' + row.create_time + '</span>';
                                if(row.payment_jump_time){
                                    content += '<br/><span>跳转：'+row.payment_jump_time+'</span>';
                                }
                                if(row.payment_completed_time){
                                    content += '<br/><span>支付：'+row.payment_completed_time+'</span>';
                                }
                                if(row.dispute_created_time){
                                    content += '<br/><span>CASE：'+row.dispute_created_time+'</span>';
                                }
                                content += '<br/><span>更新：'+row.update_time+'</span>';
                                return content;
                            }},
                        {field: 'partner_order_flag', title: __('partner_order_flag'), searchList: {"1":__('Yes'),"0":__('No')}, operate: '=',
                            formatter:function (value, row, index){
                                return value===0?'N':'Y';
                            }},
                        {field: 'duplicate_info', title: __('Duplicate_flag'), operate: false,
                            formatter: function (value,row,index){
                                return row.duplicate_flag===0?'N':'Y';
                            }},
                        {field: 'tracking_upload_status', title: __('Tracking_upload_status'),visible: false, searchList: {"0":"待上传","1":"上传中","2":"上传成功","3":"上传失败"}, operate: '='},
                        {field: 'notify_flag', title: __('Notify_flag'),visible: false, searchList: {"0":"未通知","1":"通知成功","2":"通知失败"}, operate: '='},
                        {field: 'merchant_custom', title: __('Merchant_custom'), operate: '=', table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'tracking_number', title: __('Tracking_number'), operate: '=', visible: false},
                        {field: 'shipping_info', title: __('Shipping info'), operate: false,align:'middle',halign:'center',
                            formatter:function (value, row, index){
                                if(!row.tracking_number){
                                    return ''
                                }
                                var tracking_upload_status = '待上传'
                                if(row.tracking_upload_status===1){
                                    tracking_upload_status = '上传中';
                                }else if(row.tracking_upload_status===2){
                                    tracking_upload_status = '上传成功';
                                }else if(row.tracking_upload_status===3){
                                    tracking_upload_status = '上传失败';
                                }
                                return '<span>运单号：</span><span>'+(row.tracking_number)+'</span>' +
                                    '<br/><span>公司：'+(row.carrier)+'</span>'+
                                    '<br/><span>状态：'+(tracking_upload_status)+'</span>'+
                                    '<br/><span>时间：'+(row.tracking_upload_time?row.tracking_upload_time:'')+'</span>';
                            }},
                        {field: 'payment_remark', title: __('Payment_remark'), operate: false, table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'order_remark', title: __('Order_remark'), operate: false, table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'payment_jump_time', title: __('Payment_jump_time'),visible: false, operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'payment_completed_time', title: __('Payment_completed_time'),visible: false, operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'dispute_created_time', title: __('dispute_created_time'),visible: false, operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'tracking_upload_time', title: __('Tracking_upload_time'),visible: false, operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'create_time', title: __('Create_time'),visible: false, operate:'RANGE', addclass:'datetimerange', autocomplete:false,defaultValue: this.dateRange(new Date(),1)},
                        {field: 'update_time', title: __('Update_time'),visible: false, operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate,
                            buttons: [
                                {
                                    name: __('AddTracking'),
                                    title: __('AddTracking'),
                                    classname: 'btn btn-xs btn-info btn-dialog',
                                    icon: 'fa fa-edit',
                                    url: $.fn.bootstrapTable.defaults.extend.addTracking_url,
                                    visible: function (row) {
                                        //当支付状态为完成时可以上传运单号
                                        var paymentStatus = row.payment_status.toLowerCase();
                                        var orderStatus = row.order_status.toLowerCase();
                                        return paymentStatus==='completed' && !(orderStatus === 'full refund' || orderStatus === 'partial refund');
                                    }
                                },
                                {
                                    name: __('Detail'),
                                    title: __('Detail'),
                                    classname: 'btn btn-xs btn-info btn-dialog',
                                    icon: 'fa fa-expand',
                                    url: $.fn.bootstrapTable.defaults.extend.detail_url,
                                },
                                {
                                    name: __('Tracking'),
                                    title: __('Tracking'),
                                    classname: 'btn btn-xs btn-info btn-dialog',
                                    icon: 'fa fa-chain',
                                    url: $.fn.bootstrapTable.defaults.extend.tracking_url
                                },
                                {
                                    name: __('Refund check'),
                                    title: __('Refund check'),
                                    classname: 'btn btn-xs btn-warning btn-dialog',
                                    icon: 'fa fa-check-square-o',
                                    url: $.fn.bootstrapTable.defaults.extend.refundCheck_url,
                                    visible: function (row) {
                                        //当等于申请退款时显示该按钮
                                        return row.order_status==='Apply refund';
                                    }
                                },
                            ],
                            formatter: Table.api.formatter.operate
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

            $(document).on("click", ".fa-copy", function () {
                let content = $(this).prev().text();
                Controller.copyText(content);
            });

            // 监听日期范围选择器
            $('[name="create_time"]').on('apply.daterangepicker', function(ev, picker) {
                var startDate = picker.startDate;
                var endDate = picker.endDate;
                var diffMonths = endDate.diff(startDate, 'months');
                if (diffMonths > 3) {
                    Toastr.error('搜索时间范围不能超过3个月');
                    return false;
                }
            });

            //当表格数据加载完成时
            table.on('load-success.bs.table', function (e, data) {
                //这里可以获取从服务端获取的JSON数据
                $("#total-amount").text(data.extend.total_amount);
            });
            $(document).on("click", ".btn-export-selected", function () {
                const ids = Table.api.selectedids(table);
                if(!ids.length){
                    Layer.alert('请选择数据！');
                    return false;
                }
                $.post('order/order/export',{export_type:'selected',ids:ids},function (res){
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
                $.post('order/order/export',params,function (res){
                    if(res.code===1){
                        Toastr.info(res.msg)
                    }else{
                        console.log(res);
                        Toastr.error(res.msg);
                    }
                });
                return false;
            });
            $(document).on("click", ".btn-notify", function () {
                var selectedData = Table.api.selecteddata(table);
                if(!selectedData.length){
                    Layer.alert('请选择数据！');
                    return false;
                }
                var ids = [];
                for (var i = 0; i < selectedData.length; i++) {
                    var item = selectedData[i];
                    if (item['payment_status'] !== 'Completed') {
                        Layer.alert('存在订单尚未支付，请选择已支付订单进行处理！');
                        return false;
                    }
                    ids.push(item['id']);
                }

                Layer.confirm("确认手动通知操作吗？", function(index) {
                    Fast.api.ajax({
                        url: $.fn.bootstrapTable.defaults.extend.notify_url,
                        data: {
                            ids: ids
                        }
                    }, function (data, ret) {
                        Layer.close(index);
                        Table.api.refresh();
                    });
                });
            });
        },
        aggregate: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'order/order/aggregate' + location.search,
                    table: 'order',
                }
            });
            var table = $("#table");

            //在普通搜索渲染后
            table.on('post-common-search.bs.table', function (event, table) {
                var form = $("form", table.$commonsearch);
                $("input[name='payment_method']", form).addClass("selectpage").data('multiple','true').data("source", "/api/order/getPaymentMethodList").data("primaryKey", "id").data("field", "name");
                $("input[name='order_status']", form).addClass("selectpage").data('multiple','true').data("source", '/api/order/getOrderStatusList').data("primaryKey", "id").data("field", "name");
                $("input[name='payment_status']", form).addClass("selectpage").data('multiple','true').data("source", '/api/order/getPaymentStatusList').data("primaryKey", "id").data("field", "name");
                $("input[name='user_id']", form).addClass("selectpage").data("source", "user/user/selectpage").data("primaryKey", "id").data("field", "username");
                $("input[name='merchant_site_url']", form).addClass("selectpage").data("source", "merchant/site/selectpage").data("primaryKey", "url").data("field", "url");
                $("input[name='merchant_group_name']", form).addClass("selectpage").data("source", "merchant/group/selectpage").data("primaryKey", "name").data("field", "name");
                $("input[name='channel_site_url']", form).addClass("selectpage").data("source", "channel/site/selectpage").data("primaryKey", "url").data("field", "url");
                $("input[name='channel_group_name']", form).addClass("selectpage").data("source", "channel/group/selectpage").data("primaryKey", "name").data("field", "name");
                Form.events.cxselect(form);
                Form.events.selectpage(form);
                $('button[type="submit"]').text('统计')
            });

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                search:false,
                trimOnSearch:true,
                striped:true,
                showColumns:false,
                searchFormVisible: true,
                pagination: false,  // 禁用分页
                pageSize: 999999,  // 设置一个很大的每页显示数量
                pageList: [999999], // 设置一个很大的每页显示数量选项
                searchOnEnterKey: true,
                queryParams: function (params) {
                    //这里可以追加搜索条件
                    var filter = params.filter ? JSON.parse(params.filter) : {};
                    var op = params.op ? JSON.parse(params.op) : {};
                    //这里可以动态赋值;
                    var createTime = filter.create_time;
                    if (createTime) {
                        var dates = createTime.split(' - ');
                        if (dates.length === 2) {
                            var start = new Date(dates[0]);
                            var end = new Date(dates[1]);
                            var diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                            if (diffMonths > 6) {
                                Toastr.error('下单时间范围不能超过6个月');
                                return false;
                            }
                        }
                    }
                    if(filter.order_status){
                        filter.order_status = filter.order_status.split(',');
                    }
                    if(filter.payment_method){
                        filter.payment_method = filter.payment_method.split(',');
                    }
                    params.group_by = filter.group_by?filter.group_by:'merchant_group_name';
                    params.type = filter.type;
                    delete filter.group_by;
                    delete filter.type;
                    delete op.type;
                    delete op.group_by;
                    params.filter = JSON.stringify(filter);
                    params.op = JSON.stringify(op);
                    return params;
                },
                columns: [
                    [
                        {field: 'id', title: '序号',operate: false},
                        {field: 'group_item', title: '统计项',operate: false,align:"left",halign:"center"},
                        {field: 'total_num', title: '总数量',operate: false},
                        {field: 'total_amount', title: '总金额',operate: false},
                        {field: 'total_success_num', title: '成功数量',operate: false},
                        {field: 'total_success_amount', title: '成功金额',operate: false},
                        {field: 'total_pending_num', title: '待确认数量',operate: false},
                        {field: 'total_pending_amount', title: '待确认金额',operate: false},
                        {field: 'total_failed_amount', title: '失败金额',operate: false},
                        {field: 'total_failed_num', title: '失败数量',operate: false},
                        {field: 'total_unpaid_amount', title: '未付金额',operate: false},
                        {field: 'total_unpaid_num', title: '未付数量',operate: false},
                        {field: 'total_refund_num', title: '退款数量',operate: false},
                        {field: 'total_refund_amount', title: '退款金额',operate: false},
                        {field: 'payment_rate', title: '支付率',operate: false,titleTooltip:"支付率：(成功数量+待确认数量+失败数量)/总数量"},
                        {field: 'success_rate', title: '成功率',operate: false,titleTooltip:"成功率：(成功数量+待确认数量)/(成功数量+待确认数量+失败数量)"},
                        {field: 'merchant_site_url', title: __('Merchant_site'), operate: '=',visible:false},
                        {field: 'merchant_group_name', title: __('Merchant_group'), operate: '=',visible:false},
                        {field: 'channel_site_url', title: __('Channel_site'), operate: '=',visible:false},
                        {field: 'channel_group_name', title: __('Channel_group'), operate: '=',visible:false},
                        {field: 'payment_status', title: __('Payment_status'),operate: 'IN',visible: false},
                        {field: 'order_status', title: __('Order_status'),operate: 'IN',visible: false},
                        {field: 'user_id', title: __('Username'),operate: '=',visible:false},
                        {field: 'customer_email', title: __('Customer_email'), operate: '=',visible: false},
                        {field: 'group_by', title: "分组统计方式", operate: '=',visible: false,
                            searchList:{"merchant_group_name":"商户分组","merchant_site_url":"商户站","channel_site_url":"通道站","payment_account":"收款账户"}},
                        {field: 'order_terminal', title: __('Order_terminal'), operate: '=',visible: false},
                        {field: 'payment_method', title: __('Payment_method'), operate: 'IN',visible: false},
                        {field: 'payment_account', title: __('Payment_account'), operate: '=',visible: false},
                        {field: 'type', title: "按日期统计", operate: '=',visible: false,
                            searchList:{"date":__('Yes'),"all":__('No')}},
                        {field: 'create_time', title: __('Create_time'),visible: false, operate:'RANGE', addclass:'datetimerange', autocomplete:false,defaultValue: this.dateRange(new Date(),1)},
                        {field: 'payment_completed_time', title: __('Payment_completed_time'),visible: false, operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

            // 监听日期范围选择器
            $('[name="create_time"]').on('apply.daterangepicker', function(ev, picker) {
                var startDate = picker.startDate;
                var endDate = picker.endDate;
                var diffMonths = endDate.diff(startDate, 'months');
                if (diffMonths > 6) {
                    Toastr.error('搜索时间范围不能超过6个月');
                    return false;
                }
            });
        },
        tracking: function () {
            var table = $('#table');
            var id = $('#ids').val();
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'order/order/tracking?ids='+id,
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
                        {field: 'event_name', title: __('Event_name'), operate: false},
                        {field: 'content', title: __('Content'), table: table, class: 'autocontent', formatter: Table.api.formatter.content, operate: false},
                        {field: 'create_time', title: __('Event_time'), operate:false, addclass:'datetimerange', autocomplete:false},
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        detail: function () {
            $(document).on("click", ".fa-copy", function () {
                let content = $(this).prev().text();
                Controller.copyText(content);
            });
            Controller.api.bindevent();
        },
        //如果方法名是驼峰法命名这里不能驼峰法命名
        refundcheck: function () {
            Controller.api.bindevent();
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        addtracking: function () {
            Controller.api.bindevent();
        },
        import: function () {
            Controller.api.bindevent();
        },
        notify: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
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
        copyText: function (content) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(content)
                    .then(() => {
                    Toastr.success('复制成功');
                }).catch(() => this.legacyCopyText(content));
            } else {
                this.legacyCopyText(content);
            }
        },
        legacyCopyText: function (content){
            var textarea = document.createElement('textarea');
            textarea.value = content;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            Toastr.success('复制成功');
        }
    };
    return Controller;
});
