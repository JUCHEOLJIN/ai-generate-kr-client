import { downloadDocument, generateProblems } from '@/entities/problem/api/fetchers'
import type { Problem } from '@/entities/problem/type'
import { ProblemCard } from '@/shared/components/ProblemCard'
import { useState } from 'react'

const GenerateProblem = () => {
  const [passage, setPassage] = useState('')
  const [problems, setProblems] = useState<Problem[]>([])
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [level, setLevel] = useState('중1')

  const handleSubmit = async () => {
    if (passage.trim() === '') {
      setError('지문을 입력해 주세요.')
      return
    }

    setLoading(true)
    setError(null)
    setProblems([])

    try {
      // Flask 서버의 /generate 엔드포인트로 요청
      const problems = await generateProblems({ text: passage, count, level })
      setProblems(problems)
    } catch (err) {
      console.error('Fetch Error:', err)
      setError(
        `오류 발생: ${
          (err as Error).message
        }. (서버가 실행 중인지, CORS 설정이 올바른지 확인하세요.)`,
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      setDownloadLoading(true)
      const blob = await downloadDocument({ problems, level })

      // 서버 에러 체크
      if (blob.size === 0) {
        console.error('서버에서 빈 파일을 보냈습니다.')
        return
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ko_exam_${level}_${new Date().toISOString().split('T')[0]}.docx`
      document.body.appendChild(a)
      a.click()

      // 정리
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (e) {
      console.error('다운로드 실패:', e)
    } finally {
      setDownloadLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl min-h-[calc(100vh-69px)]">
      <div className="flex gap-4 justify-between align-middle mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label
            htmlFor="level-select"
            className="text-lg font-bold text-indigo-900 flex items-center gap-2"
          >
            출제 대상 학년
          </label>

          <div className="relative w-full sm:w-48">
            <select
              id="level-select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="block w-full px-4 py-3 pr-10 text-base border-1 border-gray-300 focus:outline-none sm:text-sm rounded-xl bg-white font-medium appearance-none cursor-pointer"
            >
              <optgroup label="중학교">
                <option value="중1">중학교 1학년</option>
                <option value="중2">중학교 2학년</option>
                <option value="중3">중학교 3학년</option>
              </optgroup>
              <optgroup label="고등학교">
                <option value="고1">고등학교 1학년</option>
                <option value="고2">고등학교 2학년</option>
                <option value="고3">고등학교 3학년</option>
              </optgroup>
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <button
          className="p-2 bg-gray-500 text-white font-bold text-lg rounded-lg hover:bg-gray-700 transition duration-300 disabled:bg-gray-200"
          onClick={() => handleDownload()}
          disabled={downloadLoading || problems.length === 0}
        >
          {downloadLoading ? '다운로드 중...' : '문제 다운로드'}
        </button>
      </div>
      <textarea
        className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-base mb-6 resize-y"
        rows={12}
        placeholder="여기에 국어 지문 (시, 소설, 비문학)을 입력하세요..."
        value={passage}
        onChange={(e) => setPassage(e.target.value)}
        disabled={loading}
      />
      <label htmlFor="count" className="text-gray-600 mb-2 text-sm">
        생성할 문제 개수 :
      </label>
      <input
        id="count"
        type="number"
        className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-base mb-6 resize-y"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        disabled={loading}
      />
      <button
        className="w-full py-3 bg-indigo-600 text-white font-bold text-lg rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? '⏳ 문제 생성 중...' : '문제 생성 요청'}
      </button>

      {/* 상태 및 오류 메시지 */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-medium">
          {error}
        </div>
      )}

      {/* 결과 표시 */}
      {problems.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">생성된 문제</h2>
          {problems.map((p, index) => (
            <ProblemCard key={index} problem={p} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}

export default GenerateProblem
