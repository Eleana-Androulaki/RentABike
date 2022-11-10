import React, {useState, useEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import isValidEmail from '../../helpers/isValidEmail';  
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
  
  
const UserModal = ({open, setOpen, user, action}) => {

    const handleClose = () => {
        setOpen(false);
    };

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

    const [values, setValues] = useState({
        email: '',
        password: '',
        name:'',
        role:'User',
        showPassword: false,
    });

    const [errors, setErrors] = useState({
        email: '',
        name: '',
        password: '',
        role: ''
    })

    const rules = {
        email: v => !!v && isValidEmail(v),
        password: v => !user ? !!v : true,
        name: v => !!v,
        role: v => !!v
    }

    const save = () => {
    
        let errorObj = {
          email:'Please fill a valid email address (e.g example@example.com)',
          password: 'Please fill in the password field',
          name: 'Please fill in the name field',
          role: 'Please fill in the role field'
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
            let {password,showPassword,...newUser} = values;

            if(user)
            {
                newUser['_id'] = user._id;
            }
            else{
                newUser['password'] = password;
            }
            setOpen(false);
            action(newUser);
        }
    }

    useEffect(()=>{
        if(user)
        {
            let tempValues = {
                email: user.email,
                name:user.name,
                role:user.role,
                password: '',
                showPassword: false
            }
            setValues(tempValues);
        }
        else
        {
            setValues({
                email: '',
                password: '',
                name:'',
                role:'User',
                showPassword: false,
            });
        }
    },[user])

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            fullWidth={true}
            maxWidth="lg"
        >
            <DialogTitle>{user ? `Edit ${user.name}` : 'Create user'}</DialogTitle>
            
            <DialogContent>
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
                
                {user
                ?   null
                :   <FormControl sx={{ m: 'auto', mt: 3, width: {xs:'100%',md:'80%'} }} variant="standard">
                        <InputLabel error={errors.password !== ''}   htmlFor="password">Password</InputLabel>
                        <Input
                            id="password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            error={errors.password !== ''}
                            disabled={user ? true : false}
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
                }

                <FormControl sx={{ m: 'auto', mt: 3, width: {xs:'100%',md:'80%'} }} variant="standard">
                    <InputLabel error={errors.role !== ''}   htmlFor="role">Role</InputLabel>
                    <Select
                        id="role"
                        value={values.role}
                        onChange={handleChange('role')}
                    >
                        <MenuItem value="User">User</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                    </Select>
                </FormControl>
                
            </Box>
            </DialogContent>
            
            <DialogActions>
                <Button onClick={handleClose} color="error">Cancel</Button>
                <Button onClick={save} color="success">Save</Button>
            </DialogActions>

        </Dialog>
    );
}

export default UserModal;