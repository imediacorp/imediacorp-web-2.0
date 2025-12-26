import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/home/page'));
const WhoWeArePage = lazy(() => import('../pages/who-we-are/page'));
const ServicesPage = lazy(() => import('../pages/services/page'));
const ChaddDiagnosticSuitePage = lazy(() => import('../pages/chadd-diagnostic-suite/page'));
const RhapsodeCreativeSuitePage = lazy(() => import('../pages/rhapsode-creative-suite/page'));
const FibonacciCosmologyPage = lazy(() => import('../pages/fibonacci-cosmology/page'));
const CompositePatientGeneratorPage = lazy(() => import('../pages/composite-patient-generator/page'));
const LoginPage = lazy(() => import('../pages/login/page'));
const RegisterPage = lazy(() => import('../pages/register/page'));
const ForgotPasswordPage = lazy(() => import('../pages/forgot-password/page'));
const PortalPage = lazy(() => import('../pages/portal/page'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/who-we-are',
    element: <WhoWeArePage />,
  },
  {
    path: '/services',
    element: <ServicesPage />,
  },
  {
    path: '/chadd-diagnostic-suite',
    element: <ChaddDiagnosticSuitePage />,
  },
  {
    path: '/rhapsode-creative-suite',
    element: <RhapsodeCreativeSuitePage />,
  },
  {
    path: '/fibonacci-cosmology',
    element: <FibonacciCosmologyPage />,
  },
  {
    path: '/composite-patient-generator',
    element: <CompositePatientGeneratorPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/portal',
    element: <PortalPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;
