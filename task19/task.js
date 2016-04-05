/**
 * Created by liulei on 2016/3/30.
 */
var queueBox = document.getElementById("queue-box"),
    form = document.getElementById("form"),
    input = document.getElementById("ipt"),
    tempInputValue,
    dataStore = [];  //用来存放队列数据

/**
 *判断输入框内容是否是10-100之间的数字，若是，返回true，否则返回false
 */
function isNumber(){
    if(dataStore.length < 60){   //判断队列的长度
        tempInputValue = input.value;
        if(isNaN(tempInputValue)){
            alert("请输入数字！");
            return false;
        }else if(tempInputValue >= 10 &&  tempInputValue <= 100){
            return true;   //tempInputValue为空转为false，否则转为true
        }else {
            alert("请输入10-100之间的数字！");
            return false;
        }
    }else {
        alert("当前队列已达到最大长度！");
        return false;
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
 *随机60组数据
 */
function randomData(){
    dataStore = [];
    for (var i=0; i<60;i++){
        dataStore.push((10+Math.floor(Math.random()*91)))
    }
}

/**
 *清空队列
 */
function clearData(){
    dataStore = []
}

/**
 *冒泡排序
 */
function bubbleSort(arr){
    var numElements = arr.length,   //获取队列的长度
        temp;
    outer();
    //每次循环往后移动一个最大的数
    function outer(){
        if(numElements >= 2){
            var i = 0;
            //相邻两个数据对比，如前面大于后面则交换
            function inner(){
                if(i < numElements){
                    queueBox.getElementsByClassName(i+1)[0].style.backgroundColor = "#0f0";
                    queueBox.getElementsByClassName(i)[0].style.backgroundColor = "#f00";
                    if(arr[i] > arr[i+1]){
                        temp = arr[i];
                        arr[i] = arr[i+1];
                        arr[i+1] = temp;
                        renderQueueProcess(i);
                    }
                    i++;
                    setTimeout(inner,60);
                }else {
                    outer();
                }
            }
            inner();
            numElements--
        }
        else {
            queueBox.getElementsByClassName("0")[0].style.backgroundColor = "#0f0";
            changeQueue();
            deleteAnyData();
            alert("排序完成！")
        }
    }
}

/**
 *渲染队列排序过程
 */
function renderQueueProcess(i){
    queueBox.getElementsByClassName(i)[0].style.height = dataStore[i]*3+"px";
    queueBox.getElementsByClassName(i+1)[0].style.height = dataStore[i+1]*3+"px";
}

/**
 *渲染队列函数
 */
function renderQueue(){
    var queueHtml = "";   //清空页面

    //遍历dataStore中的所有数据，渲染页面
    for(var key in dataStore){
        queueHtml += "<div class="+key+" style='height: "+dataStore[key]*3+"px'></div>"
    }
    queueBox.innerHTML = queueHtml;
}

/**
 * 监听队列中数字的变化，执行对应的函数
 */
function changeQueue(){
    //添加监听事件
    form.onclick = function(e){
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
                case "randomData":
                    randomData();
                    break;
                case "sortData":
                    if(dataStore != 0){
                        removeListenr();
                        bubbleSort(dataStore);
                    }else {
                        alert("当前队列为空，请添加新的数字！")
                    }
                    return false;
                case "clearData":
                    clearData();
                    break;
            }
            input.value = "";
            renderQueue();
        }
    }
}

/**
 * 队列中的某个数字被点击后删除
 */
function deleteAnyData(){
    //添加监听事件
    queueBox.onclick = function(e){
        if(e.target.id ==""){   //如果被点击的是队列
            dataStore.splice(e.target.className,1);   //删除被点击的数字
            renderQueue();   //渲染列表
        }
    }
}

/**
 * 排序过程中的监听事件
 */
function removeListenr(){
    form.onclick = function (e){
        if(e.target.localName == "button"){
            alert("正在排序，请稍后……");
        }
    };
    queueBox.onclick = function (e){
        if(e.target.id ==""){
            alert("请等待排序完成，再点击删除数据！");
        }

    };

}

/**
 * 初始化函数
 */
function init(){
    changeQueue();
    deleteAnyData();
}
init();