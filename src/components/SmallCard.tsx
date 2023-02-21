import React from "react";

export default function SmallCard(props: any) {
  return (
    <div className="px-6 py-6 mx-4 my-4 bg-white border-gray-200 rounded-lg shadow-md w-80 md:mx-8 lg:px-8 border-1">
      {props.children}
    </div>
  );
}
