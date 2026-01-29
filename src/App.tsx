import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { ThemeProvider } from './context/ThemeContext';
import { LibraryProvider } from './context/LibraryContext';
import { ToastProvider } from './context/ToastContext';
import { MainLayout } from './components/Layout/MainLayout';
import { AudioPlayer } from './components/Player/AudioPlayer';
import { ToastContainer } from './components/ui/Toast';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Browse } from './pages/Browse';
import { Settings } from './pages/Settings';
import { MyLibrary } from './components/Library/MyLibrary';
import { Playlists } from './components/Library/Playlists';
import './styles/globals.css';
import './styles/animations.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <LibraryProvider>
            <PlayerProvider>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/library" element={<MyLibrary />} />
                  <Route path="/playlists" element={<Playlists />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
              <AudioPlayer />
              <ToastContainer />
            </PlayerProvider>
          </LibraryProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
