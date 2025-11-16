import React, { useState, useMemo } from "react";

function get(obj, path) {
  if (typeof path === "function") return path(obj);
  return obj[path];
}

export function DataTable({ data = [], columns = [] }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        const aValue = get(a, sortConfig.key);
        const bValue = get(b, sortConfig.key);
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {column.sortable ? (
                  <button onClick={() => requestSort(column.accessor)} className="uppercase font-medium">
                    {column.header}
                    {getSortIndicator(column.accessor)}
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedData.map((item, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  {column.render ? column.render(item) : String(get(item, column.accessor))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
