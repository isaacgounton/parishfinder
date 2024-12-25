import { History, Search } from 'lucide-react';

interface SearchHistoryProps {
  searches: string[];
  onSearchSelect: (query: string) => void;
}

export function SearchHistory({ searches, onSearchSelect }: SearchHistoryProps) {
  if (searches.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 text-gray-600 mb-2">
        <History className="w-4 h-4" />
        <h3 className="text-sm font-medium">Recent Searches</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((query, index) => (
          <button
            key={index}
            onClick={() => onSearchSelect(query)}
            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
          >
            <Search className="w-3 h-3" />
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}
