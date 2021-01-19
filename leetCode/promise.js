function Minipromise(exector) {
    var self = this;
    self.status = 'pedding';
    self.callback = [];
    self.value = ''

    function resolve(value) {
        if (self.status !== 'pedding') return;
        self.status = 'resolved';
        self.value = value;
        self.callback.forEach((cbObj) => {
            cbObj.onResolved(self.value)
        })
    }

    function reject(reason) {
        if (self.status !== 'pedding') return;
        self.status = 'rejected';
        self.value = reason;
        self.callback.forEach((cbObj) => {
            cbObj.onRejected(self.value)
        })
    }

    exector(resolve, reject)
}

Minipromise.prototype.then = function (onResolved, onRejected) {

    var self = this;
    if (self.status === 'pedding') {
        self.callback.push({ onResolved, onRejected })
    } else if (self.status == 'resolved') {
        setTimeout(() => { onResolved(self.status) })
    } else {
        setTimeout(() => { onRejected(self.value) })
    }
}

Minipromise.prototype.catch = function (value) {

}

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
)