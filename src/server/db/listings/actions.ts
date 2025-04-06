'use server'
import { db } from "~/server/db";
import { listings } from "~/server/db/schema";
import type { formSchema } from "~/components/ui/listing-form";
import type * as z from "zod"
import { auth } from "@clerk/nextjs/server";
import type {editSchema} from "~/components/modals/edit-modal"
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Type, GoogleGenAI } from "@google/genai";

export async function insertListingToDb(formValues: z.infer < typeof formSchema >) {
    const user = await auth()
    await db.insert(listings).values(
        {userId: user.userId,
        title: formValues.title,
        images: {
          "1": formValues.photos
        },
        price: formValues.price,
        sku: formValues.sku,
        condition: formValues.condition,
        category: formValues.category,
        description: formValues.description,
        tags: {
          "1": formValues.tags
        }, // form collects array of strings
        }
      )
  
}

const listingSchema = {
  type: Type.OBJECT,
  description: "Listing Fields",
  properties: {
    description: {
      type: Type.STRING,
      description: "describe the item in detail and any info for prospective buyers",
    },
    price: {
      type: Type.INTEGER,
      minimum: 0,
    },
    sku: {
      type: Type.STRING,
    },
    category: {
      type: Type.OBJECT,
      description: "Category with id and name that must match.",
      properties: {
        id: {
          type: Type.INTEGER,
          description: "ID of the Kijiji category.",
        },
        name: {
          type: Type.STRING,
          description: "Name of the Kijiji category.",
        },
      },
      required: ["id", "name"],
    },
    title: {
      type: Type.STRING,
    },
    condition: {
      type: Type.STRING,
      enum: ["brand-new", "like-new", "good", "fair"],
    },
    "image-urls": {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    tags: {
      type: Type.ARRAY,
      minItems: "7",
      maxItems: "10",
      items: { type: Type.STRING },
    },
  },
  required: ["description", "category", "title", "condition", "image-urls", "tags"],
};

export async function updateListing(formValues: z.infer<typeof editSchema>) {
  const id = formValues.id 
  // Update only fields in `editSchema`
  await db.update(listings)
    .set({
      title: formValues.title,
      price: formValues.price,
      sku: formValues.sku,
      condition: formValues.condition,
      description: formValues.description,
      updatedAt: new Date()
    })
    .where(eq(listings.id, id));
    redirect("/dashboard")
    // Ensure the listing belongs to the authenticated user
}

async function imageFromUrlToBase64(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const contentType = response.headers.get('content-type') ?? 'image/jpeg';
  return {  
    inlineData: {
      data: base64,
      mimeType: contentType 
    }
  };
}
const MyCategories = "\n[{\n      \"id\": 10,\n      \"name\": \"Arts & Collectibles\"\n    },\n    {\n      \"id\": 768,\n      \"name\": \"Audio: iPods & MP3s\"\n    },\n    {\n      \"id\": 769,\n      \"name\": \"Audio: iPod & MP3 Accessories\"\n    },\n    {\n      \"id\": 770,\n      \"name\": \"Audio: Headphones\"\n    },\n    {\n      \"id\": 14922002,\n      \"name\": \"Audio: Speakers\"\n    },\n    {\n      \"id\": 14922001,\n      \"name\": \"Audio: Stereo Systems & Home Theatre\"\n    },\n    {\n      \"id\": 771,\n      \"name\": \"Audio: Other\"\n    },\n    {\n      \"id\": 272,\n      \"name\": \"Baby Items: Bathing & Changing\"\n    },\n    {\n      \"id\": 257,\n      \"name\": \"Baby Items: Clothing (Preemie)\"\n    },\n    {\n      \"id\": 258,\n      \"name\": \"Baby Items: Clothing (0 to 3 months)\"\n    },\n    {\n      \"id\": 259,\n      \"name\": \"Baby Items: Clothing (3 to 6 months)\"\n    },\n    {\n      \"id\": 260,\n      \"name\": \"Baby Items: Clothing (6 to 9 months)\"\n    },\n    {\n      \"id\": 261,\n      \"name\": \"Baby Items: Clothing (9 to 12 months)\"\n    },\n    {\n      \"id\": 262,\n      \"name\": \"Baby Items: Clothing (12 to 18 months)\"\n    },\n    {\n      \"id\": 263,\n      \"name\": \"Baby Items: Clothing (18 to 24 months)\"\n    },\n    {\n      \"id\": 264,\n      \"name\": \"Baby Items: Clothing (2T)\"\n    },\n    {\n      \"id\": 265,\n      \"name\": \"Baby Items: Clothing (3T)\"\n    },\n    {\n      \"id\": 266,\n      \"name\": \"Baby Items: Clothing (4T)\"\n    },\n    {\n      \"id\": 267,\n      \"name\": \"Baby Items: Clothing (5T)\"\n    },\n    {\n      \"id\": 269,\n      \"name\": \"Baby Items: Cribs\"\n    },\n    {\n      \"id\": 271,\n      \"name\": \"Baby Items: Feeding & High Chairs\"\n    },\n    {\n      \"id\": 273,\n      \"name\": \"Baby Items: Gates, Monitors & Safety\"\n    },\n    {\n      \"id\": 268,\n      \"name\": \"Baby Items: Playpens, Swings & Saucers\"\n    },\n    {\n      \"id\": 270,\n      \"name\": \"Baby Items: Strollers, Carriers & Car Seats\"\n    },\n    {\n      \"id\": 256,\n      \"name\": \"Baby Items: Toys\"\n    },\n    {\n      \"id\": 255,\n      \"name\": \"Baby Items: Multi Item\"\n    },\n    {\n      \"id\": 254,\n      \"name\": \"Baby Items: Other\"\n    },\n    {\n      \"id\": 645,\n      \"name\": \"Bikes: BMX\"\n    },\n    {\n      \"id\": 650,\n      \"name\": \"Bikes: Clothing, Shoes & Accessories\"\n    },\n    {\n      \"id\": 15096001,\n      \"name\": \"Bikes: Cruiser, Commuter & Hybrid\"\n    },\n    {\n      \"id\": 14654001,\n      \"name\": \"Bikes: Ebike\"\n    },\n    {\n      \"id\": 15096002,\n      \"name\": \"Bikes: Fixie/Single Speed\"\n    },\n    {\n      \"id\": 649,\n      \"name\": \"Bikes: Frames & Parts\"\n    },\n    {\n      \"id\": 646,\n      \"name\": \"Bikes: Kids\"\n    },\n    {\n      \"id\": 647,\n      \"name\": \"Bikes: Mountain\"\n    },\n    {\n      \"id\": 648,\n      \"name\": \"Bikes: Road\"\n    },\n    {\n      \"id\": 651,\n      \"name\": \"Bikes: Other\"\n    },\n    {\n      \"id\": 14970001,\n      \"name\": \"Books: Textbooks\"\n    },\n    {\n      \"id\": 14970002,\n      \"name\": \"Books: Magazines\"\n    },\n    {\n      \"id\": 14970003,\n      \"name\": \"Books: Children & Young Adult\"\n    },\n    {\n      \"id\": 14970004,\n      \"name\": \"Books: Comics & Graphic Novels\"\n    },\n    {\n      \"id\": 14970005,\n      \"name\": \"Books: Fiction\"\n    },\n    {\n      \"id\": 14970006,\n      \"name\": \"Books: Non-Fiction\"\n    },\n    {\n      \"id\": 14970007,\n      \"name\": \"Books: Other\"\n    },\n    {\n      \"id\": 29659004,\n      \"name\": \"Business & Industrial: Industrial Kitchen Supplies\"\n    },\n    {\n      \"id\": 29659005,\n      \"name\": \"Business & Industrial: Industrial Shelving & Racking\"\n    },\n    {\n      \"id\": 29659006,\n      \"name\": \"Business & Industrial: Storage Containers\"\n    },\n    {\n      \"id\": 145,\n      \"name\": \"Business & Industrial: Other Business & Industrial\"\n    },\n    {\n      \"id\": 103,\n      \"name\": \"Cameras & Camcorders\"\n    },\n    {\n      \"id\": 104,\n      \"name\": \"CDs, DVDs & Blu-ray\"\n    },\n    {\n      \"id\": 277,\n      \"name\": \"Clothing: Costumes\"\n    },\n    {\n      \"id\": 279,\n      \"name\": \"Clothing: Kids & Youth\"\n    },\n    {\n      \"id\": 278,\n      \"name\": \"Clothing: Men's\"\n    },\n    {\n      \"id\": 15117001,\n      \"name\": \"Clothing: Men's Shoes\"\n    },\n    {\n      \"id\": 276,\n      \"name\": \"Clothing: Multi Item\"\n    },\n    {\n      \"id\": 280,\n      \"name\": \"Clothing: Wedding\"\n    },\n    {\n      \"id\": 281,\n      \"name\": \"Clothing: Women's Bags & Wallets\"\n    },\n    {\n      \"id\": 285,\n      \"name\": \"Clothing: Women's Bottoms\"\n    },\n    {\n      \"id\": 283,\n      \"name\": \"Clothing: Women's Dresses & Skirts\"\n    },\n    {\n      \"id\": 282,\n      \"name\": \"Clothing: Women's Maternity\"\n    },\n    {\n      \"id\": 286,\n      \"name\": \"Clothing: Women's Shoes\"\n    },\n    {\n      \"id\": 284,\n      \"name\": \"Clothing: Women's Tops & Outerwear\"\n    },\n    {\n      \"id\": 275,\n      \"name\": \"Clothing: Other\"\n    },\n    {\n      \"id\": 287,\n      \"name\": \"Clothing: Women's Other\"\n    },\n    {\n      \"id\": 772,\n      \"name\": \"Computers: Desktop Computers\"\n    },\n    {\n      \"id\": 776,\n      \"name\": \"Computers: iPads & Tablets\"\n    },\n    {\n      \"id\": 773,\n      \"name\": \"Computers: Laptops\"\n    },\n    {\n      \"id\": 774,\n      \"name\": \"Computers: Servers\"\n    },\n    {\n      \"id\": 29324001,\n      \"name\": \"Computers: Other\"\n    },\n    {\n      \"id\": 777,\n      \"name\": \"Computer Accessories: Cables & Connectors\"\n    },\n    {\n      \"id\": 778,\n      \"name\": \"Computer Accessories: Flash Memory & USB Sticks\"\n    },\n    {\n      \"id\": 789,\n      \"name\": \"Computer Accessories: iPad & Tablet Accessories\"\n    },\n    {\n      \"id\": 780,\n      \"name\": \"Computer Accessories: Laptop Accessories\"\n    },\n    {\n      \"id\": 781,\n      \"name\": \"Computer Accessories: Mice, Keyboards & Webcams\"\n    },\n    {\n      \"id\": 782,\n      \"name\": \"Computer Accessories: Monitors\"\n    },\n    {\n      \"id\": 783,\n      \"name\": \"Computer Accessories: Networking\"\n    },\n    {\n      \"id\": 784,\n      \"name\": \"Computer Accessories: Printers, Scanners & Fax\"\n    },\n    {\n      \"id\": 785,\n      \"name\": \"Computer Accessories: Services, Training & Repair\"\n    },\n    {\n      \"id\": 786,\n      \"name\": \"Computer Accessories: Software\"\n    },\n    {\n      \"id\": 787,\n      \"name\": \"Computer Accessories: Speakers, Headsets & Mics\"\n    },\n    {\n      \"id\": 788,\n      \"name\": \"Computer Accessories: System Components\"\n    },\n    {\n      \"id\": 790,\n      \"name\": \"Computer Accessories: Other\"\n    },\n    {\n      \"id\": 15,\n      \"name\": \"Electronics: General Electronics\"\n    },\n    {\n      \"id\": 29659002,\n      \"name\": \"Electronics: Security Systems\"\n    },\n    {\n      \"id\": 17220001,\n      \"name\": \"Free Stuff\"\n    },\n    {\n      \"id\": 246,\n      \"name\": \"Furniture: Beds & Mattresses\"\n    },\n    {\n      \"id\": 249,\n      \"name\": \"Furniture: Bookcases & Shelving Units\"\n    },\n    {\n      \"id\": 245,\n      \"name\": \"Furniture: Chairs & Recliners\"\n    },\n    {\n      \"id\": 241,\n      \"name\": \"Furniture: Coffee Tables\"\n    },\n    {\n      \"id\": 238,\n      \"name\": \"Furniture: Couches & Futons\"\n    },\n    {\n      \"id\": 239,\n      \"name\": \"Furniture: Desks\"\n    },\n    {\n      \"id\": 243,\n      \"name\": \"Furniture: Dining Tables & Sets\"\n    },\n    {\n      \"id\": 247,\n      \"name\": \"Furniture: Dressers & Wardrobes\"\n    },\n    {\n      \"id\": 250,\n      \"name\": \"Furniture: Hutches & Display Cabinets\"\n    },\n    {\n      \"id\": 244,\n      \"name\": \"Furniture: Other Tables\"\n    },\n    {\n      \"id\": 242,\n      \"name\": \"Furniture: TV Tables & Entertainment Units\"\n    },\n    {\n      \"id\": 237,\n      \"name\": \"Furniture: Multi Item\"\n    },\n    {\n      \"id\": 236,\n      \"name\": \"Furniture: Other\"\n    },\n    {\n      \"id\": 638,\n      \"name\": \"Garage Sales\"\n    },\n    {\n      \"id\": 140,\n      \"name\": \"Health & Special Needs\"\n    },\n    {\n      \"id\": 139,\n      \"name\": \"Hobbies & Crafts\"\n    },\n    {\n      \"id\": 689,\n      \"name\": \"Home Appliances: Coffee Makers\"\n    },\n    {\n      \"id\": 690,\n      \"name\": \"Home Appliances: Dishwashers\"\n    },\n    {\n      \"id\": 691,\n      \"name\": \"Home Appliances: Freezers\"\n    },\n    {\n      \"id\": 692,\n      \"name\": \"Home Appliances: Heaters, Humidifiers & Dehumidifiers\"\n    },\n    {\n      \"id\": 693,\n      \"name\": \"Home Appliances: Irons & Garment Steamers\"\n    },\n    {\n      \"id\": 694,\n      \"name\": \"Home Appliances: Microwaves & Cookers\"\n    },\n    {\n      \"id\": 695,\n      \"name\": \"Home Appliances: Processors, Blenders & Juicers\"\n    },\n    {\n      \"id\": 696,\n      \"name\": \"Home Appliances: Refrigerators\"\n    },\n    {\n      \"id\": 697,\n      \"name\": \"Home Appliances: Stoves, Ovens & Ranges\"\n    },\n    {\n      \"id\": 698,\n      \"name\": \"Home Appliances: Toasters & Toaster Ovens\"\n    },\n    {\n      \"id\": 699,\n      \"name\": \"Home Appliances: Vacuums\"\n    },\n    {\n      \"id\": 700,\n      \"name\": \"Home Appliances: Washers & Dryers\"\n    },\n    {\n      \"id\": 701,\n      \"name\": \"Home Appliances: Other\"\n    },\n    {\n      \"id\": 718,\n      \"name\": \"Home Indoor: Bathwares\"\n    },\n    {\n      \"id\": 719,\n      \"name\": \"Home Indoor: Bedding\"\n    },\n    {\n      \"id\": 15058001,\n      \"name\": \"Home Indoor: Fireplace & Firewood\"\n    },\n    {\n      \"id\": 15058002,\n      \"name\": \"Home Indoor: Holiday, Event & Seasonal\"\n    },\n    {\n      \"id\": 720,\n      \"name\": \"Home Indoor: Home Decor & Accents\"\n    },\n    {\n      \"id\": 721,\n      \"name\": \"Home Indoor: Indoor Lighting & Fans\"\n    },\n    {\n      \"id\": 722,\n      \"name\": \"Home Indoor: Kitchen & Dining Wares\"\n    },\n    {\n      \"id\": 723,\n      \"name\": \"Home Indoor: Rugs, Carpets & Runners\"\n    },\n    {\n      \"id\": 15058003,\n      \"name\": \"Home Indoor: Storage & Organization\"\n    },\n    {\n      \"id\": 724,\n      \"name\": \"Home Indoor: Window Treatments\"\n    },\n    {\n      \"id\": 725,\n      \"name\": \"Home Indoor: Other\"\n    },\n    {\n      \"id\": 678,\n      \"name\": \"Home Outdoor & Garden: BBQs & Outdoor Cooking\"\n    },\n    {\n      \"id\": 679,\n      \"name\": \"Home Outdoor & Garden: Decks & Fences\"\n    },\n    {\n      \"id\": 680,\n      \"name\": \"Home Outdoor & Garden: Garage Doors & Openers\"\n    },\n    {\n      \"id\": 681,\n      \"name\": \"Home Outdoor & Garden: Hot Tubs & Pools\"\n    },\n    {\n      \"id\": 682,\n      \"name\": \"Home Outdoor & Garden: Lawnmowers & Leaf Blowers\"\n    },\n    {\n      \"id\": 683,\n      \"name\": \"Home Outdoor & Garden: Outdoor Decor\"\n    },\n    {\n      \"id\": 684,\n      \"name\": \"Home Outdoor & Garden: Outdoor Lighting\"\n    },\n    {\n      \"id\": 685,\n      \"name\": \"Home Outdoor & Garden: Outdoor Tools & Storage\"\n    },\n    {\n      \"id\": 686,\n      \"name\": \"Home Outdoor & Garden: Patio & Garden Furniture\"\n    },\n    {\n      \"id\": 687,\n      \"name\": \"Home Outdoor & Garden: Plants, Fertilizer & Soil\"\n    },\n    {\n      \"id\": 688,\n      \"name\": \"Home Outdoor & Garden: Snowblowers\"\n    },\n    {\n      \"id\": 726,\n      \"name\": \"Home Outdoor & Garden: Other\"\n    },\n    {\n      \"id\": 728,\n      \"name\": \"Home Renovation Materials: Cabinets & Countertops\"\n    },\n    {\n      \"id\": 729,\n      \"name\": \"Home Renovation Materials: Electrical\"\n    },\n    {\n      \"id\": 730,\n      \"name\": \"Home Renovation Materials: Floors & Walls\"\n    },\n    {\n      \"id\": 731,\n      \"name\": \"Home Renovation Materials: Hardware, Nails & Screws\"\n    },\n    {\n      \"id\": 732,\n      \"name\": \"Home Renovation Materials: Heating, Cooling & Air\"\n    },\n    {\n      \"id\": 733,\n      \"name\": \"Home Renovation Materials: Painting & Paint Supplies\"\n    },\n    {\n      \"id\": 734,\n      \"name\": \"Home Renovation Materials: Plumbing, Sinks, Toilets & Showers\"\n    },\n    {\n      \"id\": 735,\n      \"name\": \"Home Renovation Materials: Roofing\"\n    },\n    {\n      \"id\": 736,\n      \"name\": \"Home Renovation Materials: Windows, Doors & Trim\"\n    },\n    {\n      \"id\": 737,\n      \"name\": \"Home Renovation Materials: Other\"\n    },\n    {\n      \"id\": 133,\n      \"name\": \"Jewelry & Watches\"\n    },\n    {\n      \"id\": 610,\n      \"name\": \"Musical Instruments: Amps & Pedals\"\n    },\n    {\n      \"id\": 611,\n      \"name\": \"Musical Instruments: Brass\"\n    },\n    {\n      \"id\": 612,\n      \"name\": \"Musical Instruments: Drums & Percussion\"\n    },\n    {\n      \"id\": 613,\n      \"name\": \"Musical Instruments: Guitars\"\n    },\n    {\n      \"id\": 14922003,\n      \"name\": \"Musical Instruments: Performance & DJ Equipment\"\n    },\n    {\n      \"id\": 614,\n      \"name\": \"Musical Instruments: Pianos & Keyboards\"\n    },\n    {\n      \"id\": 615,\n      \"name\": \"Musical Instruments: Pro Audio & Recording Equipment\"\n    },\n    {\n      \"id\": 616,\n      \"name\": \"Musical Instruments: String\"\n    },\n    {\n      \"id\": 617,\n      \"name\": \"Musical Instruments: Woodwind\"\n    },\n    {\n      \"id\": 618,\n      \"name\": \"Musical Instruments: Other\"\n    },\n    {\n      \"id\": 760,\n      \"name\": \"Phones: Cell Phones\"\n    },\n    {\n      \"id\": 761,\n      \"name\": \"Phones: Cell Phone Accessories\"\n    },\n    {\n      \"id\": 762,\n      \"name\": \"Phones: Cell Phone Services\"\n    },\n    {\n      \"id\": 765,\n      \"name\": \"Phones: Home Phones & Answering Machines\"\n    },\n    {\n      \"id\": 766,\n      \"name\": \"Phones: Other\"\n    },\n    {\n      \"id\": 652,\n      \"name\": \"Sporting Goods & Exercise: Baseball & Softball\"\n    },\n    {\n      \"id\": 653,\n      \"name\": \"Sporting Goods & Exercise: Basketball\"\n    },\n    {\n      \"id\": 654,\n      \"name\": \"Sporting Goods & Exercise: Curling\"\n    },\n    {\n      \"id\": 655,\n      \"name\": \"Sporting Goods & Exercise: Exercise Equipment\"\n    },\n    {\n      \"id\": 656,\n      \"name\": \"Sporting Goods & Exercise: Fishing, Camping & Outdoors\"\n    },\n    {\n      \"id\": 657,\n      \"name\": \"Sporting Goods & Exercise: Football\"\n    },\n    {\n      \"id\": 658,\n      \"name\": \"Sporting Goods & Exercise: Golf\"\n    },\n    {\n      \"id\": 659,\n      \"name\": \"Sporting Goods & Exercise: Hockey\"\n    },\n    {\n      \"id\": 660,\n      \"name\": \"Sporting Goods & Exercise: Lacrosse\"\n    },\n    {\n      \"id\": 661,\n      \"name\": \"Sporting Goods & Exercise: Paintball\"\n    },\n    {\n      \"id\": 662,\n      \"name\": \"Sporting Goods & Exercise: Skates & Blades\"\n    },\n    {\n      \"id\": 663,\n      \"name\": \"Sporting Goods & Exercise: Skateboard\"\n    },\n    {\n      \"id\": 664,\n      \"name\": \"Sporting Goods & Exercise: Ski\"\n    },\n    {\n      \"id\": 665,\n      \"name\": \"Sporting Goods & Exercise: Snowboard\"\n    },\n    {\n      \"id\": 666,\n      \"name\": \"Sporting Goods & Exercise: Soccer\"\n    },\n    {\n      \"id\": 667,\n      \"name\": \"Sporting Goods & Exercise: Tennis & Racquet\"\n    },\n    {\n      \"id\": 668,\n      \"name\": \"Sporting Goods & Exercise: Water Sports\"\n    },\n    {\n      \"id\": 669,\n      \"name\": \"Sporting Goods & Exercise: Other\"\n    },\n    {\n      \"id\": 702,\n      \"name\": \"Tools: Hand Tools\"\n    },\n    {\n      \"id\": 703,\n      \"name\": \"Tools: Power Tools\"\n    },\n    {\n      \"id\": 704,\n      \"name\": \"Tools: Tool Storage & Benches\"\n    },\n    {\n      \"id\": 705,\n      \"name\": \"Tools: Ladders & Scaffolding\"\n    },\n    {\n      \"id\": 715,\n      \"name\": \"Tools: Other\"\n    },\n    {\n      \"id\": 108,\n      \"name\": \"Toys & Games\"\n    },\n    {\n      \"id\": 15093002,\n      \"name\": \"TVs & Video: TVs\"\n    },\n    {\n      \"id\": 15093003,\n      \"name\": \"TVs & Video: Video & TV Accessories\"\n    },\n    {\n      \"id\": 619,\n      \"name\": \"Video Games & Consoles: Nintendo DS\"\n    },\n    {\n      \"id\": 33035001,\n      \"name\": \"Video Games & Consoles: Nintendo Switch\"\n    },\n    {\n      \"id\": 626,\n      \"name\": \"Video Games & Consoles: Nintendo Wii\"\n    },\n    {\n      \"id\": 14654002,\n      \"name\": \"Video Games & Consoles: Nintendo Wii U\"\n    },\n    {\n      \"id\": 39730002,\n      \"name\": \"Video Games & Consoles: Sony PlayStation 5\"\n    },\n    {\n      \"id\": 792,\n      \"name\": \"Video Games & Consoles: Sony PlayStation 4\"\n    },\n    {\n      \"id\": 627,\n      \"name\": \"Video Games & Consoles: Sony PlayStation 3\"\n    },\n    {\n      \"id\": 621,\n      \"name\": \"Video Games & Consoles: Sony PSP & Vita\"\n    },\n    {\n      \"id\": 39730001,\n      \"name\": \"Video Games & Consoles: Xbox Series X & S\"\n    },\n    {\n      \"id\": 622,\n      \"name\": \"Video Games & Consoles: Xbox 360\"\n    },\n    {\n      \"id\": 793,\n      \"name\": \"Video Games & Consoles: Xbox One\"\n    },\n    {\n      \"id\": 623,\n      \"name\": \"Video Games & Consoles: Older Generation\"\n    },\n    {\n      \"id\": 624,\n      \"name\": \"Video Games & Consoles: PC Games\"\n    },\n    {\n      \"id\": 625,\n      \"name\": \"Video Games & Consoles: Other\"\n    },\n    {\n      \"id\": 26,\n      \"name\": \"Other\"\n    }\n  ]\n"

// Add interface for the AI response
interface AIResponse {
  title?: string;
  description?: string;
  price?: number;
  sku?: string;
  condition?: string;
  tags?: string[];
  category?: {
    id: number;
    name: string;
  };
}

export async function generateFields(urls: string[]) {
  console.log("Generating fields...")
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const images = []
    for (const url of urls) {
        const image = await imageFromUrlToBase64(url);
        images.push(image)
    }
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
              "You must create a Kijiji marketplace listing for the item. The item may be shown by the user in an image or with a description. Please fill out the fields accordingly. Below are all of the category ID's you must choose from. " + MyCategories, 
                ...images,
            ],
        config: {
            responseMimeType: 'application/json',
            responseSchema: listingSchema
        }
    })
    if (response?.text) {
      console.log('Raw response:', response.text);
      
      // Try to parse the response to ensure it's valid JSON
      try {
        const parsedResponse = JSON.parse(response.text) as AIResponse;
        console.log('Parsed response:', parsedResponse);
        
        // Return a properly formatted JSON string
        return JSON.stringify(parsedResponse);
      } catch (error) {
        console.error('Error parsing AI response:', error);
        return JSON.stringify({
          title: "Error parsing AI response",
          description: "There was an error processing the AI response. Please try again.",
          price: 0,
          condition: "good",
          tags: ["error", "retry"],
          category: { id: 26, name: "Other" }
        });
      }
    } else {
      console.error('No response from AI');
      return JSON.stringify({
        title: "No response from AI",
        description: "The AI service did not respond. Please try again.",
        price: 0,
        condition: "good",
        tags: ["error", "retry"],
        category: { id: 26, name: "Other" }
      });
    }
}   
