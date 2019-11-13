/*
需要处理
    链式调用
    异步操作
    抛出异常    
*/

function myPromise(excutor) {
    this.status = 'pending';
    this.resolveValue = null;
    this.rejectValue = null;
    var self = this;
    //若在promise中使用注册异步方法
    this.resolveList = [];//异步方法池
    this.rejectList = [];
    function resolve(value) {
        if (self.status == 'pending') {
            self.resolveValue = value;
            self.status = 'resolved';
            self.resolveList.forEach(function (ele) {
                ele();
            })
        };
    }

    function reject(value) {
        if (self.status == 'pending') {
            self.rejectValue = value;
            self.status = 'rejected';
            self.rejectList.forEach(function (ele) {
                ele();
            })
        }

    }
    try {
        excutor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

function dealResult(returnValue, res, rej) {
    if (returnValue instanceof myPromise) {//解决返回值为promise对象的情况，相当于包装了一层nextPromise
        returnValue.then(function (data) {
            res(data)
        }, function (data) {
            rej(data)
        })
    } else {
        res(returnValue)
    }
}

myPromise.prototype.then = function (resolveFunc, rejectFunc) {
    var self = this;
    if (!resolveFunc) {//处理空then
        resolveFunc = function (data) {
            return data;
        }
    }
    if (!rejectFunc) {
        rejectFunc = function (data) {
            throw new Error(data);//此处也可以写成抛出一个异常
        }
    }
    var nextPromise = new myPromise(function (res, rej) {
        if (self.status == 'resolved') {
            setTimeout(function () {
                try {
                    var result = resolveFunc(self.resolveValue);
                    dealResult(result, res, rej)
                } catch (e) {
                    rej(e)
                }
            }, 0)
        }
        if (self.status == 'rejected') {
            setTimeout(function () {
                try {
                    var result = rejectFunc(self.rejectValue);
                    dealResult(result, res, rej)
                } catch (e) {
                    rej(e)
                }
            }, 0)
        }
        if (self.status == 'pending') {//注册异步函数
            self.resolveList.push(function () {
                setTimeout(function () {
                    try {
                        var result = resolveFunc(self.resolveValue);
                        dealResult(result, res, rej)
                    } catch (e) {
                        rej(e)
                    }
                }, 0)
            });
            self.rejectList.push(function () {
                setTimeout(function () {
                    try {
                        var result = rejectFunc(self.rejectValue);
                        dealResult(result, res, rej)
                    } catch (e) {
                        rej(e)
                    }
                }, 0)
            })
        }
    })
    return nextPromise;
}
myPromise.prototype.catch = function (rejectFunc) {
    return this.then(null, rejectFunc);
}

