/**
 * Created by liulei on 2016/3/29.
 */

var queue = {
    queueBox1 : document.getElementById("queue-box-1"),
    queueBox2 : document.getElementById("queue-box-2"),
    confirmBtn : document.getElementById("confirmBtn"),
    inputArea : document.getElementById("iptArea"),
    ipt : document.getElementById("ipt"),
    dataStore0 : [],
    dataStore : [] //用来存放队列数据
};

/**
*添加数据
*/
function addHobbies(target,dataArr){
    var tempInputValue = target.value;
    if(/^\s*$/ .test(tempInputValue)){   //如果文本域内容为空
        alert("请填写兴趣爱好！");
    }else {
        var tempDataStore = tempInputValue   //用来缓存文本域内的额文字分割后的数据
            .trim()   //获得的文本域内容首位去空字符串
            .split(/[\s,，;:；：!！？?'‘’、"“”()=\{\}\[\]，。。\.\/\\\|]+/);   //以标点符号或者空字符分割，返回数组
        removeDuplicateData(tempDataStore,dataArr);
    }
}

/**
 *去除重复及无用数据
 */
function removeDuplicateData(tempArr,dataArr){
    for (var i = 0;i < tempArr.length;i++){
        var trimArrData = tempArr[i].trim();
        if(trimArrData != ""){
            if(dataArr.indexOf(trimArrData) == -1){
                if (dataArr.length < 10){
                    dataArr.push(trimArrData);
                }else {
                    dataArr.shift();
                    dataArr.push(trimArrData);
                }
            }
        }
    }
}

/**
 *渲染队列函数
 */
function renderQueue(t,dataArr){
    var queueHtml = "";   //清空页面
    //遍历dataStore中的所有数据，渲染页面
    for(var key in dataArr){
        queueHtml += "<div class="+key+">"+dataArr[key]+"</div>"
    }
    t.innerHTML = queueHtml;
}

/**
 * 点击确认兴趣爱好按钮函数
 */
function clickConfirmBtn(){
    //添加监听事件
    queue.confirmBtn.onclick = function(){
        queue.dataStore.length = 0;
        addHobbies(queue.inputArea,queue.dataStore);
        queue.inputArea.value = "";
        renderQueue(queue.queueBox2,queue.dataStore);
    };
}

/**
 * 监听输入框文字内容变化函数
 */

function changeIpt(){
    queue.ipt.onkeydown = function(e){
        if(e.keyCode == 32 || e.keyCode == 13 || e.keyCode == 188){
            addHobbies(queue.ipt,queue.dataStore0);
            queue.ipt.value = "";
            renderQueue(queue.queueBox1,queue.dataStore0);
        }
    }
}

/**
 * 队列中的某个数字被点击后删除
 */
function deleteAnyData(t,dataArr){
    //添加监听事件
    t.addEventListener("click",function(e){
        var cc = queue.dataStore;
        if(e.target.id ==""){   //如果被点击的是队列
            dataArr.splice(e.target.className,1);   //删除被点击的数字
            renderQueue(t,dataArr);   //渲染列表
        }
    })
}
/**
* 初始化函数
*/
function init(){
    clickConfirmBtn();
    changeIpt();
    deleteAnyData(queue.queueBox1,queue.dataStore0);
    deleteAnyData(queue.queueBox2,queue.dataStore);
}
init();
