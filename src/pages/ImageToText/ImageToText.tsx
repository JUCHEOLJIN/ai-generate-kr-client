import { http } from '@/shared/utils/http'
import { useState, useRef } from 'react'

interface ExtractResponse {
  extracted_text: string
}

const ImageToText = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleExtract = async () => {
    if (!selectedFile) {
      setError('이미지를 선택해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await http.uploadFile<ExtractResponse>('/extract-text', selectedFile, 'file')
      setExtractedText(response.extracted_text)
    } catch (err) {
      console.error('Extract Error:', err)
      setError(`텍스트 추출 실패: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setExtractedText('')
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl min-h-[calc(100vh-69px)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 왼쪽: 이미지 업로드 영역 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">이미지 업로드</h2>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors min-h-[300px] flex flex-col items-center justify-center"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-[400px] object-contain rounded-lg"
              />
            ) : (
              <>
                <svg
                  className="w-16 h-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-600 font-medium">클릭하거나 이미지를 드래그하세요</p>
                <p className="text-gray-400 text-sm mt-2">PNG, JPG, JPEG 지원</p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile && (
            <p className="text-sm text-gray-500">
              선택된 파일: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleExtract}
              disabled={loading || !selectedFile}
              className="flex-1 py-3 bg-indigo-600 text-white font-bold text-lg rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? '추출 중...' : '텍스트 추출'}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition duration-300 cursor-pointer"
            >
              초기화
            </button>
          </div>
        </div>

        {/* 오른쪽: 추출된 텍스트 영역 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">추출된 텍스트</h2>

          <textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            placeholder="이미지에서 추출된 텍스트가 여기에 표시됩니다. 직접 수정도 가능합니다."
            className="w-full h-[400px] p-4 border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-base resize-y"
          />

          {extractedText && (
            <div className="flex gap-4">
              <button
                onClick={() => navigator.clipboard.writeText(extractedText)}
                className="flex-1 py-2 text-black font-medium rounded-lg hover:border-gray-500 transition duration-300 border border-gray-300 cursor-pointer"
              >
                지문 복사
              </button>
              <button
                onClick={() => setExtractedText('')}
                className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition duration-300 cursor-pointer"
              >
                초기화
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-medium">
          {error}
        </div>
      )}
    </div>
  )
}

export default ImageToText
