import './globals.css';
import Header from '../components/Header';

export const metadata = {
  title: '방화벽 로그 모니터링 시스템',
  description: '방화벽 로그를 실시간으로 모니터링하고 분석하는 웹 어드민 페이지',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
