import { images } from '../constants';

const menu = [
    {
      id: 0,
      title: 'Tako Su',
      category: 'appetizers',
      subCategory: 'Sashimi',
      price: '10.95',
      desc: 'Octopus with light vinegar sauce',
      // img: images.assortment,
      img: null,
      pdf: null
    },
    {
      id: 1,
      title: 'Tuna Tataki**',
      category: 'appetizers',
      subCategory: 'Sashimi',
      price: '18.95',
      desc: 'Seared tuna with ponzu sauce',
      // img: images.assortment,
      img: null,
      pdf: null
    },
    {
      id: 2,
      title: 'Tempura',
      category: 'appetizers',
      subCategory: 'Kitchen',
      price: '8.95',
      desc: '2-piece fried shrimp with vegetables',
      img: null,
      pdf: null
    },
    {
      id: 3,
      title: 'Ebi(SHRIMP) Tempura**',
      category: 'appetizers',
      subCategory: 'Kitchen',
      price: '11.95',
      desc: '4-piece fried shrimp',
      img: null,
      pdf: null
    },
    {
      id: 4,
      title: 'Vegetable Tempura**',
      category: 'appetizers',
      subCategory: 'Kitchen',
      price: '6.95',
      desc: '7-Piece assorted vegetables',
      img: null,
      pdf: null
    },
    {
      id: 5,
      title: 'Nasu Shigi',
      category: 'appetizers',
      subCategory: 'Kitchen',
      price: '7.95',
      desc: 'Broiled egg plant with sweet miso sauce',
      img: null,
      pdf: null
    },
    {
      id: 6,
      title: 'Age Dashi Tofu',
      category: 'appetizers',
      subCategory: 'Kitchen',
      price: '5.95',
      desc: 'Deep fried tofu with sweet soy sauce, onion, seaweed, red radish',
      img: null,
      pdf: null
    },
    {
      id: 7,
      title: 'Gyoza',
      category: 'appetizers',
      subCategory: 'Kitchen',
      price: '5.95',
      desc: 'Fried minced meat & vegetable dumpling',
      img: null,
      pdf: null
    },
    {
      id: 8,
      title: 'Ebi Shumai',
      category: 'appetizers',
      subCategory: 'Kitchen',
      price: '5.95',
      desc: 'Steamed shrimp dumpling',
      img: null,
      pdf: null
    },
    {
      id: 9,
      title: 'Edamame',
      category: 'appetizers',
      subCategory: 'Kitchen',
      price: '4.95',
      desc: 'Steamed sweet green bean',
      img: null,
      pdf: null
    },
    {
      id: 10,
      title: 'Alaskan soup',
      category: 'Soup & Salad',
      subCategory: 'Soup',
      price: '9.95',
      desc: 'Egg drop soup with crabmeat, shrimp and green onion',
      img: null,
      pdf: null
    },
    {
      id: 11,
      title: 'Kinoko Soup (For Two)',
      category: 'Soup & Salad',
      subCategory: 'Soup',
      price: '8.95',
      desc: '2 varieties of mushroom, broccoli in soup',
      img: null,
      pdf: null
    },
    {
      id: 12,
      title: 'Avocado Salad',
      category: 'Soup & Salad',
      subCategory: 'Salad',
      price: '10.95 (L) / $7.95 (S)',
      desc: 'Lettuce, romaine, tomato, orange, cucumber and avocado',
      img: null,
      pdf: null
    },
    {
      id: 13,
      title: 'Kaiso Salad',
      category: 'Soup & Salad',
      subCategory: 'Salad',
      price: '8.95 (L) / $4.95 (S)',
      desc: 'Variety of seaweed salad',
      img: null,
      pdf: null
    },
    {
      id: 14,
      title: 'Mix Green (Small)',
      category: 'Soup & Salad',
      subCategory: 'Salad',
      price: '6.95 (L) / $4.95 (S)',
      desc: 'Lettuce, romaine, tomato, orange and cucumber with ginger dressing',
      img: null,
      pdf: null
    },
    {
      id: 15,
      title: 'Nabeyaki Udon',
      category: 'Noodles',
      subCategory: 'Noodles',
      price: '14.95',
      desc: 'Thick noodle soup with egg, mushrooms, green onion, Napa, kamaboko & shrimp tempura',
      img: null,
      pdf: null
    },
    {
      id: 16,
      title: 'Tempura Udon',
      category: 'Noodles',
      subCategory: 'Noodles',
      price: '13.95',
      desc: 'Thick noodle soup with mushrooms, green onion, kamaboko & shrimp tempura',
      img: null,
      pdf: null
    },
    {
      id: 17,
      title: 'Tempura Soba',
      category: 'Noodles',
      subCategory: 'Noodles',
      price: '13.95',
      desc: 'Buckwheat noodle soup with green onion,mushroom and kamaboko and shrimp tempura on the side',
      img: null,
      pdf: null
    },
    {
      id: 42,
      title: 'Yaki Soba',
      category: 'Noodles',
      subCategory: 'Noodles',
      price: '17.95',
      desc: 'Pan fried noodle with chicken, assorted vegetable and house sauce',
      img: null,
      pdf: null
    },
    {
      id: 43,
      title: 'Chicken Teriyaki',
      category: 'Entrees',
      subCategory: 'Teriyaki',
      price: '18.95',
      desc: 'Broiled chicken breast with teriyaki sauce',
      img: null,
      pdf: null
    },
    {
      id: 18,
      title: 'Salmon Teriyaki',
      category: 'Entrees',
      subCategory: 'Teriyaki',
      price: '22.95',
      desc: 'Broiled Salmon with teriyaki sauce',
      img: null,
      pdf: null
    },
    {
      id: 19,
      title: 'Don Katsu',
      category: 'Entrees',
      subCategory: 'Katsu',
      price: '18.95',
      desc: 'Fried breaded pork cutlet served with delicious cutlet sauce',
      img: null,
      pdf: null
    },
    {
      id: 20,
      title: 'Chicken Katsu',
      category: 'Entrees',
      subCategory: 'Katsu',
      price: '16.95',
      desc: 'Fried breaded chicken cutlet served with delicious cutlet sauce',
      img: null,
      pdf: null
    },
    {
      id: 21,
      title: 'Katsu Don',
      category: 'Entrees',
      subCategory: 'Don',
      price: '16.95',
      desc: 'Pork cutlet, onion, mushroom, green onion, kamaboko & egg with sweet soy sauce over the rice',
      img: null,
      pdf: null
    },
    {
      id: 22,
      title: 'Chicken Don',
      category: 'Entrees',
      subCategory: 'Don',
      price: '16.95',
      desc: 'Chicken cutlet, onion, mushroom, green onion, kamaboko & egg with sweet soy sauce over the rice',
      img: null,
      pdf: null
    },
    {
      id: 23,
      title: 'Unagi Don',
      category: 'Entrees',
      subCategory: 'Don',
      price: '23.95',
      desc: 'Broiled fresh water smoked eel over rice',
      img: null,
      pdf: null
    },
    {
      id: 24,
      title: 'Bibimbob',
      category: 'Entrees',
      subCategory: 'Rice',
      price: '16.95',
      desc: 'Hot stone bowl with mixed vegetables (Beef, Chicken or Tofu)',
      img: null,
      pdf: null
    },
    {
      id: 44,
      title: 'Bulgogi',
      category: 'Entrees',
      subCategory: 'Rice',
      price: '23.95',
      desc: 'Thin sliced beef with onion, mushroom, green onion, sesame oil & house special sauce',
      img: null,
      pdf: null
    },
    {
      id: 25,
      title: 'Tempura',
      category: 'Entrees',
      subCategory: 'Tempura',
      price: '17.95',
      desc: '5-piece fried shrimp & 5-piece fried vegetables served with tempura sauce',
      img: null,
      pdf: null
    },
    {
      id: 26,
      title: 'Ebi Tempura',
      category: 'Entrees',
      subCategory: 'Tempura',
      price: '19.95',
      desc: '7-piece fried shrimp & 2-piece fried vegetables served with tempura sauce',
      img: null,
      pdf: null
    },
    {
      id: 27,
      title: 'Vegetable Tempura',
      category: 'Entrees',
      subCategory: 'Tempura',
      price: '13.95',
      desc: 'Lightly fried vegetables served with tempura sauce',
      img: null,
      pdf: null
    },
    {
      id: 28,
      title: 'Hwae Dup Bob**',
      category: 'Entrees',
      subCategory: 'Rice',
      price: '24.95',
      desc: 'Assorted mixed vegetables with assorted sashimi & special hot sauce',
      img: null,
      pdf: null
    },
    {
      id: 29,
      title: 'Chirashi**',
      category: 'Entrees',
      subCategory: 'Rice',
      price: '28.95',
      desc: 'Assorted Sashimi over sushi rice',
      img: null,
      pdf: null
    },
    {
      id: 30,
      title: 'Hamachigama',
      category: 'Entrees',
      subCategory: 'Rice',
      price: '17.95',
      desc: 'Broiled yellow tail jaw',
      img: null,
      pdf: null
    },
    {
      id: 41,
      title: 'Sushi and Sashimi Menu',
      category: 'Sushi & Sashimi',
      subCategory: 'Sushi & Sashimi Menu',
      price: '$$$',
      desc: 'Sushi and Sashimi Menu. Please check the PDF file for furhther detail',
      img: null,
      pdf: images.sushi_menu
    },
    {
      id: 31,
      title: 'Sushi Regular**',
      category: 'Sushi & Sashimi',
      subCategory: 'Sushi & Sashimi Combos',
      price: '26.95',
      desc: '8-piece sushi with california roll or tuna roll',
      img: null,
      pdf: null
    },
    {
      id: 32,
      title: 'Sushi Deluxe**',
      category: 'Sushi & Sashimi',
      subCategory: 'Sushi & Sashimi Combos',
      price: '29.95',
      desc: '10-piece sushi with california roll or tuna roll',
      img: null,
      pdf: null
    },
    {
      id: 33,
      title: 'Sushi For Two**',
      category: 'Sushi & Sashimi',
      subCategory: 'Sushi & Sashimi Combos',
      price: '60.00',
      desc: '20-piece nigiri sushi with California, Tuna & East roll',
      img: null,
      pdf: null
    },
    {
      id: 34,
      title: 'Sushi/Sashimi Combination**',
      category: 'Sushi & Sashimi',
      subCategory: 'Sushi & Sashimi Combos',
      price: '29.95',
      desc: '5-piece sushi, 7-piece sashimi & Tuna roll',
      img: null,
      pdf: null
    },
    {
      id: 35,
      title: 'Sushi/Sashimi Combination For Two**',
      category: 'Sushi & Sashimi',
      subCategory: 'Sushi & Sashimi Combos',
      price: '60.00',
      desc: '10-piece sushi, 14-piece sashimi, East roll & Tuna roll',
      img: null,
      pdf: null
    },
    {
      id: 36,
      title: '15-Piece Sashimi Regular**',
      category: 'Sushi & Sashimi',
      subCategory: 'Sushi & Sashimi Combos',
      price: '34.95',
      desc: '15-pieces of chef\'s selection of gourmet fresh sashimi',
      img: null,
      pdf: null
    },
    {
      id: 37,
      title: '22-Piece Sashimi Regular For 2**',
      category: 'Sushi & Sashimi',
      subCategory: 'Sushi & Sashimi Combos',
      price: '60.00',
      desc: '22-pieces of chef\'s selection of gourmet fresh sashimi',
      img: null,
      pdf: null
    },
    {
      id: 39,
      title: '#1 Roll Combination**',
      category: 'Sushi & Sashimi',
      subCategory: 'Sushi & Sashimi Combos',
      price: '17.50',
      desc: 'California, Tuna & East roll',
      img: null,
      pdf: null
    },
    {
      id: 40,
      title: '#2 Roll Combination**',
      category: 'Sushi & Sashimi',
      subCategory: 'Sushi & Sashimi Combos',
      price: '24.95',
      desc: 'California, Spicy Tuna & Crunch roll',
      img: null,
      pdf: null
    },
    {
      id: 41,
      title: '#3 Roll Combination**',
      category: 'Sushi & Sashimi',
      subCategory: 'Sushi & Sashimi Combos',
      price: '25.45',
      desc: 'Dragon, Tuna & Alaskan roll',
      img: null,
      pdf: null
    },
  ];
  export default menu;