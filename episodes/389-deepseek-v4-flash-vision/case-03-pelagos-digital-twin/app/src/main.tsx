import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/jetbrains-mono';
import './styles/index.css';
import './styles/ui.css';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
