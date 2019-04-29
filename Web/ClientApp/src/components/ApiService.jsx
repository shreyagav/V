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
}