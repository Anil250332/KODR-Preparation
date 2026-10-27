import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#080c14] text-slate-100 antialiased">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
