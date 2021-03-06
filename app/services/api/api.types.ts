import { GeneralApiProblem } from "./api-problem"
import { Character } from "../../models/character/character"
import { ReportStatus } from "../../models"

export interface User {
  id: number
  name: string
}

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem

export type GetCharactersResult = { kind: "ok"; characters: Character[] } | GeneralApiProblem
export type GetCharacterResult = { kind: "ok"; character: Character } | GeneralApiProblem

export type UploadFileResult = { kind: "ok"; upload: { filename: string } } | GeneralApiProblem
export type PostReportResult = { kind: "ok"; report: { status: ReportStatus } } | GeneralApiProblem
