// src/utils/projectStats.js

export function getCompletionCounts(files = []) {
  let completedDesignerCount = 0;
  let completedQACount = 0;
  let totalDesignerTasks = 0;
  let totalQATasks = 0;

  files.forEach((file) => {
    const stats = file.stats || {};
    const total = stats.totalInstructions || 0;
    const productionDone = stats.productionDone || 0;
    const qaDone = stats.qaDone || 0;

    // Designer done for this file?
    if (total > 0 && productionDone === total) completedDesignerCount++;
    // QA done for this file?
    if (total > 0 && qaDone === total) completedQACount++;

    // Task totals (optional)
    totalDesignerTasks += total;
    totalQATasks += total;
  });

  return {
    completedDesignerCount,
    completedQACount,
    totalDesignerTasks,
    totalQATasks,
  };
}
