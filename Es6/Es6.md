es6
    
babel插件
    npm install @babel/core     将es6翻译成抽象语法树，babel的核心
    npm install @babel/preset-env   插件集合，依赖于core
    npm install @babel/cli      脚手架
    建立.babelrc文件，严格遵循json      {"presets" : ["@babel/preset-env"]}
    使用
        npx babel index.js -o new.js -watch     转换随时监听

let
    形成临时死区
        let a = 10;
        {
            console.log(a);     报错，let实现临时死区，强绑定为本块级作用域的a
            let a = 20;
            {
                console.log(a);     20
            }
        }
    不会挂载到window上
    不能重复定义
        function a (x,y){
            let x = 10;     报错,说明在形参实参统一的时候产生 var x = 5
        }
        a(5,5)
    另: for(let i = 0; i <5; i++){
            setTimeOut(function () {
                console.log(i)  输出 0 1 2 3 4 
            },0)
        }
const
    存储常量的空间里面的值不可以发生改变
        const a = {};
        a.name = 'xuege';       可以修改
        a = 10;                 不可修改
    其余同let
能使用const,就使用const,不行再用let，完全抛弃var

扩展运算符
    读操作  ...[1,2,3]  ->  1,2,3
    写操作  1,2,3  ->  ...[1,2,3]
    ES6可以处理数组 ES7可以处理对象
    对于对象，只能深克隆第一层，第二层及以后为浅克隆
    若是多个对象同时使用相同对象扩展运算符添加属性,则这些对象浅克隆同一个对象,独立于被添加对象
        解决：
            在添加属性时嵌套一层obj,此时同样深克隆第一层
    若是对象嵌套很深的话
    可以使用JSON.parse(JSON.stringify(obj)) 但注意此时的对象中不可以含有函数，正则或者特殊对象，例如date
    Object.assign()类似jQuery的$.extend()
        例: Object.assign({},a,b,c);
            将a b c按照顺序依次克隆进{} 中,为浅克隆,若是有相同key的话,按照c中对应value,修改也修改c中的属性
解构赋值
    数组的结构赋值
        let arr = [1,2,3];
        let [x, y, z] = arr;

Object.defineProperty(obj,key,{
    value:'xuege',          值
    writable : false,       可写
    configurable : true,    可通过delete删除
    enumerable:true,        可for in的
    get: function() {
        取值时触发
    },
    set: function(value){
        存值时触发
    }
    注意：value和writable 不可以和get set同时设置
})
双向数据绑定的核心方法，主要做数据劫持(监控属性变化)
例：想单独设置name的存储信息
    let obj = {
        tempValue:'xuege',
        get name (){
            return this.tempValue
        },
        set name (newValue) {
            this.tempValue = newValue;
        }
    }

class
    私有属性(this.name)，公有属性(原型属性 Fun.prototype.init)，静态属性(函数属性 Fun.name)
    class Test {
        constructor () {
            this.name = 'xuege'  // 实例属性
        }
        static alive () {
            return true;   //静态属性，只能通过本函数调用
        }
        func () {
            console.log('ok')    //原型属性
        }
    }
    class 的原型属性和静态属性不可枚举
    es6中不支持非方法的静态属性
        es7可以写 static name = 10;
        es6可以写 static name () {return 10}
    在class内部调用new.target返回此类，可以用于确保构造函数只能通过new调用。同时在子类继承父类的时候不会继承此属性，运用此属性可以写出必须通过继承后才能使用的类
    实现私有属性：
        因为通过 Symbol 作为属性名的属性，在常规的属性遍历和获取方法中，并不能够查询到。但要注意使用此方法声明私有方法的时候，调用要用方括号
    ES7新特性:
        静态属性 :static name = 10;  === static name () { return 10}
        私有属性 :name = 10;  ===  constructor > this.name = 10
        装饰器 : @decorator
                url = 10        对url进行装饰
        class外    function decorator (proto, key,dicriptor ){
                        proto   原型
                        key     属性名
                        discriptor 属性修饰
                    const oldValue = discriptor.value;
                    当修饰私有属性的时候 discriptor.value
                    当修饰公有属性的时候 discriptor.initializer()
                    ...添加功能
                    return oldValue.apply(this,arguments);
                } 
                在不改变原有代码的前提下新增功能 
                意义：装饰比继承要灵活，避免了继承体系的臃肿，继承的耦合度太高，尤其是继承层数过多
                注意：在定义时就会执行
        Es7的语法必须通过babel转码后才可使用，需额外下载@babel/plugin-proposal-class-properties,并额外配置.babelrc

Set
    只有属性值，没有属性名。自动去重
    传入string的时候会将其拆分
    set.add()       添加
    set.delete()    删除
    set.has()       是否存在
    set.clear()     清空
    遍历：可通过forEach(value => {}) 和 for of
    set --> array   [...set] || Array.from(set) 扩展运算符和Array.from()的遍历原理是因为含有迭代接口
    array --> set   new Set(array)
    取交集 
        new Set(...arr1,...arr2)
    取交集
        let newArr = [...set1].filter( ele => set2.has(ele) )
    取差集
        let newArr1 = [...set1].filter( ele => !set2.has(ele) )
        let newArr2 = [...set2].filter( ele => !set1.has(ele) )
        let newArr = [...newArr1, ..newArr2]

Map
    传入二维数组，其中的一维数组的第0项为key，第1项为value
    适用于:对于key值为对象或者数组等的值,因为若是直接存入对象中,key值会默认调用toString
    map.set(key,value)
    map.get(key)
    map.delete(key)
    map.has(key)
    map.keys()
    遍历 forEach && for...of
    底层通过桶和链表实现，先通过数组设置好一个固定长度的“桶”，将存入的数据通过hash算法转化为一个桶内固定范围的值，此时对应的桶内空间存在一个next指针指向一个对象，此对象含有key,value,next并且此时next为null，若是又存入数据并且转化为相同的值，则将next为null改为指向此对象，此对象的next为null
    使用hash算法的原因：
        避免某一个链表过长影响查找效率

Promise 
    .then解决了try catch无法捕获异步任务的问题
    Promise.all()实现了同步并发操作异步任务
        接收一个promise数组，若成功返回一个结果数组，若失败则返回第一个失败的数据
    Promise.race()同样接收一个promise数组
        返回最先得到数据的promise的结果，无论失败或者成功
    另外，promise还可以
        let op = Promise.reject('error').then(...) 通过静态方法进行调用
捕获异步错误：
    可以通过window.onerror = function (err) {
                console.log(err)
            }事件来捕获
    可以通过process.on('uncaughtException',err =>{
                console.log(err)
            })捕获
ES6支持变量作为对象的属性名
宏任务              微任务 
task queue1        task queue2
宏任务优先放到队列中去,微任务有优先执行权
.then() 是微任务
setTimeout是宏任务

Generator
    调用.next() 返回对象，含有value和done
    yield语句的返回值是next的参数
    蛇形运行
        let a = yield('a')  调用next只会执行到 yield('a') ，再次调用next才会执行赋值语句

iterator迭代器
    出现原因：
        当需求发生改变的时候，出入的数据不是数组而是对象或者set，map，此时的代码可能就需要大范围调整
    目的：
        标准化迭代操作

async
    Generator语法糖,经babel编译后是Generator+promise+co思想实现，配合await使用
作业：async实现promiseAll

es6模块化
    在引入模块的时候要写后缀
    别名通过as 关键字
        import {a as b} from './index.js'
    模块引入是在编译阶段执行
    多次引入一个模块只会执行一次，但是多次引入模块的变量则会报错
    引入变量是动态的，模块中的变量进行改变的时候，引入的变量也会进行改变
    而require.js中的引入变量是静态的，不会改变

获取key值
    Es5
    Object.keys(k);
    Es6
    Object.getOwnPropertyNames(obj);
