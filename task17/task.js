/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};
// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
};

//储存图表宽度
var chartDivWidth;
/**
 * 渲染图表
 */
function renderChart() {
    var chartWrap = document.getElementsByClassName("aqi-chart-wrap")[0],
        chartHtmlChild,
        fragment = document.createDocumentFragment();   //创建文档碎片节点
    chartWrap.innerHTML = "";   //初始化页面

    //遍历charData中的所有数据，创建div节点并设置其样式，添加到fragment中
    for (var key in chartData){
        chartHtmlChild = document.createElement("div");
        chartHtmlChild.style.width = chartDivWidth;
        chartHtmlChild.style.height = chartData[key];
        chartHtmlChild.style.backgroundColor = getColorWarn(chartData[key]);
        fragment.appendChild(chartHtmlChild);
    }
    chartWrap.appendChild(fragment);
}

/**
 * 根据传入数据的大小返回不同的16进制颜色
 */
function getColorWarn(data){
    if(data <= 100){
        return "#0f0";
    }else if (data <=200){
        return "#00f";
    }else if (data <=300){
        return "#ff0";
    }else if (data <=400){
        return "#f90";
    }else{
        return "#f00";
    }
}
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(graTime) {
    // 确定是否选项发生了变化
        pageState.nowGraTime = graTime;   //当前页面的表单选项
    // 设置对应数据
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(selectCity) {
    // 确定是否选项发生了变化
    pageState.nowSelectCity = selectCity;   //当前页面的日、周、月选项
    // 设置对应数据
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var graTime = document.getElementById("form-gra-time");

    //监听页面日、周、月变化，若变化，则执行graTimeChange，并传入变化的value
    graTime.addEventListener("change",function(e){
        graTimeChange(e.target.value);
    })
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var citySelect = document.getElementById("city-select"),
        citySelectInner = "";

    //遍历aqiSourceData中的所有城市，并添加到select中
    for (var key in aqiSourceData){
        citySelectInner += "<option>"+key+"</option>"
    }
    citySelect.innerHTML = citySelectInner;
    pageState.nowSelectCity = citySelect.firstElementChild.innerHTML;   //当前页面的城市选项
    // 给select设置事件，当选项发生变化时调用函数citySelectChange，并传入变化的value
    citySelect.addEventListener("change",function(e){
        citySelectChange(e.target.value);
    })

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中

    //判断当前被选中的单选按钮（日、周、月）
    switch (pageState.nowGraTime){
        case "day":
            chartDivWidth = 10;   //日图表宽度设置为10px
            chartData = {};   //清空chartData

            //遍历当前选中的城市中的数据，并将其添加到chartData中
            for(var key in aqiSourceData[pageState.nowSelectCity] ){
                chartData[key] = aqiSourceData[pageState.nowSelectCity][key];
            }
            break;
        case "week":
            chartDivWidth = 30;   //周图表宽度设置为30px
            var weekIndex = 1;   //默认chartData属性，第一周
            chartData = {};   //清空chartData
            chartData[weekIndex] = [];   //将chartData[weekIndex]初始化为空数组

            //遍历当前选中的城市中的数据
            for (var key in aqiSourceData[pageState.nowSelectCity] ){
                var timeDate = new Date(Date.parse(key.replace(/-/g,"/"))).getDay();   //获取当天是周几
                chartData[weekIndex].push(aqiSourceData[pageState.nowSelectCity][key]);   //将数据添加到chartData[weekIndex]中

                //如果遍历到周日，weekIndex+1，即chartData的属性增加一个周
                if(timeDate == 0){
                    weekIndex ++;
                    chartData[weekIndex] = [];   //初始化chartData属性增加的一个周为空数组
                }
            }
            //调用求平均值函数，将每周的数据求平均值
            getAverageData(chartData);
            break;
        case "month":
            chartDivWidth = 60;   //月图表宽度设置为30px
            var monthIndex = null,
                monthIndexNow;
            chartData = {};   //清空chartData

            //遍历当前选中的城市中的数据
            for(var key in aqiSourceData[pageState.nowSelectCity]){
                monthIndexNow = ((/-(..)-/).exec(key)[1]);   //获取当前的月份并赋值给monthIndexNow
                //如果当前的月份不是默认的月份
                if(monthIndexNow != monthIndex){
                    monthIndex = monthIndexNow;   //将当前的月份赋值给默认的月份
                    chartData[monthIndex] = []   //将chartData[monthIndex]属性初始化为空数组
                }
                chartData[monthIndex].push(aqiSourceData[pageState.nowSelectCity][key]);   //将数据添加到chartData[monthIndex]中
            }
            //调用求平均值函数，将每月的数据求平均值
            getAverageData(chartData);
            break;
    }
}
/**
 * 求数据月或者周平均值函数
 */
function getAverageData(data){
    //遍历data中的所有属性
    //每个属性都是一个数组,获得每个数组内数据的平均值
    for (var key in data){
        var DataCount = 0;
        for(var k in data[key]){
            DataCount += data[key][k];
        }
        chartData[key] = DataCount/data[key].length;
    }
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
    renderChart();
}

init();
