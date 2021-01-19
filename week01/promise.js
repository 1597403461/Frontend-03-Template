function Minipromise(executor) {
    var self = this;
    self.status = 'pedding';
    self.data = undefined;

    self.callback = [];

    function resolve(value) {
        if (self.status !== 'pedding') return;
        self.status = 'resolved';
        self.data = value;
        self.callback.forEach((cbObj) => {
            cbObj.onResolved && cbObj.onResolved(value);
        })
    }

    function reject(value) {
        if (self.status !== 'pedding') return;
        self.status = 'rejected';
        self.data = value;
        self.callback.forEach((cbObj) => {
            cbObj.onRejected && cbObj.onRejected(value);
        })
    }

    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}
Minipromise.prototype.then = function (onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    var self = this;
    return new Minipromise((resolve, reject) => {
        function handle(callback) {
            try {
                const result = callback(self.data)
                if (result instanceof Minipromise) {
                    // 2. 如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
                    result.then(
                        value => { resolve(value) },
                        reason => { reject(reason) }
                    )
                } else {
                    // 1. 如果回调函数返回的不是promise，return的promise的状态是resolved，value就是返回的值。
                    resolve(result)
                }
            } catch (e) {
                //  3.如果执行onResolved的时候抛出错误，则返回的promise的状态为rejected
                reject(e)
            }
        }

        if (self.status == 'pedding') {
            self.callback.push({
                onResolved: function () {
                    handle(onResolved)
                }, onRejected: function () {
                    handle(onRejected)
                }
            })

        } else if (self.status == 'resolved') {
            setTimeout(() => {
                handle(onResolved)
            })
        } else {
            setTimeout(() => {
                handle(onRejected)
            })
        }
    })
};


Minipromise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
};

Minipromise.prototype.resolve = function (value) {
    return new Minipromise((resolve, reject) => {
        if (value instanceof Minipromise) {
            value.then((value) => { resolve(value) }, (reason) => { reject(reason) })
        } else {
            resolve(value)
        }
    })
}

Minipromise.prototype.reject = function (reason) {
    return new Minipromise((resolve, reject) => {
        reject(reason)
    })
}

Minipromise.prototype.all = function (promises) {
    let resultList = new Array(promise.length);
    let completedIndex = 0;
    return new Minipromise((resolve, reject) => {
        promises.forEach((promise, index) => {
            Minipromise.resolve(promise).then((res) => {
                completedIndex += 1;
                resultList[index] = res;
                if (completedIndex == promise.length) resolve(resultList);
            }).catch((reason) => {
                reject(reason)
            })
        })
    })
}



Minipromise.prototype.allSellected = function (promises) {
    let resultList = new Array(promise.length);
    let completedIndex = 0;
    return new Minipromise((resolve, reject) => {
        function handler() {
            completedIndex += 1;
            if (completedIndex == promise.length) resolve(resultList);
        }
        promises.forEach((promise, index) => {
            Minipromise.resolve(promise).then((value) => {
                resultList[index] = { status: 'fulfilled', value };
                handler(value)
            }).catch((reason) => {
                resultList[index] = { status: 'rejected', reason };
                handler(reason)
            })
        })
    })
}

Minipromise.prototype.race = function (promises) {
    return new Minipromise((resolve, reject) => {
        promises.forEach((promise) => {
            Minipromise.resolve(promise).then((value) => {
                resolve(value)
            }).catch((reason) => {
                reject(reason)
            })
        })
    })
}

Minipromise.prototype.any = function (promises) {
    let reasonList = new Array(promises.length);
    let completedIndex = 0;
    return new Minipromise((resolve, reject) => {
        promises.forEach((promise) => {
            Minipromise.resolve(promise).then((value) => {
                resolve(value)
            }).catch((reason) => {
                completedIndex += 1;
                reasonList[index] = reason;
                if (completedIndex == promises.length) reject(reason);
            })
        })
    })
}

Minipromise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};

let promise = new Minipromise((resolve, reject) => {

    setTimeout(function () {
        resolve(1)
        // reject(2)
    }, 2000)
    // reject(2)
})

promise.then(
    value => {
        console.log("onResolved:", value);
    },
    reason => {
        console.log("onRejected:", reason);
    }
).then((e) => {
    console.log(123);
    throw 456
}).then((res) => {
    console.log(res)
}).catch((e) => {
    console.log(e)
})