使用vue cli脚手架
```html
    <template>
        <div>hello{{msg}}</div>
    </template>
    <script>
    export default {    //此script标签内的相当于components里面除了template之外的代码
        data(){
            return{
                msg:'world'
            }
        }
    }
    </script>
    <style>
        div{
            color: blueviolet; 
        }
    </style>
```
运行vue文件     cmd -> vue serve app.vue     若此时运行app.vue 或者App.vue则可以只写vue serve

安装vue脚手架
    命令行
        vue create app_name
    图形化
        vue ui  
    代码
        vue
    js中引入包文件：若是直接写文件名则是从node_modules 里面，若是写路径则是相对路径
    可以使用jsx语法,一般在render函数中
    创建预设
    create vue

vue cli配置
打包vue文件
    cmd -> npm run build
    在dist文件夹内创建vue.config.js文件
    modult.exports = {
        productionSourceMap:false ,      取消生成map文件，map文件作用是帮助调bug
        outputDist:'./myDir',           设置生成输出目录
        publcPath: process.env.NODE_ENV=='production' ? 'https://www/baidu.com' : '/',设置文件根路径
        assetsDir:'assets'  在myDir下创建assets存放静态文件
        chainWebpack: config=>{
            config.resolve.alias.set('_v',path.resolve(__dirname,"src/views"))          将src/views取别名_v   需先require path
        },
        configureWebpack:{
            plugin:[],
            module:{},
        }
    }
vue add style-resource-loader
会在vue.config.js中添加
pluginOptions:{
    'style-resource-loader':{
        preProcessor':'less',
        patterns:[]
    }
}
当进入首页时，会对所有组件进行预加载，在跳入其他view组件时才会发生懒加载