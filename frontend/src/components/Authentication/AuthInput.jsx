import React from "react";
export default function AuthInput({
  type,
  placeholder,
  value,
  onChange,
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      {...props}
    />
  );
}
