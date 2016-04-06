/**
 * Created by liulei on 2016/4/4.
 */
/**
 *封装Tree类
 */
(function(){
    function Tree(root){
        this.root = root;     //初始化根节点为null
        this.show = show;    //显示树遍历过程
        this.orderNode = [];    //按照遍历顺序存放二叉树遍历节点
        this.i = 0;
        this.searchResult = [];  //用来存放查找到的节点
        this.timeOut = undefined;
        this.preOrder = preOrder;   //遍历方式1
        this.inOrder = inOrder;   //遍历方式2
        this.postOrder = postOrder;   //遍历方式2
        this.selectEventListener = selectEventListener;   //监听被选中的节点
        this.selectNode = null;   //被选中的节点
        this.delete = deleteNode;   //删除节点函数
        this.add = add;   //添加节点函数
        this.clear = clear;   //清除遍历或者查找过程，或者还原样式
    }
    window.Tree = Tree;   //公开一个接口
    /**
     * 显示树遍历或者查找过程
     * @param currentClassName 遍历到当前节点添加的样式名
     * @param searchValue 要查找的值，可选
     * @param searchClassName 查到的节点添加的样式名
     */
    function show(currentClassName,searchValue,searchClassName){
        //将this赋值t，如果直接用this，在经过setTimeout()函数后this会指向window
        var t = this;
        if(this.i <= this.orderNode.length){
            if(this.i > 0) {
                if(this.orderNode[this.i-1].className != searchClassName){
                    this.orderNode[this.i-1].className = this.orderNode[this.i-1].className.replace(currentClassName,"");
                }
            }
            if(this.i < this.orderNode.length){
                this.orderNode[this.i].className += (" "+currentClassName);
                if(searchValue){
                    if(this.orderNode[this.i].firstChild.data.trim() == searchValue){
                        this.searchResult.push(this.orderNode[this.i]);
                        this.orderNode[this.i].className += (" "+searchClassName);
                    }
                }
            }
            this.i++;
            this.timeOut = setTimeout(function(){t.show(currentClassName,searchValue,searchClassName)},500)
        }else {
            this.timeOut = undefined;
            if(searchValue){
                if(this.searchResult.length == 0){
                    alert("没要找到您要查询的内容！")
                }
            }
        }
    }
    /**
     * 遍历方式1，类似于二叉树的先序遍历
     * @param node 需要遍历树的根节点
     */
    function preOrder(node){
        //默认参数为根节点
        node = ((typeof arguments[0]) == "undefined")? this.root:node;
        if(!(node == null)){
            this.orderNode.push(node);
            this.preOrder(node.firstElementChild);
            this.preOrder(node.nextElementSibling);
        }
    }
    /**
     * 遍历方式2，类似于二叉树的中序遍历
     * @param node 需要遍历树的根节点
     */
    function inOrder(node){
        node = ((typeof arguments[0]) == "undefined")? this.root:node;
        if(!(node == null)){
            this.inOrder(node.firstElementChild);
            this.orderNode.push(node) ;
            this.inOrder(node.nextElementSibling);
        }
    }
    /**
     * 遍历方式3，类似于二叉树的后序遍历
     * @param node 需要遍历树的根节点
     */
    function postOrder(node){
        node = ((typeof arguments[0]) == "undefined")? this.root:node;
        if(!(node == null)){
            this.postOrder(node.firstElementChild);
            this.postOrder(node.nextElementSibling);
            this.orderNode.push(node) ;
        }
    }
    /**
     *监听被选中的节点，并改变其样式
     * @param className 被选中时添加的样式名
     */
    function selectEventListener(className) {
        var t = this;
        this.root.addEventListener("click",function (e) {
            //如果当前节点未选中，点击被选中，反之点击取消选中
            if(e.target.className.indexOf(className) == -1){
                if(t.selectNode){
                    t.selectNode.className =  t.selectNode.className.replace(className,"");
                }
                t.selectNode = e.target;
                t.selectNode.className += (" "+className);
            }else {
                t.selectNode.className = t.selectNode.className.replace(className,"");
                t.selectNode = null;
            }
        })
    }

    /**
     * 删除节点
     * @returns {boolean} 如果要删除的是根节点，则取消操作
     */
    function deleteNode() {
        if(this.selectNode){
            if(this.selectNode == this.root){
                alert("不能删除根节点！");
                return false;
            }
            this.selectNode.parentNode.removeChild(this.selectNode);
            this.selectNode = null;
        }else {
            alert("请先选择要删除的节点！")
        }
    }

    /**
     * 添加节点
     * @param nodeValue 添加节点的内容
     */
    function add(nodeValue) {
        var newNode = document.createElement("div");
        newNode.innerHTML = nodeValue;
        if(this.selectNode){
            this.selectNode.appendChild(newNode)
        }else {
            alert("请选择要添加子节点的节点！")
        }
    }

    /**
     * 清除遍历或者查找过程，或者还原样式，参数都是布尔类型
     * @param ordre 如果为有参数，停止遍历过程，并取消current样式
     * @param search 如果为有参数，取消search样式
     * @param select 如果为参数，取消select样式
     */
    function clear(currentClassName,searchClassName,selectClassName) {
        if(currentClassName){
            if(this.timeOut){
                clearTimeout(this.timeOut);
                this.timeOut = undefined;
                if(this.i > 0 && this.i <= this.orderNode.length){
                    this.orderNode[this.i-1].className = this.orderNode[this.i-1].className.replace(currentClassName,"");
                }
                this.i = 0;
                this.orderNode = [];
            }
        }
        if(searchClassName){
            if(this.searchResult.length > 0){
                for (var key in this.searchResult){
                    this.searchResult[key].className = this.searchResult[key].className.replace(searchClassName,"");
                }
                this.searchResult = [];
            }
        }
        if(selectClassName){
            this.selectNode.className = this.selectNode.className.replace(selectClassName,"");
        }
    }
})();
/**
 * 监听按钮点击事件
 */
function clickBtn(target,tree){
    target.addEventListener("click",function(e){
        /**
         * @param tree 树实例
         * @param btn 当前点击的按钮
         */
        (function (tree,btn){
            //如果当前点击的不是输入框和外层div
            if(btn != "ipt" && btn !="search" && btn != "orderBtn"){
                //清除正在执行的遍历过程
                if(btn == "stop"){
                    tree.clear("current")
                }else {
                    if(tree.timeOut){
                        var r = confirm("当前操作会停止正在执行的遍历或查找，确定吗？");
                        if(r){
                            //清除正在执行的遍历过程
                            tree.clear("current")
                        }else {
                            return false;
                        }
                    }
                }
                if(tree.searchResult.length > 0){
                    //清除正在执行的遍历过程，并还原select样式
                    tree.clear("current","search")
                }
                switch (btn){
                    case "searchBtn1":
                    case "preOrder":
                        tree.preOrder();
                        break;
                    case "searchBtn2":
                    case "inOrder":
                        tree.inOrder();
                        break;
                    case "searchBtn3":
                    case "postOrder":
                        tree.postOrder();
                        break;
                }
                switch (btn){
                    case "searchBtn1":
                    case "searchBtn2":
                    case "searchBtn3":
                    case "delete":
                    case "add":
                        if(btn == "delete"){
                            tree.delete();
                        }else{
                            (function () {
                                var iptValue = document.getElementById("ipt").value;
                                if(iptValue == ""){
                                    alert("请输入内容！")
                                }else {
                                    if(btn == "add"){
                                        tree.add(iptValue);
                                    }else {
                                        tree.show("current",iptValue,"search");
                                    }
                                }
                            })();
                        }
                        break;
                    default:
                        tree.show("current");
                }
            }
        })(tree, e.target.id)
    })
}
/**
 * 初始化函数
 */
function init(){
    var root = document.getElementById("treeRoot"),
        btnBox = document.getElementById("btn-search-wrap");
    //实例化一个Tree
    var  bst = new Tree(root);
    bst.selectEventListener("select");
    clickBtn(btnBox,bst);
}
init();


