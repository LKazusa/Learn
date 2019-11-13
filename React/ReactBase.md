# React
和Vue不同的是，React是一个js代码库，而非框架，也就说明了React更加灵活，可以和jQuery兼容，更加适合大型项目

## 页面引入React
```html
    <!--引入react核心代码-->
    <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <!--引入react-dom代码-->
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <!--解析jsx-->
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    <script type='text/babel'></script>
```

## React创建元素
### 原理
React.createElement();  注意，此时创建的是React对象
参数1:dom type
参数2 Object: dom props
参数3~: children dom 可以为React对象
```js
    const test = React.createElement('div',{
        id:'test'
    },'hello world');
```
### jsx
需要babel进行转义,并且需要在script标签写type='text/babel'
```js
    const test = <div id='test'>hello world</div>
```
要注意，在React对象根节点必须为一个元素，若是想渲染多个元素，可以
```js
    //注意，此时是在react架子中
    const test = <><div>node1</div><div>node2</div></>
```
这是`<React Fragment>` 的语法糖,类似vue中的template标签
- 在jsx中嵌入表达式
    ```js
        let a = 10;
        const text = <div>{a}</div>
        //底层是通过模板字符串进行实现
    ```
    - 使用{},但是注意若是{}内的结果是null  undefined  false  时，则不会渲染到页面中
    - 元素属性值可以以使用{},属性使用小驼峰
    - 防止注入攻击
        - 表达式渲染到页面上时，默认为字符串
        - 若想将其渲染的话,使用dangerouslySetInnerHTML
        ```js
        const content = '<div>content</div>';
        const test =<div dangerouslySetInnerHTML={{
                    __html:content
                }}></div>;
        ```
- 元素的不可变性
    React元素一旦创建，相当于调用Object.freeze()
    若想动态渲染，则需要重新建立React对象，并且重新渲染

## React渲染元素
ReactDOM.render();    将React对象渲染到页面
参数1:被渲染的React对象或者dom
参数2:渲染到的dom
```js
    ReactDOM.render(test,document.getElementById('root'));
```

#### 搭架子
`yarn create react-app appname`

## 组件
- 函数组件
  函数返回一个React实例,或者jsx
 ```js
    function DomCmp(){
        return <div>cmp</div>
    }
    ReactDOM.render(<DomCmp />, document.getElementById('root'))
 ```
	- 函数的首字母必须大写，因为若是小写的话，html则会认为是原生标签
	- 与普通的React对象的差别只有type值不同
	- 在组件文件中要导入React


- 类组件
```js
//ClassCmp.js
    import React from 'react'

    export default class ClassCmp extends React.Component {
        render(){
            return <div>class cmp</div>
        }
    }
```
必须引用React.Component
必须使用render函数

- 组件传值
**注意：在React中，数据流动讲究从谁发出数据，谁就有权利修改数据**
```js
//函数组件
//index.js
    import FuncCmp from './cmp.js';
    ReactDOM.render(<div>
        <FuncCmp name='cmp' age={10} obj={{a:10}} />
    </div>, document.getElementById('root'));

//cmp.js
    export default function (props){
        console.log(props)  //{name:'cmp',age:10,obj:{a:10}}
        return <div></div>
    }

//class组件
//index.js
    import ClassCmp from './cmp.js';
    ReactDOM.render(<div>
        <ClassCmp name='cmp' age={10} obj:{{a:10}}/>
    </div>,document.getElementById('root'))

//cmp.js
    export default class ClassCmp extends React.Component{
        construtor(props){
            super(props) //相当于在父组件调用this.props = props
            console.log(props)
        }
        render(){
            return <div>classCmp</div>
        }
    }
    
```
- 组件状态
    - 由于在React中，讲求数据的发起者才可以改变数据，所以大部分组件只适用于显示数据。
        但是在某些情况下，组件可以自行维护某些数据，称为组件状态(state)，是类组件的一个属性，是一个对象
    - 由于是组件自身创建，所以组件有权利自行更改
    **类组件**
    ```js
        export default class extends React.Component {
            //初始化状态state，方法一
            this.state = {//此时执行是在super之后
                number:props.number
            }
            constructor(props){
                super(props);
                //初始化状态state,方法二
                this.state = {
                   number : props.number
                }
            }
            setInterVal(function(){
                //修改state必须通过this.setState
                //因为React无法监控到状态的改变
                //this.setState使用的是Object.assign的mixin特性
                //this.setSate会在React中调用render函数，自行调用无效
                this.setState({
                    number:++this.state.number
                });
            },1000)
            render(){
                return<div>this.state.number</div>
            }
        }
    ```
    - **函数组件**需要使用hook
- 事件
    在React中，组件的事件就是一个函数
    在React中大部分的事件都被绑定到document上，并且事件参数e并不是原生的，而是经过包装后的

```js
export default class Event extends React.Component {
    clickFun = (e) => {
        console.log(e.target)
    }
    constructor(props){
        super(props);
    }
    render(){
        return <button onClick={this.clickFun}>click</button>
    }
}
```
自定义事件就是传参,注意：往自定义组件传的都是自定义事件，React本身并没有做出处理
若想实现比如点击事件的话，需要在组件内部调用props里的自定义事件
```js
//index.js
const likeFunc = ()=>console.log('like');
ReactDOM.render(<Event/>,document.getElementById('root'));
//Event.js
export default class Event extends React.Component {
    constructor(props) {
        super(props);
        setTimeout(() => {
            this.props.onLike()
        }, 2000)
    }
    render() {
        return <div></div>
    }
}
```
关于使用类组件时，this指向
```js
export default class Event extends React.Component {
    constructor(props) {
        super(props);
        this.props.onLike.bind(this);//解决方法一:使用bind
    }
    test() {
        //因为在调用的时候，相当于调用this.props.test,所以react自动将this转为undefined
        console.log(this)  //此时为undefined
    }
    test = ()=>{            //解决方法二:使用箭头函数
        this.props.onLike();
    }
    render() {
        return <button onClick={this.test}>click</button>
    }
}
```

### 关于setState
```js
//在事件处理函数中，是异步的，在其他情况下，是同步的
export default class Cmp extends Component {
    state  = {
        n:1
    }
    clickFunc = () =>{
        this.setState({
            n:this.state.n + 1
        },()=>{//此时写回调函数
            console.log(this.state.n)
        })
    }
    render() {
        return (
            <button onClick={this.clickFunc}>click</button>
        )
    }
}
//当遇到需要多次同步调用setState的时候
//使用函数形式
export default class Cmp extends Component {
    state  = {
        n:1
    }
    clickFunc = () =>{
        this.setState(state=>{//此时的cur代表当前的state状态
            //在实现上是通过队列进行实现，当前一个完成，才会执行后一个
            //也是异步的，也可以使用回调函数
            //返回结果覆盖之前的state
            return {
                n:state.n + 1
            }
        },()=>{ //回调函数，此函数是在所有setState和render执行完毕后执行
            console.log(this.state.n)
        });
        this.setState(cur=>({n:cur.n+1}));
        this.setState(cur=>({n:cur.n+1}),()=>console.log(this.state.n));
    }
    render() {
        return (
            <button onClick={this.clickFunc}>click</button>
        )
    }
}
```

1. 永远不要信任setState之后的状态
2. 将所有setState当做异步
3. 要使用setState之后的状态，可以使用回调函数
4. 要是setState依赖于之前的state状态的话，需要使用函数形式

React会对**异步**的setState进行优化，将所有执行完毕后，再执行render

## 生命周期
旧版 <16.0.0
1. construtor
只会执行一次，并且严禁在constructor中使用setState
2. componentWillMount
构造函数完成之后，接着执行componentWillMount()  即将挂载，正常情况下只会执行一次
可以使用setState，但是为了避免bug，不建议使用，因为componentWillChange可能会执行多次
    1. 在还未挂载阶段，可能会被打断，重新来一遍
    2. 服务端渲染ssr，服务端运行一次，客户端运行一次 
3. **render**
返回一个虚拟DOM，将其挂载到虚拟DOM树中
只要需要重新渲染，就会触发
严禁使用setState，会导致无限递归渲染
4. **componentDIdMount**
渲染完成，只会执行一次
可以使用setState
通常会将ajax，启动计时器等写在此处
5. 组件进入活跃状态
6. componentWillReceiveProps
即将接收新的属性值
参数为属性对象
可能会导致bug，不推荐使用
7. **shouldComponentUpdate(nextProps,nextState)**
指示React是否要重新渲染组件，通过返回true or false，默认true
此时的this.props和this.state都是旧的nextProps和nextState是新的，可以用于性能优化处理
8. componentWillUpdate
组件即将被重新渲染   鸡肋
9. componentDidUpdate(prevProps,prevState)
组件已经被重新渲染，此时一般用来使用dom操作，改变元素
10. **componentWillUnMount**
组件被销毁，从虚拟DOM树中移除
通常在此函数中消除一些组件依赖的资源，比如计时器

新版 >=16.0.0
getSnapshotBeforeUpdate
此时真实dom已经构建完成，但还未加入到页面中去，此时可以使用ref进行一些附加dom操作
该函数的

### 自定义组件
当自定义组件写成双标签时，中间的内容会传给子组件props.children

## 表单组件

受控组件：组件的使用者完全有能力控制组件的行为和内容，通常情况下组件没有自己的状态，内容完全受到属性的控制
非受控组件：组件的使用者没有能力控制组件的行为和内容，组件的行为和内容完全受自己控制

表单组件默认情况下是非受控组件，一旦设置了value属性，则变为受控组件，即会渲染出只读效果，此时需要添加onChange事件来监听,可以将value的值写为state里的值，并且在onChange的时候是可以通过e.target.value拿到数据
可以使用defaultValue

### 属性默认值
函数组件
```js
    //静态属性
    functionName.defaultProps = {
        ...
    }
```
类组件
```js
    //静态属性, 在调用构造函数之前就已经调用
    static defaultProps = {
        ...
    }
```
### 属性的类型检查
使用库```prop-types```
对组件使用静态属性propTypes告知react如何检查属性
```js
    //类
    static propTypes = {
        a:PropTypes.number,   //a属性必须为数字类型，否则报警告
        b:PropTypes.string.isRequired   //b属性必须为数字，并且必填   
        //设置非空验证后，若是传值为undefined或null，则会认为没有传值
    }
    //函数
    FuncName.propTypes = {
        
    }
```
## 高阶组件
函数接收一个组件，返回一个组件，此时返回的组件无论是函数组件还是类组件都可以
可以实现参数的层层传递
可以用于功能的增强，组件的重用
注意：
1. 不要在render中使用高阶组件，因为会降低效率，并且在重新渲染的时候，丢失掉以前的组件状态
2. 不要在函数中更改传入的组件的内部东西，因为会导致混乱

## ref
直接使用dom元素中的某个方法，或者自定义组件的某个方法
this.refs.xxx
在dom元素中填写 ref='xxx'
场景:
1. ref作用于内置html，得到真实dom对象
2. ref作用于类组件，得到类的实例
3. ref无法作用于函数组件
另外：
ref不再推荐字符串赋值，以后可能会被移除
推荐使用对象或者函数
**对象**
通过React.createRef 函数创建，返回一个包含current属性的对象，current即为dom
```js
export default class index extends Component {
    constructor(){
        super();
        this.test = React.createRef();
        //this.test = { 这种方法也可
        //    current:null
        //}
    }
    change=()=>{
        console.log( this.test.current)
    }
    render() {
        return (
            <div>
                <input type="text" ref={this.test}/>
                <button onClick={this.change}>click</button>
            </div>
        )
    }
}
```
**函数**
1. 在componentDidMount的时候会调用函数，此时就可取到dom
2. 在ref发生变动时，比如说重新渲染，此时旧的函数会替代新的函数，并且此时会在componentDidUpdate之前调用一次旧的函数，在调用一次新的函数，此时旧的函数传参null。可以将函数保存ref之外进行解决
3. 如果ref所在的组件被卸载，会调用函数，并传入null
```js
export default class index extends Component {
    change=()=>{
        console.log( this.test)
    }
    render() {
        return (
            <div>
                <input type="text" ref={ e => {
                    this.test = e;
                }}/>
                <button onClick={this.change}>click</button>
            </div>
        )
    }
}
```
**谨慎使用ref，因为这是一种反模式**
只要能够使用属性和状态进行控制，就不要用ref
### ref转发
可以用在高阶组件中
- 得到组件内部的东西，只能包装函数组件
使用React.forwardRef() 参数为一个函数组件，返回一个组件
在使用新组件的时候，新组件上面的ref不会指向组件本身，而是会传给此函数组件的第二个参数ref，此时可以在组件内进行ref赋值等操作
- 当类组件向要实现ref转发
    只能通过props中一个普通属性将ref传过来，然后进行赋值

## 上下文
当某个组件将数据放置在上下文中，那么此组件的子组件中都可以共享此状态
至此，数据来源：上下文，状态，属性
谨慎使用上下文，当某个组件依赖了上下文后，就不再纯粹(外部数据仅来源于props)
一般情况下，用于第三方组件(通用组件)
**旧版上下文** 以后的版本中可能会移除
- 创建上下文
旧版认为只有类组件可以创建上下文
1. 书写静态属性childContextTypes对上下文数据类型进行约束
2. 添加实例方法getChildContext,返回的对象即为上下文对象，数据必须满足类型约束。该方法会在每一次render之后运行

- 使用上下文
1. 若想使用上下文中的数据，必须要使用静态属性contextTypes，声明需要使用的上下文类型
2. 可以在构造函数的第二个参数中来获取，同时也要super
3. 从this.context中获取
4. 在函数组件中，从第二个参数中获取

- 上下文的数据变化
1. 上下文中的数据不可以直接变化，可以通过状态变化，组件进行重新渲染，从而改变上下文的数据
2. 还可以通过父组件在上下文中添加方法，子组件调用方法，在方法中setState改变数据

另外，子组件中的取得上下文数据遵循就近原则，类似作用域链

**新版上下文**
旧版api存在效率问题，并且容易导致滥用
- 创建上下文
上下文是一个独立的对象，和组件脱离联系
通过React.createContext(默认值)进行创建
返回一个包含两个属性的对象
1. Provider：一个组件，该组件会创建一个上下文，相当于是本组件创建的上下文
    此组件有一个属性value，可以将数据传给value中
    同一个Provider不要进行复用，若需在多个组件中使用，需要将其提升到更高的层级
2. Consumer 子组件可以通过此组件来获取上下文

- 使用上下文
1. 在类组件中
必须拥有静态属性contextType，应赋值为上下文对象
然后使用this.context.xxx
2. 在函数组件中
需要使用Consumer组件来获取上下文
它的子组件为一个函数组件，传入的参数为上下文中的数据。即向children中传入

注意：当上下文中的value变化(Object.is进行判断)时，依赖于此上下文的子组件都会强制进行渲染
    无论shouldComponentUpdate是否返回false
```js
const ctx = React.createContext();

class TestB extends Component {
    static contextType = ctx;
    render () {
        return (<div>{this.context.a}</div>);   //当然类组件可以以通过Consumer来进行获取
    }
}
function TestC() {
    return <>
        <ctx.Consumer>
            {value=><div>{value.a}</div>}
        </ctx.Consumer>
    </>
}
class TestA extends Component {
    render(){
        return <>
            <TestB/>
            <TestC/>
        </>
    }
}

export default class index extends Component {
    state = {a:'aaa'};
    render() {
        return (
            <div>
                <ctx.Provider value={this.state}>
                    <TestA/>
                </ctx.Provider>
            </div>
        )
    }
}
```
### Pure Component
纯组件：避免不必要的渲染，提高效率
优化：当一个组件的属性和状态都没有改变，重新渲染该组件是没有必要的
使用shouldUpdateComponent生命周期函数
PurComponent是一个组件，如果某个组件继承自组件，则该组件的shouldUpdateComponent会进行优化，属性和状态会进行浅比较，如果没变，则不会进行重新渲染
**注意**
- PureComponent进行的是浅比较，即比较地址，若是对于state中的数组进行push等操作，则不会进行重新渲染。可以创建新的或者使用concat
- 所以为了效率，尽量使用PureComponent
- 要求不要修改之前的对象，而应该创建一个新的对象去覆盖之前的对象（Immutable 不可变对象）可以使用assign或者创建obj
函数组件使用React.memo函数制作纯组件
``` export default React.memo(FunctionName) ```

### render props
当多个组件的大部分逻辑相同，但是显示不同时，可以采用render props的方法
类似于 上下文中的Consumer
即将显示写成函数，想如何显示，即传入什么样的函数
然后通过在父组件中写children(value) 将value传入进去，在父组件中定义好相应的策略

### Protals插槽
插槽：将一个React元素插入到指定的真实DOM中
ReactDOM.createPortal(React元素,真实DOM); 返回值为一个React元素
要注意，此函数会直接渲染到页面中。
但是事件的冒泡还是通过render出来的组件树进行冒泡，而不是真实DOM

### 错误边界
默认情况下，若一个组件在渲染期间出现错误，那么会导致整个组件树被卸载
本质上是一个组件，该组件会捕获到**渲染期间子组件**发生的错误，并有能力阻止错误继续传播，类似try catch
**让某个组件捕获错误**
- 使用静态生命周期函数getDerivedStateFromError
    1. 运行时间点：渲染子组件的过程中，发生错误后，在更新页面前
    2. **注意，只有子组件出错误时，才会发生**
    3. 该函数返回一个对象，覆盖掉state，可以通过state的值来判断要渲染的组件和处理
    4. 参数为错误对象
    5. 通常使用于改变状态
- 使用实例声明周期函数componentDidCatch
    1. 运行时间点：渲染子组件过程中，发生错误，更新页面之后。由于运行时间点较为靠后，一般不在此改变状态
    2. 通常使用与记录信息

不会捕获的错误
1. 自身的错误
2. 异步的错误
3. 事件中的错误

## 渲染
