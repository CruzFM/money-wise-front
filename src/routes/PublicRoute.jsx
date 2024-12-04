import { Navigate } from "react-router-dom";

export default function PublicRoute ( {children} ) {
    const token = sessionStorage.getItem('auth_token');

    if(token) {
        return <Navigate to='/' />
    }

    return children;
}