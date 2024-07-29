import React from "react";

const Cancel = () => {
  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Thanh toán đã hủy!</h1>
      <p className="text-lg text-gray-700">Bạn đã hủy quá trình thanh toán.</p>
    </div>
  );
};

export default Cancel;
