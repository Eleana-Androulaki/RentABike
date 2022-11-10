import React, { useContext, useState, useEffect } from 'react';
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
import compareDates from '../helpers/compareDates';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ConfirmationDialog from '../components/general/ConfirmationDialog';
import BikeRating from '../components/bikes/BikeRating';
import formatDate from '../helpers/formatDate';

const Reservations = () => {
  var {state, getUser, deleteReservation, rateBike} = useContext(AppContext);
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [openDeleteConf, setOpenDeleteConf] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);


  const performCancel = (shouldCancel, reservation) => {
    if(shouldCancel)
    {
      setOpenDeleteConf(false);
      setSelectedReservation(null);
      deleteReservation(token, reservation, user, state.bikes);
    }
    else
    {
      setSelectedReservation(reservation);
      setOpenDeleteConf(true);
    }
  }
    
  const addRate = (bike, rate) => {
    rateBike(token,bike,user,rate);
  }
  
  useEffect(() => {
    if(state.user && state.user._id === state.loggedInUser._id)
    {
      setUser(state.user);
    }
    else
    {
      getUser(token,state.loggedInUser._id)
    }
    
  },[state.user,state.loggedInUser._id,token,getUser])
    
    
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
              My Reservations
            </Typography>
            {
              user.reservations && user.reservations.length
              ? <List 
                sx={{ 
                  width: '100%', 
                  maxWidth: {
                    xs:'100%', 
                    sm:500, 
                    lg:1000
                  }, 
                    m:'auto', 
                    mt:2 
                  }}
                >
                {
                user.reservations
                .sort((a,b)=>-compareDates(a.start_date,b.start_date))
                .map((reservation,idx) => {
                  return (
                    <DataRow 
                      key={'reservation_'+idx} 
                      avatar={{src: bicycle,alt:'reservation'}}
                      hasDivider={idx !== user.reservations.length - 1}
                      itemOpacity={compareDates(reservation.end_date, new Date()) > 0 ? 1 :0.7}
                      typography = {
                        {
                          value: `${reservation.bike.model} - ${reservation.bike.color}`,
                          secondary_value: 
                            <Typography component="legend">
                              {reservation.bike.location}
                              <Rating 
                                  sx={{ml:{xs:0, sm:1}, fontSize:'1rem'}} 
                                  name="read-only" 
                                  value={parseFloat(reservation.bike.rating)}
                                  precision={0.5}  
                                  readOnly 
                              />
                            </Typography>
                        }
                      }
                      text={`${formatDate(reservation.start_date)} - ${formatDate(reservation.end_date)}`}
                      actions={
                        compareDates(reservation.start_date, new Date()) > 0
                        ? <React.Fragment>
                            <Stack direction="row" spacing={2} sx={{justifyContent:'end', m:2}}>
                              <Button 
                                variant="contained" 
                                color="error"
                                onClick={() => {
                                    performCancel(false,reservation)
                                  }
                                }
                              >
                                Cancel
                              </Button>
                            </Stack>
                          </React.Fragment>
                        : <BikeRating
                              addRate={addRate}
                              bike={reservation.bike}
                              userRating = {reservation.bike?.userRating}
                          />
                      }
                    />
                  )
                })
                }
                </List>
              : <Typography variant="p" color="text.secondary">
                  You haven't made any reservations yet!
                </Typography>
            }
          </CardContent>
        </Card>
        <ConfirmationDialog 
          title={
            `Cancel reservation for 
            ${formatDate(selectedReservation?.start_date)+' - '+formatDate(selectedReservation?.end_date)}`
          }
          message={`Are you sure you want to cancel your reservation?`}
          open={openDeleteConf}
          setOpen={setOpenDeleteConf}
          action={()=>performCancel(true,selectedReservation)}
        />
      </React.Fragment>
    )
  }
  return null;
}

export default Reservations;