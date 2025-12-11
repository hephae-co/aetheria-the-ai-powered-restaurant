export interface FoodCharacteristic {
  spicy: boolean;
  kidFriendly: boolean;
  glutenFree: boolean;
  vegetarian: boolean;
  vegan: boolean;
  description: string;
}

export const MENU_CHARACTERISTICS: { [key: string]: FoodCharacteristic } = {
  "Abyssal Scallops": {
    spicy: false,
    kidFriendly: false,
    glutenFree: true,
    vegetarian: false,
    vegan: false,
    description: "Pan-seared scallops from the deep, served with a delicate saffron-infused reduction."
  },
  "Celestial Cider": {
    spicy: false,
    kidFriendly: true,
    glutenFree: true,
    vegetarian: true,
    vegan: true,
    description: "A sparkling, non-alcoholic cider with notes of apple, cinnamon, and a hint of star anise."
  },
  "Cosmic Caramel Cheesecake": {
    spicy: false,
    kidFriendly: true,
    glutenFree: false,
    vegetarian: true,
    vegan: false,
    description: "Rich, creamy cheesecake swirled with salted caramel, topped with a galaxy of edible glitter."
  },
  "Crimson Mushroom Risotto": {
    spicy: false,
    kidFriendly: true,
    glutenFree: true,
    vegetarian: true,
    vegan: false,
    description: "Arborio rice cooked to perfection with wild crimson mushrooms and a touch of Parmesan."
  },
  "Galactic Garden Salad": {
    spicy: false,
    kidFriendly: true,
    glutenFree: true,
    vegetarian: true,
    vegan: true,
    description: "A vibrant mix of fresh greens, edible flowers, and celestial-inspired vegetables with a light vinaigrette."
  },
  "Meteor Meatballs": {
    spicy: true,
    kidFriendly: false,
    glutenFree: false,
    vegetarian: false,
    vegan: false,
    description: "Spicy, savory meatballs, slow-cooked in a fiery tomato sauce, reminiscent of a meteor shower."
  },
  "Nebula Noodle Soup": {
    spicy: false,
    kidFriendly: true,
    glutenFree: false,
    vegetarian: true,
    vegan: true,
    description: "A comforting noodle soup with a clear, flavorful broth and a swirl of colorful vegetables."
  },
  "Orion Onion Rings": {
    spicy: false,
    kidFriendly: true,
    glutenFree: false,
    vegetarian: true,
    vegan: true,
    description: "Crispy, golden onion rings, lightly battered and fried to a perfect crunch."
  },
  "Solar Flare Salmon": {
    spicy: true,
    kidFriendly: false,
    glutenFree: true,
    vegetarian: false,
    vegan: false,
    description: "Grilled salmon with a spicy, citrus glaze that ignites the palate like a solar flare."
  }
};