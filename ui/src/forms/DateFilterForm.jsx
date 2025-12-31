"use client";
import React from "react";

const DateFilterForm = ({ startDate, endDate, onChange, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col md:flex-row items-center gap-4 "
    >
<div className="flex flex-col sm:flex-row items-end gap-4">
  <div>
    <label className="block text-sm font-medium text-text-muted">
      Start Date
    </label>
    <input
      type="date"
      name="startDate"
      value={startDate}
      onChange={onChange}
      className="mt-1 border cursor-pointer border-text-muted text-text-muted rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      required
      style={{ width: "160px", height: "40px" }}
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-text-muted">
      End Date
    </label>
    <input
      type="date"
      name="endDate"
      value={endDate}
      onChange={onChange}
      className="mt-1 border cursor-pointer border-text-muted text-text-muted rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      required
      style={{ width: "160px", height: "40px" }}
    />
  </div>

  <button
    type="submit"
    className="bg-primary text-white font-medium px-8 py-2.5 w-40 rounded-lg hover:bg-primary-hover transition-all"
    style={{ width: "160px", height: "40px" }}
  >
    Filter
  </button>
</div>

    </form>
  );
};

export default DateFilterForm;
