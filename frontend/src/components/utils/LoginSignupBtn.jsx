import React from "react";

const LoginSignupBtn = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      className="group relative px-6 py-2 font-base text-main-text transition-colors duration-[200ms] delay-15 hover:text-white overflow-hidden rounded-full"
    >
      <span className="relative z-20 flex items-center">
        {children}
        <i className="fa-solid fa-arrow-right-to-bracket pl-2"></i>
      </span>
      <span className="absolute top-1/2 left-[2.15rem] -translate-y-1/2 h-[0.8rem] w-[0.8rem] scale-0 transition-all duration-700 group-hover:scale-[15] focus:ring-amber-500 hover:shadow-amber-500/50 bg-gradient-to-r from-amber-300/95 to-amber-600/95 rounded-full" />
    </button>
  );
};

export default LoginSignupBtn;