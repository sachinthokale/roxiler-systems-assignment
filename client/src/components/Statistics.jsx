/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";

const Statistics = ({ selectedDate }) => {
  const [data, setData] = useState({});
  useEffect(() => {
    const { month, year } = selectedDate;
    console.log(month, year);
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/statistics?year=${year}&month=${month}`
        );

        setData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [selectedDate]);
  return (
    <div className=" border border-gray-500 rounded-lg w-1/2 h-28 p-1 flex flex-col justify-center items-center text-yellow-500">
      <div className=" flex w-full">
        <p className=" w-2/3">Total sale</p>
        <p>{data.totalSaleAmount}</p>
      </div>
      <div className="  flex w-full">
        <p className=" w-2/3">Total sold item</p>
        <p>{data.totalSoldItems}</p>
      </div>
      <div className=" flex w-full">
        <p className=" w-2/3">Total not sold item</p>
        <p>{data.totalNotSoldItems}</p>
      </div>
    </div>
  );
};

export default Statistics;
