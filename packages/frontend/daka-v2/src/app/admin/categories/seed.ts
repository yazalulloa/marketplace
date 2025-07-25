import {Categories} from "@marketplace/core/category";


const categories: {
  name: string;
  description: string;
  image: string;
  status: "active" | "inactive";
}[]  = [
  {
    name: "Electronics",
    description: "Devices and gadgets including phones, laptops, and accessories.",
    image: "electronics.jpg",
    status: "active"
  },
  {
    name: "Books",
    description: "A wide range of books across various genres.",
    image: "books.jpg",
    status: "active"
  },
  {
    name: "Clothing",
    description: "Fashion and apparel",
    image: "clothing.jpg",
    status: "active"
  },
  {
    name: "Home & Kitchen",
    description: "Appliances and decor for your home.",
    image: "home_kitchen.jpg",
    status: "active"
  },
  {
    name: "Sports & Outdoors",
    description: "Equipment and apparel for sports enthusiasts.",
    image: "sports_outdoors.jpg",
    status: "active"
  },
  {
    name: "Health & Beauty",
    description: "Products for personal care and wellness.",
    image: "health_beauty.jpg",
    status: "active"
  },
  {
    name: "Toys & Games",
    description: "Fun and educational toys for children of all ages.",
    image: "toys_games.jpg",
    status: "inactive"
  },
  {
    name: "Automotive",
    description: "Parts and accessories for vehicles.",
    image: "automotive.jpg",
    status: "active"
  },
  {
    name: "Grocery",
    description: "Everyday essentials and gourmet foods.",
    image: "grocery.jpg",
    status: "inactive"
  },
  {
    name: "Pet Supplies",
    description: "Food and accessories for pets.",
    image: "pet_supplies.jpg",
    status: "active"
  },
  {
    name: "Arts & Crafts",
    description: "Supplies for creative projects and hobbies.",
    image: "arts_crafts.jpg",
    status: "inactive"
  },
  {
    name: "Music & Movies",
    description: "CDs, vinyl, and DVDs across various genres.",
    image: "music_movies.jpg",
    status: "active"
  },
  {
    name: "Office Supplies",
    description: "Everything you need for your office or home workspace.",
    image: "office_supplies.jpg",
    status: "active"
  },
  {
    name: "Garden & Outdoor",
    description: "Tools and decor for your garden and outdoor spaces.",
    image: "garden_outdoor.jpg",
    status: "active"
  },
  {
    name: "Baby Products",
    description: "Essentials for newborns and toddlers.",
    image: "baby_products.jpg",
    status: "inactive"
  },
  {
    name: "Jewelry & Accessories",
    description: "Fashion jewelry and accessories.",
    image: "jewelry_accessories.jpg",
    status: "active"
  },
  {
    name: "Health & Fitness",
    description: "Supplements and equipment for a healthy lifestyle.",
    image: "health_fitness.jpg",
    status: "active"
  }
]
export async function seedCategories() {

  //for of 0 to 5
  let i= 0;
  while (i < 5) {
    i++;

    for (const category of categories) {
      try {
        // Assuming Categories.create is a function that inserts a category into the database
        await Categories.create({
          name: category.name,
          description: category.description,
          image: category.image,
          status: category.status || "active",
        });
        console.log(`Category "${category.name}" seeded successfully.`);
      } catch (error) {
        console.error(`Failed to seed category "${category.name}":`, error);
      }
    }
  }


}

