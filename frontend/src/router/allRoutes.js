import React from "react";
import RentBike from "../views/RentBike";
import Reservations from "../views/Reservations";
import Bikes from "../views/Bikes";
import Users from "../views/Users";
import NoRights from "../views/NoRights";
import GeneralError from "../views/GeneralError";
import NoMatch from "../views/NoMatch";
import { Navigate } from "react-router-dom";
import UserView from '../views/UserView';
import BikeView from '../views/BikeView';


const routes = [
	{
		path: "/",
		exact: true,
		rights: ['Manager','User'],
		name: 'Home',
		hasNavbar:true,
		showInNavbar: false,
		main: (props) => {
			return (
				<Navigate 
					replace 
					to={
						props.role === 'Manager' 
						? "/bikes" 
						: "/rentabike"
					} 
				/>
			)
		}
	},
	{
		path: "/auth",
		exact: true,
		rights: ['Manager','User'],
		name: 'Auth',
		hasNavbar:false,
		showInNavbar: false,
		main: () => <Navigate replace to="/" />
	},
	{
		path: "/rentabike",
		exact: true,
		rights: ['User'],
		name: 'Rent a bike',
		hasNavbar:true,
		showInNavbar: true,
		main: () => <RentBike />
	},
	{
		path: "/reservations",
		exact: true,
		rights: ['User'],
		name: 'See my reservations',
		hasNavbar:true,
		showInNavbar: true,
		main: () => <Reservations />
	},
	{
		path: "/bikes",
		exact: true,
		rights: ['Manager'],
		name: 'Bikes',
		hasNavbar:true,
		showInNavbar: true,
		main: () => <Bikes />
	},
	{
		path: "/bikes/:id",
		exact: true,
		rights: ['Manager'],
		name: 'BikeView',
		hasNavbar:true,
		showInNavbar: false,
		breadcrumbs:[{link:'/bikes',name:'Bikes'},{name:'View'}],
		main: () => <BikeView />
	},
	{
		path: "/users",
		exact: true,
		rights: ['Manager'],
		name: 'Users',
		hasNavbar:true,
		showInNavbar: true,
		main: () => <Users />
	},
	{
		path: "/users/:id",
		exact: true,
		rights: ['Manager'],
		name: 'UserView',
		hasNavbar:true,
		showInNavbar: false,
		breadcrumbs:[{link:'/users',name:'Users'},{name:'View'}],
		main: () => <UserView />
	},
	{
		path: "/no-rights",
		exact: true,
		rights: ['Manager', 'User'],
		name: 'Access denied',
		hasNavbar:false,
		showInNavbar: false,
		main: () => <NoRights />
	},
	{
		path: "/error",
		exact: true,
		rights: ['Manager', 'User'],
		name: 'General error',
		hasNavbar:false,
		showInNavbar: false,
		main: () => <GeneralError />
	},
	{
		path: "*",
		exact:true,
		rights: ['Manager','User'],
		name: 'No match',
		hasNavbar:false,
		showInNavbar: false,
		main: () => <NoMatch />
	}
	
];

export { routes };
