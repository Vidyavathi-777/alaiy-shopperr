import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CategoryProductsPage from "../pages/CategoryProductsPage";

const router = createBrowserRouter([
    {
        path : "/",
        element : <App />,
        children :[
            {
                path : "",
                element : <HomePage />
            },
            {
                path : "login",
                element  : <Login />

            },
            {
                path:'register',
                element:<Register />
            },
            {
                path : 'categories/:category',
                element:<CategoryProductsPage />
            }
        ]
    }
])

export default router


