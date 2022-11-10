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
import formatDate from '../helpers/formatDate';


const UserView = () => {
    var {state, getUser} = useContext(AppContext);
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        if(state.user && state.user._id === id)
        {
            setUser(state.user);
        }
        else
        {
            getUser(token,id)
        }
    }, [state.user,token,id,getUser])
    
    
    if(user)
    {
        return (
            <React.Fragment>
                <Card sx={{ maxWidth: {xs:'100%', sm:600, lg:1000}, m:'auto', mt:4}}>
                    <CardHeader
                        avatar={
                        <Avatar alt={user.name} aria-label="user" src={userIcon}>
                        </Avatar>
                        }
                        title={user.name}
                        subheader={user.role}
                    />
                     <CardContent>
                        <Typography variant="h5" color="text.primary">
                            Reservations
                        </Typography>
                        {
                            user.reservations && user.reservations.length
                            ?   <List sx={{ width: '100%', maxWidth: {xs:'100%', sm:500, lg:720}, m:'auto', mt:2 }}>
                                {
                                user.reservations.map((reservation,idx) => {
                                    return (
                                    <DataRow 
                                        key={'reservation_'+idx} 
                                        avatar={{src: bicycle,alt:'reservation'}}
                                        hasDivider={idx !== user.reservations.length - 1}
                                        typography = {
                                        {
                                            value: `${reservation.bike.model}  (${reservation.bike.color})`,
                                            secondary_value: ` - ${reservation.bike.location}`
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
                                    This user has no reservations
                                </Typography>
                        }
                    </CardContent>
                </Card>
            </React.Fragment>

        )
    }
    return null;
    
}

export default UserView;