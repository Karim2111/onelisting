import { fbCategories, kjCategories, ndCategories } from "./sitesCategories";

interface SiteInfo {
  name: string;
  url: string;
  iconUrl: string;
  listingInfo: {
    images: { min: number; max: number; minDimensions?: number };
    videos?: { max: number };
    title: { min: number; max: number };
    price: { min: number; max: number; cents: boolean; "Please Contact"?: boolean; "Swap/Trade"?: boolean };
    categories: typeof fbCategories;
    condition?: string[];
    description: { min: number; max: number };
    location: string[];
    locationPrivate?: boolean;
    optional: {
      availability?: string[];
      productTags?: { max: number };
      sku?: { max: number };
      fulfillment?: string[];
      hideFromFriends?: boolean;
      payment?: string[];
      phoneNumber?: boolean;
      scheduleStart?: {
        "hour:": string[];
        minute: string[];
        "am/pm": string[];
      };
    };
    pricing?: {
      auction?: {
        startingBid: { min: number; max: number; cents: boolean };
        auctionDuration: string[];
        allowOffers: { minimumPrice: { min: number; max: string; cents: boolean } };
      };
      "Buy It Now"?: {
        price: { min: number; max: number; cents: boolean };
        quantity: { min: number; max: number };
        allowOffers: { minimumPrice: { min: number; max: string; cents: boolean } };
      };
      both?: {
        startingBid: { min: number; max: number; cents: boolean };
        auctionDuration: string[];
        price: { min: number; max: number; cents: boolean };
      };
    };
    fulfillment?: {
      "Ship your item"?: any;
      "Local Pickup"?: {
        postalCode: { min: number; max: number };
        "city, Province": { min: number; max: number };
      };
      "Both"?: {
        postalCode: { min: number; max: number };
        "city, Province": { min: number; max: number };
      };
    };
  };
}

interface SitesInfo {
  fb: SiteInfo;
  kj: SiteInfo;
  nd: SiteInfo;
  eb: SiteInfo;
}

export const sitesInfo: SitesInfo = {
  fb: {
    name: "Facebook MarketPlace",
    url: "https://www.facebook.com/",
    iconUrl: "https://onelisting.s3.us-east-1.amazonaws.com/facebookLogo.png",
    listingInfo: {
      images: { min: 1, max: 10 },
      videos: { max: 1 },
      title: { min: 1, max: 99 },
      price: { min: 0, max: 999999999, cents: false },
      categories: fbCategories,
      condition: ["New", "Used - Like New", "Used - Good", "Used - Fair"],
      description: { min: 1, max: 61000 },
      location: ["city", "neighborhood", "halfPostalCode"],
      optional: {
        availability: ["List as Single Item", "In Stock"],
        productTags: { max: 20 },
        sku: { max: 100 },
        fulfillment: ["Public meetup", "Door pickup", "Door dropoff"],
        hideFromFriends: true,
      }
    }
  },
  kj: {
    name: "Kijiji",
    url: "https://www.kijiji.ca/",
    iconUrl: "https://onelisting.s3.us-east-1.amazonaws.com/kijijiLogo.png",
    listingInfo: {
      images: { min: 1, max: 10, minDimensions: 300 },
      title: { min: 1, max: 64 },
      price: { min: 0, max: 999999999, cents: false, "Please Contact": true, "Swap/Trade": true },
      categories: kjCategories,
      condition: ["New", "Used - Like New", "Used - Good", "Used - Fair"],
      description: { min: 10, max: 61000 },
      location: ["address", "postalCode", "halfPostalCode"],
      locationPrivate: true,
      optional: {
        productTags: { max: 5 },
        sku: { max: 100 },
        fulfillment: ["Willing to ship the item", "Door pickup", "Door dropoff"],
        payment: ["Cash accepted", "Offer cashless payment"],
        phoneNumber: true,
      }
    }
  },
  nd: {
    name: "Nextdoor",
    url: "https://ca.nextdoor.com/for_sale_and_free/",
    iconUrl: "https://onelisting.s3.us-east-1.amazonaws.com/nextdoorLogo.png",
    listingInfo: {
      images: { min: 1, max: 10 },
      title: { min: 1, max: 100 },
      price: { min: 0, max: 999999999, cents: true },
      categories: ndCategories,
      description: { min: 1, max: 10000 },
      location: ["city", "neighborhood"],
      optional: {}
    }
  },
  eb: {
    name: "eBay",
    url: "https://www.ebay.ca/",
    iconUrl: "https://onelisting.s3.us-east-1.amazonaws.com/ebayLogo.png",
    listingInfo: {
      images: { min: 1, max: 24 },
      title: { min: 26, max: 80 },
      price: { min: 0, max: 999999999, cents: true },
      condition: ["New", "Used"],
      categories: fbCategories, // Placeholder until API is checked
      description: { min: 1, max: 1000 },
      location: ["city", "postalCode"],
      optional: {
        scheduleStart: {
          "hour:": ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
          minute: ["00", "15", "30", "45"],
          "am/pm": ["AM", "PM"],
        }
      },
      pricing: {
        auction: {
          startingBid: { min: 0, max: 999999999, cents: true },
          auctionDuration: ["1 day", "3 days", "5 days", "7 days", "10 days"],
          allowOffers: { minimumPrice: { min: 0, max: "startingBid", cents: true } }
        },
        "Buy It Now": {
          price: { min: 0, max: 999999999, cents: true },
          quantity: { min: 1, max: 1000 },
          allowOffers: { minimumPrice: { min: 0, max: "price", cents: true } }
        },
        both: {
          startingBid: { min: 0, max: 999999999, cents: true },
          auctionDuration: ["1 day", "3 days", "5 days", "7 days", "10 days"],
          price: { min: 0, max: 999999999, cents: true }
        }
      },
      fulfillment: {
        "Ship your item": {},
        "Local Pickup": {
          postalCode: { min: 6, max: 7 },
          "city, Province": { min: 4, max: 80 }
        },
        "Both": {
          postalCode: { min: 6, max: 7 },
          "city, Province": { min: 4, max: 80 }
        }
      }
    }
  }
};