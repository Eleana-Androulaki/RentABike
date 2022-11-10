module.exports = (bike) => {
    return  bike?.ratings.length 
            ? parseFloat(bike.ratings.reduce((a,b)=>a+b.value,0)/bike.ratings.length).toFixed(1) 
            : 0;
}