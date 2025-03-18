import AuthProviderWrapper from './components/AuthProviderWrapper';
import GoogleMapsScript from './components/GoogleMapsScript';
import './globals.css';

export const metadata = {
  title: 'Full Cycle Marketing AI',
  description: 'Your AI-powered marketing assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProviderWrapper>
          <GoogleMapsScript />
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  )
}
