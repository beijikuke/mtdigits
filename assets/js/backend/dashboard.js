define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'template', 'echarts', 'echarts-theme'], function ($, undefined, Backend, Table, Form, Template, Echarts) {

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
        isWithin31Days:function (date1, date2){
            const d1 = new Date(date1);
            const d2 = new Date(date2);
            // 计算日期差值（单位：天）
            const diffDays = Math.abs(Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
            return diffDays <= 31;
        },
        aggregate:function (){
            var datetime = $('#datetime').val();
            var dates = datetime.split(' - ');
            if (dates.length === 2) {
                if(!this.isWithin31Days(dates[0],dates[1])){
                    Toastr.error('统计时间范围不能超过1个月');
                    return false;
                }
            }else{
                Toastr.error('统计时间格式不正确');
                return false;
            }
            var merchant_site_url = $('#merchant-site-url').val();
            var merchant_group_name = $('#merchant_group_name').val();
            $.post('dashboard/index',{'datetime':datetime,'merchant_site_url':merchant_site_url,'merchant_group_name':merchant_group_name},function (res){
                if(res.code===1){
                    $('#total_num').text(res.result.total_num);
                    $('#total_success_num').text(res.result.total_success_num);
                    $('#total_pending_num').text(res.result.total_pending_num);
                    $('#total_failed_num').text(res.result.total_failed_num);
                    $('#total_unpaid_num').text(res.result.total_unpaid_num);
                    $('#total_refund_num').text(res.result.total_refund_num);
                    $('#total_amount').text('$'+res.result.total_amount);
                    $('#total_success_amount').text('$'+res.result.total_success_amount);
                    $('#total_pending_amount').text('$'+res.result.total_pending_amount);
                    $('#total_failed_amount').text('$'+res.result.total_failed_amount);
                    $('#total_unpaid_amount').text('$'+res.result.total_unpaid_amount);
                    $('#total_refund_amount').text('$'+res.result.total_refund_amount);
                    $('#risk_amount').text('$'+res.result.risk_amount);
                    $('#risk_count').text(res.result.risk_count);
                    $('#invalid_count').text(res.result.invalid_count);
                    $('#invalid_amount').text('$'+res.result.invalid_amount);
                }else{
                    console.log(res);
                    Layer.alert(res.msg);
                }
            });

            $.post('dashboard/orderDateRangeEchart',{'datetime':datetime,'merchant_site_url':merchant_site_url,'merchant_group_name':merchant_group_name},function (res){
                if(res.code===1){
                    // 基于准备好的dom，初始化echarts实例
                    var amountChart = Echarts.init(document.getElementById('amount-chart'), 'walden');

                    // 指定图表的配置项和数据
                    var option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: true,
                            data: res.xAxis
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name: '总金额',
                                type: 'line',
                                data: res.result.total_amount,
                                lineStyle: {
                                    color: '#1688f1',
                                }
                            },
                            {
                                name: '成功|待入账金额',
                                type: 'line',
                                data: res.result.total_success_amount,
                                lineStyle: {
                                    color: '#18bc9c',
                                }
                            },
                            {
                                name: '未付|失败金额',
                                type: 'line',
                                data: res.result.total_unpaid_amount,
                                lineStyle: {
                                    color: '#f39c12',
                                }
                            }
                        ]
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    amountChart.setOption(option);
                    // 基于准备好的dom，初始化echarts实例
                    var countChart = Echarts.init(document.getElementById('count-chart'), 'walden');

                    // 指定图表的配置项和数据
                    var option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: true,
                            data: res.xAxis
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name: '总数量',
                                type: 'line',
                                stack: 'Total',
                                data: res.result.total_num,
                                lineStyle: {
                                    color: '#1688f1',
                                }
                            },
                            {
                                name: '成功|待入账数量',
                                type: 'line',
                                data: res.result.total_success_num,
                                lineStyle: {
                                    color: '#18bc9c',
                                }
                            },
                            {
                                name: '未付|失败数量',
                                type: 'line',
                                data: res.result.total_unpaid_num,
                                lineStyle: {
                                    color: '#f39c12',
                                }
                            }
                        ]
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    countChart.setOption(option);
                }else{
                    console.log(res);
                    Layer.alert(res.msg);
                }
            });

            $.post('dashboard/paymentMethodEchart',{'datetime':datetime,'merchant_site_url':merchant_site_url,'merchant_group_name':merchant_group_name},function (res){
                if(res.code===1){
                    var amountPieChart = Echarts.init(document.getElementById('amount-pie-chart'), 'walden');
                    var option = {
                        title: {
                            text: '支付方式占比',
                            left: 'center'
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b} : {c} ({d}%)'
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left'
                        },
                        series: [
                            {
                                name: '支付方式',
                                type: 'pie',
                                radius: '50%',
                                data: res.amountData,
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    amountPieChart.setOption(option);

                    var countPieChart = Echarts.init(document.getElementById('count-pie-chart'), 'walden');
                    option = {
                        title: {
                            text: '支付方式占比',
                            left: 'center'
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b} : {c} ({d}%)'
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left'
                        },
                        series: [
                            {
                                name: '支付方式',
                                type: 'pie',
                                radius: '50%',
                                data: res.countData,
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    countPieChart.setOption(option);
                }else{
                    console.log(res);
                    Layer.alert(res.msg);
                }
            });
        },
        index: function () {
            // 初始化表单
            Form.api.bindevent($("form"));
            // 设置默认值（可选）
            // $('#datetime').val(Moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss') + ' - ' + Moment().format('YYYY-MM-DD HH:mm:ss'));
            $('#datetime').val(this.dateRange(new Date(),1));
            //这句话在多选项卡统计表时必须存在，否则会导致影响的图表宽度不正确
            $(document).on("click", ".charts-custom a[data-toggle=\"tab\"]", function () {
                var that = this;
                setTimeout(function () {
                    var id = $(that).attr("href");
                    var chart = Echarts.getInstanceByDom($(id)[0]);
                    chart.resize();
                }, 0);
            });

            this.aggregate();

            $(document).on("click", "#search-btn", function () {
                Controller.aggregate();
                return false;
            });
        },
    };
    return Controller;
});
