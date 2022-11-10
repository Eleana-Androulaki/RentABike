import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import isValidEmail from '../../helpers/isValidEmail';
import { Context as AppContext}  from '../../context/appContext';

const Registration = ({setTab}) => {
  var { register} = useContext(AppContext);

  const [values, setValues] = useState({
    email: '',
    password: '',
    name:'',
    showPassword: false,
  });

  const [errors, setErrors] = useState({
    email: '',
    name: '',
    password: ''
  })

  const rules = {
    email: v => !!v && isValidEmail(v),
    password: v => !!v,
    name: v => !!v
  }

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const performRegistration = () => {
    
    let errorObj = {
      email:'Please fill a valid email address (e.g example@example.com)',
      password: 'Please fill in the password field',
      name: 'Please fill in the name field'
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
      register(values, (success)=>{
        if(success)
        {
          setTab('login');
        }
      })
    }
  }


  return (
    <React.Fragment>
      <Box
        sx={{ display: 'flex', flexWrap: 'wrap' }}
      >
        <FormControl variant="standard" sx={{ m: 'auto', mt: 3, width: {xs:'100%',md:'80%'} }}>
          <InputLabel error={errors.email !== ''} htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            value={values.email}
            error={errors.email !== ''}
            onChange={handleChange('email')}
            type='text'
            autoComplete="off"
          />
          <FormHelperText error id="email-help-text">{errors.email}</FormHelperText>
        </FormControl>
        
        <FormControl variant="standard" sx={{ m: 'auto', mt: 3, width: {xs:'100%',md:'80%'} }}>
          <InputLabel error={errors.name !== ''}  htmlFor="name">Name</InputLabel>
          <Input
            id="name"
            value={values.name}
            error={errors.name !== ''}
            onChange={handleChange('name')}
            type='text'
            autoComplete="off"
          />
          <FormHelperText error id="name-help-text">{errors.name}</FormHelperText>
        </FormControl>
        
        <FormControl sx={{ m: 'auto', mt: 3, width: {xs:'100%',md:'80%'} }} variant="standard">
          <InputLabel error={errors.password !== ''}   htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            error={errors.password !== ''}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText error id="password-help-text">{errors.password}</FormHelperText>
        </FormControl>
        
      </Box>
      <Stack direction="row" spacing={2}>
        <Button 
          variant="contained"
          sx={{ m: 'auto', mt: 3, width: {xs:'70%',md:'50%'} }}
          onClick={performRegistration}
        >
          Register
        </Button>
      </Stack>
      
    </React.Fragment>
  );
}


export default Registration;