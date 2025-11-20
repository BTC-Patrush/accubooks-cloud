import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Invoices } from './pages/Invoices';
import { Reports } from './pages/Reports';

// Simple Hash Router implementation since environment restricts browser router
const Router = () => {
  const [route, setRoute] = useState(window.location.hash.replace('#', '') || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash.replace('#', '') || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  let Component = Dashboard;
  if (route === '/transactions') Component = Transactions;
  if (route === '/invoices') Component = Invoices;
  if (route === '/reports') Component = Reports;
  if (route === '/ledger') Component = Reports; // Reuse reports for ledger demo
  if (route === '/contacts') Component = () => <div className="p-8">Contacts Module (Coming Soon)</div>;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <Sidebar currentPath={route} navigate={navigate} />
        <main className="ml-64 flex-1 transition-all duration-300">
            <header className="bg-white h-16 border-b border-slate-100 flex items-center px-8 justify-between no-print">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">My Business Inc.</h2>
                <div className="flex gap-4">
                   <button className="text-sm font-medium text-slate-500 hover:text-blue-600">Help</button>
                   <button className="text-sm font-medium text-slate-500 hover:text-blue-600">Settings</button>
                </div>
            </header>
            <Component />
        </main>
    </div>
  );
};

function App() {
  return <Router />;
}

export default App;