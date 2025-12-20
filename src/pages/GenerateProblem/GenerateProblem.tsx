import {
  downloadDocument,
  generateProblems,
  getPassages,
  type Passage,
} from '@/entities/problem/api/fetchers'
import type { Problem } from '@/entities/problem/type'
import { ProblemCard } from '@/shared/components/ProblemCard'
import { useEffect, useState } from 'react'

const GenerateProblem = () => {
  const [passage, setPassage] = useState('')
  const [problems, setProblems] = useState<Problem[]>([])
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [level, setLevel] = useState('중1')

  // 지문 리스트 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [passages, setPassages] = useState<Passage[]>([])
  const [passagesLoading, setPassagesLoading] = useState(false)
  const [passagesError, setPassagesError] = useState<string | null>(null)

  // 모달 열 때 지문 목록 불러오기
  const handleOpenModal = async () => {
    setIsModalOpen(true)
    setPassagesLoading(true)
    setPassagesError(null)

    try {
      const data = await getPassages()
      setPassages(data)
    } catch (err) {
      console.error('지문 목록 불러오기 실패:', err)
      setPassagesError('지문 목록을 불러오는데 실패했습니다.')
    } finally {
      setPassagesLoading(false)
    }
  }

  // 지문 선택 시 textarea에 적용
  const handleSelectPassage = (selectedPassage: Passage) => {
    console.log(selectedPassage)
    setPassage(selectedPassage.content)
    setLevel(selectedPassage.level || '중1')
    setIsModalOpen(false)
  }

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

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

      {/* 저장된 지문 불러오기 버튼 */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition duration-300 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          저장된 지문 불러오기
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

      {/* 지문 리스트 모달 */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">저장된 지문 목록</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* 모달 바디 */}
            <div className="flex-1 overflow-y-auto p-6">
              {passagesLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                  <span className="ml-3 text-gray-600">지문 목록을 불러오는 중...</span>
                </div>
              )}

              {passagesError && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {passagesError}
                </div>
              )}

              {!passagesLoading && !passagesError && passages.length === 0 && (
                <div className="text-center py-12 text-gray-500">저장된 지문이 없습니다.</div>
              )}

              {!passagesLoading && !passagesError && passages.length > 0 && (
                <div className="space-y-3">
                  {passages.map((p, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectPassage(p)}
                      className="p-4 border border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 group-hover:text-indigo-700">
                          {p.title || '제목 없음'}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {p.level || '미지정'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {p.content?.slice(0, 150)}
                        {p.content && p.content.length > 150 && '...'}
                      </p>
                      {p.timestamp && <p className="mt-2 text-xs text-gray-400">{p.timestamp}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <p className="text-sm text-gray-500 text-center">
                지문을 클릭하면 자동으로 입력됩니다. (ESC로 닫기)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GenerateProblem
