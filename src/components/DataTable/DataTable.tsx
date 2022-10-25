import * as React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, chakra, Input, FormControl, FormLabel, Text, Button, Select } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
  Column,
  Table as ReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  sortingFns,
  FilterFn,
  SortingFn,
  FilterFns,
} from "@tanstack/react-table";
import { useAsyncDebounce, useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { NextPage } from "next";
import { BeatLoader } from "react-spinners";

type Props = {
  data: any
  columns: any
  isLoading: boolean
}

const DataTable: NextPage<Props> = ({
  data,
  columns,
  isLoading
}) => {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    state,
    preGlobalFilteredRows,
    setGlobalFilter
  } =
    useTable({
      columns,
      data,
      initialState: {
        pageSize: 5,
      }
    }, useFilters, useGlobalFilter, useSortBy, usePagination);

  return (
    <div>
      <div>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      <div className='p-5 overflow-auto mt-5 bg-white rounded shadow'>
        <table className="table w-full table-auto " {...getTableProps()}>
          <thead className="text-gray-700 uppercase bg-gray-50">
            {headerGroups.map((headerGroup, idx) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                {headerGroup.headers.map((header, i) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  return (
                    <th
                      scope="col" className="py-3 px-6"
                      {...header.getHeaderProps(header.getSortByToggleProps())}
                      key={header.id}
                    >
                      {header.render('Header')}
                      <chakra.span pl="4">
                        {header.isSorted ? (
                          header.isSortedDesc ? (
                            <TriangleDownIcon aria-label="sorted descending" />
                          ) : (
                            <TriangleUpIcon aria-label="sorted ascending" />
                          )
                        ) : null}
                      </chakra.span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <>
                <tr className="bg-white border-b">
                  <td className="py-4 px-6" colSpan={columns?.length}>
                    <BeatLoader color="#F6AD55" />
                  </td>
                </tr>
              </>
            ) : (
              <>
                {page.length == 0 &&
                  <tr className="bg-white border-b" >
                    <td className="text-center py-4 px-6" colSpan={columns?.length}>
                      <p>Data tidak ada...</p>
                    </td>
                  </tr>}
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr className="bg-white border-b" {...row.getRowProps()} key={i}>
                      {row.cells.map((cell, idx) => {
                        return <td className="py-4 px-6" {...cell.getCellProps()} key={idx}>{cell.render("Cell")}</td>;
                      })}
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
      {page.length != 0 &&
        <div className="pagination mt-3">
          <div className="sm:hidden grid grid-cols-2">
            <Button roundedLeft={'10px'} roundedRight='none' bg={'orange.400'} textColor="white" _hover={{ bg: 'orange.300' }} onClick={() => previousPage()} disabled={!canPreviousPage} className="cursor-pointer">Previous</Button>
            <Button roundedLeft={'none'} roundedRight='10px' bg={'orange.400'} textColor="white" _hover={{ bg: 'orange.300' }} onClick={() => nextPage()} disabled={!canNextPage} className="cursor-pointer">Next</Button>
          </div>
          <div className="hidden sm:block">
            <div className="flex justify-between">
              <div className="flex gap-x-2 items-center">
                <span className="text-sm w-[150px]">
                  Page <span className="font-medium">{state.pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>
                </span>
                <Select
                  className="cursor-pointer"
                  value={state.pageSize}
                  bg='white'
                  onChange={e => {
                    setPageSize(Number(e.target.value))
                  }}
                >
                  {[5, 10, 20].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Button roundedLeft={'10px'} roundedRight='none' bg={'orange.400'} textColor="white" _hover={{ bg: 'orange.300' }} onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="cursor-pointer">«</Button>
                <Button rounded={'none'} bg={'orange.400'} textColor="white" _hover={{ bg: 'orange.300' }} onClick={() => previousPage()} disabled={!canPreviousPage} className="cursor-pointer">{'<'}</Button>
                <Button rounded={'none'} bg={'orange.400'} textColor="white" _hover={{ bg: 'orange.300' }} onClick={() => nextPage()} disabled={!canNextPage} className="cursor-pointer">{'>'}</Button>
                <Button roundedLeft={'none'} roundedRight='10px' rounded={'none'} bg={'orange.400'} textColor="white" _hover={{ bg: 'orange.300' }} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="cursor-pointer">»</Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

type PropsFilter = {
  preGlobalFilteredRows: any,
  globalFilter: any,
  setGlobalFilter: any
}

const GlobalFilter: NextPage<PropsFilter> = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <>
      <div className="flex flex-row gap-x-[20px] items-center">
        <Text className="font-bold">Cari</Text>
        <Input bg={'white'} borderColor={'orange.300'} borderWidth={2} w={{ base: 'full', md: '300px' }} value={value || ""} onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }} />
      </div>
    </>
  )
}


export default DataTable