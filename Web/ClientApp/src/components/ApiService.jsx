const host = "https://trr.azurewebsites.net";
export class Service {
    static getCalendarEvents(month, year, sites) {
        var promice = fetch(host + '/api/Calendar/GetMonthEvents',
            {
                method: 'post',
                body: JSON.stringify({ month, year, sites }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        promice.catch(err => console.error(err));
        return promice.then(data => {
            return data.json();
        });
    }
    static getChaptersForSelector() {
        var promice = fetch(host + '/api/Chapter/GetGrouppedChapters');
        promice.catch(err => console.error(err));
        return promice.then(data => {
            return data.json();
        });
    }
    static getEventTypes() {
        var promice = fetch(host + '/api/Lists/getEventTypes');
        promice.catch(err => console.error(err));
        return promice.then(data => {
            return data.json();
        });
    }
    static getEventsList(filter) {
        filter = filter || { from: '2019-03-01', to: '2019-04-01' };
        var promice = fetch(host + '/api/Calendar/GetFilteredList', {
            method: 'post',
            body: JSON.stringify(filter),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        promice.catch(err => console.error(err));
        return promice.then(data => {
            return data.json();
        });
    }
    static changeEvent(event) {
        var promice = fetch(host + '/api/Event/ChangeEvent', {
            method: 'post',
            body: JSON.stringify(event),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        promice.catch(err => console.error(err));
        return promice.then(data => {
            return data.json();
        }).catch(err => console.error(err));
    }
    static getEvent(id) {
        var promice = fetch(host + '/api/Event/GetEventById/'+id);
        promice.catch(err => console.error(err));
        return promice.then(data => {
            return data.json();
        }).catch(err => console.error(err));
    }
    static getEventAttendees(id) {
        var promice = fetch(host + '/api/Event/GetEventAttendees/' + id);
        promice.catch(err => console.error(err));
        return promice.then(data => {
            return data.json();
        }).catch(err => console.error(err));
    }
    static removeEventAttendee(id, attendee) {
        var promice = fetch(host + '/api/Event/RemoveEventAttendees/' + id, {
            method: 'post',
            body: JSON.stringify(attendee),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        promice.catch(err => console.error(err));
        return promice.then(data => {
            return data.json();
        }).catch(err => console.error(err));
    }
    static getSiteMembers(id) {
        var promice = fetch(host + '/api/Event/GetSiteMembers/' + id);
        promice.catch(err => console.error(err));
        return promice.then(data => {
            return data.json();
        }).catch(err => console.error(err));
    }
}