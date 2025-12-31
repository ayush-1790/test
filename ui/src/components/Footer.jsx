import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-6 text-center">
      <p>&copy; {new Date().getFullYear()} . All rights reserved.</p>
    </footer>
  );
};

export default Footer;
