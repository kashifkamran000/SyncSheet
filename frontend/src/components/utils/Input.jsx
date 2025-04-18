import React, {forwardRef, useId} from 'react'

const Input = forwardRef(function Input({
    label,
    className = "",
    labelClassName = "",
    error,
    type = "text",
    ...props
  }, ref) {
  
    const id = useId();
    return (
      <div className="mb-4">
        {label && <label htmlFor={id} className={`inline-block mb-4 mt-1 pl-1 font-light text-main-text text-sm ${labelClassName}`}>{label}</label>}
        <input
          type={type}
          ref={ref}
          id={id}
          {...props}
          className={`text-sm px-3 py-2 rounded-lg bg-bg-main text-main-text font-light outline-none w-full duration-200 border focus:ring-2 ring-golden ring-opacity-20 shadow-inner focus:border-golden ${error && 'border-red-600'} ${className} `}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
    );
  });

export default Input