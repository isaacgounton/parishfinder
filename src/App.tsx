import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { LoginPage } from './components/LoginPage';
import { SearchBar } from './components/SearchBar';
import { ParishCard } from './components/ParishCard';
import { ParishForm } from './components/ParishForm';
import { initPlacesService, searchParishes } from './lib/places';
import { saveParish, saveSearchHistory, getSearchHistory } from './lib/database';
import { SearchHistory } from './components/SearchHistory';
import type { Parish } from './types/parish';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Parish[]>([]);
  const [editingParish, setEditingParish] = useState<Parish | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    initPlacesService().catch(error => {
      setError('Failed to initialize Google Maps. Please try again.');
      console.error(error);
    });
  }, []);

  useEffect(() => {
    if (user) {
      getSearchHistory(user.uid)
        .then(history => setSearchHistory(history.map(h => h.query)))
        .catch(console.error);
    }
  }, [user]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchParishes(query);
      setSearchResults(results);
      if (user) {
        await saveSearchHistory(user.uid, query);
        // Update local search history
        setSearchHistory(prev => [query, ...prev.filter(q => q !== query)].slice(0, 10));
      }
    } catch (err) {
      setError('Failed to search for parishes. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveParish = async (parishData: Partial<Parish>) => {
    setIsLoading(true);
    try {
      if (!editingParish?.id) {
        throw new Error('Invalid parish data');
      }
      const updatedParish = {
        ...editingParish,
        ...parishData
      } as Parish;
      
      await saveParish(updatedParish);
      setEditingParish(null);
      const updatedResults = searchResults.map(p => 
        p.id === updatedParish.id ? updatedParish : p
      );
      setSearchResults(updatedResults);
    } catch (err) {
      setError('Failed to save parish. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNewParish = async (parish: Parish) => {
    setIsLoading(true);
    try {
      await saveParish(parish);
      setError(null);
      // Optionally show a success message
    } catch (err) {
      setError('Failed to save parish. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Parish Finder</h1>
          <button
            onClick={() => auth.signOut()}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        <SearchHistory searches={searchHistory} onSearchSelect={handleSearch} />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {editingParish ? (
          <div className="mt-8">
            <ParishForm
              parish={editingParish}
              onSubmit={handleSaveParish}
              onCancel={() => setEditingParish(null)}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map(parish => (
              <ParishCard
                key={parish.id}
                parish={parish}
                onEdit={setEditingParish}
                onSave={handleSaveNewParish}
              />
            ))}
          </div>
        )}

        {isLoading && (
          <div className="mt-8 text-center text-gray-600">
            Searching for parishes...
          </div>
        )}

        {!isLoading && searchResults.length === 0 && (
          <div className="mt-8 text-center text-gray-600">
            No parishes found. Try searching for a different location.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;