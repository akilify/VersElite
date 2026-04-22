import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import AITestPage from "@/pages/AITestPage";
import ChatPage from "@/pages/ChatPage";
import CollaborationPage from "@/pages/CollaborationPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import CookiesPage from "@/pages/CookiesPage";
import HelpPage from "@/pages/HelpPage";
import GuidelinesPage from "@/pages/GuidelinesPage";
import ExplorePage from "@/pages/ExplorePage";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import CreatePage from "@/pages/CreatePage/CreatePage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ai-test" element={<AITestPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/collab/:id" element={<CollaborationPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/create" element={<CreatePage />} />
      </Routes>
    </BrowserRouter>
  );
}
