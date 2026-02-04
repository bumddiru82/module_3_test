import { render, screen, fireEvent } from '@testing-library/react'
import Alert from '@/components/Alert'

describe('Alert Component', () => {
  describe('렌더링 테스트', () => {
    it('기본 info 타입의 Alert를 렌더링한다', () => {
      render(<Alert message="정보 메시지입니다" />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('정보 메시지입니다')).toBeInTheDocument()
      expect(screen.getByText('ℹ️')).toBeInTheDocument()
    })

    it('success 타입의 Alert를 렌더링한다', () => {
      render(<Alert type="success" message="성공 메시지입니다" />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('성공 메시지입니다')).toBeInTheDocument()
      expect(screen.getByText('✓')).toBeInTheDocument()
    })

    it('warning 타입의 Alert를 렌더링한다', () => {
      render(<Alert type="warning" message="경고 메시지입니다" />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('경고 메시지입니다')).toBeInTheDocument()
      expect(screen.getByText('⚠️')).toBeInTheDocument()
    })

    it('error 타입의 Alert를 렌더링한다', () => {
      render(<Alert type="error" message="에러 메시지입니다" />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('에러 메시지입니다')).toBeInTheDocument()
      expect(screen.getByText('✕')).toBeInTheDocument()
    })
  })

  describe('닫기 기능 테스트', () => {
    it('onClose prop이 있을 때 닫기 버튼이 렌더링된다', () => {
      const onClose = jest.fn()
      render(<Alert message="메시지" onClose={onClose} />)

      expect(screen.getByLabelText('닫기')).toBeInTheDocument()
    })

    it('onClose prop이 없을 때 닫기 버튼이 렌더링되지 않는다', () => {
      render(<Alert message="메시지" />)

      expect(screen.queryByLabelText('닫기')).not.toBeInTheDocument()
    })

    it('닫기 버튼을 클릭하면 onClose 콜백이 호출된다', () => {
      const onClose = jest.fn()
      render(<Alert message="메시지" onClose={onClose} />)

      const closeButton = screen.getByLabelText('닫기')
      fireEvent.click(closeButton)

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('스타일 테스트', () => {
    it('각 타입별로 적절한 CSS 클래스가 적용된다', () => {
      const { rerender } = render(<Alert type="info" message="메시지" />)
      let alert = screen.getByRole('alert')
      expect(alert).toHaveClass('bg-primary-50')

      rerender(<Alert type="success" message="메시지" />)
      alert = screen.getByRole('alert')
      expect(alert).toHaveClass('bg-success-50')

      rerender(<Alert type="warning" message="메시지" />)
      alert = screen.getByRole('alert')
      expect(alert).toHaveClass('bg-warning-50')

      rerender(<Alert type="error" message="메시지" />)
      alert = screen.getByRole('alert')
      expect(alert).toHaveClass('bg-danger-50')
    })
  })
})
