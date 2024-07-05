import { useState } from "react";

const MonthYearDropdown = ({ onSelect }) => {
  const months = [
    { id: 1, name: "January" },
    { id: 2, name: "February" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" },
  ];

  const years = Array.from({ length: 25 }, (_, i) => 2000 + i);

  const [selectedMonth, setSelectedMonth] = useState(months[0].id);
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const handleMonthChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setSelectedMonth(selectedId);
    onSelect({ month: selectedId, year: selectedYear });
  };

  const handleYearChange = (e) => {
    const selected = parseInt(e.target.value);
    setSelectedYear(selected);
    onSelect({ month: selectedMonth, year: selected });
  };

  return (
    <div className="flex space-x-4">
      <div>
        <label className="text-white" htmlFor="monthSelect">
          Select Month:
        </label>
        <select
          id="monthSelect"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="p-2 bg-gray-700 text-white rounded"
        >
          {months.map((month) => (
            <option key={month.id} value={month.id}>
              {month.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-white" htmlFor="yearSelect">
          Select Year:
        </label>
        <select
          id="yearSelect"
          value={selectedYear}
          onChange={handleYearChange}
          className="p-2 bg-gray-700 text-white rounded"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MonthYearDropdown;
