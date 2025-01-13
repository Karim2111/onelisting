'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Bug, Lightbulb, MessageSquare } from 'lucide-react'
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"

const betaTesterQualities = [
  { icon: Bug, text: "Find and report bugs" },
  { icon: Lightbulb, text: "Suggest improvements" },
  { icon: MessageSquare, text: "Provide valuable feedback" },
]

export default function BetaTesterWaitlist() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleSignup = () => {
    window.open('https://2xcpflvlkrm.typeform.com/to/g8rK1UWz', '_blank')
  }

  return (
    <section className="py-16 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Beta Tester Waitlist</h2>
          <p className="text-xl mb-8">
            We&apos;re excited to build OneListing—a tool designed to save time and simplify cross-listing for Canadian sellers. 
            By joining our Beta Program, you&apos;ll gain early access to test our platform and shape its development with your feedback.
          </p>
          <p className="text-lg mb-12">
            We&apos;re aiming to start onboarding beta users in Q2 2025, and we can&apos;t wait to have you on board!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {betaTesterQualities.map((quality, index) => (
              <Card 
                key={index}
                className="relative overflow-hidden"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <CardContent className="p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <quality.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold">{quality.text}</h3>
                  </motion.div>
                </CardContent>
                <motion.div
                  className="absolute inset-0 bg-primary/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Card>
            ))}
          </div>
          
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="https://2xcpflvlkrm.typeform.com/to/g8rK1UWz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-muted-foreground h-10 px-4 py-2"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Join the Beta Tester Waitlist
            </a>
          </motion.div>
          
          <p className="mt-8 text-sm text-muted-foreground">
            Be among the first to experience OneListing and help shape its future!
          </p>
        </div>
      </div>
    </section>
  )
}

