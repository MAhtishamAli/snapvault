import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthModal from './components/ui/AuthModal';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import StatsCard from './components/dashboard/StatsCard';
import ChecklistCard from './components/dashboard/ChecklistCard';
import VideoGrid from './components/dashboard/VideoGrid';
import SecurityPulse from './components/charts/SecurityPulse';
import PrivacyMix from './components/charts/PrivacyMix';
import TimeSaved from './components/charts/TimeSaved';
import CapturePreview from './components/recorder/CapturePreview';
import RecordingsPage from './components/pages/RecordingsPage';
import PrivacyRulesPage from './components/pages/PrivacyRulesPage';
import SettingsPage from './components/pages/SettingsPage';
import VideoPlayerModal from './components/ui/VideoPlayerModal';
import NotificationPanel from './components/ui/NotificationPanel';
import TourOverlay from './components/ui/TourOverlay';
import ProcessRecordingModal from './components/ui/ProcessRecordingModal';
import { ToastContainer } from './components/ui/Toast';
import { useRecorder } from './hooks/useRecorder';
import { useDashboardData } from './hooks/useDashboardData';
import { useTour } from './hooks/useTour';
import { pageTransition } from './animations/variants';
import { Images, ShieldCheck, Sparkles, Compass } from 'lucide-react';

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [mousePos, setMousePos] = useState({ x: -300, y: -300 });

  // Checklist states
  const [snapDone, setSnapDone] = useState(false);
  const [recordDone, setRecordDone] = useState(false);
  const [shieldDone, setShieldDone] = useState(false);

  const recorder = useRecorder();
  const dashboard = useDashboardData();
  const tour = useTour();
  const { user, requireAuthAction, isLoading } = useAuth();

  // Mouse spotlight tracking
  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleSnap = () => {
    requireAuthAction(async () => {
      setSnapDone(true);
      const blob = await recorder.takeSnap();
      if (blob) {
        try {
          const formData = new FormData();
          formData.append('snap', blob, `snap_${Date.now()}.png`);
          await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/snaps/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          addToast('Screenshot secured & saved to vault!', 'success');
          dashboard.refresh?.();
        } catch (err) {
          console.error(err);
          addToast('Failed to save snap', 'error');
        }
      }
    });
  };

  const handleToggleRecording = () => {
    requireAuthAction(() => {
      setRecordDone(true);
      if (!recorder.isRecording) {
        recorder.startRecording();
        addToast('Recording started', 'info');
      } else {
        recorder.stopRecording();
        addToast('Recording saved', 'success');
      }
    });
  };

  const handleToggleShield = () => {
    setShieldDone(true);
    recorder.toggleBlur();
  };

  const renderPage = () => {
    switch (activePage) {
      case 'recordings':
        return <RecordingsPage onPlayVideo={setActiveVideo} />;
      case 'privacy':
        return <PrivacyRulesPage onToast={addToast} />;
      case 'settings':
        return <SettingsPage onToast={addToast} />;
      default:
        return (
          <motion.div {...pageTransition}>
            {/* Hero Welcome */}
            <div className="flex items-start sm:items-center justify-between fluid-section">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                  Welcome back, {user ? user.name : 'Guest'} 👋
                </h1>
                <p className="text-sm text-text-muted mt-2 max-w-lg leading-relaxed">
                  Your privacy dashboard is running. All {dashboard.totals.totalBlurred} detected secrets have been auto-redacted.
                </p>
              </div>
              <motion.button
                onClick={tour.start}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 cursor-pointer transition-shadow flex-shrink-0"
              >
                <Compass className="w-4 h-4" strokeWidth={1.8} />
                Start Tour
              </motion.button>
            </div>

            <ChecklistCard
              onSnap={handleSnap}
              onRecord={handleToggleRecording}
              onShield={handleToggleShield}
              snapDone={snapDone}
              recordDone={recordDone}
              shieldDone={shieldDone}
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 fluid-gap fluid-section">
              <StatsCard
                icon={Images}
                title="Recent Snaps"
                value={recorder.snapCount > 0 ? recorder.snapCount : 24}
                subtitle="Last snap: 2 minutes ago"
                accentColor="teal"
                trend="+3 today"
                index={0}
              />
              <StatsCard
                icon={ShieldCheck}
                title="Active Redaction Rules"
                value="12"
                subtitle="API keys, passwords, and PII detection"
                accentColor="emerald"
                trend="All active"
                index={1}
              />
              <StatsCard
                icon={Sparkles}
                title="Hours Saved (AI)"
                value={dashboard.totals.hoursSaved}
                subtitle={`Automated redaction saved ${dashboard.totals.minutesSaved} minutes`}
                accentColor="indigo"
                trend="+52 this week"
                index={2}
              />
            </div>

            {/* Charts */}
            <div data-tour="charts" className="fluid-section">
              <div className="grid grid-cols-1 lg:grid-cols-5 fluid-gap mb-4">
                <SecurityPulse data={dashboard.securityData} className="lg:col-span-3" />
                <PrivacyMix data={dashboard.privacyMix} className="lg:col-span-2" />
              </div>
              <TimeSaved data={dashboard.timeSaved} />
            </div>

            {/* Video Grid */}
            <VideoGrid onPlayVideo={setActiveVideo} />
          </motion.div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden relative">
      {/* Mouse Spotlight */}
      <div className="spotlight" style={{ left: mousePos.x, top: mousePos.y }} />

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activePage={activePage}
        onNavigate={setActivePage}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Navbar
          onNewRecording={handleToggleRecording}
          onSnap={handleSnap}
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
          isRecording={recorder.isRecording}
          isMuted={recorder.isMuted}
          onToggleMute={recorder.toggleMute}
          isBlurActive={recorder.isBlurActive}
          onToggleBlur={handleToggleShield}
          formattedTime={recorder.formattedTime}
        />

        <main className="flex-1 overflow-y-auto fluid-px fluid-py">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={activePage}>
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Overlays */}
      <CapturePreview showFlash={recorder.showFlash} />

      <AnimatePresence>
        {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {activeVideo && <VideoPlayerModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {recorder.recordedBlob && (
          <ProcessRecordingModal
            blob={recorder.recordedBlob}
            onClose={recorder.clearRecordedBlob}
            onComplete={(result) => {
              // Show toast and save the result somewhere if needed
              addToast(`Recording secure! AI found ${result.detections} areas.`, 'success');
              recorder.clearRecordedBlob();
            }}
          />
        )}
      </AnimatePresence>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <TourOverlay {...tour} />
      <AuthModal />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
