"use client";
import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Loader from "./Loader";

const CustomDataGrid = ({
  rows = [],
  columns = [],
  loading = false,
  error = null,
  pageSizeOptions = [25, 50, 100],
  toolbarProps = {},
  onRowClick = null,
  rowIdField = "id",
  getRowId,
}) => {
  // loading state is received from parent via props
  
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 100,
    page: 0,
  });

  const resolvedGetRowId = getRowId || ((row) => row[rowIdField]);

  const getRowClassName = (params) =>
    params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "";

  return (
    <div
      className="w-full"
      style={{
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div style={{ minWidth: "600px" }}>
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <>
            <style>{`
              .even-row { background-color: var(--color-sidebar-background); }
              @media (max-width: 768px) {
                .mobile-scrollable-grid { height: 70vh !important; overflow-y: auto; }
              }
            `}</style>

            <DataGrid
              className="mobile-scrollable-grid"
              rows={rows}
              columns={columns}
              getRowId={resolvedGetRowId}
              getRowClassName={getRowClassName}
              pagination
              pageSizeOptions={pageSizeOptions}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              disableRowSelectionOnClick
              // Use either initialState OR a controlled model (we’re controlling it, so remove initialState)
              showToolbar={true}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: {
                    debounceMs: 500,
                    placeholder: "Search...",
                  },
                  ...toolbarProps,
                },
              }}
              columnBufferPx={100}
              onRowClick={onRowClick}
              sx={{
                border: "none",
                height: "68vh",
                "& .MuiDataGrid-columnHeader": {
                  color: "var(--color-text-muted)",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                  borderTop: "none",
                },
                "& .MuiDataGrid-row": { borderBottom: "none" },
                "& .MuiDataGrid-row:hover": {
                  cursor: "pointer",
                },
                "& .MuiDataGrid-columnHeaders": { borderBottom: "none" },
                "& .MuiDataGrid-columnSeparator": { display: "none" },
                "& .MuiDataGrid-footerContainer": { display: "flex" },
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                  outline: "none",
                },
                "& .MuiDataGrid-virtualScroller": { border: "none" },
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CustomDataGrid;
