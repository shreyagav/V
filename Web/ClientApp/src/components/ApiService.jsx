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
}