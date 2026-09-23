import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SiteHeader } from './components/site/SiteHeader';
import { SiteFooter } from './components/site/SiteFooter';
import { ScrollManager } from './components/site/ScrollManager';
import { ResourceLayout } from './components/site/ResourceLayout';
import { HomePage } from './pages/HomePage';
import { legacyRedirects, resourcePages, resourcePath, sections } from './content/resources';
import { resourceComponents } from './content/resourceComponents';

const PricingPage = lazy(() => import('./pages/PricingPage'));
const LessonsPage = lazy(() => import('./pages/LessonsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const ResourceSectionPage = lazy(() => import('./pages/ResourceSectionPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

/** Old URLs keep working locally too (Vercel issues permanent redirects in production) */
function LegacyRedirect({ to }: { to: string }) {
  const { search, hash } = useLocation();
  return <Navigate to={`${to}${search}${hash}`} replace />;
}

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <ScrollManager />
      <SiteHeader />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/resources" element={<ResourcesPage />} />

            {sections.map(section => (
              <Route
                key={section.id}
                path={`/resources/${section.id}`}
                element={<ResourceSectionPage sectionId={section.id} />}
              />
            ))}

            {resourcePages.map(page => {
              const Page = resourceComponents[page.key];
              return (
                <Route
                  key={page.key}
                  path={resourcePath(page)}
                  element={
                    <ResourceLayout page={page}>
                      <Page />
                    </ResourceLayout>
                  }
                />
              );
            })}

            {Object.entries(legacyRedirects).map(([from, to]) => (
              <Route key={from} path={from} element={<LegacyRedirect to={to} />} />
            ))}

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
