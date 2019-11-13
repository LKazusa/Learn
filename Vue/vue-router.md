命令行 vue add router
    提示是否选择是否使用历史模式
    历史模式：包含hash和history
    一般使用history模式，在Router实例中写mode:'history'
router.js
    import Vue from 'vue'
    import Router from 'vue-router'
    import Home from './view/Home.vue'
    Vue.use(Router);                     //必须有这一步，引入了$router $route
    export dafault new Router({
        mode:'history',
        routes:[
            {
                path:'/home',
                name:'home',            //可写可不写
                component:Home          //加载使用的插件
            },
            {
                path:'/about',
                name:'abour',
                component:()=>import('./view/About.vue'),
                children:[
                    {},{}
                ]
            },
            {
                path:'*',   //当当前的地址不存在于上面任何一个地址时，执行
                redirect(to){
                    if(to.path == '/'){
                        return '/home';
                    }else {
                        return '/notFound';
                }
            }
        ]
    })
在component中执行import引入组件是为了懒加载，要注意首屏加载时间

    router-link标签 跳转    当点击此标签时，vue会默认赋予router-link-exact-active的class
    router-view标签  显示   放置路由的页面
子路由
    使用children
页面级组件放到view中,其他的组件放到component
class
    router-link-active  当地址栏含有时，本元素就包含此class
    router-link-exact-active    当地址栏的最后一个是，则本元素包含此class
$router
    this.$router.push()     将此地址推入到地址栈中
                            此时若是传入的参数含有path的话，会忽略params参数
    this.$router.replace('')    将此地址替代当前地址放入地址栈中
    this.$router.go(-1)      将本页面向后退一步
动态路由
    /question/id:xxx 
    to="{ name:'question',params:{id:1} }"    路由跳转后携带信息
        若是在router.js中写 path:'/question' 信息不会放到地址栏中
    在question页面中可以通过this.$route.params来获取数据
    query:{}    也可，调用this.$route.query获取，不过在地址栏中是?id=xxx
使用props进行传参解耦
    router.js
        {
            path:'/main/:a',
            name:'main',
            props:true,
            component:()=>import('')
        }
    main.vue
        props:['a']
    另一种形式
    router.js
        {
            path:'/main',
            name:'name',
            compononet:()=>import(),
            props: (route)=>({a:route.params.a})
        }

## 组件守卫
### 组件内守卫
- beforeRouteLeave(to,from,next){}
- beforeRouteEnter(to,from,next){}
- beforeRouterUpdate(to,from,next){} 当前路由下，子路由发生变化触发  可以和mounted配合使用，在mounted中获取数据，在此函数中进行
### 路由独享守卫
- beforeEnter(to, from, next){}  只可守卫一个路由
{
    path:'/home',
    name:'home',
    component:()=>import(),
    beforeEnter(to,from,next){
        next()
    }
}
### 全局守卫
- 在main.js中
router.beforeEach((to, from, next)=>{
    next()
})
router.beforeResolve((to,from ,next)=>{  路由加载完毕执行
    next()
})
router.afterEach(()=>{})
### 进入新的路由后触发顺序
- 全局守卫  路由独享守卫  组件内守卫
- beforeEach -> brforeEnter -> beforeRouteEnter -> beforeResolve -> afterEach
另：next('/login')跳转到login页面
### 完整的导航解析流程
- 导航被触发。
- 在失活的组件里调用离开守卫。
- 调用全局的 beforeEach 守卫。
- 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
- 在路由配置里调用 beforeEnter。
- 解析异步路由组件。
- 在被激活的组件里调用 beforeRouteEnter。
- 调用全局的 beforeResolve 守卫 (2.5+)。
- 导航被确认。
- 调用全局的 afterEach 钩子。
- 触发 DOM 更新。
- 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。
### 路由源信息
定义路由的时候可以设置meta属性
路径中@可以代表src