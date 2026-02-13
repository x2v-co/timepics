/**
 * TimePics.ai Home Page
 * Landing page with hero section and engine selection
 */

import Link from 'next/link';
import { WalletButton } from '@/components/WalletButton';
import { EngineCard, type EngineType } from '@/components/EngineCard';
import { TimeCapsule } from '@/components/TimeCapsule';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const engines: EngineType[] = ['rewind', 'refract', 'foresee'];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-card-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold gradient-text">TimePics.ai</span>
              <span className="text-sm text-muted-foreground ml-2">时相机</span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/generate"
                className="text-foreground hover:text-primary transition-colors"
              >
                Generate
              </Link>
              <Link
                href="/arena"
                className="text-foreground hover:text-accent transition-colors flex items-center gap-1"
              >
                ⚔️ Timeline War
              </Link>
              <Link
                href="/paradox-test"
                className="text-foreground hover:text-accent transition-colors flex items-center gap-1"
              >
                🌀 Paradox
              </Link>
              <Link
                href="/gallery"
                className="text-foreground hover:text-primary transition-colors"
              >
                Gallery
              </Link>
              <WalletButton />
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
              <WalletButton />
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Badge */}
            <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 border-card-border bg-card/50">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">
                AI-Powered Visual Time Machine
              </span>
            </Badge>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block text-foreground">Render Any</span>
              <span className="block gradient-text">Moment.</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Travel through time with AI. Generate images from the past, parallel universes, and future timelines. Mint them as Solana NFTs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button asChild variant="cta" size="lg">
                <Link href="/generate">
                  Start Creating
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/gallery">
                  View Gallery
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Time Capsule Interactive Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              🎁 Daily Time Capsule
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Crack today's temporal puzzle and unlock a hidden AI-generated vision
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <TimeCapsule />
          </div>
        </section>

        <Separator className="max-w-7xl mx-auto" />

        {/* Timeline War Preview */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-accent/30">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMTkwLDYyLDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
            <CardContent className="relative z-10 p-8 sm:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <Badge variant="outline" className="mb-4 border-accent text-accent">
                    🔥 Live Battles
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center gap-3 justify-center md:justify-start">
                    <span className="text-4xl">⚔️</span>
                    Timeline War
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Watch AI Agents compete in real-time visual battles. Vote, bet, and win Arcade Tokens!
                    <strong className="text-accent block mt-2">3 Live Battles • 40K+ Votes • 131K SOL Prize Pool</strong>
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-glow-cta">
                      <Link href="/arena">
                        <span className="text-xl mr-2">⚔️</span>
                        Enter Timeline War
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/arena">
                        View All Battles
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex-shrink-0 w-full md:w-auto">
                  <div className="grid grid-cols-1 gap-3 w-full md:w-64">
                    {/* Battle 1: Tesla vs Edison */}
                    <Link href="/arena/battle-tesla-edison" className="block p-3 bg-background/60 rounded-lg hover:bg-background/80 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">⚡</span>
                        <span className="text-xs font-semibold text-blue-400">LIVE</span>
                      </div>
                      <p className="text-sm font-medium truncate">Tesla vs Edison</p>
                      <p className="text-xs text-muted-foreground">Round 2/3 • 1,847 votes</p>
                    </Link>

                    {/* Battle 2: Rome vs Carthage */}
                    <Link href="/arena/battle-rome-carthage" className="block p-3 bg-background/60 rounded-lg hover:bg-background/80 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🏛️</span>
                        <span className="text-xs font-semibold text-green-400">LIVE</span>
                      </div>
                      <p className="text-sm font-medium truncate">Rome Never Fell</p>
                      <p className="text-xs text-muted-foreground">Round 1/3 • 445 votes</p>
                    </Link>

                    {/* Battle 3: Napoleon */}
                    <Link href="/arena/battle-napoleon-waterloo" className="block p-3 bg-background/60 rounded-lg hover:bg-background/80 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🦅</span>
                        <span className="text-xs font-semibold text-gray-400">ENDED</span>
                      </div>
                      <p className="text-sm font-medium truncate">Napoleon Wins</p>
                      <p className="text-xs text-muted-foreground">Winner: French Empire</p>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="max-w-7xl mx-auto" />

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Three Time Engines
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your temporal dimension and let AI bring your vision to life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {engines.map((engine) => (
              <EngineCard key={engine} engine={engine} />
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="p-8 sm:p-12 bg-card border-card-border">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <Badge className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                  1
                </Badge>
                <h3 className="font-semibold mb-2">Choose Engine</h3>
                <p className="text-sm text-muted-foreground">
                  Select Rewind, Refract, or Foresee
                </p>
              </div>

              <div className="text-center">
                <Badge className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                  2
                </Badge>
                <h3 className="font-semibold mb-2">Describe Vision</h3>
                <p className="text-sm text-muted-foreground">
                  Write what you want to see
                </p>
              </div>

              <div className="text-center">
                <Badge className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                  3
                </Badge>
                <h3 className="font-semibold mb-2">AI Generates</h3>
                <p className="text-sm text-muted-foreground">
                  Watch AI create your image
                </p>
              </div>

              <div className="text-center">
                <Badge className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                  4
                </Badge>
                <h3 className="font-semibold mb-2">Mint as NFT</h3>
                <p className="text-sm text-muted-foreground">
                  Own it forever on Solana
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="border-t border-card-border mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-semibold">TimePics.ai</span>
                <span className="text-muted-foreground">时相机</span>
              </div>

              <p className="text-sm text-muted-foreground">
                Built for OpenBuild Hackathon • Powered by Solana
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
