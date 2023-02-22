import React from "react";

export default function Card(props: any) {
  return (
    <div className="px-6 py-6 mx-auto my-4 bg-white border-gray-200 rounded-lg shadow-md w-80 md:w-96 md:px-8 border-1">
      {props.children}
    </div>
  );
}
