import { render, screen } from '@testing-library/react'
import LogSeverityBadge from '@/components/LogSeverityBadge'

describe('LogSeverityBadge Component', () => {
  describe('렌더링 테스트', () => {
    it('critical 레벨의 배지를 렌더링한다', () => {
      render(<LogSeverityBadge severity="critical" />)
      expect(screen.getByText('긴급')).toBeInTheDocument()
    })

    it('high 레벨의 배지를 렌더링한다', () => {
      render(<LogSeverityBadge severity="high" />)
      expect(screen.getByText('높음')).toBeInTheDocument()
    })

    it('medium 레벨의 배지를 렌더링한다', () => {
      render(<LogSeverityBadge severity="medium" />)
      expect(screen.getByText('중간')).toBeInTheDocument()
    })

    it('low 레벨의 배지를 렌더링한다', () => {
      render(<LogSeverityBadge severity="low" />)
      expect(screen.getByText('낮음')).toBeInTheDocument()
    })

    it('info 레벨의 배지를 렌더링한다', () => {
      render(<LogSeverityBadge severity="info" />)
      expect(screen.getByText('정보')).toBeInTheDocument()
    })

    it('알 수 없는 레벨일 때 info 배지를 렌더링한다', () => {
      render(<LogSeverityBadge severity="unknown" />)
      expect(screen.getByText('정보')).toBeInTheDocument()
    })
  })

  describe('스타일 테스트', () => {
    it('critical 레벨에 적절한 CSS 클래스가 적용된다', () => {
      const { container } = render(<LogSeverityBadge severity="critical" />)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('bg-danger-100', 'text-danger-800')
    })

    it('high 레벨에 적절한 CSS 클래스가 적용된다', () => {
      const { container } = render(<LogSeverityBadge severity="high" />)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('bg-danger-50', 'text-danger-700')
    })

    it('medium 레벨에 적절한 CSS 클래스가 적용된다', () => {
      const { container } = render(<LogSeverityBadge severity="medium" />)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('bg-warning-100', 'text-warning-800')
    })

    it('low 레벨에 적절한 CSS 클래스가 적용된다', () => {
      const { container } = render(<LogSeverityBadge severity="low" />)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('bg-primary-100', 'text-primary-800')
    })

    it('모든 배지에 공통 CSS 클래스가 적용된다', () => {
      const { container } = render(<LogSeverityBadge severity="critical" />)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full')
    })
  })
})
