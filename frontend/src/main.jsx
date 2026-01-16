import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from "./routes/AppRoutes.jsx";
import { PlayerProvider } from './context/PlayerContext.jsx';

createRoot(document.getElementById('root')).render(
  <PlayerProvider>
    <AppRoutes/>
  </PlayerProvider>,
)
