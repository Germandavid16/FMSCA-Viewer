import React, { useEffect, useState } from "react";

import Papa from "papaparse";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { CircularProgress } from "@mui/material";
import styled from "@emotion/styled";

import { IRecord } from "../../../types/records.ts";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  id: keyof IRecord;
  label: string;
  numeric: boolean;
  minWidth?: number;
}

const headCells: readonly HeadCell[] = [
  {
    id: "created_dt",
    numeric: false,
    label: "Created_DT",
  },
  {
    id: "data_source_modified_dt",
    numeric: false,
    label: "Modifed_DT",
  },
  {
    id: "entity_type",
    numeric: false,
    label: "Entity",
  },
  {
    id: "operating_status",
    numeric: false,
    label: "Operating status",
  },
  {
    id: "legal_name",
    numeric: false,
    label: "Legal name",
  },
  {
    id: "dba_name",
    numeric: false,
    label: "DBA name",
  },
  {
    id: "physical_address",
    numeric: false,
    label: "Physical address",
  },
  {
    id: "phone",
    numeric: false,
    label: "Phone",
  },
  {
    id: "usdot_number",
    numeric: true,
    label: "DOT",
  },
  {
    id: "mc_mx_ff_number",
    numeric: false,
    label: "MC/MX/FF",
  },
  {
    id: "power_units",
    numeric: true,
    label: "Power units",
  },
  {
    id: "out_of_service_date",
    numeric: true,
    label: "Out of service date",
    minWidth: 150,
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IRecord,
  ) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead({
  order,
  orderBy,
  onRequestSort,
}: EnhancedTableProps) {
  const createSortHandler =
    (property: keyof IRecord) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{
              minWidth: headCell.minWidth ?? "auto",
              background: "#556cd6",
              color: "white",
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#556cd600",
    "&:hover": {
      backgroundColor: "#556cd640",
    },
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#556cd620",
    "&:hover": {
      backgroundColor: "#556cd640",
    },
    "& td, & th": {
      border: 0,
    },
  },
}));

export default function EnhancedTable() {
  let navigate = useNavigate();

  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof IRecord>("created_dt");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [rows, setRows] = useState<IRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);

    const response = await fetch("/fmsca-records.csv");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const csvText = await response.text();

    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (result: any) => {
        setRows(result.data);
      },
    });

    setLoading(false);
  };

  useEffect(() => {
    getData().then();
  }, []);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof IRecord,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  const handleRowClick = (id: string) => {
    navigate(`/${id}`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {loading ? (
        <Box justifyContent="center" sx={{ display: "flex", padding: "40px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 192px)" }}>
            <Table
              stickyHeader
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.map((row) => {
                  return (
                    <StyledTableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(row.id)}
                    >
                      {headCells.map((headCell) => (
                        <TableCell align={headCell.numeric ? "right" : "left"}>
                          {row[headCell.id]}
                        </TableCell>
                      ))}
                    </StyledTableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <StyledTableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[50, 100, 200, 500, 1000]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
}
