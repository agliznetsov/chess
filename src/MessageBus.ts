export default class MessageBus {
    private static instance:MessageBus = new MessageBus();
    private consumers = {};

    private constructor() {
    }

    static get(): MessageBus {
        return MessageBus.instance;
    }

    publish(event: string, data) {
        let arr = this.consumers[event];
        if (arr) {
            arr.forEach(it => it(data));
        }
    }

    subscribe(event: string, consumer) {
        let arr = this.consumers[event];
        if (!arr) {
            arr = [];
            this.consumers[event] = arr;
        }
        arr.push(consumer);
    }
}

