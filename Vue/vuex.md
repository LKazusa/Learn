## Vuex
vuex是一个vue.js的状态管理模式  可用于子组件之间的数据交互
在文件夹中 vue add vuex
会生成一个store.js
通过store.state来获取状态对象
store.commit来触发状态变更 此时的状态变更时通过触发mutation来实现
由于store是响应式的，所以在组件中调用store的状态只需在计算属性中返回即可，触发变化也是组件中的methods中触发commit

- state
state:{
    person:{
        name:'xuege',
        age:20
    }
}
组件中从computed中访问this.$store.state属性来实现,因为若是使用data来获取的话，若是后期state改变了，data的值不会变
在页面中若想对多个state属性进行操作可以引用mapState辅助函数
import {mapState} from 'vuex';
...mapState(['name','age','sex'])  -->显示,相当于在computed计算属性中写出此三个函数
mapState返回的是一个对象，可以通过扩展运算符来混入到外部对象中

- getters
就像计算属性一样，getters的返回值会根据他的依赖被缓存起来，且只有当它的依赖值发生改变才会重新计算
getters:{
    person(state){
        return `name:${state.name} age:${state.age}`
    }
}
类似于计算属性
在组件中对于多个getters属性可以引用mapGetters
import {mapGetters} from 'vuex';
computed:{
    ...mapGetters:['person','animals']
}
可以使用别名通过对象
mapGetters:{
    myPerson:'person',
    myAnimals:'animals'
}

    -----再看
- mutatioin
由于vuex的理念是双向数据流，组件无法直接更改数据只能通过mutations来实现
    mutations:{
        changeList:(state){
            state.studentList.push({
                name:'xuege',
                age:'20'
            })
        }
    }
提交mutation用于组件更改vuex中的state状态
    组件中
        this.$store.commit('changeList',temp);  //temp是数据，即载荷，触发changeList，并传入temp
    store.js
        changList:(state,payload){      //payload是载荷,接收外界传来的参数，所有传来的参数都放其中，一般为对象
            state.studentList.push(payload)
        }
同时,mutations不可以写异步代码
提交mutation的另一种方式是包含type属性的对象
    this.$store.commit({
        type:'changeList',
        name:'xuege'
    })
    此时整个对象都传入到mutation的载荷之中
- 在组件中提交mutation
    - this.$store.commit('xxx');进行提交
    - 在methods中使用mapMutations将methods映射为store.commit调用
        methods : {
            ...mapMutations(['changeList']),
            ...mapMutations({
                change:'changeList'
            })
    }

- action
    类似mutation
    可以写异步
    提交的是 mutation，而不是直接变更状态。
    通常是实现异步commit
    actions:{
        changeList (context){ 接收一个和store实例具有相同方法和属性的实例
            context.commit('changeList')
        }
        changeList({state,commit}){   简化版
            commit('changeList')    
        }
    }
    action通过store.dispatch来触发,也支持同样的载荷和对象方式
    同样也可以使用mapActions辅助函数将methods映射为store.dispach调用
    -action的组合
    action可以返回一个promise,dispatch也可返回一个异步函数
    actions:{
        changeList01:({commit}){
            return new Promise((resolve,reject)=>{
                commit('mutation-changList')
                resolve();
            })
        },
        changList02:({commit,dispatch}){
            return dispatch('changList01').then(()=>{
                commit('');
            });
        }
    }
    store.dispatch('changeList01').then(()=>{
        ...
    })
    利用await/async组合
    actions: {
        async actionA ({ commit }) {
            commit('gotData', await getData())
        },
        async actionB ({ dispatch, commit }) {
            await dispatch('actionA') // 等待 actionA 完成
            commit('gotOtherData', await getOtherData())
        }
    }
    一个store.dispatch可以触发多个action，在此情况下，在所有的函数都执行完后，才会去执行返回的promise

- strict
严格模式一般只在开发阶段使用
strict : process.env_NODE_ENV !== 'production'

- modules
- 根据功能让vuex分出模块
- state会放入到每一个模块下，getters、mutations、actions会直接放入到全局

### 获取vuex中的数据（无namespaced）
- 获取state : this.$store.state.moduleName.xxx
- 获取getters： this.$store.getters.xxx
- 获取mutations： this.$store.commit('xxx')
- 获取actions： this.$store.dispatch('xxx')
- 可以通过mapXXX 方式拿到getters、mutations、action，但是不能拿到state，如果想通过这种方式获取state，需要加命名空间：namespaced：true

### 获取vuex中的数据（有namespaced）
- 获取state : this.$store.state.moduleName.xxx
- 获取getters： this.$store['moduleName/getters'].xxx
- 获取mutations： this.$store.commit('moduleName/xxx')
- 获取actions： this.$store.dispatch('moduleName/xxx')
- 可以通过mapXXX: mapXXX('moduleName', ['xxx'])  mapXXX('moduleName', {})
