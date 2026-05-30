import { BrowserRouter, Routes, Route } from "react-router-dom";

import ClientLayout from "../layouts/ClientLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/client/Home";
import Profile from "../pages/client/profile/Profile";
import SearchPage from "../pages/client/search/SearchPage";

import Dashboard from "../pages/admin/Dashboard";
import ThuaDat from "../pages/admin/thuadat/ThuaDat";
import ThuaDatMap from "../pages/admin/thuadat/components/ThuaDatMap";
import CongTrinh from "../pages/admin/congtrinh/CongTrinh";
import ChuSoHuu from "../pages/admin/chusohuu/ChuSoHuu";
import User from "../pages/admin/user/User";
import BienDong from "../pages/admin/biendong/BienDong";

export default function AppRoutes() {

    return (
        <BrowserRouter>
            <Routes>

                {/* CLIENT */}
                <Route path="/" element={<ClientLayout />}>
                    <Route index element={<Home />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="search" element={<SearchPage />} />
                </Route>

                {/* ADMIN */}
                <Route path="/admin" element={<AdminLayout />}>

                    <Route index element={<Dashboard />} />

                    <Route path="thua-dat" element={<ThuaDat />} />

                    <Route path="thuadat/map/:id" element={<ThuaDatMap />} />

                    <Route path="cong-trinh" element={<CongTrinh />} />

                    <Route path="chu-so-huu" element={<ChuSoHuu />} />

                    <Route path="users" element={<User />} />

                    <Route path="bien-dong" element={<BienDong />} />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}