"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ArrowLeftToLine, Plus, RefreshCw, X } from "lucide-react"
import Image from "next/image"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { getUserConnections, disconnectMarketplace, connectMarketplace } from "./actions"
import { toast } from "sonner"
import { formatTimeAgo } from "~/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Textarea } from "~/components/ui/textarea"
import { sitesInfo } from "~/lib/sitesInfo"
import Link from "next/link"

type MarketplaceConnection = {
  connected: boolean;
  createdAt: string | null;
}

type MarketplaceConnections = {
  [K in 'facebook' | 'kijiji']: MarketplaceConnection;
}

type Marketplace = {
  id: 'facebook' | 'kijiji'
  name: string
  logo: React.ReactNode
  connected: boolean
  createdAt?: Date
}

export default function ConnectionsPage() {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([
    {
      id: "facebook",
      name: "Facebook Marketplace",
      logo: <Image src={sitesInfo.fb.iconUrl} alt="Facebook Marketplace icon" className="h-8 w-8 text-blue-600 rounded-full" width={32} height={32} />,
      connected: false,
    },
    {
      id: "kijiji",
      name: "Kijiji",
      logo: <Image src={sitesInfo.kj.iconUrl} alt="Kijiji icon" className="h-8 w-8 text-blue-600 rounded-full" width={32} height={32} />,
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
        setMarketplaces(prev => prev.map(marketplace => {
          const connection = connections[marketplace.id];
          return {
            ...marketplace,
            connected: connection.connected,
            createdAt: connection.createdAt ? new Date(connection.createdAt) : undefined,
          } satisfies Marketplace;
        }));
      } catch (error) {
        console.error('Failed to load connections:', error);
        toast.error('Failed to load marketplace connections');
      }
    };
    
    void loadConnections();
  }, []);

  const handleConnect = async (id: 'facebook' | 'kijiji') => {
    setSelectedMarketplace(id);
    setIsOpen(true);
  };

  const handleSubmitCookies = async () => {
    if (!selectedMarketplace || !cookies.trim()) return;

    try {
      await connectMarketplace(selectedMarketplace, cookies);
      
      // Load fresh data
      const loadConnections = async () => {
        try {
          const connections = await getUserConnections();
          setMarketplaces(prev => prev.map(marketplace => {
            const connection = connections[marketplace.id];
            return {
              ...marketplace,
              connected: connection.connected,
              createdAt: connection.createdAt ? new Date(connection.createdAt) : undefined,
            } satisfies Marketplace;
          }));
        } catch (error) {
          console.error('Failed to load connections:', error);
          toast.error('Failed to load marketplace connections');
        }
      };
      
      void loadConnections();
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

        <div className="container px-6 sm:px-8 lg:px-10 py-8 mx-auto">
          <div className="flex flex-row justify-between">
            <div className="mb-8 plr-2">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Marketplace Connections</h1>
              <p className="text-muted-foreground mt-2">
                Connect your marketplace accounts to crosslist your products automatically.
              </p>
            </div>
            <Button asChild variant={"default"}><Link href="/dashboard">
              <ArrowLeftToLine className="h-4 w-6 mr-2" /> Dashboard
            </Link></Button>
          </div>

          <div className="grid gap-3 lg:gap-4 xl:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto">
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
                  <div className="flex justify-between">
                    <Badge variant={marketplace.connected ? "default" : "outline"} className="mt-2">
                      {marketplace.connected ? "Connected" : "Not Connected"}
                    </Badge>
                    {marketplace.connected && marketplace.createdAt && (
                      <Badge variant="outline" className="mt-2">
                        Updated {formatTimeAgo(new Date(marketplace.createdAt))}
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
                We&apos;re working on adding more marketplace integrations.
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

