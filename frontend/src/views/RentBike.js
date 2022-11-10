import React, { useContext, useState, useEffect } from 'react';
import { Context as AppContext } from '../context/appContext';
import RangeDatePicker from '../components/general/RangeDatePicker';
import BikeFilters from '../components/bikes/BikeFilters';
import Grid from '@mui/material/Grid';
import dateRangeConfict from '../helpers/dateRangeConfict';
import List from '@mui/material/List';
import DataRow from '../components/general/DataRow';
import bicycle from '../assets/images/bicycle.png';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import ConfirmationDialog from '../components/general/ConfirmationDialog';
import Checkbox from '@mui/material/Checkbox';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import FormControlLabel from '@mui/material/FormControlLabel';
import formatDate from '../helpers/formatDate';


const filterKeys = ['model', 'color', 'location'];


const RentBike = () => {
  var {state, getBikes, createReservation} = useContext(AppContext);
  const token = localStorage.getItem("token");
  const [range, setRange] = useState({
    from:'',
    to:'',
  })
  const [filters, setFilters] = useState({
    model:{
      values:[],
      options:[]
    },
    color:{
      values:[],
      options:[]
    },
    location:{
      values:[],
      options:[]
    }
  })

  const [filterRating, setFilterRating] = useState([0,5]);

  const [openBookConf, setOpenBookConf] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);

  const performBook = (shouldBook, reservation, bike) => {
    if(shouldBook)
    {
      setOpenBookConf(false);
      setSelectedReservation(null);
      createReservation(token, bikes, state.loggedInUser, reservation);
    }
    else
    {
      let newReservation = {
        bike,
        start_date: range.from,
        end_date : range.to
      }
      setSelectedReservation(newReservation);
      setOpenBookConf(true);
    }
  }

  useEffect(() => {
    if(state.bikes)
    {

      let tempObj = {};
      filterKeys.forEach((key)=>{
        tempObj[key] =  {
            values:[],
            options:[...new Set(state.bikes.filter(b=>b.rentable).map((el)=>el[key]))]
          }
      });

      setFilters(tempObj);
      setBikes(state.bikes.filter(b=>b.rentable));
    }
    else
    {
      getBikes(token);
    }
  }, [token, getBikes, state.bikes])


  useEffect(() => {
    if(bikes && bikes.length)
    {
      let tempBikes = bikes.filter((bike)=>{
        let tempBikeArray= filterKeys.map((key)=>{
          if(filters[key].values.length === 0 || filters[key].values.includes(bike[key]))
          {
            return true;
          }
          return false;
        });
        return tempBikeArray.every(el => el === true);
      }).filter(bike=>{
        return Math.round(bike.rating) >= filterRating[0] &&
               Math.round(bike.rating)<=filterRating[1]
      }).filter(bike => {
        if(range.from && range.to)
        {
          let rule = bike.reservations.every((reserv)=>{
            return !dateRangeConfict(
                reserv.start_date,
                reserv.end_date,
                range.from,
                range.to
            )
          });
          return rule;
          
        }
        return true;
      })
      setFilteredBikes(tempBikes);
    }
  }, [range, filters, bikes, filterRating])
  
  
  const datesComplete = (newRange) => {
    setRange({
      from: newRange.from.value,
      to: newRange.to.value
    });
  }

  if(bikes && bikes.length)
  {
    return (
      <React.Fragment>
        <RangeDatePicker datesComplete={datesComplete}/>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <BikeFilters 
              filters={filters} 
              setFilters={setFilters} 
              setFilterRating={setFilterRating}
              filterRating = {filterRating}
            />
          </Grid>
          <Grid item xs={12} md={10}>
            <List 
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

                filteredBikes.map((bike,idx) => {
                  return (
                    <DataRow 
                        key={'bike'+idx} 
                        avatar={{src: bicycle,alt:'bike'}}
                        hasDivider={idx !== filteredBikes.length - 1}
                        typography = {
                          {
                            value: 
                              <Typography component="legend">
                                <FormControlLabel 
                                  control={
                                    bike.rentable
                                    ? <Checkbox 
                                        aria-label='Checkbox demo' 
                                        defaultChecked 
                                        color="success" 
                                        disabled
                                        sx={{color: '#2e7d32!important'}} 
                                      />
                                    : <Checkbox 
                                        aria-label='Checkbox demo' 
                                        defaultChecked 
                                        color="error" 
                                        disabled
                                        sx={{color: '#d32f2f!important'}}
                                        checkedIcon={
                                          <DoNotDisturbOnIcon />
                                        } 
                                      />
                                  } 
                                  label={bike.rentable ? 'Available' : 'Unavailable'} 
                                />
                              </Typography>,
                            secondary_value: 
                              <Typography component="legend">
                                {bike.location} - {bike.color}
                              </Typography>
                          }
                        }
                        text={
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
                        actions={
                          <React.Fragment>
                            <Stack direction="row" spacing={2} sx={{justifyContent:'end', m:2}}>
                              <Button 
                                variant="contained" 
                                color="success"
                                disabled={!(range.from && range.to) || !bike.rentable}
                                onClick={() => {
                                    performBook(false, null,bike)
                                  }
                                }
                                sx={{m:{xs:0}}}
                              >
                                Book now
                              </Button>
                            </Stack>
                          </React.Fragment>
                        }
                      />
                  )
                })
              }
            </List>
          </Grid>
        </Grid>
        <ConfirmationDialog 
          title={`Rent Bike`}
          message={
            `Would you like to proceed with the reservation for 
            ${formatDate(selectedReservation?.start_date)} - 
            ${formatDate(selectedReservation?.end_date)}`}
          open={openBookConf}
          setOpen={setOpenBookConf}
          action={()=>performBook(true,selectedReservation,null)}
        />
      </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment>
        <RangeDatePicker datesComplete={datesComplete}/>
        <Typography component="p">
          There are no bikes available
        </Typography>
      </React.Fragment>
    );
  }
  
}

export default RentBike;