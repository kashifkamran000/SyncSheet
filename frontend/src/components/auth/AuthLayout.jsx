import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authStore';

export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        const checkAuthStatus = () => {
            if (authentication && !authStatus) {
                dispatch(logout());
                navigate("/login");
            } else if (!authentication && authStatus) {
                navigate("/");
            }
            setLoader(false);
        };

        checkAuthStatus();
    }, [authStatus, navigate, authentication, dispatch]);

    return loader ? <h1>Loading...</h1> : <>{children}</>;
}
