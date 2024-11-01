type Category = {
    id?: number;
    name: string;
    subcategories?: Category[];
  };

export const fbCategories = [
    {
      id: 1,
      name: "Home & Garden",
      subcategories: [
        { name: "Tools" },
        { name: "Furniture" },
        { name: "Household" },
        { name: "Garden" },
        { name: "Appliances" }
      ]
    },
    {
      id: 2,
      name: "Entertainment",
      subcategories: [
        { name: "Video Games" },
        { name: "Books, Movies & Music" }
      ]
    },
    {
      id: 3,
      name: "Clothing & Accessories",
      subcategories: [
        { name: "Bags & Luggage" },
        { name: "Women’s Clothing & Shoes" },
        { name: "Men’s Clothing & Shoes" },
        { name: "Jewelry & Accessories" }
      ]
    },
    {
      id: 4,
      name: "Family",
      subcategories: [
        { name: "Health & Beauty" },
        { name: "Pet Supplies" },
        { name: "Baby & Kids" },
        { name: "Toys & Games" }
      ]
    },
    {
      id: 5,
      name: "Electronics",
      subcategories: [
        { name: "Electronics & Computers" },
        { name: "Mobile Phones" }
      ]
    },
    {
      id: 6,
      name: "Hobbies",
      subcategories: [
        { name: "Bicycles" },
        { name: "Arts & Crafts" },
        { name: "Sports & Outdoors" },
        { name: "Auto Parts" },
        { name: "Musical Instruments" },
        { name: "Antiques & Collectibles" }
      ]
    },
    {
      id: 7,
      name: "Classifieds",
      subcategories: [
        { name: "Garage Sale" },
        { name: "Miscellaneous" }
      ]
    },
    {
      id: 8,
      name: "Vehicles"
    }
  ]

export const kjCategories = [
    {
        id: 10,
        name: "Arts & Collectibles",
        subcategories: []
    },
    {
        id: 767,
        name: "Audio",
        subcategories: [
            { id: 768, name: "iPods & MP3s" },
            { id: 769, name: "iPod & MP3 Accessories" },
            { id: 770, name: "Headphones" },
            { id: 14922002, name: "Speakers" },
            { id: 14922001, name: "Stereo Systems & Home Theatre" },
            { id: 771, name: "Other" }
        ]
    },
    {
        id: 253,
        name: "Baby Items",
        subcategories: [
            { id: 272, name: "Bathing & Changing" },
            { id: 257, name: "Clothing (Preemie)" },
            { id: 258, name: "Clothing (0 to 3 months)" },
            { id: 259, name: "Clothing (3 to 6 months)" },
            { id: 260, name: "Clothing (6 to 9 months)" },
            { id: 261, name: "Clothing (9 to 12 months)" },
            { id: 262, name: "Clothing (12 to 18 months)" },
            { id: 263, name: "Clothing (18 to 24 months)" },
            { id: 264, name: "Clothing (2T)" },
            { id: 265, name: "Clothing (3T)" },
            { id: 266, name: "Clothing (4T)" },
            { id: 267, name: "Clothing (5T)" },
            { id: 269, name: "Cribs" },
            { id: 271, name: "Feeding & High Chairs" },
            { id: 273, name: "Gates, Monitors & Safety" },
            { id: 268, name: "Playpens, Swings & Saucers" },
            { id: 270, name: "Strollers, Carriers & Car Seats" },
            { id: 256, name: "Toys" },
            { id: 255, name: "Multi Item" },
            { id: 254, name: "Other" }
        ]
    },
    {
        id: 644,
        name: "Bikes",
        subcategories: [
            { id: 645, name: "BMX" },
            { id: 650, name: "Clothing, Shoes & Accessories" },
            { id: 15096001, name: "Cruiser, Commuter & Hybrid" },
            { id: 14654001, name: "Ebike" },
            { id: 15096002, name: "Fixie/Single Speed" },
            { id: 649, name: "Frames & Parts" },
            { id: 646, name: "Kids" },
            { id: 647, name: "Mountain" },
            { id: 648, name: "Road" },
            { id: 651, name: "Other" }
        ]
    },
    {
        id: 109,
        name: "Books",
        subcategories: [
            { id: 14970001, name: "Textbooks" },
            { id: 14970002, name: "Magazines" },
            { id: 14970003, name: "Children & Young Adult" },
            { id: 14970004, name: "Comics & Graphic Novels" },
            { id: 14970005, name: "Fiction" },
            { id: 14970006, name: "Non-Fiction" },
            { id: 14970007, name: "Other" }
        ]
    },
    {
        id: 29659003,
        name: "Business & Industrial",
        subcategories: [
            { id: 29659004, name: "Industrial Kitchen Supplies" },
            { id: 29659005, name: "Industrial Shelving & Racking" },
            { id: 29659006, name: "Storage Containers" },
            { id: 145, name: "Other Business & Industrial" }
        ]
    },
    {
        id: 103,
        name: "Cameras & Camcorders",
        subcategories: []
    },
    {
        id: 104,
        name: "CDs, DVDs & Blu-ray",
        subcategories: []
    },
    {
        id: 274,
        name: "Clothing",
        subcategories: [
            { id: 277, name: "Costumes" },
            { id: 279, name: "Kids & Youth" },
            { id: 278, name: "Men's" },
            { id: 15117001, name: "Men's Shoes" },
            { id: 276, name: "Multi Item" },
            { id: 280, name: "Wedding" },
            { id: 281, name: "Women's Bags & Wallets" },
            { id: 285, name: "Women's Bottoms" },
            { id: 283, name: "Women's Dresses & Skirts" },
            { id: 282, name: "Women's Maternity" },
            { id: 286, name: "Women's Shoes" },
            { id: 284, name: "Women's Tops & Outerwear" },
            { id: 275, name: "Other" },
            { id: 287, name: "Women's Other" }
        ]
    },
    {
        id: 16,
        name: "Computers",
        subcategories: [
            { id: 772, name: "Desktop Computers" },
            { id: 776, name: "iPads & Tablets" },
            { id: 773, name: "Laptops" },
            { id: 774, name: "Servers" },
            { id: 29324001, name: "Other" }
        ]
    },
    {
        id: 128,
        name: "Computer Accessories",
        subcategories: [
            { id: 777, name: "Cables & Connectors" },
            { id: 778, name: "Flash Memory & USB Sticks" },
            { id: 789, name: "iPad & Tablet Accessories" },
            { id: 780, name: "Laptop Accessories" },
            { id: 781, name: "Mice, Keyboards & Webcams" },
            { id: 782, name: "Monitors" },
            { id: 783, name: "Networking" },
            { id: 784, name: "Printers, Scanners & Fax" },
            { id: 785, name: "Services, Training & Repair" },
            { id: 786, name: "Software" },
            { id: 787, name: "Speakers, Headsets & Mics" },
            { id: 788, name: "System Components" },
            { id: 790, name: "Other" }
        ]
    },
    {
        id: 29659001,
        name: "Electronics",
        subcategories: [
            { id: 15, name: "General Electronics" },
            { id: 29659002, name: "Security Systems" }
        ]
    },
    {
        id: 17220001,
        name: "Free Stuff",
        subcategories: []
    },
    {
        id: 235,
        name: "Furniture",
        subcategories: [
            { id: 246, name: "Beds & Mattresses" },
            { id: 249, name: "Bookcases & Shelving Units" },
            { id: 245, name: "Chairs & Recliners" },
            { id: 241, name: "Coffee Tables" },
            { id: 238, name: "Couches & Futons" },
            { id: 239, name: "Desks" },
            { id: 243, name: "Dining Tables & Sets" },
            { id: 247, name: "Dressers & Wardrobes" },
            { id: 250, name: "Hutches & Display Cabinets" },
            { id: 244, name: "Other Tables" },
            { id: 242, name: "TV Tables & Entertainment Units" },
            { id: 237, name: "Multi Item" },
            { id: 236, name: "Other" }
        ]
    },
    {
        id: 638,
        name: "Garage Sales",
        subcategories: []
    },
    {
        id: 140,
        name: "Health & Special Needs",
        subcategories: []
    },
    {
        id: 139,
        name: "Hobbies & Crafts",
        subcategories: []
    },
    {
        id: 107,
        name: "Home Appliances",
        subcategories: [
            { id: 689, name: "Coffee Makers" },
            { id: 690, name: "Dishwashers" },
            { id: 691, name: "Freezers" },
            { id: 692, name: "Heaters, Humidifiers & Dehumidifiers" },
            { id: 693, name: "Irons & Garment Steamers" },
            { id: 694, name: "Microwaves & Cookers" },
            { id: 695, name: "Processors, Blenders & Juicers" },
            { id: 696, name: "Refrigerators" },
            { id: 697, name: "Stoves, Ovens & Ranges" },
            { id: 698, name: "Toasters & Toaster Ovens" },
            { id: 699, name: "Vacuums" },
            { id: 700, name: "Washers & Dryers" },
            { id: 701, name: "Other" }
        ]
    },
    {
        id: 717,
        name: "Home Indoor",
        subcategories: [
            { id: 718, name: "Bathwares" },
            { id: 719, name: "Bedding" },
            { id: 15058001, name: "Fireplace & Firewood" },
            { id: 15058002, name: "Holiday, Event & Seasonal" },
            { id: 720, name: "Home Decor & Accents" },
            { id: 721, name: "Indoor Lighting & Fans" },
            { id: 722, name: "Kitchen & Dining Wares" },
            { id: 723, name: "Rugs, Carpets & Runners" },
            { id: 15058003, name: "Storage & Organization" },
            { id: 724, name: "Window Treatments" },
            { id: 725, name: "Other" }
        ]
    },
    {
        id: 19,
        name: "Home Outdoor & Garden",
        subcategories: [
            { id: 678, name: "BBQs & Outdoor Cooking" },
            { id: 679, name: "Decks & Fences" },
            { id: 680, name: "Garage Doors & Openers" },
            { id: 681, name: "Hot Tubs & Pools" },
            { id: 682, name: "Lawnmowers & Leaf Blowers" },
            { id: 683, name: "Outdoor Decor" },
            { id: 684, name: "Outdoor Lighting" },
            { id: 685, name: "Outdoor Tools & Storage" },
            { id: 686, name: "Patio & Garden Furniture" },
            { id: 687, name: "Plants, Fertilizer & Soil" },
            { id: 688, name: "Snowblowers" },
            { id: 726, name: "Other" }
        ]
    },
    {
        id: 727,
        name: "Home Renovation Materials",
        subcategories: [
            { id: 728, name: "Cabinets & Countertops" },
            { id: 729, name: "Electrical" },
            { id: 730, name: "Floors & Walls" },
            { id: 731, name: "Hardware, Nails & Screws" },
            { id: 732, name: "Heating, Cooling & Air" },
            { id: 733, name: "Painting & Paint Supplies" },
            { id: 734, name: "Plumbing, Sinks, Toilets & Showers" },
            { id: 735, name: "Roofing" },
            { id: 736, name: "Windows, Doors & Trim" },
            { id: 737, name: "Other" }
        ]
    },
    {
        id: 133,
        name: "Jewelry & Watches",
        subcategories: []
    },
    {
        id: 17,
        name: "Musical Instruments",
        subcategories: [
            { id: 610, name: "Amps & Pedals" },
            { id: 611, name: "Brass" },
            { id: 612, name: "Drums & Percussion" },
            { id: 613, name: "Guitars" },
            { id: 14922003, name: "Performance & DJ Equipment" },
            { id: 614, name: "Pianos & Keyboards" },
            { id: 615, name: "Pro Audio & Recording Equipment" },
            { id: 616, name: "String" },
            { id: 617, name: "Woodwind" },
            { id: 618, name: "Other" }
        ]
    },
    {
        id: 132,
        name: "Phones",
        subcategories: [
            { id: 760, name: "Cell Phones" },
            { id: 761, name: "Cell Phone Accessories" },
            { id: 762, name: "Cell Phone Services" },
            { id: 765, name: "Home Phones & Answering Machines" },
            { id: 766, name: "Other" }
        ]
    },
    {
        id: 111,
        name: "Sporting Goods & Exercise",
        subcategories: [
            { id: 652, name: "Baseball & Softball" },
            { id: 653, name: "Basketball" },
            { id: 654, name: "Curling" },
            { id: 655, name: "Exercise Equipment" },
            { id: 656, name: "Fishing, Camping & Outdoors" },
            { id: 657, name: "Football" },
            { id: 658, name: "Golf" },
            { id: 659, name: "Hockey" },
            { id: 660, name: "Lacrosse" },
            { id: 661, name: "Paintball" },
            { id: 662, name: "Skates & Blades" },
            { id: 663, name: "Skateboard" },
            { id: 664, name: "Ski" },
            { id: 665, name: "Snowboard" },
            { id: 666, name: "Soccer" },
            { id: 667, name: "Tennis & Racquet" },
            { id: 668, name: "Water Sports" },
            { id: 669, name: "Other" }
        ]
    },
    {
        id: 110,
        name: "Tools",
        subcategories: [
            { id: 702, name: "Hand Tools" },
            { id: 703, name: "Power Tools" },
            { id: 704, name: "Tool Storage & Benches" },
            { id: 705, name: "Ladders & Scaffolding" },
            { id: 715, name: "Other" }
        ]
    },
    {
        id: 108,
        name: "Toys & Games",
        subcategories: []
    },
    {
        id: 15093001,
        name: "TVs & Video",
        subcategories: [
            { id: 15093002, name: "TVs" },
            { id: 15093003, name: "Video & TV Accessories" }
        ]
    },
    {
        id: 141,
        name: "Video Games & Consoles",
        subcategories: [
            { id: 619, name: "Nintendo DS" },
            { id: 33035001, name: "Nintendo Switch" },
            { id: 626, name: "Nintendo Wii" },
            { id: 14654002, name: "Nintendo Wii U" },
            { id: 39730002, name: "Sony PlayStation 5" },
            { id: 792, name: "Sony PlayStation 4" },
            { id: 627, name: "Sony PlayStation 3" },
            { id: 621, name: "Sony PSP & Vita" },
            { id: 39730001, name: "Xbox Series X & S" },
            { id: 622, name: "Xbox 360" },
            { id: 793, name: "Xbox One" },
            { id: 623, name: "Older Generation" },
            { id: 624, name: "PC Games" },
            { id: 625, name: "Other" }
        ]
    },
    {
        id: 26,
        name: "Other",
        subcategories: []
    }
]

export const ndCategories = [
    {
        id: 1,
        name: "Appliances"
    },
    {
        id: 2,
        name: "Baby & Kids"
    },
    {
        id: 3,
        name: "Bicycles"
    },
    {
        id: 4,
        name: "Clothing & Accessories"
    },
    {
        id: 5,
        name: "Electronics"
    },
    {
        id: 6,
        name: "Furniture"
    },
    {
        id: 7,
        name: "Garage Sales"
    },
    {
        id: 8,
        name: "Garden"
    },
    {
        id: 9,
        name: "Home decor"
    },
    {
        id: 10,
        name: "Home sales"
    },
    {
        id: 11,
        name: "Motoring"
    },
    {
        id: 12,
        name: "Musical Instruments"
    },
    {
        id: 13,
        name: "Neighbour made"
    },
    {
        id: 14,
        name: "Neighbour services"
    },
    {
        id: 15,
        name: "Other"
    },
    {
        id: 16,
        name: "Pet supplies"
    },
    {
        id: 17,
        name: "Property rentals"
    },
    {
        id: 18,
        name: "Sports & Outdoors"
    },
    {
        id: 19,
        name: "Tickets"
    },
    {
        id: 20,
        name: "Tools"
    },
    {
        id: 21,
        name: "Toys & Games"
    },
    {
        id: 22,
        name: "Wanted"
    }
]

