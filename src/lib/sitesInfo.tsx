import { fbCategories, kjCategories, ndCategories } from "./sitesCategories";



export const sitesInfo = {
    "fb": {
        "name": "Facebook MarketPlace",
        "url": "https://www.facebook.com/",
        "iconUrl": "https://onelisting.s3.us-east-1.amazonaws.com/facebookLogo.png",
        "listingInfo": {
            "images": { "min": 1, "max": 10 },
            "videos": { "max": 1},
            "title": { "min": 1, "max": 99 },
            "price": { "min": 0, "max": 999999999, "cents": false },
            "categories": fbCategories,
            "condition": ["New", "Used - Like New", "Used - Good", "Used - Fair"],
            "description": { "min": 1, "max": 61000 },
            "location": ["city", "neighborhood", "halfPostalCode"],
            "optional": { 
                "availability": ["List as Single Item", "In Stock"],
                "productTags" : { "max": 20 },
                "sku": { "max": 100 },
                "fulfillment": ["Public meetup", "Door pickup", "Door dropoff"],
                "hideFromFriends": true,
            }
        }
    },
    "kj": {
        "name": "Kijiji",
        "url": "https://www.kijiji.ca/",
        "iconUrl": "https://onelisting.s3.us-east-1.amazonaws.com/kijijiLogo.png",
        "listingInfo": {
            "images": { "min": 1, "max": 10, "minDimensions": 300},
            "title": { "min": 1, "max": 64 },
            "price": { "min": 0, "max": 999999999, "cents": false, "Please Contact": true, "Swap/Trade": true },
            "categories": kjCategories,
            "description": { "min": 10, "max": 61000 },
            "location": ["address", "postalCode", "halfPostalCode"],
            "locationPrivate": true,
            "optional": { 
                "productTags" : { "max": 5 },
                "sku": { "max": 100 },
                "fulfillment": ["Willing to ship the item", "Door pickup", "Door dropoff"],
                "payment": ["Cash accepted", "Offer cashless payment"],
                "condition": ["New", "Used - Like New", "Used - Good", "Used - Fair"],
                "phoneNumber": true,
            }
            }
        },
    "nd": {
        "name": "Nextdoor",
        "url": "https://ca.nextdoor.com/for_sale_and_free/",
        "iconUrl": "https://onelisting.s3.us-east-1.amazonaws.com/nextdoorLogo.png",
        "listingInfo": {
            "images": { "min": 1, "max": 10 },
            "title": { "min": 1, "max": 100 },
            "categories": ndCategories,
            "description": { "min": 1, "max": 10000 },
            "price": { "min": 0, "max": 999999999, "cents": true },
        }
    },
    "eb": {
        name: "eBay",
        url: "https://www.ebay.ca/",
        iconUrl: "https://onelisting.s3.us-east-1.amazonaws.com/ebayLogo.png",
        "listingInfo": {
            "images": { "min": 1, "max": 24 },
            "title": { "min": 26, "max": 80 },
            "condition": ["New", "Used"],
            "categories": {/*CHECK API BEFORE FILLING ALL OF THIS*/},
            "pricing": {"auction": {
                            "startingBid": { "min": 0, "max": 999999999, "cents": true },
                             "auctionDuration": ["1 day", "3 days", "5 days", "7 days", "10 days"],
                             "allowOffers": { "minimumPrice": { "min": 0, "max": "startingBid", "cents": true }
                        },
                        "Buy It Now":{
                            "price": { "min": 0, "max": 999999999, "cents": true },
                            "quantity": { "min": 1, "max": 1000 },
                            "allowOffers": { "minimumPrice": { "min": 0, "max": "price", "cents": true }
                        }, "both":{
                            "startingBid": { "min": 0, "max": 999999999, "cents": true },
                            "auctionDuration": ["1 day", "3 days", "5 days", "7 days", "10 days"],
                            "price": { "min": 0, "max": 999999999, "cents": true }
                        }},
            }},
            "fulfillment": {"Ship your item":{ ///CHECK API BEFORE FILLING ALL OF THIS

            }, "Local Pickup":{
                "postalCode": { "min": 6, "max": 7 },
                "city, Province": { "min": 4, "max": 80 }, 
            }, "Both":{ ///CHECK API BEFORE FILLING ALL OF THIS
                "postalCode": { "min": 6, "max": 7 },
                "city, Province": { "min": 4, "max": 80 }, 

            }},
            "optional": {
                "scheduleStart": {
                                "hour:": ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
                                "minute": ["00", "15", "30", "45"],
                                "am/pm": ["AM", "PM"],
                            }
                        }
        }
    }
}