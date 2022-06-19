import { flow, getRoot, Instance, SnapshotOut, toGenerator, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import { RootStore } from "../root-store/root-store"
import { v4 as uuidv4 } from "uuid"
import "react-native-get-random-values"
import { Platform } from "expo-modules-core"

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
  .extend(withEnvironment)
  .props({
    id: types.optional(types.identifier, () => uuidv4()),
    description: types.optional(types.string, ""),
    photo: types.string,
    status: types.optional(
      types.enumeration<ReportStatus>("ReportStatus", Object.values(ReportStatus)),
      ReportStatus.Pending,
    ),
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
      const rootStore = getRoot<RootStore>(self)
      try {
        const uploadFileResult = yield* toGenerator(
          // TODO
          self.photo.indexOf("mp4") === -1 && Platform.OS === "ios"
            ? self.environment.api.uploadRawFile(self.photo)
            : self.environment.api.uploadRawFile(self.photo),
        )

        if (uploadFileResult.kind === "ok") {
          const result = yield* toGenerator(
            self.environment.api.postReport(
              self,
              uploadFileResult.upload.filename,
              rootStore.user.id,
            ),
          )
          if (result.kind === "ok") {
            self.status = result.report.status
          }
        } else {
          __DEV__ && console.tron.log(uploadFileResult.kind)
        }
      } catch (error) {
        console.log({ error })
      }
      self.loading = false
    }),
  }))

type ReportType = Instance<typeof ReportModel>
export interface Report extends ReportType {}
type ReportSnapshotType = SnapshotOut<typeof ReportModel>
export interface ReportSnapshot extends ReportSnapshotType {}
export const createReportDefaultModel = () => types.optional(ReportModel, {})
