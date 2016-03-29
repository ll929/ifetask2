/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var city = document.getElementById("aqi-city-input").value,
        airQuality = document.getElementById("aqi-value-input").value,
        regCity = /^[\u4e00-\u9fa5\sa-zA-Z]+$/,   //正则城市名，只能是中英文
        regAirQuality = /^[0-9]*[0-9][0-9]*$/;   //正则空气质量，只能是整数，不能有空格

    if(regCity.test(city) && regAirQuality.test(airQuality)){
        aqiData[city] = airQuality;   //用户输入中获取数据，向aqiData中增加一条数据
    }else {
        alert("请正确输入城市名和空气质量");
    }
}
/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var table = document.getElementById("aqi-table").firstElementChild,  //获取表格
        tableValue = "";
    //遍历aqiDate中的所有城市，将其添加的表格中
    for (var key in aqiData){
        tableValue += "<tr><td>"+key+"</td><td>"+aqiData[key]+"</td><td><button>删除</button></td></tr>";
    }
    table.innerHTML = "<td>城市</td><td>空气质量</td><td>操作</td>"+tableValue;
}
/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(del) {
    // do sth.
    delete aqiData[del];   //删除aqiDate中被点击的城市
    renderAqiList();   //重新渲染表格
}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
        var addBtn = document.getElementById("add-btn"),
            delBtn = document.getElementById("aqi-table");
        addBtn.onclick = function(){
            addBtnHandle();
        };

    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
        delBtn.onclick = function(event){
            var delVal = event.target.parentNode.parentNode.firstChild.innerText;   //获取被点击删除按钮行的城市名
            delBtnHandle(delVal)
        }
}

init();
