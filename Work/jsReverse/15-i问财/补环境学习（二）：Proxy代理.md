# 代理的作用
代理在实战中的意义：如果将obj替换成window，不管window使用任何属性、函数都能知道

```javascript
var obj = {
  name: "Lin",
  age: 18,
  learn: function () {
    console.log("学习补环境中的代理使用 函数代理");
    return 111;
  }
}

// 代理 对象
var obj_proxy = new Proxy(obj, {
  // handle: 具体发生什么操作，要被拦截

  // target: 代理了哪个对象 目标对象
  // pro: 要获取哪个属性(不管有还是没有) 属性名
  // 取值时 拦截
  get(target, pro, receiver){
    // return obj[pro]; // 死循环：取值get->get里又取值->取值get
    console.log("取值时 拦截 111");
    // 反射 -> 可以理解成从目标对象中获取某个属性(可以忽略代理)
    var val = Reflect.get(target, pro, receiver);
    console.log("在代理中获取到：", pro, val);
    return val;
  },
  // 赋值时 拦截
  set(target, pro, value, receiver){
    // obj[pro] = "xxx"; // 死循环：赋值set->set里又赋值->赋值set
    console.log("赋值时 拦截 222");
    console.log("给对象设置属性", pro ,"=", value);
    Reflect.set(target, pro, value, receiver);
  },
  // // 执行函数时 拦截
  apply(target, thisArg, arg_list){
    console.log("执行函数时 拦截 333");
    console.log("调用函数");
    var ret = Reflect.apply(target, thisArg, arg_list);
    console.log("函数执行完毕，结果是：", ret);
    return ret;
  }
});

console.log(obj_proxy.name);
obj_proxy.id = "123abc";
obj_proxy.learn();

// 代理 函数
obj.learn = new Proxy(obj.learn, {
  apply(target, thisArg, arg_list){
    console.log("执行函数时 拦截 333");
    console.log("调用函数");
    var ret = Reflect.apply(target, thisArg, arg_list);
    console.log("函数执行完毕，结果是：", ret);
    return ret;
  }
})

obj.learn();

// 代理在实战中的意义：如果将obj替换成window，不管window使用任何属性、函数都能知道
// window.任何属性
// window['????']
```



![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785384953086-5eba19f8-29d8-4e8d-bbf9-a3e6cd82be45.png)



# 封装 Proxy
上面的代理还有些美中不足，就是我们不知道是从哪个对象中获取的属性，所以要进行一些封装，获取代理对象名，更多记录些信息



```javascript
function obj_proxy(obj, name) {
    return new Proxy(obj, {
        get(target, pro, receiver) {
            var val = Reflect.get(target, pro, receiver);
            console.log("从", name, "获取", pro, "该属性的值是", val);
            if(typeof val == 'object'){ // 代理的灵魂所在
                return obj_proxy(val, pro);
            } else if(typeof val == 'function'){
                return func_proxy(val, pro);
            }
            return val;
        },
        set(target, pro, value, receiver){
            console.log("向", name, "设置", pro, "属性", "该属性的值是", value);
            Reflect.set(target, pro, value, receiver);

        }
    });
}

function func_proxy(func, name){
    return new Proxy(func, {
        apply(target, thisArg, arg_list){
            var ret = Reflect.apply(target, thisArg, arg_list);
            console.log("调用了"+name+"函数", "函数的返回值是", ret);
            if(typeof ret == 'object'){ // 代理的灵魂所在
                return obj_proxy(ret, name+"的返回值");
            } else if(typeof ret == 'function'){
                return func_proxy(ret, name+"的返回值");
            }
            return ret;
        }
    })
}

window = obj_proxy({}, "window");
// window.navigator

navigator = {
    userAgent: "Lin的浏览器",
    plugins: {
        abc: {
            aaa:{},
            bbb:{},
            ccc:{},
            learn: function(){
                return {
                    hao:{
                        good: "好",
                        better: "更好",
                        best: "最好"
                    }
                }
            }
        }
    }
}
window.navigator = navigator

// console.log(window.navigator.userAgent)
// console.log(window.navigator.plugins.abc.aaa);
// console.log(window.navigator.plugins.abc.learn());
console.log(window.navigator.plugins.abc.learn()['hao']['good']);

```

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785387428150-42d3264e-939d-4dd5-ac4d-ebfa3b1e5883.png)

# 使用封装的 Proxy （实战：i 问财-补环境）
> 注意 i 问财的 URL 会根据页面窗口的大小变化（变成手机模式/H5），这里主要是正常 PC 浏览器页面
>
> 有些网站会根据页面的状态获取的数据结果、数据结构和逆向思路都不同
>
> 有些网站 H5 页面的检测可能会相对弱一些
>

URL: [同花顺问财](https://www.iwencai.com/screener/result?w=2026-7-29%E8%82%A1%E7%A5%A8&querytype=stock&sign=1785393999056)

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785391840731-2a0457f0-4408-4c05-8954-94d6bd435077.png)

## 定位接口、加密参数


![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785392793844-729aa015-a7e2-40c2-8d6b-9d8ce370e5b3.png)

数据需要转 Unicode 搜索，`\u6b23`![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785392817675-7755062c-e5fc-4997-8936-0608051bd852.png)

在请求头有一个网站自定义的字段`heixin-v`，这个字段也在 cookie 中

可以请求验证其他的暂时参数不变，所以我们重点关注 `heixin-v`这个参数![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785392772389-fbcce594-ef9f-45c3-93c3-556a85f10f06.png)

## 定位加密位置
> 也可以使用 XHR 断点，过滤 `get-robot-data`来定位加密位置
>

清除 `cookie`

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785394202593-e33a94b6-7735-4f24-b2fb-5af8be4d073a.png)



使用浏览器插件 hook cookie

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785394262200-c1244890-b6b4-4a3d-8580-7da2526edcb3.png)



刷新页面，成功断住

有一个细节就是目前断点断住，但是一个请求都还没发出去，所以当请求中的 cookie 的 v 值 是在请求前生成的，请求后也一定能看到 cookie 中被设置了 v 值

先加载一个 cookie 后续发请求再重新加载 cookie

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785394355802-c49a9f84-3582-4cf4-96c7-90f3053eb9b2.png)



放断点，知道看到我们需要的字段 `v`，再通过调用栈溯源

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785394457300-844b71d4-b0f2-4c32-a5bc-f80ffa609c9c.png)



找到一个控制流

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785394776541-b5c952b0-3eb5-4079-8d52-34893d7ee7a0.png)



转化为

```javascript
r[u(361)] = function(n, r, t, e, i) {
  var c = u , v = 0;
  var a = window[c(663)][c(773)];
  var z = window[c(663)][c(384)];
  var w = f.NUTCu(a, c(745));
  var B = f[c(442)](z[c(526)](f[c(391)]), -1) || f[c(312)](z[c(526)](f[c(571)]), -1);
  var s = f[c(784)](n, "=") + r;
  e && (s += f[c(784)](f[c(359)], e));
  i && (s += f[c(784)](f[c(630)], i));
  t && (s += f[c(497)] + t);
  w && B && (s += f[c(759)], s += f[c(558)]);
  document[c(444)] = s;
}
```



![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785395593818-fb1c6154-f148-4caf-bb2c-96bd8e54ce7e.png)



可以看到 M[r(410)]() 就是加密函数

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785396037223-749eae2d-a13a-4396-9c01-d9a52c2806db.png)



跳转到 M 的 update 函数

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785396142096-fd4836fe-8348-46c4-ba6e-faaa3d7b521d.png)



可以看到 r.update 可以选择开始扣代码逆向，不过这次的重点是补环境，就用补环境的思路来完成

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785396286940-b819e261-8ee1-4e30-b8b7-ee62c37e9083.png)



## 古法手工补环境演示


我们可以明确 cookie 是在 `chameleon`这个 js 文件中被生成并设置，那将这个 js 文件复制或下载下来

只要实现 `console.log(document.cookie);`输出 cookie，那大概率是成功了（最终是否成功还得看能否请求成功）



先简单运行几遍，补充需要的全局变量

```javascript
// global在node环境中表示全局，但是浏览器中没有global
// globalThis 在浏览器表示全局，在node环境下也表示全局
var window = globalThis;
var document = {};

// (复制的代码)

console.log(document.cookie);
// 输出一些document内部的属性，需要我们补
```

这段代码在浏览器环境中是一定能运行的，所以我们要到浏览器中对应报错的地方，下断点，拿到我们需要的值

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785403377193-b127e439-49f6-418d-b610-a07a513d81ff.png)

问财这个下断点比较麻烦，如果断点断住了，尽可能的拿到我们想要的值

定位报错位置需要，`ctrl + g`跳转到报错位置，复制报错字段在浏览器中搜索，在下断点查看缺什么属性

（有能力的可以先解混淆再补环境会清晰一些）

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785404789569-08e952a4-d547-4fd5-9a24-5388868446c6.png)

接下来就是一步步按照前面的步骤补全

最后如果发现补完了但是输出的值明显不对，那有可能是被检测了，使用大量的 try catch 处理

遇到这种情况需要借助 `全局异常断点`： 表示整个js,，不论在什么情况下出错了，不管try还是没try都断下来.

做联调，用浏览器的devtools来调试我们当前的js代码

## 使用代理补环境实现


先对 `window`和 `document` 挂上代理

```javascript

function obj_proxy(obj, name) {
    return new Proxy(obj, {
        get(target, pro, receiver) {
            var val = Reflect.get(target, pro, receiver);
            console.log("从", name, "获取", pro, "该属性的值是", val);
            if(typeof val == 'object'){ // 代理的灵魂所在
                return obj_proxy(val, pro);
            } else if(typeof val == 'function'){
                return func_proxy(val, pro);
            }
            return val;
        },
        set(target, pro, value, receiver){
            console.log("向", name, "设置", pro, "属性", "该属性的值是", value);
            Reflect.set(target, pro, value, receiver);

        }
    });
}

function func_proxy(func, name){
    return new Proxy(func, {
        apply(target, thisArg, arg_list){
            var ret = Reflect.apply(target, thisArg, arg_list);
            console.log("调用了"+name+"函数", "函数的返回值是", ret);
            if(typeof ret == 'object'){ // 代理的灵魂所在
                return obj_proxy(ret, name+"的返回值");
            } else if(typeof ret == 'function'){
                return func_proxy(ret, name+"的返回值");
            }
            return ret;
        }
    })
}

// global在node环境中表示全局，但是浏览器中没有global
// globalThis 在浏览器表示全局，在node环境下也表示全局
var window = obj_proxy(globalThis, "window");
var document = obj_proxy({}, "document");
window.document = document;

// 复制的代码

console.log(document.cookie);
```

### 第一次运行
可以看到`document` 缺少 `head`和 `getElementsByTagName`

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785406963200-a873e369-d6db-42de-bfec-c6c13d323e01.png)

第一次补环境

```javascript
var document = obj_proxy({
    head: {},
    getElementsByTagName: function (){
        return [];
    }
}, "document");
```

### 第二次运行
从 window 获取 addEventListener 该属性的值是 undefined 不要补!!!!!!!

补了 addEventListener，网站会用监听的事件搞事情

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785407399092-2666f4c6-49b2-4ebc-8c35-c8176c280742.png)

第二次补环境

```javascript
var document = obj_proxy({
    head: {},
    getElementsByTagName: function (){
        return [];
    },
    createElement: function (){
        return {};
    }
}, "document");
```

### 第三次运行
![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785407791764-69e72bbd-37d0-4054-94d4-287536f69b93.png)

第三次补环境

```javascript
var document = obj_proxy({
    head: {},
    getElementsByTagName: function (){
        return [];
    },
    createElement: function (){
        return {};
    },
    attachEvent: function (){
        return {};
    },
}, "document");
```

### 第四次运行
![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785407885587-fc3fbf83-ae27-42c0-b142-75bea3345486.png)

第四次补环境

```javascript
var navigator = obj_proxy({}, "navigator");
window.navigator = navigator;
```

### 第五次运行
![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785408029200-f6ea1bca-f586-419e-8495-9291f16f3e52.png)

第五次补环境

这里补 `navigator`的 `plugins`

`addEventListener`前面说过会搞事情不补， `CHAMELEON_LOADED`和 `cookie`不补，这是在声明变量，后面复值

```javascript
var navigator = obj_proxy({
    plugins: [],
}, "navigator");
```

### 第六次运行
前面没有补 `location`，但这次运行也不像之前显示 ` xxx is not defined`，更多时候前面更多的不会输出`location`来提示，运行也不报错

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785422737913-bcc76bb0-f2bc-43f7-9da0-1163b74686dc.png)

补环境中如果能输出值，但是值不对是最头疼的，因为不知道哪出错了，可能是环境没补对，还有可能就是进行了检测但是用大量 try 处理而没有报错~~（引出下文，其实就是使用了大量 try catch 来处理）~~

~~需~~要做联调，用浏览器的devtools来调试我们当前的js代码，全局异常断点

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785405842577-cc7c0662-78f3-49ff-aa09-2af3955134a2.png?x-oss-process=image%2Fformat%2Cwebp)

```javascript
// 全局异常断点 -> 表示整个js, 不论在什么情况下. 出错了. 不管try还是没try. 都断下来.
// 接下来做联调... 用浏览器的devtools来调试我们当前的js代码

// 用node-inspect可以实现devtools联调
// 在新版本的node环境下已经被默认安装.
// 启动的时候:
//  node-inspect xxx.js  => 手动去打开浏览器的开发者工具. 点击node图标 => 等待即可
//  想要关掉它, 回到terminal. 输入ctrl+c. 终止该调试

// nodemon --inspect-brk xxx.js 更好调试
```

第六次补环境

```javascript
var location = obj_proxy({}, "location");
window.location = location;
```

### 第七次运行
这次多了些东西，这些都可以到浏览器中控制台输入对应获得

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785422980266-b29d0555-7099-48dd-bc32-a7cdf017a1d1.png)

第七次补环境

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785423457078-36c50aa6-d867-4048-a0f9-fb69ad4edeb1.png)

```javascript
var location = obj_proxy({
    hostname: 'www.iwencai.com',
    protocol: 'https:',
}, "location");
```

### 第八次运行
![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785423518432-5d6736f8-cfc2-46eb-81fb-0d356ebed707.png)

第八次补环境

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785423608973-2504f084-2576-41a5-b2ea-64a2e329ea1f.png)

第八次补环境

```javascript
var document = obj_proxy({
    head: {},
    getElementsByTagName: function (){
        return [];
    },
    createElement: function (){
        return {};
    },
    attachEvent: function (){
        return {};
    },
    documentElement: function documentElement(){
        return {};
    }
}, "document");
```

### 第九次运行
![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785424317623-eea1cfeb-573a-44cf-8a9a-c1e31ef8643e.png)

第九次补环境

```javascript
var navigator = obj_proxy({
    plugins: [],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    
}, "navigator");
```

### 第十次运行
![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785424368611-016e9ad7-2478-4305-a63a-3f1a583f688c.png)

第十次补环境

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785424565025-e8a1c88b-da8f-426d-9f64-9628db769a86.png)

```javascript
var navigator = obj_proxy({
    plugins: [],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    javaEnabled: function javaEnabled(){
        return {};
    },
}, "navigator");
```

### 第十一次运行


![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785424735916-969acc9a-f715-44fc-ac08-4ccde36e93aa.png)

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785424964202-ede3f294-c1ec-40d2-83fb-d4bf6f067f46.png)

第十一次补环境

ActiveXObject 不用补

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785425483006-d6c17738-95c2-48df-8992-bcc559d5d544.png)

```javascript
var document = obj_proxy({
    head: {},
    getElementsByTagName: function (){
        return [];
    },
    createElement: function (){
        return {
            getContext: function (){
                return {};
            }
        };
    },
    attachEvent: function (){
        return {};
    },
    documentElement: function documentElement(){
        return {};
    }
}, "document");
var navigator = obj_proxy({
    plugins: [],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    javaEnabled: function javaEnabled(){
        return {};
    },
    webdriver: false,
    language: 'zh-CN',
    languages: ['zh-CN', 'zh'],
    platform: 'Win32',
    vendor:'Google Inc.',
    appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',

}, "navigator");
var location = obj_proxy({
    hostname: 'www.iwencai.com',
    protocol: 'https:',
    href: 'https://www.iwencai.com/screener/result?w=2026-7-29%E8%82%A1%E7%A5%A8&querytype=stock&sign=1785393999056'
}, "location");
```

其实补到这一步已经生成 cookie 了，而且还能发请求

### 第十二次运行
已经生成 v 值了，虽然后续还有可以补的，但这个 v 值可以用于发请求得到响应数据；

如果不放心的可以继续补完环境，按照前面的步骤

在这里生成 v 值，但是会发现程序一直在运行并没有结束，这个时候我们可以怀疑 `setInterval`和 `setTimeout`，只需重新赋值函数即可

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785426125703-b6df4b78-fdfc-48be-8035-826d7e264096.png)

第十二次补环境

```javascript
setInterval = function (){};
setTimeout = function (){};
```

## 最终效果
### 补环境代码
```javascript
function obj_proxy(obj, name) {
    return new Proxy(obj, {
        get(target, pro, receiver) {
            var val = Reflect.get(target, pro, receiver);
            console.log("从", name, "获取", pro, "该属性的值是", val);
            if(typeof val == 'object'){ // 代理的灵魂所在
                return obj_proxy(val, pro);
            } else if(typeof val == 'function'){
                return func_proxy(val, pro);
            }
            return val;
        },
        set(target, pro, value, receiver){
            console.log("向", name, "设置", pro, "属性", "该属性的值是", value);
            Reflect.set(target, pro, value, receiver);

        }
    });
}

function func_proxy(func, name){
    return new Proxy(func, {
        apply(target, thisArg, arg_list){
            var ret = Reflect.apply(target, thisArg, arg_list);
            console.log("调用了"+name+"函数", "函数的返回值是", ret);
            if(typeof ret == 'object'){ // 代理的灵魂所在
                return obj_proxy(ret, name+"的返回值");
            } else if(typeof ret == 'function'){
                return func_proxy(ret, name+"的返回值");
            }
            return ret;
        }
    })
}

// global在node环境中表示全局，但是浏览器中没有global
// globalThis 在浏览器表示全局，在node环境下也表示全局
var window = obj_proxy(globalThis, "window");
var document = obj_proxy({
    head: {},
    getElementsByTagName: function (){
        return [];
    },
    createElement: function (){
        return {
            getContext: function (){
                return {};
            }
        };
    },
    attachEvent: function (){
        return {};
    },
    documentElement: function documentElement(){
        return {};
    }
}, "document");
var navigator = obj_proxy({
    plugins: [],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    javaEnabled: function javaEnabled(){
        return {};
    },
    webdriver: false,
    language: 'zh-CN',
    languages: ['zh-CN', 'zh'],
    platform: 'Win32',
    vendor:'Google Inc.',
    appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',

}, "navigator");
var location = obj_proxy({
    hostname: 'www.iwencai.com',
    protocol: 'https:',
    href: 'https://www.iwencai.com/screener/result?w=2026-7-29%E8%82%A1%E7%A5%A8&querytype=stock&sign=1785393999056'
}, "location");
window.navigator = navigator;
window.document = document;
window.location = location;

setInterval = function (){};
setTimeout = function (){};

// <-- 要补环境的代码 -->

function gen_v(){
    return document.cookie;
}

console.log("最终的cookie:",document.cookie);
```

### 请求代码
```python
# -*- coding: utf-8 -*-
"""
@File    : get_data.py
@Author  : Elliot Lin
@Date    : 2026/7/30 14:21
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : i问财补环境实现生成heixin-v
"""
import requests
import execjs

headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://www.iwencai.com",
    "Pragma": "no-cache",
    "Referer": "https://www.iwencai.com/screener/result?w=2026-7-29%E8%82%A1%E7%A5%A8&querytype=stock&sign=1785391891308",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "hexin-v": "AxBeLa5oTvkdyBL9VkeykIDe4VVn2fbYFrhIJwrj3ZY-E75LsunEs2bNGIdZ",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
cookies = {
    "chat_bot_session_id": "d85e9d20d068c90e3e07e0f759af631c",
    "other_uid": "Ths_iwencai_Xuangu_i9ptk59iuwgi5faex1eifde7akn37961",
    "_clck": "82zqja%7C2%7Cg86%7C0%7C0",
    "cid": "836c95a3defc1cd4c46d85a98792d7211785377642",
    "_clsk": "1ixroc9skfuz%7C1785391893627%7C8%7C1%7C",
    "v": "Ay9hEJWlmczWPZ3w3XqFhfsrvkg81IENHS2H6kG-yuOlxkE2SaQTRi34FwtS"
}
with open('./demo.js', 'r', encoding='utf-8') as f:
    js_code = f.read()

ctx = execjs.compile(js_code)
v = ctx.call('gen_v').split(";")[0].split("=")[1]
headers['hexin-v'] = v
cookies['v'] = v
url = "https://www.iwencai.com/unifiedwap/unified-wap/v2/result/get-robot-data"
data = {
    "question": "2026-7-29股票",
    "source": "Ths_iwencai_Xuangu",
    "version": "2.0",
    "secondary_intent": "stock",
    "rsh": "",
    "page": "1",
    "perpage": "50",
    "log_info": "{\"input_type\":\"typewrite\"}",
    "add_info": "{\"urp\":{\"scene\":1,\"company\":1,\"business\":1},\"contentType\":\"json\",\"searchInfo\":true}"
}
response = requests.post(url, headers=headers, cookies=cookies, data=data)

print(response.json())
print(response)
```

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785421585550-a5e1bf86-4845-4260-9de4-5e7c16287a1f.png)

![](https://cdn.nlark.com/yuque/0/2026/png/54586906/1785426646368-ae81ba59-111e-480e-b1d6-d0e9c1eb5a30.png)

