/**
 * Created by liulei on 2016/3/29.
 */
var queueBox = document.getElementById("queue-box"),
    form = document.getElementById("form"),
    input = document.getElementById("ipt"),
    queueHtml,   //存放动态生成的div
    dataStore = [];  //用来存放队列数据

/**
*左侧入队函数
 * html中输入框的type为number，所以这里只判断获取的输入框的值不为空
*/
function leftEnqueue(){
    if(input.value != ""){
        dataStore.unshift(input.value);
    }
}

/**
 *右侧入队函数
 */
function rightEnqueue(){
    if(input.value != ""){
        dataStore.push(input.value);
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
    queueHtml = "";   //清空页面

    //遍历dataStore中的所有数据，渲染页面
    for(var key in dataStore){
        queueHtml += "<div>"+dataStore[key]+"</div>"
    }
    queueBox.innerHTML = queueHtml;
}
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
* 初始化函数
*/
function init(){
    changeQueue();
}
init();
