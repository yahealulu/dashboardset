import React, { ReactElement } from 'react';
import { useStore } from '../../store/zustandStore';
import { Navigate, NavLink, useLocation } from 'react-router-dom';

const ProtectRoute = ({ children }: { children: ReactElement }) => {
    const UserToken = useStore((store) => store.UserToken);
    const location = useLocation();
    if (!UserToken) return <Navigate to={'/logIn'} state={{ path: location.pathname }} />;
    else return children;
};

export default ProtectRoute;
