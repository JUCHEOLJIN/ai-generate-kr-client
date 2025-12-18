import { http } from '@/shared/utils/http'
import type { Problem } from '../type'

type GenerateProblemsRequest = {
  text: string
  count: number
  level: string
}

type GenerateProblemsResponse = {
  problems: Problem[]
}

export const generateProblems = async (request: GenerateProblemsRequest) => {
  const response = await http.post<GenerateProblemsResponse>('/generate', request)
  return response.problems
}

type DownloadDocumentRequest = {
  problems: Problem[]
  level: string
}

export const downloadDocument = async (request: DownloadDocumentRequest) => {
  const blob = await http.download(`/download-docx`, request)
  return blob
}
