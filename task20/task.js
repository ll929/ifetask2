/**
 * Created by liulei on 2016/3/29.
 */
var queueBox = document.getElementById("queue-box"),
    form = document.getElementById("form"),
    input = document.getElementById("ipt"),
    searchIpt = document.getElementById("searchIpt"),
    dataStore = [],  //用来存放队列数据
    searchIndex = [];   //用来存放查找到的字符串的下标


/**
*左侧入队函数
*/
function leftEnqueue(){
    var tempInputValue = input.value;
    if(/^\s*$/ .test(tempInputValue)){   //如果文本域内容为空
        alert("请输入内容！");
    }else {
        dataStore = tempInputValue
            .trim()   //获得的文本域内容首位去空字符串
            .split(/[\s,，;:；：!！？?'‘’、"“”()=\{\}\[\]，。。\.\/\\\|]+/)    //以标点符号或者空字符分割，返回数组
            .concat(dataStore);   //与原数组合并
    }
}
/**
 *右侧入队函数
 */
function rightEnqueue(){   //同上（15-24行）
    var tempInputValue = input.value;
    if(/^\s*$/ .test(tempInputValue)){
        alert("请输入内容！");
    }else {
        dataStore = dataStore
            .concat(tempInputValue
                .trim()
                .split(/[\s,，;:；：!！？?'‘’、"“”()=\{\}\[\]，。。\.\/\\\|]+/));
    }
}

/**
 *左侧出队函数
 */
function leftDequeue(){
    if(dataStore.length != 0){
        alert("左侧出的内容为："+dataStore.shift());
    }else {
        alert("当前队列为空，请添加新的数字！");
    }
}

/**
 *右侧出队函数
 */
function rightDequeue(){
    if(dataStore.length != 0){
        alert("右侧出的内容为："+dataStore.pop());
    }else {
        alert("当前队列为空，请添加新的数字！");
    }
}

/**
* 查询字符串并显示
* */

function renderSearchString(){
    var i = 0,
        searchValue = searchIpt.value;
    if(searchValue != ""){
        if(dataStore.indexOf(searchValue) != -1){   //如果数组中有待查询的数据
            searchString(searchValue,i);   //执行查询字符换索引函数
            for (var key in searchIndex){   //把所有查询到的字符串的背景颜色变为绿色
                queueBox.getElementsByClassName(searchIndex[key])[0].style.backgroundColor = "#0f0";
            }
        }else {
            alert("没有找到您查询的内容！")
        }
    }else {
        alert("请输入查询的内容！")
    }
}

/**
 *查询字符串在数组中的索引函数
 */
function searchString(val,i){
    var tempIndex = dataStore.indexOf(val,i);   //查询内容在数组的第一个位置，若查询不到，返回-1
    if( tempIndex != -1){   //
        searchIndex.push(tempIndex);   //存储原数组中所有查询元素的索引
        i = tempIndex+1;
        searchString(val,i)
    }
}

/**
 *渲染队列函数
 */
function renderQueue(){
    var queueHtml = "";   //清空页面

    //遍历dataStore中的所有数据，渲染页面
    for(var key in dataStore){
        queueHtml += "<div class="+key+">"+dataStore[key]+"</div>"
    }
    queueBox.innerHTML = queueHtml;
}

/**
 * 监听队列中数字的变化，执行对应的函数
 */
function changeQueue(){
    //添加监听事件
    form.addEventListener("click",function(e){
        if(e.target.localName == "button"){   //如果被点击的是button标签
            //eval(e.target.id+"()");   //不知道能不能用

            //判断被点击的是button标签的id，执行对应的函数
            switch (e.target.id){
                case "leftEnqueue":
                    leftEnqueue();
                    break;
                case "rightEnqueue":
                    rightEnqueue();
                    break;
                case "leftDequeue":
                    leftDequeue();
                    break;
                case "rightDequeue":
                    rightDequeue();
                    break;
                case "search":
                    renderSearchString();
                    return false;
            }
            input.value = "";
            renderQueue();
        }
    })
}

/**
 * 队列中的某个数字被点击后删除
 */
function deleteAnyData(){
    //添加监听事件
    queueBox.addEventListener("click",function(e){
        if(e.target.id ==""){   //如果被点击的是队列
            dataStore.splice(e.target.className,1);   //删除被点击的数字
            renderQueue();   //渲染列表
        }
    })
}
/**
* 初始化函数
*/
function init(){
    changeQueue();
    deleteAnyData();
}
init();
