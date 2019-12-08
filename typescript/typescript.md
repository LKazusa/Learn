typescript会做出假设：
1. 当前的执行环境是dom
2. 若没有使用模块化开发，则会认为在全局执行
3. 编译的目标是es3

有两种方式更改假设：
1. 使用ts命令行的时候加上选项参数
2. 使用ts配置文件，增加编译选项

`tsc --init`生成编译文件

使用了配置文件后，使用tsc编译不可以跟上文件名，若是跟上文件名则会忽略配置文件

@types是一个官方的库，包含了很多对js的依赖
比如@types/node @types/jquery

第三方库
ts-node：将ts代码在内存中编译并运行
nodemon: 检测文件的变化
```
    nodemon --exec ts-node src/index.ts 
    nodemon -e ts --exec ts-node src/index.ts 只检测ts文件
    nodemon --watch src -e ts --exec ts-node src/index.ts 只检测src下面的ts文件
```

typescript的类型约束
number `  num:number `
string ` str:string `
boolean `bool:boolean `
array `arr:string[] `
object `obj:object `
null undefined  这两个是其他类型的子类型，即赋值给其他类型不报错，可以通过设置严格条件修改 ` "strictNullChecks": true`

- 联合类型 多个类型任选其一
通常可以使用typeof来触发基本类型保护
- void类型 通常用于约束函数的返回值，既不返回值
- never类型 常用与表示函数永不结束
    比如在函数中抛出错误或者死循环
- 字面量类型 表示使用一个值进行约束
 `let a : 'aa';` 表示只能取值为aa
 `let arr:[] ;`表示arr只能为空数组
- 元祖类型（Tuple) 一个固定长度的数组，且数组每一项的类型确定
 `let arr:[string, number];`
- any类型 可以绕过类型选择


使用type来对类型取别名，可以通过此方式来实现类型的复杂组合
``` ts
    type User = {
        name: string,
        age: number,
        sex: '男' | '女'
    };
    let user :User;
    user = {
        name: 'xue',
        age: 21,
        sex: '男'
    }
```

实现了函数的重载
``` ts
function test1(str:string):string;
function test1(num:number):number;
function test1(a:string|number):string|number{
    return a;
}
```
函数可选参数（只能放在末尾）
``` ts
function test2(a:number,b?:number){
    //相当于b:number|undefined
}
```

## 枚举类型
- 逻辑含义和真实值产生了混淆，当修改真实值的时候会产生大量的修改
- 字面量的值不会进入到编译结果
```ts
    enum 枚举名{
        枚举字段1 = 值1,
        枚举字段2 = 值2,
    }
    enum Gender{
        male: '男',
        female: '女'
    }
    let gender:Gender;
    gender = Gender.male;
    gender = Gender.female;
```
枚举会出现在编译结果中
枚举规则
- 枚举的字段值可以为字符串和数组
- 数字枚举的值自动递增
- 被数字枚举约束的变量，可以直接赋值数字
- 数字枚举的编译结果和字符串枚举的编译结果有差异
最佳实践
- 不要再一个枚举中既出现字符串，又出现数字
- 使用枚举时尽量使用名称而不是真实值

ts中使用esmodule
``` ts
    import * as fs from 'fs';
```

扩展类型-接口
扩展类型：类型别名，枚举，接口，类
标准的形式：
- API文档，弱标准
- 代码约束，强标准

interface与类型别名type的重要不同在与约束类
```ts
interface User{
    name: string,
    age: number,
    sayHello(): void,
    sayHello: () => void
}

interface Condition{
    (n: number): boolean  //此接口为一个函数，接收一个number返回一个boolean
}

//接口是可以进行继承来实现多种接口组合
//不可以覆盖父接口的成员
interface Student extends User{
    userId: number
}

//type也可以实现，需要使用交叉类型实现 & 
type User{
    name: string
}
type Student{
    age: number
} & User

//只读修饰符，不参与编译，即不在编译结果中
interface User{
    readonly id:string,
    readonly arr1: number[], //对数组变量进行约束
    arr2: readonly number[] //对数组内容进行约束
}
let arr: readonly number[] = [1,2,3];//此时的数组中的内容不可变

//断言
interface User{
    name: 'xuege'
}
let user = {
    name 'xuege' as 'xuege'
}


```

interface 和 type
- 接口不可以覆盖父接口的成员
- type会将相同的成员变成交叉类型

## 类型兼容性
- 基本类型：完全匹配
- 对象类型：鸭子辨型

当直接使用类型约束声明对象的时候，会触发严格判断，而不是鸭子辨型，只有在类型约束声明变量，将一个对象赋值过来的时候才会触发鸭子辨型
