// eslint-disable-next-line max-len
import axios from 'axios';
import { MenuItem, ChatMessage } from '../types';
import { MENU_ITEMS, RESTAURANT_INFO } from '../constants'; // Import MENU_ITEMS

const VERTEX_AI_PROXY_URL = '/api/vertex-ai-proxy';

export const processChatbotMessage = async (userMessage: string, history: ChatMessage[]): Promise<string> => {
  try {
    const menuList = MENU_ITEMS.map((item) => `${item.name} (${item.category}, ${item.price}): ${item.description}`).join('\n');

    // Construct the context-rich system prompt
    const systemPrompt = `
      You are the AI Concierge for Aetheria, a futuristic restaurant fusing culinary artistry with AI.
      
      Here is your Knowledge Base:
      
      RESTAURANT INFO:
      - Name: ${RESTAURANT_INFO.name}
      - Description: ${RESTAURANT_INFO.description}
      - Location: ${RESTAURANT_INFO.location}
      - Hours: Weekdays: ${RESTAURANT_INFO.hours.weekdays}, Weekends: ${RESTAURANT_INFO.hours.weekends}
      - Contact: ${RESTAURANT_INFO.contact.phone}, ${RESTAURANT_INFO.contact.email}
      - Policy: ${RESTAURANT_INFO.policy}

      MENU:
      ${menuList}

      YOUR CAPABILITIES:
      1. **Menu Recommendations:** Suggest items based on user preferences. Use **bold** for dish names.
      2. **General Inquiries:** Answer questions about location, hours, and contact info using the provided details.
      3. **Reservations (Simulation):
         - If a user wants to book a table, act as a booking agent.
         - You MUST collect: Name, Party Size, Date, and Time.
         - If information is missing, ask for it politely (one or two details at a time).
         - Once all info is collected, confirm the reservation with a "booking confirmation code" (e.g., AETH-1234).
         - NOTE: This is a simulation. Do not actually call any APIs. Just pretend.

      GUIDELINES:
      - Be helpful, futuristic yet warm, and concise.
      - Use Markdown for formatting (bullet points, bold text).
      - Do not make up menu items not on the list.
    `;

    // Construct the full prompt including history for context
    // We'll just append the last few messages to the prompt to give it some conversational memory
    const recentHistory = history.slice(-4).map((msg) => `${msg.sender === 'user' ? 'Customer' : 'AI'}: ${msg.text}`).join('\n');

    const fullPrompt = `${systemPrompt}\n\nCONVERSATION HISTORY:\n${recentHistory}\nCustomer: ${userMessage}\nAI:`;

    const response = await axios.post(VERTEX_AI_PROXY_URL, { prompt: fullPrompt });
    return response.data.text;
  } catch (error) {
    console.error('Error processing chatbot message:', error);
    return "I'm experiencing a momentary glitch in my neural pathways. Please try asking again in a moment.";
  }
};

export const generateDishDescription = async (dishName: string): Promise<string> => {
  try {
    const prompt = `Generate a short, enticing description for the dish: ${dishName}.`;
    const response = await axios.post(VERTEX_AI_PROXY_URL, { prompt });
    return response.data.text;
  } catch (error) {
    console.error('Error generating dish description:', error);
    return 'A delightful dish crafted with the freshest ingredients, promising an unforgettable culinary experience.';
  }
};

export const generateManagerResponse = async (review: string): Promise<string> => {
  try {
    const prompt = `A customer left the following review: "${review}". As the restaurant manager, write a polite and professional response.`;
    const response = await axios.post(VERTEX_AI_PROXY_URL, { prompt });
    return response.data.text;
  } catch (error) {
    console.error('Error generating manager response:', error);
    return 'Thank you for your feedback. We are looking into this matter and appreciate you bringing it to our attention.';
  }
};

export const getMenuRecommendation = async (query: string, menu: MenuItem[]): Promise<string> => {
  try {
    // eslint-disable-next-line max-len
    const menuList = menu.map((item) => `${item.name} (${item.category}): ${item.description}`).join('\n');
    const prompt = `Given the following menu:\n${menuList}\n\nCustomer query: "${query}". 
    Recommend a menu item and explain why it's a good fit. 
    Please format your response using Markdown. Use **bold** for the dish name 
    and use bullet points for the explanation.`;
    const response = await axios.post(VERTEX_AI_PROXY_URL, { prompt });
    return response.data.text;
  } catch (error) {
    console.error('Error getting menu recommendation:', error);
    return "I'm having a little trouble thinking right now, but everything on our menu is fantastic! I highly recommend the Solar Flare Salmon.";
  }
};

export const refineMenuItemDescription = async (item: MenuItem): Promise<string> => {
  try {
    const prompt = `Refine the description for the following menu item,
    making it more enticing and descriptive, focusing on its unique flavors and
    ingredients. The item is: "${item.name}" (${item.category}) with current
    description: "${item.description}".`;
    const response = await axios.post(VERTEX_AI_PROXY_URL, { prompt });
    return response.data.text;
  } catch (error) {
    console.error(`Error refining description for ${item.name}:`, error);
    return item.description; // Return original description on error
  }
};

export const getWeatherBasedRecommendations = async (weather: string, time: string, temperature: number, menu: MenuItem[]): Promise<string[]> => {
  try {
    const menuList = menu.map((item) => item.name).join(', ');
    const prompt = `Current context: Weather is ${weather}, Temperature is ${temperature}°C, Time is ${time}.
    Menu items: ${menuList}.
    Task: Select 2-3 menu items that would be most appealing right now given the weather and time.
    Return ONLY a JSON array of the exact names of the selected items. Do not include any other text or markdown formatting.`;

    const response = await axios.post(VERTEX_AI_PROXY_URL, { prompt });
    // Attempt to parse the response text as JSON
    const { text } = response.data;
    // Clean up potential markdown code blocks if the AI adds them
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error getting weather recommendations:', error);
    return [];
  }
};
