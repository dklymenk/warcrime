import { Instance, SnapshotOut, types } from "mobx-state-tree"

export enum ReportStatus {
  Pending = "PENDING",
  Uploaded = "UPLOADED",
  Accepted = "ACCEPTED",
  Rejected = "REJECTED",
}

/**
 * Model description here for TypeScript hints.
 */
export const ReportModel = types.model("Report").props({
  id: types.identifier,
  description: types.optional(types.string, ""),
  photo: types.string,
  status: types.enumeration<ReportStatus>("ReportStatus", Object.values(ReportStatus)),
  latLong: types.maybe(types.string),
})

type ReportType = Instance<typeof ReportModel>
export interface Report extends ReportType {}
type ReportSnapshotType = SnapshotOut<typeof ReportModel>
export interface ReportSnapshot extends ReportSnapshotType {}
export const createReportDefaultModel = () => types.optional(ReportModel, {})
