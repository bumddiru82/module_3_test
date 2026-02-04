import { render, screen } from '@testing-library/react'
import DataTable from '@/components/DataTable'

describe('DataTable Component', () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '이름' },
    { key: 'email', label: '이메일' },
  ]

  const mockData = [
    { id: 1, name: '홍길동', email: 'hong@test.com' },
    { id: 2, name: '김철수', email: 'kim@test.com' },
    { id: 3, name: '이영희', email: 'lee@test.com' },
  ]

  describe('렌더링 테스트', () => {
    it('테이블 헤더를 올바르게 렌더링한다', () => {
      render(<DataTable columns={columns} data={mockData} />)

      expect(screen.getByText('ID')).toBeInTheDocument()
      expect(screen.getByText('이름')).toBeInTheDocument()
      expect(screen.getByText('이메일')).toBeInTheDocument()
    })

    it('테이블 데이터를 올바르게 렌더링한다', () => {
      render(<DataTable columns={columns} data={mockData} />)

      expect(screen.getByText('홍길동')).toBeInTheDocument()
      expect(screen.getByText('hong@test.com')).toBeInTheDocument()
      expect(screen.getByText('김철수')).toBeInTheDocument()
      expect(screen.getByText('kim@test.com')).toBeInTheDocument()
      expect(screen.getByText('이영희')).toBeInTheDocument()
      expect(screen.getByText('lee@test.com')).toBeInTheDocument()
    })

    it('데이터가 없을 때 메시지를 표시한다', () => {
      render(<DataTable columns={columns} data={[]} />)

      expect(screen.getByText('데이터가 없습니다')).toBeInTheDocument()
    })

    it('올바른 개수의 행을 렌더링한다', () => {
      const { container } = render(<DataTable columns={columns} data={mockData} />)
      const rows = container.querySelectorAll('tbody tr')

      expect(rows).toHaveLength(3)
    })
  })

  describe('커스텀 렌더링 테스트', () => {
    it('renderCell 함수를 사용하여 커스텀 렌더링을 수행한다', () => {
      const renderCell = (row, key) => {
        if (key === 'name') {
          return `이름: ${row[key]}`
        }
        return row[key]
      }

      render(<DataTable columns={columns} data={mockData} renderCell={renderCell} />)

      expect(screen.getByText('이름: 홍길동')).toBeInTheDocument()
      expect(screen.getByText('이름: 김철수')).toBeInTheDocument()
      expect(screen.getByText('이름: 이영희')).toBeInTheDocument()
    })

    it('renderCell 없이도 정상 작동한다', () => {
      render(<DataTable columns={columns} data={mockData} />)

      expect(screen.getByText('홍길동')).toBeInTheDocument()
    })
  })

  describe('테이블 구조 테스트', () => {
    it('올바른 테이블 구조를 가진다', () => {
      const { container } = render(<DataTable columns={columns} data={mockData} />)

      const table = container.querySelector('table')
      expect(table).toBeInTheDocument()
      expect(table).toHaveClass('min-w-full', 'divide-y', 'divide-gray-200')

      const thead = container.querySelector('thead')
      expect(thead).toBeInTheDocument()
      expect(thead).toHaveClass('bg-gray-50')

      const tbody = container.querySelector('tbody')
      expect(tbody).toBeInTheDocument()
      expect(tbody).toHaveClass('bg-white', 'divide-y', 'divide-gray-200')
    })

    it('컬럼 수만큼 th 요소가 있다', () => {
      const { container } = render(<DataTable columns={columns} data={mockData} />)
      const headers = container.querySelectorAll('th')

      expect(headers).toHaveLength(columns.length)
    })

    it('각 행마다 컬럼 수만큼 td 요소가 있다', () => {
      const { container } = render(<DataTable columns={columns} data={mockData} />)
      const rows = container.querySelectorAll('tbody tr')

      rows.forEach(row => {
        const cells = row.querySelectorAll('td')
        expect(cells).toHaveLength(columns.length)
      })
    })
  })
})
