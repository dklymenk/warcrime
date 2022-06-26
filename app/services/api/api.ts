import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import { ReportSnapshot, ReportStatus } from "../../models"
import * as FileSystem from "expo-file-system"
import Upload, { UploadOptions } from "react-native-background-upload"

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Gets a list of users.
   */
  async getUsers(): Promise<Types.GetUsersResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const convertUser = (raw) => {
      return {
        id: raw.id,
        name: raw.name,
      }
    }

    // transform the data into the format we are expecting
    try {
      const rawUsers = response.data
      const resultUsers: Types.User[] = rawUsers.map(convertUser)
      return { kind: "ok", users: resultUsers }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a single user by ID
   */

  async getUser(id: string): Promise<Types.GetUserResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users/${id}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultUser: Types.User = {
        id: response.data.id,
        name: response.data.name,
      }
      return { kind: "ok", user: resultUser }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Uploads a single file
   */

  async uploadFile(fileName: string): Promise<Types.UploadFileResult> {
    const form = new FormData()
    const uri = `${FileSystem.documentDirectory}${fileName}`
    form.append("file", { uri, name: fileName, type: "image/jpg" } as any)
    const headers = {
      "Content-Type": "multipart/form-data",
    }
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.post("/upload", form, { headers })

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const filename: string = this.config.url + "/files/" + response.data.filename
      return { kind: "ok", upload: { filename } }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Uploads a single file as base64
   */

  async uploadFileBase64(filename: string): Promise<Types.UploadFileResult> {
    const uri = `${FileSystem.documentDirectory}${filename}`
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: "base64",
    })

    const response: ApiResponse<any> = await this.apisauce.post("/upload/base64", {
      filename,
      base64,
    })

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const filename: string = this.config.url + "/files/" + response.data.filename
      return { kind: "ok", upload: { filename } }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async uploadRawFile(filename: string): Promise<Types.UploadFileResult> {
    const uri = `${FileSystem.documentDirectory}${filename}`
    console.log(uri)
    const options: UploadOptions = {
      url: this.config.url + "/upload/raw",
      path: uri,
      method: "POST",
      type: "raw",
      headers: {
        "content-type": "video/mp4", // Customize content-type
      },
      // Below are options only supported on Android
      notification: {
        enabled: true,
      },
    }

    const uploadViaBackgroundSerice = () =>
      new Promise<ApiResponse<any>>((resolve, reject) => {
        Upload.startUpload(options)
          .then((uploadId) => {
            console.log(`Upload started with upload ID: ${uploadId}`)
            Upload.addListener("completed", uploadId, (data) => {
              // data includes responseCode: number and responseBody: Object
              console.log("Completed!")
              resolve({
                ok: true,
                data: JSON.parse(data.responseBody),
                problem: null,
                originalError: null,
              })
            })
            Upload.addListener("error", uploadId, (data) => {
              // data includes responseCode: number and responseBody: Object
              console.log("Error!")
              reject(data)
            })
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          })
      })

    const response: ApiResponse<any> = await uploadViaBackgroundSerice()

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const filename: string = this.config.url + "/files/" + response.data.filename
      return { kind: "ok", upload: { filename } }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Post a report
   */

  async postReport(
    report: ReportSnapshot,
    photo: string,
    userId: string,
  ): Promise<Types.PostReportResult> {
    const { id, description, latLong } = report

    // make the api call
    const response: ApiResponse<any> = await this.apisauce.post("/reports", {
      id,
      description: description || "-",
      photo,
      latLong,
      userId,
    })

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const status: ReportStatus = response.data.status
      return { kind: "ok", report: { status } }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
