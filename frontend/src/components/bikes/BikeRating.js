import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const BikeRating = ({addRate, bike, userRating}) => {
    const [rate, setRate] = useState(0);

    const handleChangeRate = (event) => {
        setRate(event.target.value);
        addRate(bike,event.target.value)
    };
    
    useEffect(()=>{
        if(userRating)
        {
            setRate(userRating.value);
        }
    },[userRating])

    return ( 
        <React.Fragment>
            <Rating 
                sx={{ml:1, fontSize:{sm:'1.5rem',xs:'1rem'}}} 
                name="bike-rating" 
                value={parseFloat(rate)}
                onChange={handleChangeRate}
                precision={1}  
            />
            <Typography 
                variant="h5" 
                color="text.secondary" 
                sx={{fontSize:'0.7rem',textAlign:'center'}}
            >
              { userRating ? 'Change your rate' : 'Give us your rate'}
            </Typography>
        </React.Fragment>
    )
}

export default BikeRating;