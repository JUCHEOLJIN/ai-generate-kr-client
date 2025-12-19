import { NavLink } from 'react-router-dom'

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <NavLink to="/">
          <h1 className="text-xl font-bold text-indigo-600">국어의 정석</h1>
        </NavLink>
        <nav className="flex gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            문제 생성
          </NavLink>
          <NavLink
            to="/image-to-text"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            지문 추출
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
