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
            <Route path="/" element={<Index />} />
            <Route path="/schedule/:day/:scheduleIndex" element={<ScheduleDetail />} />
            <Route path="/itinerary" element={<ItineraryDetail />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/new-booking" element={<NewBooking />} />
            <Route path="/narrate" element={<Narrate />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
