import React, { useContext, useState, useEffect } from 'react';
import { Context as AppContext } from '../context/appContext';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import DataRow from '../components/general/DataRow';
import List from '@mui/material/List';
import userIcon from '../assets/images/avatar.png';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import Chip from '@mui/material/Chip';
import ConfirmationDialog from '../components/general/ConfirmationDialog';
import UserModal from '../components/users/UserModal';
import { useNavigate } from "react-router-dom";

const Users = () => {
  var {state, getUsers,deleteUser, createUser, updateUser} = useContext(AppContext);
  const [users, setUsers] = useState(null);
  const token = localStorage.getItem('token');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDeleteConf, setOpenDeleteConf] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);

  const navigate = useNavigate();

  const openEdit = (user) => {
    setSelectedUser(user);
    setOpenUserModal(true);
  }

  const performEdit = (newUser)=>{
    updateUser(token,newUser)
  }

  const performCreate = (newUser) =>{
    createUser(token,newUser)
  }

  const performDelete = (shouldDelete, user) => {
    if(shouldDelete)
    {
      setOpenDeleteConf(false);
      setSelectedUser(null);
      deleteUser(token, user);
    }
    else
    {
      setSelectedUser(user);
      setOpenDeleteConf(true);
    }
  }

  useEffect(() => {
    
    if(state.users)
    {
      setUsers(state.users);
    }
    else
    {
      getUsers(token)
    }

  },[state.users, getUsers, token])

  if(users && users.length)
  {
    return (
      <React.Fragment>
        <Stack direction="row" spacing={2} sx={{justifyContent:'end', m:2}}>
          <Button 
            variant="contained" 
            endIcon={<AddIcon />} 
            color="success"
            onClick={() => {
                setSelectedUser(null);
                setOpenUserModal(true);
              }
            }
          >
            Create a user
          </Button>
        </Stack>
        <List sx={{ width: '100%', maxWidth: {xs:'100%', sm:500, lg:720}, m:'auto', mt:2 }}>
        {
          users.map((user,idx) => {
            return (
              <DataRow 
                key={'user_'+idx} 
                avatar={{src: userIcon,alt:user.name}}
                hasDivider={idx !== users.length - 1}
                typography = {
                  {
                    value: user.email,
                    secondary_value: 
                      user._id === state.loggedInUser?._id
                      ? <Chip 
                          component="span" 
                          sx={{m:1}} 
                          size="small" 
                          label={`Active - ${user.role}`} 
                          color="success" 
                          variant="outlined" 
                        />
                      : <Chip 
                          component="span" 
                          sx={{m:1}} 
                          size="small" 
                          label={user.role} 
                          color={user.role === 'Manager' ?"info" :"secondary"} 
                          variant="outlined" 
                        />
                  }
                }
                text={user.name}
                actions={
                  <React.Fragment>
                    <IconButton 
                      onClick={() => navigate('/users/'+user._id)} 
                      color="secondary" 
                      edge="end" 
                      aria-label="view"
                    >
                        <Visibility />
                    </IconButton>
                    <IconButton 
                      onClick={() => openEdit(user)} 
                      color="primary" 
                      edge="end" 
                      aria-label="edit"
                      disabled={user._id === state.loggedInUser?._id}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => performDelete(false,user)} 
                      color="error" 
                      edge="end" 
                      aria-label="delete"
                      disabled={user._id === state.loggedInUser?._id}
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
          title={`Delete user ${selectedUser?.name}`}
          message={
            `Are you sure you want to delete user "${selectedUser?.name}"?
             This will also delete all of user's reservations
            `
          }
          open={openDeleteConf}
          setOpen={setOpenDeleteConf}
          action={()=>performDelete(true,selectedUser)}
        />

        <UserModal 
          open={openUserModal}
          setOpen={setOpenUserModal}
          user={selectedUser}
          action={
            selectedUser
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
              setSelectedUser(null);
              setOpenUserModal(true);
            }
          }
        >
          Create a user
        </Button>
      </Stack>
      <UserModal 
          open={openUserModal}
          setOpen={setOpenUserModal}
          user={selectedUser}
          action={
            selectedUser
            ? performEdit
            : performCreate
          }
        />
    </React.Fragment>
  );
}

export default Users;