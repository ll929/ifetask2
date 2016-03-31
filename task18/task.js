/**
 * Created by liulei on 2016/3/29.
 */
var queueBox = document.getElementById("queue-box"),
    form = document.getElementById("form"),
    input = document.getElementById("ipt"),
    tempInputValue,
    dataStore = [];  //用来存放队列数据

/**
 *判断输入框内容是否是数字，若是，返回true，否则返回false
 */
function isNumber(){
    tempInputValue = input.value;
    if(isNaN(tempInputValue)){
        alert("请输入数字！");
        return false;
    }else {
        return tempInputValue;   //tempInputValue为空转为false，否则转为true
    }
}
/**
*左侧入队函数
*/
function leftEnqueue(){
    if(isNumber()){
        dataStore.unshift(tempInputValue);
    }
}

/**
 *右侧入队函数
 */
function rightEnqueue(){
    if(isNumber()){
        dataStore.push(tempInputValue);
    }
}

/**
 *左侧出队函数
 */
function leftDequeue(){
    if(dataStore.length != 0){
        alert("左侧出的数字为："+dataStore.shift());
    }else {
        alert("当前队列为空，请添加新的数字！");
    }
}

/**
 *右侧出队函数
 */
function rightDequeue(){
    if(dataStore.length != 0){
        alert("右侧出的数字为："+dataStore.pop());
    }else {
        alert("当前队列为空，请添加新的数字！");
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
            }
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
