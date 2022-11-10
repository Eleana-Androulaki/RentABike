import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Context as AppContext } from '../context/appContext';
import DataRow from '../components/general/DataRow';
import List from '@mui/material/List';
import userIcon from '../assets/images/avatar.png';
import bicycle from '../assets/images/bicycle.png';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import formatDate from '../helpers/formatDate';

const BikeView = () => {
    var {state, getBike} = useContext(AppContext);
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [bike, setBike] = useState(null);
    
    useEffect(() => {
        if(state.bike && state.bike._id === id)
        {
            setBike(state.bike);
        }
        else
        {
            getBike(token,id)
        }
    }, [state.bike, id, token, getBike])
    
    
    if(bike)
    {
        return (
            <React.Fragment>
                <Card sx={{ maxWidth: {xs:'100%', sm:600, lg:1000}, m:'auto', mt:4}}>
                    <CardHeader
                        avatar={
                        <Avatar alt={bike.model} aria-label="bike" src={bicycle}>
                        </Avatar>
                        }
                        title={
                            <Typography component="legend">
                                {bike.model}
                                <Rating 
                                    sx={{ml:1, fontSize:'1rem'}} 
                                    name="read-only" 
                                    value={parseFloat(bike.rating)}
                                    precision={0.5}  
                                    readOnly 
                                />
                            </Typography>
                        }
                        subheader={`${bike.location} - ${bike.color}`}
                    />
                     <CardContent>
                        <Typography variant="h5" color="text.primary">
                            Reservations
                        </Typography>
                        {
                            bike.reservations && bike.reservations.length
                            ?   <List sx={{ width: '100%', maxWidth: {xs:'100%', sm:500, lg:720}, m:'auto', mt:2 }}>
                                {
                                bike.reservations.map((reservation,idx) => {
                                    return (
                                    <DataRow 
                                        key={'reservation_'+idx} 
                                        avatar={{src: userIcon,alt:'reservation'}}
                                        hasDivider={idx !== bike.reservations.length - 1}
                                        typography = {
                                        {
                                            value: reservation.user.name,
                                            secondary_value: ` - ${reservation.user.email}`
                                        }
                                        }
                                        text={
                                            `${formatDate(reservation.start_date)} - 
                                            ${formatDate(reservation.end_date)}`
                                        }
                                    />
                                    )
                                })
                                }
                                </List>
                            :   <Typography variant="p" color="text.secondary">
                                    This bike hasn't been reserved yet.
                                </Typography>
                        }
                    </CardContent>
                </Card>
            </React.Fragment>

        )
    }
    return null;
    
}

export default BikeView;