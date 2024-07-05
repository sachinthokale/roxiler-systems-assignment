/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useTable, usePagination } from "react-table";

const Table = ({ selectedMonth }) => {
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const { data } = await axios.get(
          `http://localhost:5000/api/transactions?search=${search}&month=${selectedMonth}&page=${page}&perPage=${perPage}`
        );
        console.log(data.transaction);
        setTableData(data.transaction);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [page, perPage, search, selectedMonth]);

  const COLUMNS = useMemo(
    () => [
      { Header: "Id", accessor: "id" },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ value }) => (
          <div className="relative group">
            <span className="group-hover:underline">
              {value.length > 15 ? `${value.slice(0, 15)}...` : value}
            </span>
            <div className="absolute bottom-0 left-0 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {value}
            </div>
          </div>
        ),
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => (
          <div className="relative group">
            <span className="group-hover:underline">
              {value.length > 15 ? `${value.slice(0, 15)}...` : value}
            </span>
            <div className="absolute bottom-0 left-0 w-60 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {value}
            </div>
          </div>
        ),
      },
      { Header: "Price", accessor: "price" },
      { Header: "Category", accessor: "category" },
      {
        Header: "Sold",
        accessor: "sold",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        Header: "Images",
        accessor: "image",
        Cell: ({ value }) => (
          <a href={value} target="_blank" rel="noopener noreferrer">
            link
          </a>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data: tableData,
      initialState: { pageIndex: page - 1, pageSize: perPage },
      manualPagination: true,
      pageCount: Math.ceil(totalCount / perPage),
    },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page: tablePage,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,

    state: { pageIndex, pageSize },
  } = tableInstance;

  useEffect(() => {
    setPage(pageIndex + 1);
    setPerPage(pageSize);
  }, [pageIndex, pageSize]);

  return (
    <div className="table-container w-full text-white p-2">
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 bg-gray-700 text-white rounded w-full text-sm"
        />
      </div>
      <table {...getTableProps()} className="min-w-full text-white text-xs">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              key={headerGroup.id}
              {...headerGroup.getHeaderGroupProps()}
              className="border-b border-gray-700"
            >
              {headerGroup.headers.map((column) => (
                <th
                  key={column.id}
                  {...column.getHeaderProps()}
                  className="p-2 text-left text-pink-500"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="divide-y divide-gray-700">
          {tablePage.map((row) => {
            prepareRow(row);
            return (
              <tr
                key={row.id}
                {...row.getRowProps()}
                className="hover:bg-gray-700"
              >
                {row.cells.map((cell) => (
                  <td
                    key={cell.id}
                    {...cell.getCellProps()}
                    className="p-2 text-yellow-500"
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination flex justify-between items-center mt-2">
        <div>
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="p-1 m-1 bg-gray-600 text-white rounded disabled:opacity-50"
          >
            {"<<"}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="p-1 m-1 bg-gray-600 text-white rounded disabled:opacity-50"
          >
            {"<"}
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="p-1 m-1 bg-gray-600 text-white rounded disabled:opacity-50"
          >
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageOptions.length - 1)}
            disabled={!canNextPage}
            className="p-1 m-1 bg-gray-600 text-white rounded disabled:opacity-50"
          >
            {">>"}
          </button>
        </div>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            className="p-1 bg-gray-700 text-white rounded w-20"
          />
        </span>
      </div>
    </div>
  );
};

export default Table;
