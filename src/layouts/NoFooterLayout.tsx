import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";

const NoFooterLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default NoFooterLayout;
