import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/ProtectedRoute';
import EKycPage from './pages/EKycPage';
import SignIn from './pages/SignIn';
import GetStarted from './pages/GetStarted';
import OfficerLogin from './pages/OfficerLogin';
import OfficerRegistration from './pages/OfficerRegistration';
import OfficerProfile from './pages/OfficerProfile';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import LearnMore from './pages/LearnMore';
import RequestDemo from './pages/RequestDemo';
import PoliceStationsMap from './pages/PoliceStationsMap';
import PoliceStationDetail from './pages/PoliceStationDetail';
import CaseHeatmap from './pages/CaseHeatmap';
import HelpUsPage from './pages/HelpUsPage';
import SubmitTipPage from './pages/SubmitTipPage';
import AdvisoryPage from './pages/AdvisoryPage';
import CancelReport from './pages/CancelReport';
import ContinueReport from './pages/ContinueReport';
import ViewDraftReport from './pages/ViewDraftReport';
import GenerateDetailedReport from './pages/GenerateDetailedReport';
import ViewAllRewards from './pages/ViewAllRewards';
import LearnAboutRewards from './pages/LearnAboutRewards';
import ConnectWallet from './pages/ConnectWallet';
import OfficerDashboard from './pages/OfficerDashboard';
import OfficerSettings from './pages/OfficerSettings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/officer-login" element={<OfficerLogin />} />
        <Route path="/officer-registration" element={<OfficerRegistration />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/request-demo" element={<RequestDemo />} />
        
        {/* Protected routes */}
        <Route path="/ekyc" element={<ProtectedRoute><EKycPage /></ProtectedRoute>} />
        <Route path="/police-stations-map" element={<ProtectedRoute><PoliceStationsMap /></ProtectedRoute>} />
        <Route path="/police-station/:id" element={<ProtectedRoute><PoliceStationDetail /></ProtectedRoute>} />
        <Route path="/case-heatmap" element={<ProtectedRoute><CaseHeatmap /></ProtectedRoute>} />
        <Route path="/help-us" element={<ProtectedRoute><HelpUsPage /></ProtectedRoute>} />
        <Route path="/submit-tip" element={<ProtectedRoute><SubmitTipPage /></ProtectedRoute>} />
        <Route path="/advisory" element={<ProtectedRoute><AdvisoryPage /></ProtectedRoute>} />
        <Route path="/cancel-report" element={<ProtectedRoute><CancelReport /></ProtectedRoute>} />
        <Route path="/continue-report" element={<ProtectedRoute><ContinueReport /></ProtectedRoute>} />
        <Route path="/view-draft-report" element={<ProtectedRoute><ViewDraftReport /></ProtectedRoute>} />
        <Route path="/generate-detailed-report" element={<ProtectedRoute><GenerateDetailedReport /></ProtectedRoute>} />
        <Route path="/view-all-rewards" element={<ProtectedRoute><ViewAllRewards /></ProtectedRoute>} />
        <Route path="/learn-about-rewards" element={<ProtectedRoute><LearnAboutRewards /></ProtectedRoute>} />
        <Route path="/connect-wallet" element={<ProtectedRoute><ConnectWallet /></ProtectedRoute>} />
        
        {/* Officer routes */}
        <Route path="/officer-dashboard" element={<OfficerDashboard />} />
        <Route path="/officer-profile" element={<OfficerProfile />} />
        <Route path="/officer-settings" element={<OfficerSettings />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
