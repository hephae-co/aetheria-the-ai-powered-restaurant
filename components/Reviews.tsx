import React, { useState } from 'react';
import AIInsight from './AIInsight';
import { generateManagerResponse } from '../services/geminiService';
import Loader from './Loader';

const Reviews: React.FC = () => {
  const [review, setReview] = useState('The soup was cold and the waiter was a bit slow.');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.trim()) return;

    setIsLoading(true);
    setResponse(null);
    try {
      const managerResponse = await generateManagerResponse(review);
      setResponse(managerResponse);
    } catch (error) {
      console.error(error);
      setResponse("We apologize for the issues you experienced. We are looking into it.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group mx-auto max-w-2xl">
      {/* Holographic Border Effect */}
      <div className={`absolute -inset-px bg-gradient-to-br from-purple-500/50 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse`}></div>
      
      <section id="reviews" className="relative bg-primary rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-16 text-center">
          {/* AI Insight button */}
          <div className="absolute top-4 right-4 z-10">
            <AIInsight title="AI for Customer Service">
              <p>This interactive tool demonstrates how AI can assist in customer relations. When you submit a review, it's sent to an AI model.</p>
              <p>The AI is given a specific "persona" – that of our professional and empathetic restaurant manager. It analyzes the sentiment and key points of your review and then drafts a response that is validating, constructive, and aligned with our brand's voice.</p>
              <p className="font-bold text-accent mt-2">Model Used: Gemini 2.5 Flash</p>
            </AIInsight>
          </div>




          <form onSubmit={handleSubmit} className="text-left mx-auto max-w-md mb-8">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full h-32 p-4 bg-secondary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Write a sample review..."
            />
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 bg-accent text-primary font-bold py-3 px-8 rounded-md hover:bg-yellow-300 transition-colors duration-300 disabled:bg-gray-500"
            >
              {isLoading ? 'Generating Response...' : 'Generate Manager Response'}
            </button>
          </form>

          <div className="mx-auto max-w-md">
            {isLoading && <div className="mt-8"><Loader text="Composing response..." /></div>}
            
            {response && (
              <div className="mt-8 text-left bg-secondary p-6 rounded-lg border border-gray-700 animate-fade-in">
                <h3 className="font-bold text-lg text-accent mb-2">A Message from Our Manager:</h3>
                <p className="text-text-primary whitespace-pre-wrap">{response}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;