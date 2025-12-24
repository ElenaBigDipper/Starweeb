
import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 border rounded shadow-sm prose prose-sm">
        <h1 className="text-2xl font-bold border-b pb-4 mb-6">Starweeb Terms of Service</h1>
        
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2">1. Your Privacy</h2>
          <p className="text-gray-600">Your privacy is important to us. We only store data required for the simulated experience in your browser's local storage. No data is actually sent to a backend unless specified for AI generation services (Gemini API).</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2">2. Respect the Web</h2>
          <p className="text-gray-600">You agree not to post harmful, illegal, or offensive content. Bulletins, forums, and gallery posts are visible to simulated users and stored locally.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2">3. Content Ownership</h2>
          <p className="text-gray-600">You own the content you post on Starweeb. However, by posting, you grant Starweeb (the simulated environment) a non-exclusive right to display your content within this SPA.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2">4. Secret Admirers Feature</h2>
          <p className="text-gray-600">The Secret Admirer feature uses AI. Responses are generated based on limited inputs. Treat others with kindness. Abuse of anonymous features will result in a local ban from the application.</p>
        </section>

        <div className="mt-12 pt-6 border-t flex justify-between items-center">
          <Link to="/login" className="text-blue-700 font-bold hover:underline">&laquo; Return to Login</Link>
          <p className="text-gray-400 text-[10px]">Updated: January 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
