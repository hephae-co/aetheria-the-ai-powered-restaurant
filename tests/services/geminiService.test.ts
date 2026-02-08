import axios from 'axios';
import { refineMenuItemDescription, getWeatherBasedRecommendations, generateManagerResponse, processChatbotMessage, generateDishDescription } from '../../services/geminiService';
import { MENU_ITEMS } from '../../constants';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('geminiService', () => {
    beforeEach(() => {
        mockedAxios.post.mockClear();
    });

    it('refineMenuItemDescription calls the AI model with the correct prompt', async () => {
        mockedAxios.post.mockResolvedValue({ data: { text: 'Mocked response' } });
        await refineMenuItemDescription(MENU_ITEMS[0]);
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/vertex-ai-proxy', expect.objectContaining({
            prompt: expect.stringContaining(MENU_ITEMS[0].name)
        }));
    });

    it('getWeatherBasedRecommendations calls the AI model with the correct prompt', async () => {
        mockedAxios.post.mockResolvedValue({ data: { text: '["item1", "item2"]' } });
        await getWeatherBasedRecommendations('sunny', '12:00', 25, MENU_ITEMS);
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/vertex-ai-proxy', expect.objectContaining({
            prompt: expect.stringContaining('sunny')
        }));
    });

    it('generateManagerResponse calls the AI model with the correct prompt', async () => {
        mockedAxios.post.mockResolvedValue({ data: { text: 'Mocked response' } });
        await generateManagerResponse('The food was great');
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/vertex-ai-proxy', expect.objectContaining({
            prompt: expect.stringContaining('The food was great')
        }));
    });

    it('processChatbotMessage calls the AI model with the correct prompt', async () => {
        mockedAxios.post.mockResolvedValue({ data: { text: 'Mocked response' } });
        await processChatbotMessage('Hello', []);
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/vertex-ai-proxy', expect.objectContaining({
            prompt: expect.stringContaining('Hello')
        }));
    });

    it('getWeatherBasedRecommendations returns an array of strings on success', async () => {
        const mockResponse = { data: { text: '["item1", "item2"]' } };
        mockedAxios.post.mockResolvedValue(mockResponse);
        const result = await getWeatherBasedRecommendations('sunny', '12:00', 25, []);
        expect(result).toEqual(['item1', 'item2']);
    });

    it('getWeatherBasedRecommendations returns an empty array on failure', async () => {
        mockedAxios.post.mockRejectedValue(new Error('API Error'));
        const result = await getWeatherBasedRecommendations('sunny', '12:00', 25, []);
        expect(result).toEqual([]);
    });

    it('generateDishDescription returns a string on success', async () => {
        const mockResponse = { data: { text: 'A delicious dish' } };
        mockedAxios.post.mockResolvedValue(mockResponse);
        const result = await generateDishDescription('test dish');
        expect(result).toBe('A delicious dish');
    });

    it('generateDishDescription returns a default string on failure', async () => {
        mockedAxios.post.mockRejectedValue(new Error('API Error'));
        const result = await generateDishDescription('test dish');
        expect(result).toBe('A delightful dish crafted with the freshest ingredients, promising an unforgettable culinary experience.');
    });
});
