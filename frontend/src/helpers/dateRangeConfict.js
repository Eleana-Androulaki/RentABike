import compareDates from "./compareDates"

const dateRangeConfict = (start, end, from, to) =>{
    // start = beginning of reservation
    // end = end of reservation
    // from = beginning of requested date range
    // to = end of requested date range

    if(compareDates(start,from) === 0)
    {// there is another reservation for this bike that begins in the from date
        return true;
    }
    if(compareDates(from,start) ===1 && compareDates(from,end)===-1)
    {
        // order of dates is (start, from, end) while "to" doesn't matter so 
        // during the date span (from,end) these two dates overlap
        return true;
    }

    if(compareDates(to,start) === 1 && compareDates(to,end)===-1)
    {
        // order of dates is (start, to, end) while "from" doesn't matter so
        // during the date span (start, to) these two dates overlap
        return true;
    }

    if(compareDates(from,start) === -1 && (compareDates(to,end)===1 || compareDates(to,end)===0))
    {
        // order of dates is (from, start, end, to) so the whole reservation is
        // within the requested date
        return true;
    }

    // in every other case there is no conflict
    return false;

}

export default dateRangeConfict;