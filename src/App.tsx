
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import FeaturesPage from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import SignIn from "./pages/SignIn";
import GetStarted from "./pages/GetStarted";
import NotFound from "./pages/NotFound";
import LearnMore from "./pages/LearnMore";
import ContinueReport from "./pages/ContinueReport";
import CancelReport from "./pages/CancelReport";
import ViewDraftReport from "./pages/ViewDraftReport";
import GenerateDetailedReport from "./pages/GenerateDetailedReport";
import ConnectWallet from "./pages/ConnectWallet";
import LearnAboutRewards from "./pages/LearnAboutRewards";
import ViewAllRewards from "./pages/ViewAllRewards";
import RequestDemo from "./pages/RequestDemo";
import EKycPage from "./pages/EKycPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/continue-report" element={<ContinueReport />} />
          <Route path="/cancel-report" element={<CancelReport />} />
          <Route path="/view-draft-report" element={<ViewDraftReport />} />
          <Route path="/generate-detailed-report" element={<GenerateDetailedReport />} />
          <Route path="/connect-wallet" element={<ConnectWallet />} />
          <Route path="/learn-about-rewards" element={<LearnAboutRewards />} />
          <Route path="/view-all-rewards" element={<ViewAllRewards />} />
          <Route path="/request-demo" element={<RequestDemo />} />
          <Route path="/e-kyc" element={<EKycPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
