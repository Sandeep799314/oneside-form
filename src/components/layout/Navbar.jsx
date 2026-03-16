import React from "react";

const Navbar = () => {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 110,
        backgroundColor: "rgb(247, 190, 57)",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        fontFamily: "Poppins, sans-serif",
        fontWeight: 200,
        fontSize: "16px",
        lineHeight: "normal",
        letterSpacing: "normal",
        color: "#212529",
        padding: "0",
        margin: "0",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={() => window.location.reload()}
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          borderRadius: "6px",
          marginLeft: "15px",
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingTop: "4px",
          paddingBottom: "4px",
          cursor: "pointer",
          userSelect: "none",
          height: "34px",
          boxSizing: "border-box",
        }}
      >
        <img
          src="/logo3.png"
          alt="trav platforms"
          style={{
            height: "26px",
            width: "auto",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;