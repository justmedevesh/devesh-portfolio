// BootLoader is its own client boundary: nesting it inside ClientProviders
// drops ClientProviders from the RSC client manifest on Next 15.5
import BootLoader from '../components/BootLoader';
import ClientProviders from '../components/ClientProviders';
import { themeInitScript } from '../components/themeScript';
import '../styles/globals.css';

export const metadata = {
  title: {
    default: 'Devesh Kumar Mandal — Data Scientist & ML Engineer | Nepal',
    template: '%s | Devesh Kumar Mandal',
  },
  description:
    'Portfolio of Devesh Kumar Mandal — Data Scientist & ML Engineer from Nepal. Specialising in machine learning, NLP, Python, Streamlit, and data-driven web apps. Open to opportunities.',
  keywords: [
    'Devesh Kumar Mandal',
    'Data Scientist Nepal',
    'Machine Learning Engineer',
    'NLP Engineer',
    'Python Developer',
    'Streamlit Developer',
    'Data Science Portfolio',
    'ML Portfolio Nepal',
    'Data Analyst Nepal',
    'justmedevesh',
    'Softwarica College',
    'Nexthike IT Solution',
  ],
  authors: [{ name: 'Devesh Kumar Mandal' }],
  creator: 'Devesh Kumar Mandal',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: 'https://deveshmandal.com.np',
    siteName: 'Devesh Kumar Mandal',
    title: 'Devesh Kumar Mandal — Data Scientist & ML Engineer',
    description:
      'Data Scientist from Nepal specialising in machine learning, NLP, and Python. Building intelligent systems that extract insight from real-world data.',
    images: [{ url: 'https://deveshmandal.com.np/logo.png', width: 1200, height: 630 }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Devesh Kumar Mandal — Data Scientist & ML Engineer',
    description:
      'Data Scientist from Nepal specialising in machine learning, NLP, and Python.',
    images: ['https://deveshmandal.com.np/logo.png'],
    creator: '@justmedevesh',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export const viewport = {
  themeColor: '#0b0b0b',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Devesh Kumar Mandal',
              url: 'https://deveshmandal.com.np',
              image: 'https://deveshmandal.com.np/logo.png',
              jobTitle: 'Data Scientist',
              description:
                'Data Scientist and Machine Learning Engineer from Nepal, specialising in NLP, Python, Streamlit, and data-driven systems.',
              address: { '@type': 'PostalAddress', addressCountry: 'NP', addressLocality: 'Nepal' },
              sameAs: [
                'https://github.com/justmedevesh',
                'https://www.linkedin.com/in/devesh-kumar-mandal',
              ],
              knowsAbout: [
                'Machine Learning', 'Data Science', 'Natural Language Processing',
                'Python', 'Streamlit', 'Data Analysis', 'Deep Learning', 'SQL',
              ],
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'Softwarica College of IT & E-Commerce',
              },
            }),
          }}
        />
      </head>
      <body>
        {/* Client-only: NeuralCanvas (Three.js) — loaded with ssr:false */}
        <BootLoader />
        <ClientProviders />
        {children}
      </body>
    </html>
  );
}
