import { formatProblemsForClipboard } from '@/entities/problem/lib/format'
import type { Problem } from '@/entities/problem/type'
import { useState } from 'react'

export const ProblemCard = ({ problem, index }: { problem: Problem; index: number }) => {
  const [copied, setCopied] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleSingleCopy = async () => {
    const text = formatProblemsForClipboard([problem]) // 단일 문제만 배열로 전달
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative border border-gray-200 p-6 rounded-xl shadow-lg mb-6 bg-gray-50">
      <button
        onClick={handleSingleCopy}
        className="absolute top-4 right-4 text-xs bg-white border px-2 py-1 rounded hover:bg-gray-100 shadow-sm"
      >
        {copied ? '✅ 복사됨' : '📄 개별 복사'}
      </button>
      <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
        문제 {index + 1}. <span className="text-indigo-600">[{problem.type}]</span>
      </h3>
      <p className="font-medium text-lg mb-4">{problem.question}</p>

      <ul className="list-none p-0 space-y-2">
        {problem.options.map((option, i) => (
          <li
            key={i}
            className={`p-3 rounded-md border-l-4 ${
              showExplanation && i === problem.answer_index
                ? 'bg-green-100 border-green-600 font-bold'
                : 'bg-white border-gray-300'
            }`}
          >
            {i + 1}. {option}
          </li>
        ))}
      </ul>

      <button
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 text-sm"
        onClick={() => setShowExplanation(!showExplanation)}
      >
        {showExplanation ? '▲ 정답 및 해설 숨기기' : '▼ 정답 및 해설 보기'}
      </button>

      {showExplanation && (
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <h4 className="text-base font-bold text-indigo-700 mb-2">
            정답: {problem.answer_index + 1}번
          </h4>
          <p className="text-sm whitespace-pre-line leading-relaxed">{problem.explanation}</p>
        </div>
      )}
    </div>
  )
}
