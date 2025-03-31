'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Card, CardContent } from "~/components/ui/card"
import { sitesInfo } from "~/lib/sitesInfo"

// Define the structure of our integration data
interface Integration {
  name: string
  logo: string
  features: string[]
}

// Sample data - replace with your actual integrations and features
const integrations: Integration[] = [
  {
    name: "eBay",
    logo: sitesInfo.eb.iconUrl,
    features: [
      "Cross-list to/from",
      "Order management",
      "Promo listing tools"
    ]
  },
  {
    name: "Facebook Marketplace",
    logo: sitesInfo.fb.iconUrl,
    features: [
      "Cross-list to/from",
      "One-click list",
      "Vehicle support",
      "Home rental support"
    ]
  },
  {
    name: "Kijiji",
    logo: sitesInfo.kj.iconUrl,
    features: [
      "Cross-list to/from",
      "One-click list"
    ]
  },
  {
    name: "Nextdoor",
    logo: sitesInfo.nd.iconUrl,
    features: [
      "Cross-list to/from",
      "One-click list",
      "Local reach focus"
    ]
  },
]

export default function IntegrationShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground font-montserrat">Supported Marketplaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrations.map((integration, index) => (
            <Card 
              key={integration.name}
              className="relative overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 bg-card border-primary/20"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src={integration.logo}
                      alt={`${integration.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4 text-card-foreground">{integration.name}</h3>
                <ul className="space-y-2">
                  {integration.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: hoveredIndex === index ? 1 : 0, 
                        y: hoveredIndex === index ? 0 : 20 
                      }}
                      transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                    >
                      <Check className="h-5 w-5 text-primary" />
                      <span className="text-sm text-card-foreground">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

