import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar";

const MainLayout = () => {
    return (
        <>
            <Navbar />

            <main className="pt-13">
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;