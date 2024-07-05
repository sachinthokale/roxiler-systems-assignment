import { useState } from "react";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import Statistics from "./components/Statistics";
import Table from "./components/Table";
import MonthYearDropdown from "./components/MonthYearDropdown";

const App = () => {
  const [selectedDate, setSelectedDate] = useState({ month: 3, year: 2000 });

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className=" bg-[#022B3A] w-screen h-screen p-2 flex">
      <div className=" w-1/2 h-full">
        <div className="w-full p-2 flex gap-2">
          <Statistics selectedDate={selectedDate} />
          <MonthYearDropdown onSelect={handleDateSelect} />
        </div>
        <div className="w-full h-4/5 flex border border-gray-500 rounded-lg p-2 justify-center items-center">
          <Table selectedDate={selectedDate} />
        </div>
      </div>
      <div className=" w-1/2 h-full flex flex-col border border-gray-500 rounded-lg">
        <div className=" w-full h-1/2 p-4 ">
          <PieChart selectedDate={selectedDate} />
        </div>
        <div className=" w-full h-1/2 p-4">
          <BarChart selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default App;
