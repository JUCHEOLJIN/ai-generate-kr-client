import type { Problem } from '../type'

// 원 문자 변환 함수
const _getCircleNumber = (index: number) => {
  const circles = ['①', '②', '③', '④', '⑤']
  return circles[index] || `(${index + 1})`
}

// 클립보드용 텍스트 포맷팅 함수
export const formatProblemsForClipboard = (problems: Problem[]) => {
  return problems
    .map((p, index) => {
      const optionsText = p.options
        .map((opt: string, i: number) => `${_getCircleNumber(i)} ${opt}`)
        .join('\n')

      return `[문제 ${index + 1}] (${p.type})\n${p.question}\n\n${optionsText}\n\n`
    })
    .join('\n\n')
}
