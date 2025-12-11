export interface MenuItem {
  name: string;
  price: string;
  category: 'Appetizer' | 'Main Course' | 'Dessert' | 'Beverage';
  description: string;
  initialImage?: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}