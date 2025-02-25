import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import ScheduleDetail from './pages/ScheduleDetail';
import ItineraryDetail from './pages/ItineraryDetail';
import ManagePage from './pages/ManagePage';
import NewBooking from "@/pages/NewBooking";
import Narrate from "@/pages/Narrate";
import PreLanding from "@/pages/PreLanding";
import Welcome from "@/pages/Welcome";
import SiteDetail from "@/pages/SiteDetail";
import NarrateRebook from "./pages/NarrateRebook";
import Demo1 from "@/pages/Demo1";
import Demo2 from "@/pages/Demo2";
import Demo3 from "@/pages/Demo3";
import Demo4 from "@/pages/Demo4";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Navigation />
        <main className="pt-0 md:pt-16 pb-20 md:pb-6">
          <Routes>
            <Route path="/" element={<PreLanding />} />
            <Route path="/home" element={<Index />} />
            <Route path="/schedule/:day/:scheduleIndex" element={<ScheduleDetail />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/new-booking" element={<NewBooking />} />
            <Route path="/narrate" element={<Narrate />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/itinerary" element={<ItineraryDetail />} />
            <Route path="/site/:id" element={<SiteDetail />} />
            <Route path="/narrate-rebook" element={<NarrateRebook />} />
            <Route path="/demo1" element={<Demo1 />} />
            <Route path="/demo2" element={<Demo2 />} />
            <Route path="/demo3" element={<Demo3 />} />
            <Route path="/demo4" element={<Demo4 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
