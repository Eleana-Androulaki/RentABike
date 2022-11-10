import React, {useState, useEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
  
  
const BikeModal = ({open, setOpen, bike, action}) => {

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleChangeRentable = (event) => {
        setValues({ ...values, rentable: event.target.checked });
    };


    const [values, setValues] = useState({
        model: '',
        color: '',
        location:'',
        rentable:true,
    });

    const [errors, setErrors] = useState({
        model: '',
        color: '',
        location:'',
    })

    const rules = {
        model: v => !!v,
        color: v => !!v,
        location: v => !!v,
    }

    const save = () => {
    
        let errorObj = {
            model:'Please fill in the model field',
            color: 'Please fill in the color field',
            location: 'Please fill in the location field',
        }
        
        Object.keys(values).forEach( key => {
          if(rules[key] && rules[key](values[key]))
          {
            errorObj[key] = '';
          }
        });
        
        if(Object.values(errorObj).some( v => v !== '' ))
        {
            setErrors(errorObj);
        }
        else
        {
            setErrors(errorObj);
            let newBike = {...values};

            if(bike)
            {
                newBike['_id'] = bike._id;
            }
            setOpen(false);
            action(newBike);
        }
    }

    useEffect(()=>{
        if(bike)
        {
            let tempValues = {
                model: bike.model,
                color: bike.color,
                location:bike.location,
                rentable:bike.rentable,
            }
            setValues(tempValues);
        }
        else
        {
            setValues({
                model: '',
                color: '',
                location:'',
                rentable:true,
            });
        }
    },[bike])

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            fullWidth={true}
            maxWidth="lg"
        >
            <DialogTitle>{bike ? `Edit ${bike.model}` : 'Create bike'}</DialogTitle>
            
            <DialogContent>
            <Box
                sx={{ display: 'flex', flexWrap: 'wrap' }}
            >
                <FormControl variant="standard" sx={{ m: 'auto', mt: 3, width: {xs:'100%',md:'80%'} }}>
                    <InputLabel error={errors.model !== ''} htmlFor="model">Model</InputLabel>
                    <Input
                        id="model"
                        value={values.model}
                        error={errors.model !== ''}
                        onChange={handleChange('model')}
                        type='text'
                        autoComplete="off"
                    />
                    <FormHelperText error id="model-help-text">{errors.model}</FormHelperText>
                </FormControl>
                
                <FormControl variant="standard" sx={{ m: 'auto', mt: 3, width: {xs:'100%',md:'80%'} }}>
                    <InputLabel error={errors.color !== ''} htmlFor="color">Color</InputLabel>
                    <Input
                        id="color"
                        value={values.color}
                        error={errors.color !== ''}
                        onChange={handleChange('color')}
                        type='text'
                        autoComplete="off"
                    />
                    <FormHelperText error id="color-help-text">{errors.color}</FormHelperText>
                </FormControl>
                
                <FormControl variant="standard" sx={{ m: 'auto', mt: 3, width: {xs:'100%',md:'80%'} }}>
                    <InputLabel error={errors.location !== ''} htmlFor="model">Location</InputLabel>
                    <Input
                        id="model"
                        value={values.location}
                        error={errors.location !== ''}
                        onChange={handleChange('location')}
                        type='text'
                        autoComplete="off"
                    />
                    <FormHelperText error id="location-help-text">{errors.location}</FormHelperText>
                </FormControl>

                <FormControlLabel 
                    control={
                        <Checkbox
                            checked={values.rentable}
                            onChange={handleChangeRentable}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    } 
                    label="Rentable" 
                    sx={{ m: 'auto', mt: 3, width: {xs:'100%',md:'80%'} }}
                />
            </Box>
            </DialogContent>
            
            <DialogActions>
                <Button onClick={handleClose} color="error">Cancel</Button>
                <Button onClick={save} color="success">Save</Button>
            </DialogActions>

        </Dialog>
    );
}

export default BikeModal;