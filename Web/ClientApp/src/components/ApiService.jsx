const host = "https://trr.azurewebsites.net";
export class Service {
    static getCalendarEvents(month, year, sites) {
        return Service.__post(host + '/api/Calendar/GetMonthEvents', { month, year, sites })
    }
    static getChaptersForSelector() {
        return Service.__get(host + '/api/Chapter/GetGrouppedChapters')
    }
    static getEventTypes() {
        return Service.__get(host + '/api/Lists/getEventTypes')
    }
    static getEventsList(filter) {
        filter = filter || { from: '2019-03-01', to: '2019-04-01' };
        return Service.__post(host + '/api/Calendar/GetFilteredList', filter)
    }
    static changeEvent(event) {
        return Service.__post(host + '/api/Event/ChangeEvent', event)
    }
    static getEvent(id) {
        return Service.__get(host + '/api/Event/GetEventById/' + id)
    }
    static getEventAttendees(id) {
        return Service.__get(host + '/api/Event/GetEventAttendees/' + id)
    }
    static addEventAttendees(id, ids) {
        return Service.__post(host + '/api/Event/AddEventAttendees/' + id, ids);
    }
    static removeEventAttendee(id, attendee) {
        return Service.__post(host + '/api/Event/RemoveEventAttendees/' + id, attendee)
    }
    static getSiteMembers(id) {
        return Service.__get(host + '/api/Event/GetSiteMembers/' + id)
    }

    static getBudget(eventId) {
        
        return Service.__get(host + '/api/Event/GetBudget/' + eventId)
    }
    static deleteBudgetLine(id, line) {
        return Service.__post(host + '/api/Event/DeleteBudgetLine/' + id, line);
    }
    static addBudgetLine(id, line) {
        return Service.__post(host + '/api/Event/AddBudgetLine/' + id, line);
    }

    static updateBudgetLine(id, line) {
        return Service.__post(host + '/api/Event/UpdateBudgetLine/' + id, line);
    }
    static getEventPictures(id) {
        return Service.__get(host + '/api/Event/GetEventPhotos/' + id);//Service.__get('/Pictures.json');//
    }
    static __get(url) {
        var promice = fetch(url);
        promice.catch(err => console.error(err));
        return promice.then(data => {
            return data.json();
        }).catch(err => console.error(err));
    }
    
    static __post(url, data) {
        var promice = fetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        promice.catch(err => console.error(err));
        return promice.then(data => {
            return data.json();
        }).catch(err => console.error(err));
    }
    static uploadPictures(eventId, input) {
        let formData = new FormData();
        for (var i = 0; i < input.files.length; i++) {
            formData.append('files', input.files[i], input.files[i].name);
        }
        var promice = fetch(host + '/api/Event/UploadFile/' + eventId, { body: formData, method: 'post' });
        promice.catch(err => console.error(err));
        return promice.then(data => {
            return data.json();
        }).catch(err => console.error(err));
    }}