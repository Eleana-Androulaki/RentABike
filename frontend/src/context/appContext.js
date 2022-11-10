import createDataContext from './createDataContext';
import mainApi from '../api/main_api';
import axios from 'axios';
import baseUrl from '../api/baseUrl';


const appReducer = (state, action) => {
    switch (action.type){
        case 'setLocation': 
            return{
                ...state,
                location: action.payload
            }
        case 'changeAlert':
          return{
                    ...state,
                    alertProps:action.payload
                }
        case 'setLoading':
            return{
                        ...state,
                        loading:action.payload
                    }
        case 'setHasServerError':
            return{
                        ...state,
                        hasServerError:action.payload
                    }
        case 'setLoggedInUser':
            return{
                ...state,
                loggedInUser:action.payload
            }
        case 'setUsers':
            return{
                ...state,
                users:action.payload
            }
        case 'setUser':
            return{
                ...state,
                user:action.payload
            }
        case 'setBikes':
            return{
                ...state,
                bikes:action.payload
            }
        case 'setBike':
            return{
                ...state,
                bike:action.payload
            }
        case 'logout':
            return{
                ...state,
                alertProps: {show:false,type:null,message:''},
                loading: false,
                loggedInUser: null,
                user: null,
                users: null,
                bike: null,
                bikes: null
            }
        default:
            return state;
    }
};

const setLocation = (dispatch)=>{
    return (newLocation) =>{
        dispatch({
            type: 'setLocation',
            payload: newLocation
        })
    }
}

const changeAlert = (dispatch) => {
    return (show,type,message) => {
        let alertProps = {show,type,message}
        dispatch({
            type: 'changeAlert',
            payload: alertProps
        })
    }
}

const setLoading = (dispatch) => {
    return (show) => {
        dispatch({
            type: 'setLoading',
            payload: show
        })
    }
}

const setHasServerError = (dispatch) => {
    return (hasError) => {
        dispatch({
            type: 'setHasServerError',
            payload: hasError
        })
    }
}


const login = (dispatch) => {
    return (credentials) => {
        let body = {
            email: credentials.email,
            password: credentials.password
        }
        setLoading(dispatch)(true);
        mainApi.post("/api/user/login",body).then((response)=>{
            dispatch({
                type: 'setLoggedInUser',
                payload: response.data.user
            })
            localStorage.setItem('token',response.data.token);
            changeAlert(dispatch)(false,null,'');
        }).catch(err=>{
            changeAlert(dispatch)(true,'error',err.response.data);
        }).finally(() => setLoading(dispatch)(false))
    }
}

const register = (dispatch) => {
    return (newUser, callback) => {
        setLoading(dispatch)(true);
        mainApi.post("/api/user/register",newUser).then(()=>{
            changeAlert(dispatch)(true,'success','User successfully created! Please log in.');
            if(callback)
            {
                callback(true)
            }
        })
        .catch((err)=>{
            changeAlert(dispatch)(true,'error',err.response.data);
        }).finally(() => setLoading(dispatch)(false))
    }
}

const logout = (dispatch) => {
    return (callback) => {
        localStorage.removeItem("token");
        dispatch({
            type: 'logout',
            payload: null
        })
        callback();
    }
}

const fetchLoggedInUser = (dispatch) => {
    return (token) => {
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }
        setLoading(dispatch)(true);
        
        mainApi.get("/api/user/loggedInUser",{headers}).then((response)=>{
            dispatch({
                type: 'setLoggedInUser',
                payload: response.data.user
            })
        })
        .catch((err)=>
            {
                console.error(err);
                localStorage.removeItem("token");
            }
        ).finally(() => setLoading(dispatch)(false))
    }
}

const getUsers = (dispatch) => {
    return (token) => {
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }
        setLoading(dispatch)(true);
        mainApi.get("/api/user/",{headers}).then((response)=>{
            dispatch({
                type: 'setUsers',
                payload: response.data
            })
        })
        .catch((err)=>{
            console.error(err);
            setHasServerError(dispatch)(true);
        }).finally(() => setLoading(dispatch)(false))
    }
}

const getUser = (dispatch) => {
    return (token,id) => {
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }

        setLoading(dispatch)(true);
        mainApi.get("/api/user/"+id,{headers}).then((response)=>{
            dispatch({
                type: 'setUser',
                payload: response.data
            })
        })
        .catch((err)=>
            {
                console.error(err);
                setHasServerError(dispatch)(true);
            }
        ).finally(() => {setLoading(dispatch)(false);})
    }
}

const createUser = (dispatch) => {
    return (token, user) =>{
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }
        setLoading(dispatch)(true);
        mainApi.post("/api/user/",user,{headers}).then((response)=>{
            dispatch({
                type: 'setUsers',
                payload: response.data.users
            })
            changeAlert(dispatch)(true,'success','User successfully created');
        }).catch((err)=>{
            console.error(err);
            changeAlert(dispatch)(true,'error',err.response.data);
        }).finally(() => setLoading(dispatch)(false))
    }
}

const updateUser = (dispatch) => {
    return (token, user) =>{
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }
        setLoading(dispatch)(true);
        mainApi.put("/api/user/"+user._id,user,{headers}).then((response)=>{
            dispatch({
                type: 'setUsers',
                payload: response.data.users
            })
            changeAlert(dispatch)(true,'success','User successfully updated');
        }).catch((err)=>{
            console.error(err);
            changeAlert(dispatch)(true,'error',err.response.data);
        }).finally(() => setLoading(dispatch)(false))
    }
}

const deleteUser = (dispatch) => {
    return (token, user) => {
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }
        setLoading(dispatch)(true);
        axios({
            method: 'DELETE',
            url: baseUrl+'api/user/'+user._id,
            headers: headers
        })
        .then((response) => {
            dispatch({
                type: 'setUsers',
                payload: response.data.users
            })
            changeAlert(dispatch)(true,'success','User successfully deleted');
        })
        .catch((err) => {
            console.error(err);
            changeAlert(dispatch)(true,'error',err.response.data);
        }).finally(() => setLoading(dispatch)(false))
    }
}

const getBikes = (dispatch) => {
    return (token) => {
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }
        setLoading(dispatch)(true);
        mainApi.get("/api/bike/",{headers}).then((response)=>{
            dispatch({
                type: 'setBikes',
                payload: response.data
            })
        })
        .catch((err)=>{
            console.error(err);
            setHasServerError(dispatch)(true);   
        }).finally(() => setLoading(dispatch)(false))
    }
}

const getBike = (dispatch) => {
    return (token,id) => {
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }
        setLoading(dispatch)(true);
        mainApi.get("/api/bike/"+id,{headers}).then((response)=>{
            dispatch({
                type: 'setBike',
                payload: response.data.bike
            })
        })
        .catch((err)=>{
            console.error(err);
            setHasServerError(dispatch)(true);   
        }).finally(() => setLoading(dispatch)(false))
    }
}

const createBike = (dispatch) => {
    return (token, bike) =>{
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }
        setLoading(dispatch)(true);
        mainApi.post("/api/bike/",bike,{headers}).then((response)=>{
            dispatch({
                type: 'setBikes',
                payload: response.data.bikes
            })
            changeAlert(dispatch)(true,'success','Bike successfully created!');
        }).catch((err)=>{
            console.error(err);
            changeAlert(dispatch)(true,'error',err.response.data);
        }).finally(() => setLoading(dispatch)(false))
    }
}

const updateBike = (dispatch) => {
    return (token, bike) =>{
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }
        setLoading(dispatch)(true);
        mainApi.put("/api/bike/"+bike._id,bike,{headers}).then((response)=>{
            dispatch({
                type: 'setBikes',
                payload: response.data.bikes
            })
            changeAlert(dispatch)(true,'success','Bike successfully updated!');
        }).catch((err)=>{
            console.error(err);
            changeAlert(dispatch)(true,'error',err.response.data);
        }).finally(() => setLoading(dispatch)(false))
    }
}

const deleteBike = (dispatch) => {
    return (token, bike) => {
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }
        setLoading(dispatch)(true);
        axios({
            method: 'DELETE',
            url: baseUrl+'api/bike/'+bike._id,
            headers: headers
        })
        .then((response) => {
            dispatch({
                type: 'setBikes',
                payload: response.data.bikes
            })
            changeAlert(dispatch)(true,'success','Bike successfully deleted!');
        })
        .catch((err) => {
            console.error(err);
            changeAlert(dispatch)(true,'error',err.response.data);
        }).finally(() => setLoading(dispatch)(false))
    }
}

const deleteReservation = (dispatch) => {
    return (token, reservation, user, bikes) => {
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }
        setLoading(dispatch)(true);
        axios({
            method: 'DELETE',
            url: baseUrl+'api/reservation/'+reservation._id,
            headers: headers
        })
        .then(() => {
            let updatedUser = {
                ...user,
                reservations: user.reservations.filter(res => res._id !== reservation._id)
            }

            let updatedBikes = bikes.map((bike)=>{
                return {
                    ...bike,
                    reservations: bike.reservations.filter(res=> res._id !== reservation._id)
                }
            })



            dispatch({
                type: 'setUser',
                payload: updatedUser
            })
            dispatch({
                type: 'setBikes',
                payload: updatedBikes
            })
            changeAlert(dispatch)(true,'success','Reservation successfully canceled!');
        })
        .catch((err) => {
            console.error(err);
            changeAlert(dispatch)(true,'error',err.response.data);
        }).finally(() => setLoading(dispatch)(false))
    }
}

const rateBike = (dispatch) => {
    return (token, bike, user, rate) => {
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }
        setLoading(dispatch)(true);
        mainApi.put("/api/bike/"+bike._id,{rating:rate},{headers})
        .then((response) => {
            let updatedReservations = user.reservations.map(res => {
                return {
                    ...res,
                    bike: response.data.bikes.find(item => item._id === res.bike._id)
                }
            })
            let updatedUser = {
                ...user,
                reservations: updatedReservations
            }
            dispatch({
                type: 'setUser',
                payload: updatedUser
            })
            dispatch({
                type: 'setBikes',
                payload: response.data.bikes
            })

            
            changeAlert(dispatch)(true,'success','Rate successfully added!');
        })
        .catch((err) => {
            console.error(err);
            changeAlert(dispatch)(true,'error',err.response.data);
        }).finally(() => setLoading(dispatch)(false))
    }
}

const createReservation = (dispatch) =>{
    return (token, bikes,user, reservation) =>{
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token": token
        }
        setLoading(dispatch)(true);
        mainApi.post("/api/reservation/",reservation,{headers}).then((response)=>{
            let updatedBikes = bikes.map((bike)=>{
                return {
                    ...bike,
                    reservations: response.data.reservations.filter((res)=> res.bike._id === bike._id)
                }
            })
            let updatedUser = {
                ...user,
                reservations: response.data.reservations.filter(res => res.user._id === user._id)
            }
            dispatch({
                type: 'setBikes',
                payload: updatedBikes
            })
            dispatch({
                type: 'setUser',
                payload: updatedUser
            })
            changeAlert(dispatch)(true,'success','Reservation successfully created!');
        }).catch((err)=>{
            console.error(err);
            changeAlert(dispatch)(true,'error',err.response.data);
        }).finally(() => setLoading(dispatch)(false))
    }
}

export const { Context, Provider } = createDataContext(
    appReducer,
    {
        setLocation,
        changeAlert,
        setLoading,
        logout,
        login,
        getUsers,
        getUser,
        register,
        deleteUser,
        createUser,
        updateUser,
        fetchLoggedInUser,
        getBikes,
        getBike,
        deleteBike,
        createBike,
        updateBike,
        setHasServerError,
        deleteReservation,
        rateBike,
        createReservation

    },
    {
        alertProps: {show:false,type:null,message:''},
        loading: false,
        loggedInUser: null,
        user: null,
        users: null,
        bike: null,
        bikes: null,
        hasServerError: false,
        location:''
    }
);
