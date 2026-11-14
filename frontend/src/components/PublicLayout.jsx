import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar";

const PublicLayout = () => {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
            
        </>
    );
};

export default PublicLayout;