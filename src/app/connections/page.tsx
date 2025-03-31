"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Facebook, Plus, RefreshCw, X } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { getUserConnections, disconnectMarketplace, connectMarketplace, type MarketplaceConnections } from "~/server/db/users/actions"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Textarea } from "~/components/ui/textarea"

type Marketplace = {
  id: 'facebook' | 'kijiji'
  name: string
  logo: React.ReactNode
  connected: boolean
}

export default function ConnectionsPage() {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([
    {
      id: "facebook",
      name: "Facebook Marketplace",
      logo: <Facebook className="h-8 w-8 text-blue-600" />,
      connected: false,
    },
    {
      id: "kijiji",
      name: "Kijiji",
      logo: (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
          <span className="font-bold">K</span>
        </div>
      ),
      connected: false,
    },
  ])

  const [selectedMarketplace, setSelectedMarketplace] = useState<'facebook' | 'kijiji' | null>(null);
  const [cookies, setCookies] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Load connection status on mount
  useEffect(() => {
    const loadConnections = async () => {
      try {
        const connections = await getUserConnections();
        setMarketplaces(marketplaces.map(marketplace => ({
          ...marketplace,
          connected: connections[marketplace.id]
        })));
      } catch (error) {
        console.error('Failed to load connections:', error);
        toast.error('Failed to load marketplace connections');
      }
    };
    
    loadConnections();
  }, []);

  const handleConnect = async (id: 'facebook' | 'kijiji') => {
    setSelectedMarketplace(id);
    setIsOpen(true);
  };

  const handleSubmitCookies = async () => {
    if (!selectedMarketplace || !cookies.trim()) return;

    try {
      await connectMarketplace(selectedMarketplace, cookies);
      setMarketplaces(marketplaces.map(marketplace =>
        marketplace.id === selectedMarketplace ? { ...marketplace, connected: true } : marketplace
      ));
      toast.success(`Connected to ${selectedMarketplace}`);
      setIsOpen(false);
      setCookies('');
    } catch (error) {
      console.error(`Failed to connect to ${selectedMarketplace}:`, error);
      toast.error(`Failed to connect to ${selectedMarketplace}`);
    }
  };

  const handleDisconnect = async (id: 'facebook' | 'kijiji') => {
    try {
      await disconnectMarketplace(id);
      setMarketplaces(marketplaces.map(marketplace =>
        marketplace.id === id ? { ...marketplace, connected: false } : marketplace
      ));
      toast.success(`Disconnected from ${id}`);
    } catch (error) {
      console.error(`Failed to disconnect ${id}:`, error);
      toast.error(`Failed to disconnect from ${id}`);
    }
  };

  return (
    <main>
      <SignedOut>
      </SignedOut>
      <SignedIn>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect {selectedMarketplace?.charAt(0).toUpperCase()}{selectedMarketplace?.slice(1)}</DialogTitle>
              <DialogDescription>
                Paste your cookies below to connect your account.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={cookies}
              onChange={(e) => setCookies(e.target.value)}
              placeholder="Paste your cookies here..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitCookies}>Connect</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Marketplace Connections</h1>
            <p className="text-muted-foreground mt-2">
              Connect your marketplace accounts to crosslist your products automatically.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {marketplaces.map((marketplace) => (
              <Card key={marketplace.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  {marketplace.logo}
                  <div>
                    <CardTitle>{marketplace.name}</CardTitle>
                    <CardDescription>Crosslist your products</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant={marketplace.connected ? "default" : "outline"} className="mt-2">
                      {marketplace.connected ? "Connected" : "Not Connected"}
                    </Badge>
                    {marketplace.connected && (
                      <Badge variant="outline" className="mt-2">
                        Last sync: 2 hours ago
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {marketplace.connected ? (
                    <>
                      <Button variant="outline" size="sm" className="gap-1">
                        <RefreshCw className="h-4 w-4" />
                        Sync Now
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDisconnect(marketplace.id)}
                        className="gap-1"
                      >
                        <X className="h-4 w-4" />
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => handleConnect(marketplace.id)}
                    >
                      Connect Account
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}

            {/* Add More Card */}
            <Card className="flex flex-col items-center justify-center border-dashed p-6">
              <div className="mb-4 rounded-full bg-muted p-3">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">More Platforms Coming Soon</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                We're working on adding more marketplace integrations.
              </p>
              <Button variant="outline" className="mt-4">
                Request a Platform
              </Button>
            </Card>
          </div>
        </div>
      </SignedIn>
    </main>
  )
}

