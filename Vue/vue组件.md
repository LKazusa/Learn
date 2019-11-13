## vue组件
- 全局组件
    ```js
    Vue.component('myCmp',{
        data:function(){
            return {data:1}
        }
        template:`<div>{{data}}</div>`
    })
    ```
- 局部组件
    ```js
    new Vue({
        el:'#id',
        components:{
            'myCmp':{
                data:function(){
                    return {data:1}
                },
                template:`<div>{{data}}</div>`
            }
        }
    })
    ```
像这些元素`<ul>，<ol>，<table>，<select>`限制了能被它包裹的元素，而一些像<option> 这样的元素只能出现在某些其它元素内部。此时可以使用元素的is属性解决
注意：有时我们会将组件封装在全局
```html
<div id="div">
    <ul>
        <li is="firstDemo"></li>
    </ul>    
<div>
<script>
    const firstDemo = {
        data:function(){
            return { name:'xx'}
        },
        template:`<div>{{name}}</div>`
    }
    const vm = new Vue({
        el: '#main',
        components: {
            firstDemo:firstDemo
        }
    });
</script>
```