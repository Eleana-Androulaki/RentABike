import React, { useContext, useState, useEffect } from 'react';
import { Context as AppContext } from '../context/appContext';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import DataRow from '../components/general/DataRow';
import List from '@mui/material/List';
import bicycle from '../assets/images/bicycle.png';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import ConfirmationDialog from '../components/general/ConfirmationDialog';
import BikeModal from '../components/bikes/BikeModal';
import { useNavigate } from "react-router-dom";

const Bikes = () => {
  var {state, getBikes, deleteBike, createBike, updateBike} = useContext(AppContext);
  const [bikes, setBikes] = useState(null);
  const token = localStorage.getItem('token');
  const [selectedBike, setSelectedBike] = useState(null);
  const [openDeleteConf, setOpenDeleteConf] = useState(false);
  const [openBikeModal, setOpenBikeModal] = useState(false);

  const navigate = useNavigate();

  const openEdit = (bike) => {
    setSelectedBike(bike);
    setOpenBikeModal(true);
  }

  const performEdit = (newBike)=>{
    updateBike(token,newBike);
  }

  const performCreate = (newBike) =>{
    createBike(token,newBike);
  }

  const performDelete = (shouldDelete, bike) => {
    if(shouldDelete)
    {
      setOpenDeleteConf(false);
      setSelectedBike(null);
      deleteBike(token, bike);
    }
    else
    {
      setSelectedBike(bike);
      setOpenDeleteConf(true);
    }
  }

  useEffect(() => {
    
    if(state.bikes)
    {
      setBikes(state.bikes);
    }
    else
    {
      getBikes(token)
    }

  },[state.bikes, token, getBikes])

  if(bikes && bikes.length)
  {
    return (
      <React.Fragment>
        <Stack direction="row" spacing={2} sx={{justifyContent:'end', m:2}}>
          <Button 
            variant="contained" 
            endIcon={<AddIcon />} 
            color="success"
            onClick={() => {
                setSelectedBike(null);
                setOpenBikeModal(true);
              }
            }
          >
            Create a bike
          </Button>
        </Stack>
        <List sx={{ width: '100%', maxWidth: {xs:'100%', sm:500, lg:720}, m:'auto', mt:2 }}>
        {
          bikes.map((bike,idx) => {
            return (
              <DataRow 
                key={'bike_'+idx} 
                avatar={{src: bicycle,alt:bike.model}}
                hasDivider={idx !== bikes.length - 1}
                typography = {
                  {
                    value: `${bike.location} - ${bike.color}`,
                    secondary_value: 
                    <Chip 
                      component="span" 
                      sx={{m:1}} 
                      size="small" 
                      label={bike.rentable ? 'Rentable' : 'Unrentable'} 
                      color={bike.rentable ? 'success' : 'error'}
                      variant="outlined" 
                    />
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
                    <IconButton 
                      onClick={() => navigate('/bikes/'+bike._id)} 
                      color="secondary" 
                      edge="end" 
                      aria-label="view"
                    >
                        <Visibility />
                    </IconButton>
                    <IconButton 
                      onClick={() => openEdit(bike)} 
                      color="primary" 
                      edge="end" 
                      aria-label="edit"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => performDelete(false,bike)} 
                      color="error" 
                      edge="end" 
                      aria-label="delete"
                    >
                        <DeleteIcon />
                    </IconButton>
                  </React.Fragment>
                }
              />
            )
          })
        }
        </List>
        <ConfirmationDialog 
          title={`Delete bike ${selectedBike?.model} - ${selectedBike?.color}`}
          message={
            `Are you sure you want to delete bike 
            "${selectedBike?.model} - ${selectedBike?.color}"?
            This will also delete all of bike's reservations.
          `}
          open={openDeleteConf}
          setOpen={setOpenDeleteConf}
          action={()=>performDelete(true,selectedBike)}
        />

        <BikeModal 
          open={openBikeModal}
          setOpen={setOpenBikeModal}
          bike={selectedBike}
          action={
            selectedBike
            ? performEdit
            : performCreate
          }
        />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <Stack direction="row" spacing={2} sx={{justifyContent:'end', m:2}}>
          <Button 
            variant="contained" 
            endIcon={<AddIcon />} 
            color="success"
            onClick={() => {
                setSelectedBike(null);
                setOpenBikeModal(true);
              }
            }
          >
            Create a bike
          </Button>
        </Stack>
      <div>
        There are no bikes yet.
      </div>
      <BikeModal 
          open={openBikeModal}
          setOpen={setOpenBikeModal}
          bike={selectedBike}
          action={
            selectedBike
            ? performEdit
            : performCreate
          }
        />
    </React.Fragment>
  )
}

export default Bikes;