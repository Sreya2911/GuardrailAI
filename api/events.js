const events = [];

export function publishEvent(event) {

    events.unshift({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ...event
    });

    if (events.length > 100) {
        events.pop();
    }

}

export function getEvents() {
    return events;
}