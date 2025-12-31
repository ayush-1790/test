import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Loader from "./Loader";

const CustomDataGrid_server = ({
  rows = [],
  columns = [],
  loading = false,
  error = null,
  rowCount = 0,                // NEW: total rows from server
  pageSizeOptions = [25, 50, 100],
  paginationModel,             // NEW: fully controlled
  onPaginationModelChange,     // NEW
  onFilterModelChange,         // NEW: to catch quick filter changes
  getRowId,
  rowIdField = "_id",
  toolbarProps = {},
  onRowClick = null,
}) => {
  const resolvedGetRowId = getRowId || ((row) => row[rowIdField]);

  const getRowClassName = (params) =>
    params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "";

  return (
    <div className="w-full" style={{ overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch" }}>
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

              // --- SERVER MODES ---
              pagination
              paginationMode="server"
              filterMode="server"
              rowCount={rowCount}
              paginationModel={paginationModel}
              onPaginationModelChange={onPaginationModelChange}
              onFilterModelChange={onFilterModelChange}

              pageSizeOptions={pageSizeOptions}
              disableRowSelectionOnClick
              showToolbar={true}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500, placeholder: "Search..." },
                  ...toolbarProps,
                },
              }}
              columnBufferPx={100}
              onRowClick={onRowClick}
              sx={{
                border: "none",
                height: "68vh",
                "& .MuiDataGrid-columnHeader": { color: "var(--color-text-muted)" },
                "& .MuiDataGrid-cell": { borderBottom: "none", borderTop: "none" },
                "& .MuiDataGrid-row": { borderBottom: "none", cursor: "pointer" },
                "& .MuiDataGrid-columnHeaders": { borderBottom: "none" },
                "& .MuiDataGrid-columnSeparator": { display: "none" },
                "& .MuiDataGrid-footerContainer": { display: "flex" },
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
                "& .MuiDataGrid-virtualScroller": { border: "none" },
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CustomDataGrid_server;
