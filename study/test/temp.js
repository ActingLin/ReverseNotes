l.prototype.request = function(e) {
    // 判断传入的参数类型，e是一个字符串时，表示url，其他参数会被合并
    if ("string" == typeof e) {
        e = arguments[1] || {};  // 如果参数数组有第二个参数则使用第二个参数，否则使用空对象
        e.url = arguments[0];     // 将第一个参数作为url
    } else {
        e = e || {};  // 如果没有传入参数，则使用空对象
    }

    // 将默认的配置和传入的配置合并
    e = s(this.defaults, e);

    // 确保method是小写字母（如果没有传入method，则使用默认的method，默认为"get"）
    if (e.method) {
        e.method = e.method.toLowerCase();
    } else if (this.defaults.method) {
        e.method = this.defaults.method.toLowerCase();
    } else {
        e.method = "get";
    }

    // 初始化t数组，包含两个元素o和undefined
    var t = [o, void 0];

    // 创建一个Promise对象，初始化为传入的配置e
    var n = Promise.resolve(e);

    // 遍历请求拦截器，依次将fulfilled和rejected放入t数组
    this.interceptors.request.forEach(function(e) {
        t.unshift(e.fulfilled, e.rejected);
    });

    // 遍历响应拦截器，依次将fulfilled和rejected放入t数组
    this.interceptors.response.forEach(function(e) {
        t.push(e.fulfilled, e.rejected);
    });

    // 依次执行请求和响应拦截器，形成一个链式调用
    while (t.length) {
        n = n.then(t.shift(), t.shift());
    }

    // 返回最终的Promise对象
    return n;
}


l.prototype.request = function(e) {
    "string" == typeof e ? (e = arguments[1] || {}).url = arguments[0] : e = e || {},
    (e = s(this.defaults, e)).method ? e.method = e.method.toLowerCase() : this.defaults.method ? e.method = this.defaults.method.toLowerCase() : e.method = "get";
    var t = [o, void 0]
      , n = Promise.resolve(e);
    for (this.interceptors.request.forEach((function(e) {
        t.unshift(e.fulfilled, e.rejected)
    }
    )),
    this.interceptors.response.forEach((function(e) {
        t.push(e.fulfilled, e.rejected)
    }
    )); t.length; )
        n = n.then(t.shift(), t.shift());
    return n
}