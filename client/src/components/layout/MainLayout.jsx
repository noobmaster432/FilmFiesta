import { Box } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import userApi from "../../api/modules/user.api";
import AuthModal from "../common/AuthModal";
import Footer from "../common/Footer";
import GlobalLoading from "../common/GlobalLoading";
import Topbar from "../common/Topbar";
import favouriteApi from "../../api/modules/favourite.api";
import { setListFavourites, setUser } from "../../redux/features/userSlice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const authUser = async () => {
      const { response, err } = await userApi.getInfo();

      if (response) dispatch(setUser(response));
      if (err) dispatch(setUser(null));
    };

    authUser();
  }, [dispatch]);

  useEffect(() => {
    const getFavourites = async () => {
      const { response, err } = await favouriteApi.getList();

      if (response) dispatch(setListFavourites(response));
      if (err) toast.error(err.message);
    };

    if (user) getFavourites();
    if (!user) dispatch(setListFavourites([]));
  }, [dispatch, user]);

  return (
    <>
      {/* global-loading */}
      <GlobalLoading />
      {/* global-loading */}

      {/* login modal */}
      <AuthModal />
      {/* login modal */}

      <Box display="flex" minHeight="100vh">
        {/* header */}
        <Topbar />
        {/* header */}

        {/* main */}
        <Box component="main" flexGrow={1} overflow="hidden" minHeight="100vh">
          <Outlet />
        </Box>
        {/* main */}
      </Box>

      {/* footer */}
      <Footer />
      {/* footer */}
    </>
  );
};

export default MainLayout;
