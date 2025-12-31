import { create } from "zustand";

const useDashboardStore = create((set) => ({
  designerCompleted: 0,
  qaCompleted: 0,

  incrementDesignerCompleted: () =>
    set((state) => ({
      designerCompleted: state.designerCompleted + 1,
    })),

  incrementQaCompleted: () =>
    set((state) => ({
      qaCompleted: state.qaCompleted + 1,
    })),
}));

export default useDashboardStore;