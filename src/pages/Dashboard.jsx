import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="bg-surface border border-border rounded-card p-10 max-w-md w-full text-center">
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-20 h-20 rounded-full mx-auto mb-6 border-2 border-accent"
          />
        )}
        <h1 className="font-display text-2xl font-bold text-text mb-2">
          Welcome, {user?.displayName}
        </h1>
        <p className="font-sans text-muted mb-8">{user?.email}</p>
        <p className="font-mono text-sm text-muted mb-8">Dashboard coming in Phase 2</p>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
