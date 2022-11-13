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
  isLoading: boolean,
  hiddenColumns?: string[]
  pagination?: boolean,
  isSearch?: boolean,
  sizeSet?: boolean
}

const DataTable: NextPage<Props> = ({
  data,
  columns,
  isLoading,
  hiddenColumns,
  isSearch, pagination, sizeSet
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
        hiddenColumns: hiddenColumns
      },
      autoResetPage: false,
      autoResetFilters: false
    }, useFilters, useGlobalFilter, useSortBy, usePagination);

  return (
    <div>
      <div>
        {isSearch ? <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        /> : null}
      </div>
      <div className='p-5 overflow-auto mt-5 bg-white rounded shadow'>
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup, idx) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                {headerGroup.headers.map((header, index) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  return (
                    <Th
                      {...header.getHeaderProps(header.getSortByToggleProps())}
                      key={index}
                    >
                      <div className="flex flex-row items-center">
                        {header.render('Header')}
                        <chakra.span pl="2">
                          {header.isSorted ? (
                            header.isSortedDesc ? (
                              <TriangleDownIcon aria-label="sorted descending" />
                            ) : (
                              <TriangleUpIcon aria-label="sorted ascending" />
                            )
                          ) : null}
                        </chakra.span>
                      </div>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {isLoading ? (
              <>
                <Tr>
                  <Td colSpan={columns?.length}>
                    <BeatLoader color="#F6AD55" />
                  </Td>
                </Tr>
              </>
            ) : (
              <>
                {page.length == 0 &&
                  <Tr>
                    <Td textAlign={'center'} colSpan={columns?.length}>
                      <p>Data tidak ada...</p>
                    </Td>
                  </Tr>}
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Tr {...row.getRowProps()} key={i}>
                      {row.cells.map((cell, idx) => {
                        return <Td {...cell.getCellProps()} key={idx}>{cell.render("Cell")}</Td>;
                      })}
                    </Tr>
                  );
                })}
              </>
            )}
          </Tbody>
        </Table>
      </div>
      {page.length != 0 &&
        <div className="pagination mt-3">
          <div className="sm:hidden grid grid-cols-2">
            <Button roundedLeft={'10px'} roundedRight='none' bg={'orange.400'} textColor="white" _hover={{ bg: 'orange.300' }} onClick={() => previousPage()} disabled={!canPreviousPage} className="cursor-pointer">Previous</Button>
            <Button roundedLeft={'none'} roundedRight='10px' bg={'orange.400'} textColor="white" _hover={{ bg: 'orange.300' }} onClick={() => nextPage()} disabled={!canNextPage} className="cursor-pointer">Next</Button>
          </div>
          <div className="hidden sm:block">
            <div className="flex justify-between">
              {sizeSet ? <div className="flex gap-x-2 items-center">
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
              </div> : null}
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
        <Input bg={'white'} placeholder="cari..." borderColor={'orange.300'} borderWidth={2} w={{ base: 'full', md: '300px' }} value={value || ""} onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }} />
      </div>
    </>
  )
}


export default DataTable