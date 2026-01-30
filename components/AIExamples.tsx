import React, { useEffect, useRef } from 'react';

const AIExamples: React.FC = () => {
  // Refs for DOM elements
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatSendBtnRef = useRef<HTMLButtonElement>(null);

  const menuInputRef = useRef<HTMLTextAreaElement>(null);
  const menuOutputRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const seoExampleRef = useRef<HTMLDivElement>(null);
  const seoBtnRef = useRef<HTMLButtonElement>(null);

  const phoneSimulationRef = useRef<HTMLDivElement>(null);
  const phoneBtnRef = useRef<HTMLButtonElement>(null);

  const marketingExampleRef = useRef<HTMLDivElement>(null);
  const marketingBtnRef = useRef<HTMLButtonElement>(null);

  const imageUploadInputRef = useRef<HTMLInputElement>(null);
  const imageUrlInputRef = useRef<HTMLInputElement>(null);
  const originalContainerRef = useRef<HTMLDivElement>(null);
  const generatedContainerRef = useRef<HTMLDivElement>(null);
  const enhanceBtnRef = useRef<HTMLButtonElement>(null);

  const imageBase64 = useRef<string | null>(null);

  useEffect(() => {
    // --- AI CHATBOT (SIMULATED) ---
    const chatWindow = chatWindowRef.current;
    const chatInput = chatInputRef.current;
    const chatSendBtn = chatSendBtnRef.current;

    const addChatMessage = (message: string, sender: 'user' | 'ai') => {
      if (!chatWindow) return;
      const bubble = document.createElement('div');
      bubble.classList.add('max-w-xs', 'md:max-w-md', 'px-4', 'py-2', 'rounded-lg', 'animate-fade-in');
      if (sender === 'user') {
        bubble.classList.add('bg-accent', 'text-primary', 'rounded-br-none', 'self-end');
      } else {
        bubble.classList.add('bg-secondary', 'text-text-primary', 'rounded-bl-none', 'self-start');
      }
      bubble.textContent = message;
      chatWindow.appendChild(bubble);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    const getAiResponse = (userInput: string) => {
      const lowerInput = userInput.toLowerCase();
      if (lowerInput.includes('hour') || lowerInput.includes('open')) { return 'We are open Tuesday to Sunday from 5 PM to 10 PM. We are closed on Mondays.'; }
      if (lowerInput.includes('reservation')) { return 'You can make a reservation online through our website or by giving us a call. Would you like a link to our reservation page?'; }
      if (lowerInput.includes('location') || lowerInput.includes('address')) { return 'We are located at 123 Celestial Way, Nebula, 98765.'; }
      if (lowerInput.includes('vegan') || lowerInput.includes('vegetarian')) { return 'Yes, we have a wonderful selection of vegan and vegetarian options! Our Galaxy Greens salad and the Mushroom Nebula Risotto are customer favorites.'; }
      return "I'm sorry, I can't answer that question right now, but our staff would be happy to help if you give us a call.";
    };

    const handleChat = () => {
      if (!chatInput) return;
      const userInput = chatInput.value.trim();
      if (userInput) {
        addChatMessage(userInput, 'user');
        chatInput.value = '';
        setTimeout(() => {
          const aiResponse = getAiResponse(userInput);
          addChatMessage(aiResponse, 'ai');
        }, 1000);
      }
    };

    chatSendBtn?.addEventListener('click', handleChat);
    const handleKeyPress = (e: KeyboardEvent) => { if (e.key === 'Enter') { handleChat(); } };
    chatInput?.addEventListener('keypress', handleKeyPress);

    // --- AI MENU ENHANCER ---
    const menuBtn = menuBtnRef.current;
    const menuInput = menuInputRef.current;
    const menuOutput = menuOutputRef.current;

    const enhanceMenuDescription = async () => {
      if (!menuInput || !menuBtn || !menuOutput) return;

      const description = menuInput.value.trim();
      if (!description) { alert('Please enter a dish description.'); return; }

      menuBtn.disabled = true;
      menuBtn.innerHTML = '<div class="flex justify-center items-center">Thinking...</div>';
      menuOutput.classList.remove('hidden');
      menuOutput.innerHTML = '<div class="flex justify-center">Loading...</div>';

      const userQuery = `You are an expert menu copywriter for a restaurant named 'Aetheria'. Take the following simple dish description and enhance it. First, write a single, more appealing paragraph. Then, on new lines, add a bulleted list of 'Key Ingredients', 'Dietary Notes' (like Vegan, Gluten-Free), and a 'Perfect Pairing' suggestion. Format the bullet points with a '*' at the start of each line. Here's the description: "${description}"`;
      const apiUrl = '/api/vertex-ai-proxy';
      const payload = { prompt: userQuery };

      try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const result = await response.json();
        let { text } = result;
        if (text) {
          text = text.replace(/^\s*\*\s*(.*)$/gm, '<li><span class="text-accent mr-2">•</span>$1</li>');
          text = text.replace(/(<li>.*<\/li>)/g, '<ul class="mt-4 space-y-2">$1</ul>');
          menuOutput.innerHTML = text.replace(/\n/g, '<br>');
        } else { menuOutput.innerHTML = '<p class="text-error">Could not generate content. Please try again.</p>'; }
      } catch (error) {
        console.error('Error enhancing menu:', error);
        menuOutput.innerHTML = '<p class="text-error text-center">An error occurred. Please check the browser console.</p>';
      } finally {
        menuBtn.disabled = false;
        menuBtn.innerHTML = '✨ Enhance with AI';
      }
    };
    menuBtn?.addEventListener('click', enhanceMenuDescription);

    // --- AI SEO INTERACTIVITY ---
    const seoBtn = seoBtnRef.current;
    const seoExample = seoExampleRef.current;
    let seoOptimized = false;

    const handleSeoClick = () => {
      if (!seoExample || !seoBtn) return;
      seoOptimized = !seoOptimized;
      if (seoOptimized) {
        seoExample.innerHTML = '<h3 class="text-accent text-xl font-semibold">Best Celestial Dining in Nebula | Aetheria</h3><p class="text-green-400 text-sm">aetheria-restaurant.com/reservations</p><p class="text-text-secondary text-sm">★★★★★ Book your table at Aetheria for an unforgettable celestial-themed fine dining experience. Vegan options available.</p>';
        seoBtn.textContent = 'Revert to Original';
      } else {
        seoExample.innerHTML = '<h3 class="text-accent text-xl font-semibold">Aetheria | Celestial Way Restaurant</h3><p class="text-green-400 text-sm">aetheria-restaurant.com</p><p class="text-text-secondary text-sm">Unique dining with celestial themes.</p>';
        seoBtn.textContent = 'Optimize with AI';
      }
    };
    seoBtn?.addEventListener('click', handleSeoClick);

    // --- AI PHONE INTERACTIVITY ---
    const phoneBtn = phoneBtnRef.current;
    const phoneSimulation = phoneSimulationRef.current;
    const handlePhoneClick = () => {
      if (!phoneBtn || !phoneSimulation) return;
      phoneBtn.disabled = true;
      phoneBtn.textContent = 'Simulation in progress...';
      phoneSimulation.innerHTML = '';
      const messages = [
        { from: 'user', text: 'Hi, are you open on Mondays?' },
        { from: 'ai', text: 'Thanks for calling Aetheria! We are closed on Mondays but open Tuesday through Sunday from 5 PM to 10 PM.' },
        { from: 'ai', text: 'Can I help with anything else? I can also text you a link to our online reservation page.' },
        { from: 'user', text: 'Yes, please text me the link!' },
        { from: 'ai', text: 'Of course! I have sent the reservation link to this number. We look forward to seeing you!' },
      ];
      let delay = 500;
      messages.forEach((msg, index) => {
        setTimeout(() => {
          const bubble = document.createElement('div');
          bubble.classList.add('max-w-xs', 'md:max-w-md', 'px-4', 'py-2', 'rounded-lg', 'animate-fade-in');
          if (msg.from === 'user') { bubble.classList.add('bg-accent', 'text-primary', 'rounded-br-none', 'self-end'); } else { bubble.classList.add('bg-secondary', 'text-text-primary', 'rounded-bl-none', 'self-start'); }
          bubble.textContent = msg.text;
          phoneSimulation.appendChild(bubble);
          phoneSimulation.scrollTop = phoneSimulation.scrollHeight;
          if (index === messages.length - 1) { phoneBtn.disabled = false; phoneBtn.textContent = 'Simulate Again'; }
        }, delay);
        delay += msg.from === 'ai' ? 1500 : 1000;
      });
    };
    phoneBtn?.addEventListener('click', handlePhoneClick);

    // --- AI MARKETING CONTENT ---
    const marketingBtn = marketingBtnRef.current;
    const marketingExample = marketingExampleRef.current;

    const generateMarketingContent = async () => {
      if (!marketingBtn || !marketingExample) return;
      marketingBtn.disabled = true;
      marketingBtn.innerHTML = '<div class="flex justify-center items-center">Thinking...</div>';
      marketingExample.classList.remove('text-text-secondary', 'italic');
      marketingExample.classList.add('text-text-primary', 'items-center', 'justify-center');
      marketingExample.innerHTML = '<div>Loading...</div>';
      const userQuery = "Generate a short, exciting SMS marketing message for a restaurant called Aetheria. Highlight a special offer for the 'Galaxy Mousse Cake' dessert. Keep it under 200 characters and include a call to action to order online.";
      const apiUrl = '/api/vertex-ai-proxy';
      const payload = { prompt: userQuery };
      try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const result = await response.json();
        const { text } = result;
        if (text) { marketingExample.innerHTML = `<p class="text-center">${text.replace(/\n/g, '<br>')}</p>`; } else { marketingExample.innerHTML = '<p class="text-error">Could not generate content. Please try again.</p>'; }
      } catch (error) {
        console.error('Error generating marketing content:', error);
        marketingExample.innerHTML = '<p class="text-error text-center">An error occurred. Please check the browser console.</p>';
      } finally {
        marketingBtn.disabled = false;
        marketingBtn.innerHTML = '✨ Regenerate Content';
      }
    };
    marketingBtn?.addEventListener('click', generateMarketingContent);

    // --- AI FOOD PHOTO ENHANCER ---
    const enhanceBtn = enhanceBtnRef.current;
    const imageUploadInput = imageUploadInputRef.current;
    const imageUrlInput = imageUrlInputRef.current;
    const originalContainer = originalContainerRef.current;
    const generatedContainer = generatedContainerRef.current;

    const displayImage = (containerElement: HTMLElement, base64: string) => {
      const targetContainer = containerElement;
      targetContainer.innerHTML = `<img src="${base64}" alt="Food photo" class="rounded-lg object-cover w-full h-full">`;
    };
    const showLoading = (containerElement: HTMLElement, text: string) => {
      const targetContainer = containerElement;
      targetContainer.innerHTML = `<div class="flex flex-col items-center justify-center h-full"><p class="mt-2 text-text-secondary text-sm">${text}</p></div>`;
    };
    const showError = (containerElement: HTMLElement, text: string) => {
      const targetContainer = containerElement;
      targetContainer.innerHTML = `<p class="text-error text-center text-sm">${text}</p>`;
    };
    const processFile = (file: File) => {
      if (!originalContainer || !enhanceBtn) return;
      if (file && file.type.startsWith('image/')) {
        if (imageUrlInput) imageUrlInput.value = '';
        const reader = new FileReader();
        reader.onload = (e) => {
          imageBase64.current = e.target?.result as string;
          displayImage(originalContainer, imageBase64.current);
          enhanceBtn.disabled = false;
        };
        reader.onerror = () => { showError(originalContainer, 'Error reading file.'); imageBase64.current = null; enhanceBtn.disabled = true; };
        reader.readAsDataURL(file);
      } else {
        showError(originalContainer, 'Please select an image file.');
        imageBase64.current = null;
        enhanceBtn.disabled = true;
      }
    };

    const processUrl = async (url: string) => {
      if (!url || !originalContainer || !enhanceBtn) return;
      if (imageUploadInput) imageUploadInput.value = '';
      showLoading(originalContainer, 'Loading image...');
      enhanceBtn.disabled = true;
      try {
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          imageBase64.current = reader.result as string;
          displayImage(originalContainer, imageBase64.current);
          enhanceBtn.disabled = false;
        };
        reader.onerror = () => { showError(originalContainer, 'Error reading image from URL.'); imageBase64.current = null; enhanceBtn.disabled = true; };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error fetching image from URL:', error);
        showError(originalContainer, 'Could not load image. Check URL and server logs.');
        imageBase64.current = null;
        enhanceBtn.disabled = true;
      }
    };

    const defaultImageUrl = imageUrlInput?.value;
    if (defaultImageUrl) {
      processUrl(defaultImageUrl);
    }

    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.[0]) processFile(target.files[0]);
    };
    const handleUrlChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      processUrl(target.value);
    };

    imageUploadInput?.addEventListener('change', handleFileChange);
    imageUrlInput?.addEventListener('change', handleUrlChange);

    const handleEnhanceClick = async () => {
      if (!imageBase64.current) { alert('Please upload an image or provide a URL first.'); return; }
      if (!enhanceBtn || !generatedContainer) return;

      enhanceBtn.disabled = true;
      enhanceBtn.innerHTML = 'Thinking...';
      showLoading(generatedContainer, 'AI is working...');

      const prompt = 'You are a professional food photographer. Enhance this image to look more delicious, vibrant, and high-quality for a restaurant menu. Improve the lighting, color saturation, and focus on the texture of the food. Do not change the dish or add new elements.';
      const apiUrl = '/api/vertex-ai-proxy';

      const pureBase64 = imageBase64.current.split(',')[1];
      const imageMimeType = imageBase64.current.match(/data:(.*);base64,/)?.[1];

      if (!imageMimeType) {
        showError(generatedContainer, 'Invalid image format.');
        return;
      }

      const payload = { prompt, image: { mimeType: imageMimeType, data: pureBase64 } };

      try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);
        const result = await response.json();

        const text = result?.text;
        if (text) {
          generatedContainer.innerHTML = `<p class="text-text-primary text-sm text-center">${text}</p>`;
        } else {
          showError(generatedContainer, 'AI could not enhance this image. Please try another.');
        }
      } catch (error) {
        console.error('Error enhancing food photo:', error);
        showError(generatedContainer, 'An error occurred during enhancement.');
      } finally {
        enhanceBtn.disabled = false;
        enhanceBtn.innerHTML = '✨ Enhance Another Photo';
      }
    };
    enhanceBtn?.addEventListener('click', handleEnhanceClick);

    return () => {
      chatSendBtn?.removeEventListener('click', handleChat);
      chatInput?.removeEventListener('keypress', handleKeyPress);
      menuBtn?.removeEventListener('click', enhanceMenuDescription);
      seoBtn?.removeEventListener('click', handleSeoClick);
      phoneBtn?.removeEventListener('click', handlePhoneClick);
      marketingBtn?.removeEventListener('click', generateMarketingContent);
      imageUploadInput?.removeEventListener('change', handleFileChange);
      imageUrlInput?.removeEventListener('change', handleUrlChange);
      enhanceBtn?.removeEventListener('click', handleEnhanceClick);
    };
  }, []);

  return (
        <section id="ai-examples" className="relative py-12 bg-primary rounded-lg overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center font-serif mb-12 text-accent">Interactive AI Examples</h2>

                <div className="text-center relative pb-4 mb-12">
                    <img id="aetheria-logo" src="https://storage.googleapis.com/hephae/aetheria/data/aetheria-logo.png" alt="Aetheria Logo" className="mx-auto mb-4 h-16 w-auto object-contain" />
                    <h1 className="font-serif text-4xl md:text-6xl font-bold text-accent">The Aetheria AI Revolution</h1>
                    <p className="mt-4 text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">Interactive examples of Generative AI powering the modern restaurant.</p>
                </div>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Card 1: AI Chatbot */}
                    <div className="bg-primary border border-secondary rounded-lg shadow-lg p-6 md:p-8 flex flex-col transition-transform duration-300 ease-in-out hover:scale-105">
                        <div className="flex items-center mb-4">
                            <div className="bg-primary p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </div>
                            <h2 className="ml-4 text-2xl font-bold text-text-primary">AI Customer Service Chatbot</h2>
                        </div>
                        <p className="text-text-secondary mb-4">An AI chatbot handles common questions instantly, freeing up staff and providing 24/7 customer support.</p>
                        <div ref={chatWindowRef} id="chat-window" className="bg-background p-4 rounded-lg h-64 overflow-y-auto flex flex-col space-y-3 mb-4">
                            <div className="max-w-xs md:max-w-md px-4 py-2 rounded-lg bg-secondary text-text-primary rounded-bl-none self-start animate-fade-in">Welcome to Aetheria! How can I help you today? Try asking about our hours, location, or reservations.</div>
                        </div>
                        <div className="flex space-x-2">
                            <input ref={chatInputRef} type="text" id="chat-input" className="w-full rounded-lg p-2 bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Ask a question..." />
                            <button ref={chatSendBtnRef} id="chat-send" className="px-4 py-2 rounded-lg font-semibold bg-accent text-primary hover:bg-yellow-300 transition-colors duration-300">Send</button>
                        </div>
                    </div>

                    {/* Card 2: AI Menu Description Enhancer */}
                    <div className="bg-primary border border-secondary rounded-lg shadow-lg p-6 md:p-8 flex flex-col transition-transform duration-300 ease-in-out hover:scale-105">
                        <div className="flex items-center mb-4">
                           <div className="bg-primary p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h2 className="ml-4 text-2xl font-bold text-text-primary">AI Menu Description Enhancer</h2>
                        </div>
                        <p className="text-text-secondary mb-4">Transform basic dish names into enticing descriptions with key features highlighted by AI.</p>
                        <textarea ref={menuInputRef} id="menu-input" className="w-full rounded-lg p-2 h-32 bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" defaultValue="A light and airy chocolate soufflé, dusted with edible glitter, reminiscent of a starry night."></textarea>
                        <button ref={menuBtnRef} id="menu-btn" className="w-full py-2 rounded-lg font-semibold mt-4 bg-accent text-primary hover:bg-yellow-300 transition-colors duration-300">✨ Enhance with AI</button>
                        <div ref={menuOutputRef} id="menu-output" className="hidden mt-4 p-4 bg-background rounded-lg animate-fade-in"></div>
                    </div>

                    {/* Card 3: AI-Powered SEO */}
                    <div className="bg-primary border border-secondary rounded-lg shadow-lg p-6 md:p-8 flex flex-col transition-transform duration-300 ease-in-out hover:scale-105">
                        <div className="flex items-center mb-4">
                            <div className="bg-primary p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <h2 className="ml-4 text-2xl font-bold text-text-primary">AI-Powered SEO</h2>
                        </div>
                        <p className="text-text-secondary mb-4">AI optimizes website titles and content to dominate local search results, attracting more direct customers.</p>
                        <div className="bg-background p-4 rounded-lg">
                            <p className="text-sm text-text-secondary mb-2">Google Search Result:</p>
                            <div ref={seoExampleRef} id="seo-example" className="transition-all duration-300">
                                <h3 className="text-accent text-xl font-semibold">Aetheria | Celestial Way Restaurant</h3>
                                <p className="text-green-400 text-sm">aetheria-restaurant.com</p>
                                <p className="text-text-secondary text-sm">Unique dining with celestial themes.</p>
                            </div>
                        </div>
                        <button ref={seoBtnRef} id="seo-btn" className="w-full py-2 rounded-lg font-semibold mt-4 bg-accent text-primary hover:bg-yellow-300 transition-colors duration-300">Optimize with AI</button>
                    </div>

                    {/* Card 4: AI Phone Answering */}
                    <div className="bg-primary border border-secondary rounded-lg shadow-lg p-6 md:p-8 flex flex-col transition-transform duration-300 ease-in-out hover:scale-105">
                        <div className="flex items-center mb-4">
                            <div className="bg-primary p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <h2 className="ml-4 text-2xl font-bold text-text-primary">AI Phone Answering</h2>
                        </div>
                        <p className="text-text-secondary mb-4">AI assistants answer calls 24/7, handling common questions and converting callers to customers without staff intervention.</p>
                        <div ref={phoneSimulationRef} id="phone-simulation" className="bg-background p-4 rounded-lg h-64 overflow-y-auto flex flex-col space-y-3">
                            <div className="flex justify-center items-center h-full">
                                <p className="text-text-secondary">Click below to simulate a call.</p>
                            </div>
                        </div>
                        <button ref={phoneBtnRef} id="phone-btn" className="w-full py-2 rounded-lg font-semibold mt-4 bg-accent text-primary hover:bg-yellow-300 transition-colors duration-300">Simulate a Call to Aetheria</button>
                    </div>

                    {/* Card 5: AI Marketing Content */}
                    <div className="bg-primary border border-secondary rounded-lg shadow-lg p-6 md:p-8 flex flex-col transition-transform duration-300 ease-in-out hover:scale-105">
                        <div className="flex items-center mb-4">
                            <div className="bg-primary p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </div>
                            <h2 className="ml-4 text-2xl font-bold text-text-primary">AI Marketing Content</h2>
                        </div>
                        <p className="text-text-secondary mb-4">AI can analyze menu data and reviews to automatically generate a month's worth of engaging social media or SMS content.</p>
                        <div ref={marketingExampleRef} id="marketing-example" className="bg-background p-4 rounded-lg min-h-[100px] flex items-center justify-center text-text-secondary italic">
                            Your draft will appear here...
                        </div>
                        <button ref={marketingBtnRef} id="marketing-btn" className="w-full py-2 rounded-lg font-semibold mt-4 bg-accent text-primary hover:bg-yellow-300 transition-colors duration-300">✨ Generate with AI for Aetheria</button>
                    </div>

                    {/* Card 6: AI Food Photography Enhancer */}
                    <div className="bg-primary border border-secondary rounded-lg shadow-lg p-6 md:p-8 flex flex-col transition-transform duration-300 ease-in-out hover:scale-105">
                        <div className="flex items-center mb-4">
                            <div className="bg-primary p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <h2 className="ml-4 text-2xl font-bold text-text-primary">AI Food Photo Enhancer</h2>
                        </div>
                        <p className="text-text-secondary mb-4">Upload a food photo and let AI improve its lighting, color, and appeal to make it menu-ready.</p>

                        <div className="mt-auto">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div ref={originalContainerRef} id="original-image-container" className="bg-background rounded-lg h-40 flex items-center justify-center flex-col text-center p-2">
                                    <img src="https://storage.googleapis.com/hephae/aetheria/data/Solar%20Flare%20Salmon.png" alt="Default Food Photo" className="rounded-lg object-cover w-full h-full" />
                                </div>
                                <div ref={generatedContainerRef} id="generated-image-container" className="bg-background rounded-lg h-40 flex items-center justify-center flex-col text-center p-2">
                                    <p className="text-text-secondary text-sm">AI Enhanced</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <input ref={imageUrlInputRef} type="text" id="image-url-input" className="w-full rounded-lg p-2 text-sm bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Paste an image URL here..." defaultValue="https://storage.googleapis.com/hephae/aetheria/data/Solar%20Flare%20Salmon.png" />

                                <label htmlFor="image-upload" className="cursor-pointer p-2 rounded-lg bg-secondary border border-secondary text-center transition-colors duration-200 hover:bg-primary block">
                                    Or click to upload an image
                                </label>
                                <input ref={imageUploadInputRef} type="file" id="image-upload" className="hidden" accept="image/*" />
                            </div>

                            <button ref={enhanceBtnRef} id="enhance-btn" className="w-full py-2 rounded-lg font-semibold mt-4 bg-accent text-primary hover:bg-yellow-300 transition-colors duration-300">✨ Enhance Photo with AI</button>
                        </div>
                    </div>
                </main>
            </div>
        </section>
  );
};

export default AIExamples;
