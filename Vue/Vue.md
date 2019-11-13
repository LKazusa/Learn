虚拟dom的实现
    基于JavaScript实现的，主要还是保留了Element之间的层次关系和一些基本属性。你给我一个数据，我根据这个数据生成一个全新的virtual dom，然后和我上一次生成的virtual dom去diff，然后得到一个patch，然后把这个patch打到浏览器的dom上去

vue数据双向绑定
    通过数据劫持结合发布者-订阅者模式
    1.实现一个监听器Observer，数据监听器的核心方法就是Object.defineProperty(),用来劫持并监听所有属性，如果有变动则通知订阅者
    2.实现一个订阅者Watcher，每一个Watcher都绑定一个更新函数，watcher可以接受到属性的变化通知并执行相应的函数，从而更新视图
    3.实现一个解析器Compile，可以扫描解析每一个节点的相关指令（v-model，v-on等），如果节点存在v-model，v-on等指令，则解析器会初始化这类节点的模板数据，是指可以显示在视图上，然后初始化相应的订阅者

使用snabbdom.js来操作虚拟dom
当原值和现值相同时不渲染页面
{{}}插值表达式
    在{{}}中不可以使用if ，但可以使用三元表达式
    在更改数据的时候，需要先存在此数据才能实现数据绑定
    通过索引操作数组无法实现数据绑定，改变数组长度也无法实现数据绑定。通过push等api改变数组可以实现数据绑定。因为vue是通过数据劫持的方式来实现数据绑定，在vue中实现数组变异方法：push pop shift unshift sort reverse splice
$set(obj, key, value) 改变数据并渲染到视图上
vue.$el 获取当前数据渲染节点
由于vue会优化性能，会将需要渲染的数据放到异步队列中去，所以无法在修改数据之后去console.log(vue.$el.innerText)
vue.$nextTick(()=>{
    在页面渲染完成执行
})
vue.$mount('') 将数据挂载到某个节点上 ， 和el功能相同

## Vue指令

- v-pre   当前元素不使用vue语法进行渲染，即不使用{{}}
- v-cloak 页面渲染完成后删除v-cloak
        用处：由于我们的页面是先加载后进行vue渲染，所以中间会有一个空档期，使得页面上都是{{}}，所以此时可以在css中写
        [v-cloak]{display : none} 可以消除此空档期的出现
```html
    <div id="test" v-cloak>
       {{content}}
    </div>
```
```css
    [v-cloak]{
            display: none;
        }
```
- v-once  只使用第一次渲染的数据
- v-html  == innerHTML 将数据渲染成html 此时不用写{{}}  注意：此时要注意xss攻击，使用的值必须可靠
- v-text  == innerText 将数据进行text渲染  当使用v-text的时候，元素中的其他数据都不再渲染
```html
<div id="test" v-cloak>
    <div v-html='htmlContent'></div>
    <div v-text='textContent'></div>
    <div v-pre><div>{{content}}</div></div>
</div>
```
- v-if  控制元素显示和隐藏 eg: v-if="flag"
        当多个元素使用同一个flag的时候，可以使用template标签控制显示隐藏，此标签在渲染结束后就消失
        既可以减少判断，又可以减少dom元素添加
```html
    <template v-if='flag'>
        <div>aaa</div>
        <div>bbb</div>
    </template>
```

- v-else  和v-if中不可插入其他元素  v-else-if      else if

- v-show  只是设置display='none' v-if则是将元素设置为注释
          另外：v-show不支持template
- v-bind  当dom的属性想要使用数据的时候可以实现绑定
        `<img v-bind:src="imgUrl">`
        此时就可以在引号中使用{{}}的语法
        简写：`<img :src="imgUrl">`
        class属性
            :class="[red,blue]" 添加多个class
            :class="{red:flag,blue:falg}" 使用flag控制class的添加
            :class="[flag&&red,flag&&blue]"
            注意：class只是控制是否添加，不能通过此方法进行删除
        style属性
            需要使用对象
            :style="{width:domWidth,height:'100px'}"
            使用多个
            :style:"[style01,style02]"
            另外:style权重高于style
- v-on  绑定事件
        v-on:click="clickFunc('a')" 此时clickFunc应写在methods里面
        简写  @click="clickFunc('a')"
        在methods中一般不写箭头函数，否则this会指向window
        $event  事件源对象，传参时可写
- v-for   <div v-for="(item, index) in arr" :key="">
        注意index最好不要作为key值
        因为v-for的原理是根据key值找元素，如果数据改变后再次对页面进行渲染时，会根据key值查看元素，尽可能的多去复用
        如果将index设置为key值的话，若进行reverse或者改变其他index的操作的话，会减少复用
        适用范围：数组，对象，数字，字符串
        <div v-for="(key,value) in obj" :key="key">
        另：若想同时渲染多个元素，可以使用template，但要注意key值只能设置在最终可以显示的元素上
        <template v-for="(item,index)">
            <div :key=`${key}_1`>{{value}}</div> //注意要将key值分开，不能存在相同的key
            <div :key=`${key}_2`>{{value}}</div>
        </template>
        key值妙用：
            当使用v-if实现多个元素的出现删除时，其中包含input，则会为了复用只使用同一个input，此时可以使用key值来解决
- v-model 实现数据的双向绑定，可以将页面中的数据传送到data中，一般用于input，textarea和select
        当在多选时，可以写在数组中
- v-slot  插槽
        我们在自定义组件中写的数据无法渲染到页面中，因为页面进行渲染时，当看到此标签为自定义标签时，就会直接去找template。
        但是可以使用slot解决
```html
        <div id="test">
        <cmp>
            <div slot="header">header</div>
            <div slot="footer">footer</div>
        </cmp>
    </div>
    <script>
        const cmp = {
            mounted(){
                console.log(this.$slots)
            },
            template:`<div><slot name='header'></slot>
                <slot name='footer'></slot> </div>`
        }
        const vm = new Vue({
            el:'#test',
            components:{
                cmp:cmp
            }
        })
    </script>
```

注意，只能使用template来调用v-slot属性
简写 #cmp   ===  v-slot="cmp"

自定义指令
    全局    所有vue实例都可使用
    局部    当前vue实例可使用
    - 全局指令
    Vue.directive('name',(el,bindings,vnode)=>{
        el  绑定的元素
        bindings  修饰符，传参等信息
        vnode   主要vnode.context拿到vue实例
        ...
    })
    Vue.directive('name',{
        bind(el, bindings, vnode){
            在绑定时执行，只执行一次
        },
        update(el, bindings, vnode){
            在数据重新渲染时执行
        },
        insered(el, bindings, vnode){
            在节点插入页面后触发，可实现刷新页面聚焦焦点
        }
    })
    - 局部指令
        写在vue实例内
        new Vue({
            directive:{
                slice ()=>{
                    ...同全局
                },
                slice: {
                    ...同全局
                }
            }
        })

修饰符：@keyup:enter
        修改： Vue.config
        v-model.lazy    当页面不用边输入边进行数据绑定时可以使用
        v-model.number  当数据为纯数字时，传输到data中为number，否则为string
        v-model.trim    消除前后空格

过滤器：filter
    {{money | toMoney}}
    Vue.filter('toMoney',value=>{
        return ...
    })
    过滤器不会改变数据，只会改变展示形式
    另外，函数的第一个参数必为value，若对其传参，则往后排
    局部过滤器
        new Vue({
            filters : {
                toMoney : value =>{}
            }
        })

挂载流程
    先根据el寻找节点
        若存在template，则根据template生成抽象语法树，然后对抽象语法树进行渲染，生成虚拟dom，然后根据虚拟dom生成真实dom，最终替换掉原节点
        若不存在template，则根据此节点(el.outerHTML)作为模板生成一个抽象语法树

render  当使用render函数时，会替代挂载流程中的render
        使用场景：动态添加dom
```js
    new Vue({
        render(createElement){
            return createElement('h1',{     //创建h1
                class:'haha',               //设置dom属性
                style:{
                    color:'red',
                    fontSize:'20px'
                }
            },[                             //设置子元素
                '我是一个h1标题',
                createElement('p','我是一个p标签')
            ])
        }
    })
```
    可以使用jsx语法简化 ，jsx语法中{}写js语法，<>写dom语法
```js
    render(createElement){
        const tag = 'div';
        return (
        <tag 
            class=""
            style={{color:'red'}}
            on-click={()=>{console.log('---')}}>
            this is a div
        </tag>)
    }
```
    但jsx语法需要进行处理

## vue生命周期
```
new Vue()
    |  处理事件的方法，以及lifecycle
beforeCreate()
    |  注入依赖data,methods,computed等
created()
    | 是否传入el ? continue : 等待vm.$mount(el)执行
    | 是否传入template ? 根据template来实现抽象语法树: 根据el的外层html来生成抽象语法树
beforeMount()
    | 将vm生成的dom来替换掉el的dom
mounted()
    | 调用vm.$destory(),比如router跳转
beforeDestory()
    | 卸载事件监听和子组件
destoryed()

beforeUpdate()
    | 虚拟dom的再次生成和渲染
updated()
```
watch和computed都是以Vue的依赖追踪机制为基础
两者语义不同，watch是观察，当观察的对象发生变化后需要进行操作。computed是计算，通过变量计算得出数据
watch善于处理一个数据影响多个数据
computed善于处理一个数据受多个数据影响
计算属性
    当一个数据属性在他所依赖的属性发生变化时，也要发生变化。同时设置getter和setter方法
    执行的时候相当于取缓存，只要计算属性的依赖没有改变就会取缓存，性能比methods好
    computed:{
        person(){
            return this.name  当name值改变时，触发此函数
        }
    }
    另外写法
    computed:{
        person:{
            get(){
                ...  相当于直接执行person函数
            },
            set(){
                ...
            }
        }
    }
    数据查找过程：data => methods => computed
侦听器
    watch的变量需要先从data中声明
    如果要在数据变化的同时进行异步操作或者是比较大的开销，那么watch为最佳选择
    watch:{
        name(newVal){}  当name值改变后触发函数，在函数内可以使用this.name
    }
    watch:{
        name:{
            handler(newVal){
                ...
            },
            immediate:true      此值设置为true时，handler函数会在页面首次渲染时执行
        }
    }
    在vue实例外
    mv.$watch('name',()=>{
        ...
    },{
        immediate:true
    })

组件间的双向通信
    单向数据流：
        vue中不建议子组件拿到父组件的值后不断修改，因为此时的数据是引用，可以通过JSON.stringigy使之变成自己的
    在子组件内改变数据并返回到父组件内：
        可以在子组件内通过触发$emit(event,val)，然后在父组件行间内触发@event
        简化
        :str + @input = v-model     此时不需要再父组件中对数据进行处理，v-model内部已经进行了数据传输
        :str + @input = :str.sync  此时绑定的event为 update:str
        