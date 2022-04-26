import { Instance, SnapshotOrInstance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import { ReportModel } from "../report/report"

/**
 * Model description here for TypeScript hints.
 */
export const ReportStoreModel = types
  .model("ReportStore")
  .props({
    reports: types.optional(types.array(ReportModel), []),
  })
  .extend(withEnvironment)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addReport: (report: SnapshotOrInstance<typeof ReportModel>) => {
      self.reports.push(report)
    },
  }))

type ReportStoreType = Instance<typeof ReportStoreModel>
export interface ReportStore extends ReportStoreType {}
type ReportStoreSnapshotType = SnapshotOut<typeof ReportStoreModel>
export interface ReportStoreSnapshot extends ReportStoreSnapshotType {}
export const createReportStoreDefaultModel = () => types.optional(ReportStoreModel, {})
