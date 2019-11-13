function MyMap() {
    if (arguments.length > 1 || Object.prototype.toString.call(arguments[0]) != '[object Array]') {//传入多个值，或者传入的值不是数组
        if (arguments.length != 0) {//若不传值也可
            throw Error('no')
        }
    }
    this.bucketLength = 8;
    this.init();
    if (arguments.length != 0) {
        arguments[0].forEach(ele => {//遍历赋值
            this.set(ele[0], ele[1])
        })
    }
}
MyMap.prototype.init = function () {
    let len = this.bucketLength;
    this.bucket = new Array(len);
    for (let i = 0; i < len; i++) {
        this.bucket[i] = {
            number: i,
            next: null
        }
    }
    return this.bucket;
}
MyMap.prototype.set = function (initKey, initValue) {
    let hashNumber = this.hash(initKey);
    let bucket = this.bucket[hashNumber];
    while (bucket.next) {
        if (bucket.next.key == initKey) {
            bucket.next.value = initValue;
            return;
        } else {
            bucket = bucket.next;
        }
    }
    bucket.next = {
        key: initKey,
        value: initValue,
        next: null
    }
}
MyMap.prototype.get = function (key) {
    let hashNumber = this.hash(key);
    let bucket = this.bucket[hashNumber];
    while (bucket.next) {
        if (bucket.next.key == key) {
            return bucket.next.value;
        }
    }
    return undefined;
}
MyMap.prototype.hash = function (key) {
    if (typeof key != 'string') {
        switch (typeof key) {
            case 'number':
                return key + '' == "NaN" ? 0 : Math.floor(key % 8);
            case 'object':
                return 2;
            case 'boolean':
                return key ? 1 : 0;
            case 'function':
                return key.length % 8;
            default:
                return 0;
        }
    } else {
        return key.length >= 3 ? key.charCodeAt(2) % 8 : key.charCodeAt(0) % 8;
    }
}
MyMap.prototype.delete = function (key) {
    let hashNumber = this.hash(key);
    let bucket = this.bucket[hashNumber];
    while (bucket.next) {
        if (bucket.next.key = key && bucket.next.next) {
            bucket.next = bucket.next.next;
            return true;
        } else if (bucket.next.key = key) {
            bucket.next = null;
            return true;
        } else {
            bucket = bucket.next;
        }
    }
    return false;
}
MyMap.prototype.has = function (key) {
    let hashNumber = this.hash(key);
    let bucket = this.bucket[hashNumber];
    while (bucket.next) {
        if (bucket.next.key == key) {
            return true;
        } else {
            bucket = bucket.next;
        }
    }
    return false;
}
MyMap.prototype.clear = function () {
    this.init();
}

let map = new MyMap([
    ['age', 20],
    [{}, false]
]);
map.set('name1', 'aaa');
map.set('name2', 'bbb');
