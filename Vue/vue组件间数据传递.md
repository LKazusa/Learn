## 父向子传递数据
- 使用props
```html
<div id="div">
    //此时的a没有在props中注册，所以会在渲染后显示在行间
    <cmp :title="title" :content="content" a="title"></cmp>
</div>
<script>
    const cmp = {
        props:['title','content'],
        template : `<div>{{title}} {{content}}</div>`
    }
    const vm = new Vue({
        el:'#div',
        data:{
            content:'content',
            title:'title'
        },
        components:{
            cmp : cmp
        }
    })
</script>
```
props的另外的写法
```js
props:{
    title:{
        type:String,    //期望传值类型
        default:'this is default title'//默认值
    },
    content:{
        type:String,
        required:true   //必须传的值，不传则警告
    },
    arr:{
        type:Array,
        default:()=>[1,2,3] //对引用类型的默认值要放到函数中
    },
    num:{
        type:Number,
        validator:(value)=>value>20 //对数据校验，返回false警告
    }
}
```
- `this.$attrs`
    场景：父组件传值给子组件，子组件没有用到此数据，只传递给孙子组件，此时没有必要在子组件中注册此数据
    若是attrs中数据较多，可以直接v-bind="$attrs"
```html
<div id="div">
<cmp  :content="content" :arr='arr' a="title" :num="number"></cmp>
</div>
<script>
    const child = {
    props:['arr'],
    template:`<div>{{arr}}</div>`
}
const cmp = {
    props:['content'],
    template : `<div>{{content}}
            		<child :arr="$attrs.arr"></child>
        		</div>`,
    components:{
        child:child
    },
    inheritAttrs:false  //使得未被注册的属性不显示在行间
}
const vm = new Vue({
    el:'#div',
    data:{
        content:'content',
        arr:[1,2,3,4,5],
        number : 2
    },
    components:{
        cmp : cmp
    }
})
</script>
```

- `this.$parent`
  使用的较少，因为不美观，若嵌套过多则会使得代码冗长

    ```html
    <div id="div">
        <son :title="title"></son>
    </div>
    <script>
        const grandSon = {
            template:`<div>{{$parent.$parent.num}}</div>`
        }
        const son = {
            props:['title'],
            template:`<div>
                        {{title}}
                        <grand-son></grand-son>
                    </div>`,
            components:{
                grandSon:grandSon
            }
        }
        const vm = new Vue({
            el:'#div',
            data:{
                num:10,
                title:'title'
            },
            components:{
                son:son
            }
        })
    </script>
    ```

- provide 和 inject
    类似于局部的vuex，但是使用的也不多，因为若是嵌套过深，则会不知道数据是从哪一个组件传过来的
    ```html
    <div id="div">
        <son></son>
    </div>
    <script>
        const grandSon = {
            inject: ['content'],//接收数据
            template: `<div>{{content}}</div>`
        }
        const son = {
            inject: ['title'],//接收数据
            template: `<div>
                        {{title}}
                        <grand-son></grand-son>
                    </div>`,
            components:{
                grandSon:grandSon
            }
        }
        const vm = new Vue({
            el:'#div',
            provide:{   //发送数据
                title:'title',
                content:'content'
            },
            components:{
                son:son
            }
        })
    </script>
    ```

$children只有在mounted时才可以访问得到

## 子向父传递数据
- ref
  若是在父元素上使用ref属性，拿到的是dom元素
  若是在子元素上使用ref属性，拿到的是vue实例
  若多个dom使用同一个ref则会覆盖，但是通过v-for循环出来的会返回一个数组
  缺点：只可以拿到直接子元素的ref

  注意：如果在父组件中通过this.$refs取得子组件的值时，需要注意只有在挂在完毕后才可以取得子组件

  ```html
    <div id="test" ref='father'>
        <son ref='son'></son>
    </div>
    <script>
        const son = {
            data(){
                return {content:'this is son'} 
            },
            template:`<div>aa</div>`
        }
        const vm = new Vue({
            el:'#test',
            mounted(){
                console.log(this.$refs.son) //vue实例
                console.log(this.$refs.father) //dom元素
            },
            components:{
                son:son
            }
        })
  ```

- 使用`$children`
    使用方法同`$parent`,只不过要注意，此时的返回值是一个数组
    同样，官方也不推荐使用，并且用起来很繁琐

- 在子组件中调用父组件的方法进行传值
    - 通过prop,将父组件中的方法传到子组件中，进行调用
    ```html
    <div id="test" >
        <son :father-click="fatherClick"></son>
    </div>
    <script>
        const son = {
            data(){
                return {content:'this is son'} 
            },
            props:['fatherClick'],
            methods:{
                clickFunc(){
                    this.fatherClick(this.content)
                }
            },
            template:`<div>aa
                <button @click="clickFunc">click</button>
                </div>`
        }
        const vm = new Vue({
            el:'#test',
            components:{
                son:son
            },
            methods:{
                fatherClick(value){
                    console.log(value)
                }
            }
        })
    </script>
    ```
    - 通过`$listener`   被动监听
    可以收集到父组件向子组件上绑定的事件(包括自定义事件),然后在子组件内通过this.$listeners.xxx进行调用 
    ```html
    <div id="test">
        <son @like="fatherClick"></son>
    </div>
    <script>
        const son = {
            data(){
                return {content:'this is son'} 
            },
            mounted(){
                this.$listeners.like(this.content)
            },
            props:['fatherClick'],
            template:`<div>aa</div>`
        }
        const vm = new Vue({
            el:'#test',
            components:{
                son:son
            },
            methods:{
                fatherClick(value){
                    console.log(value)
                }
            }
        })
    </script>
    ```
    若是父组件给子组件传递多个事件，可以在子组件的template中v-on="this.$listeners"进行统一绑定，但是无法传参

- 通过this.$emit('event',arguments);  主动触发
  使用此函数时，传参：事件类型，相应的参数
  当这个这个语句被执行到的时候 就会将参数arg传递给父组件，父组件通过@event监听并接收参数。
## 组件间通讯
- event bus 事件总线
  两个子组件触发同一个vue实例的一个事件
    ```html
    <div id="test">
        <son1></son1>
        <son2></son2>
    </div>
    <script>
        Vue.prototype.bus = new Vue();
        const son1 = {
            data(){
                return {
                    count:1
                }
            },
            template:`<button @click="handleClick">click</button>`,
            methods:{
                handleClick(){
                    this.bus.$emit('like',++this.count)
                }
            }
        };
        const son2 = {
            template:`<div>{{message}}</div>`,
            data(){
                return {
                    message :0
                }
            },
            mounted(){
                let self = this;
                this.bus.$on('like',function(val){
                    self.message = val;
                })
            }
        }
        const vm = new Vue({
            el:'#test',
            components:{
                son1:son1,
                son2:son2
            }
        })
    </script>
    ```
    将Vue.prototype.bus设置为一个vue实例，然后子组件内发生变化时，去触发this.bus上面的事件。其他子组件去监听相应的事件就可以实现。发布订阅模式

  注意：在vue cli中使用vue bus需要先npm install vue-bus

  ​	然后Vue.use(bus)

  ​	在使用的时候使用$bus

- 使用vuex进行状态控制