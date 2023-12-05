class EventManager {
    subscribe(event, callback) {
        document.addEventListener(event, (e) => callback(e, e.detail));
    }

    dispatch(event, data) {
        let c = new CustomEvent(event, {detail: data});

        document.dispatchEvent(c);
    }

    remove(event, callback) {
        document.removeEventListener(event, callback);
    }

}

const globalEventManager = new EventManager();
export default globalEventManager;