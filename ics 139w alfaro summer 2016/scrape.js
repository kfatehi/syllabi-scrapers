typeof jQuery === 'undefined' ? jQueryInit(init) : init();
function jQueryInit(callback) {
    (function(e, s) {
        e.src = s;
        e.onload = function() {
            $ = jQuery.noConflict();
            console.log('jQuery injected');
            callback();
        }
        ;
        document.head.appendChild(e);
    })(document.createElement('script'), '//code.jquery.com/jquery-latest.min.js')
}
function getTrimmedLines(str) {
    return str.split('\n').reduce((acc,str)=>{
        let trimmed = str.trim();
        if (trimmed.length === 0)
            return acc;
        else
            return [...acc, trimmed];
    }
    , [])
}
function getChildElemAt(parent, childSelector, idx) {
    return $($(parent).find(childSelector).get(idx));
}
function init() {
    function getTopicsAndItemsForRow(tr) {
        let get = (i) => getTrimmedLines(getChildElemAt(tr, 'td', i).text());
        return { topic: get(1), due: get(2) };
    }
    var res = $('tr').toArray().reduce((state,tr)=>{
        var td = $(tr).find('td:first-child');
        var tdText = td.text().trim();
        var matchWeek = tdText.match(/Wk(\d{1})/);
        if (matchWeek) {
            var weekNumber = parseInt(matchWeek[1]);
            var weekDay = tdText.match(/\w{3}$/)[0];
            switch (weekDay) {
            case 'Mon':
                {
                    return {
                        currentWeek: [Object.assign({
                            day: 'Mon'
                        }, getTopicsAndItemsForRow(tr))],
                        weeks: state.weeks
                    }
                }
            case 'Wed':
                {
                    return {
                        currentWeek: [...state.currentWeek, Object.assign({
                            day: 'Wed'
                        }, getTopicsAndItemsForRow(tr))],
                        weeks: state.weeks
                    }
                }
            case 'Fri':
                {
                    let currentWeek = [...state.currentWeek, Object.assign({
                        day: 'Fri'
                    }, getTopicsAndItemsForRow(tr))];
                    return {
                        weeks: [...state.weeks, currentWeek]
                    }
                }
            }
        }
        return state;
    }
    , {
        weeks: [],
    });
    console.log(res);
}
