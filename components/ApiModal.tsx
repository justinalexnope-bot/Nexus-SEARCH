import React, { useEffect } from 'react';
import { XIcon } from './Icons';

interface ApiModalProps {
  onClose: () => void;
}

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-gray-800 text-sm text-text-primary-dark p-3 rounded-md overflow-x-auto">
        <code>
            {children}
        </code>
    </pre>
);

export const ApiModal: React.FC<ApiModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const responseStructure = `{
  "query": "your search query",
  "results": {
    "web": [ ...SearchResults ],
    "image": [ ...ImageResults ],
    "code": [ ...CodeResults ]
  }
}`;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in"
      style={{ animationDuration: '0.3s' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-surface-dark p-6 rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close API documentation"
        >
          <XIcon />
        </button>

        <h2 className="text-xl font-bold mb-4">Nexus Search Public API</h2>
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-6 text-text-secondary-dark">
            <p>You can programmatically perform searches using the global <code className="bg-gray-700 text-sm p-1 rounded">nexusApi</code> object available in your browser's developer console.</p>
            
            <div>
                <h3 className="font-semibold text-text-primary-dark mb-2">Usage</h3>
                <CodeBlock>{`await window.nexusApi.search(query, options)`}</CodeBlock>
            </div>

            <div>
                <h3 className="font-semibold text-text-primary-dark mb-2">Parameters</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><code className="bg-gray-700 p-1 rounded">query</code> (string, required): The search term.</li>
                    <li><code className="bg-gray-700 p-1 rounded">options</code> (object, optional): An object containing search options.
                        <ul className="list-['-_'] list-inside ml-4 mt-1">
                            <li><code className="bg-gray-700 p-1 rounded">options.type</code> (string): <code className="bg-gray-700 p-1 rounded">'web'</code>, <code className="bg-gray-700 p-1 rounded">'image'</code>, <code className="bg-gray-700 p-1 rounded">'code'</code>, or <code className="bg-gray-700 p-1 rounded">'all'</code>. Defaults to <code className="bg-gray-700 p-1 rounded">'web'</code>.</li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div>
                <h3 className="font-semibold text-text-primary-dark mb-2">Examples</h3>
                <div className="space-y-2">
                    <CodeBlock>{`// Search for web results (default)
await window.nexusApi.search('react hooks')`}</CodeBlock>
                    <CodeBlock>{`// Search for images
await window.nexusApi.search('cyberpunk city', { type: 'image' })`}</CodeBlock>
                    <CodeBlock>{`// Search for all result types
await window.nexusApi.search('fastapi authentication', { type: 'all' })`}</CodeBlock>
                </div>
            </div>

             <div>
                <h3 className="font-semibold text-text-primary-dark mb-2">Response Structure</h3>
                <CodeBlock>{responseStructure}</CodeBlock>
            </div>
            
            <div className="border-t border-gray-700 pt-4 text-sm">
                <p><span className="font-semibold text-text-primary-dark">Note for Bot Developers:</span> This is a client-side API. To connect this to a Discord bot, you would need a backend service (e.g., using Node.js and Puppeteer) that runs this application in a headless browser and exposes an HTTP endpoint for your bot to call.</p>
            </div>
        </div>
      </div>
    </div>
  );
};