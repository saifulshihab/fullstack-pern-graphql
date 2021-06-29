import React from "react";
import Navbar from "./Navbar";
import Wrapper, { WrapperVarient } from "./Wrapper";

interface LayoutProps {
  varient: WrapperVarient;
}

const Layout: React.FC<LayoutProps> = ({ varient, children }) => {
  return (
    <>
      <Navbar />
      <Wrapper varient={varient}>{children}</Wrapper>
    </>
  );
};

export default Layout;
