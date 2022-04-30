import { flow, getRoot, Instance, SnapshotOut, types } from "mobx-state-tree"
import { RootStore } from "../root-store/root-store"

export enum ReportStatus {
  Pending = "PENDING",
  Uploaded = "UPLOADED",
  Accepted = "ACCEPTED",
  Rejected = "REJECTED",
}

/**
 * Model description here for TypeScript hints.
 */
export const ReportModel = types
  .model("Report")
  .props({
    id: types.identifier,
    description: types.optional(types.string, ""),
    photo: types.string,
    status: types.enumeration<ReportStatus>("ReportStatus", Object.values(ReportStatus)),
    latLong: types.maybe(types.string),
    loading: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setDescription: (description: string) => {
      self.description = description
    },
  }))
  .actions((self) => ({
    upload: flow(function* upload(): any {
      self.loading = true
      const root = getRoot<RootStore>(self)
      const { id, description, photo, status, latLong } = self
      console.log({ id, description, photo, status, latLong, userId: root.user.id })
      yield new Promise<void>((resolve) => setTimeout(() => resolve(), 1000))
      self.loading = false
    }),
  }))

type ReportType = Instance<typeof ReportModel>
export interface Report extends ReportType {}
type ReportSnapshotType = SnapshotOut<typeof ReportModel>
export interface ReportSnapshot extends ReportSnapshotType {}
export const createReportDefaultModel = () => types.optional(ReportModel, {})
