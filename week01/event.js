class Event {
    constructor() {
        this.listeners = []
    }
    on(type, callback) {
        if(this.listeners[type]) {
            this.listeners[type].push(callback)
        }else {
            this.listeners[type] = [callback];
        }
    }

    trigger(type) {
        if(!this.listeners[type]) {
            console.error('not has the' + type  +  ' function');
            return;
        };
        this.listeners[type].forEach(callback => {
            callback && callback()
        });
    }

    clear(type, callback) {
        if(!this.listeners[type]) return;
        delete this.listeners[type];
        callback && callback();
    }
}

let emitter = new Event();

emitter.on('go', function() {
    console.log(123)
})

emitter.on('go', function() {
    console.log(456)
})


emitter.trigger('go')

emitter.clear('go', function() {
    console.log('has cleared')
})

emitter.trigger('go')
