import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const ReportModel = types.model("Report").props({
  id: types.identifier,
  description: types.maybe(types.string),
  photo: types.string,
})

type ReportType = Instance<typeof ReportModel>
export interface Report extends ReportType {}
type ReportSnapshotType = SnapshotOut<typeof ReportModel>
export interface ReportSnapshot extends ReportSnapshotType {}
export const createReportDefaultModel = () => types.optional(ReportModel, {})
