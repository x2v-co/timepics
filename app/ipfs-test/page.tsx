/**
 * IPFS Integration Test Page
 * /ipfs-test
 *
 * Test IPFS upload functionality and view results
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IPFSSetupInstructions } from '@/components/IPFSSetupInstructions';
import { ArrowLeft, Upload, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';

interface IPFSResult {
  imageCID: string;
  metadataCID: string;
  imageUrl: string;
  metadataUrl: string;
}

export default function IPFSTestPage() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'uploading' | 'success' | 'error'>('idle');
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [result, setResult] = useState<IPFSResult | null>(null);
  const [error, setError] = useState<string>('');

  const checkStatus = async () => {
    setStatus('checking');
    try {
      const response = await fetch('/api/ipfs/test');
      const data = await response.json();
      setConfigured(data.configured);
      setStatus('idle');
    } catch (err) {
      setError('Failed to check IPFS status');
      setStatus('error');
    }
  };

  const testUpload = async () => {
    setStatus('uploading');
    setError('');
    try {
      const response = await fetch('/api/ipfs/test', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error);
      }

      setResult(data.result);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-border bg-background/80 backdrop-blur-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>

              <h1 className="text-xl font-bold gradient-text">IPFS Integration Test</h1>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Status Check */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🔍 IPFS Configuration Status</CardTitle>
            <CardDescription>
              Check if NFT.Storage is properly configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                onClick={checkStatus}
                disabled={status === 'checking'}
                variant="outline"
              >
                {status === 'checking' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check Status'
                )}
              </Button>

              {configured !== null && (
                <Badge variant={configured ? 'default' : 'destructive'}>
                  {configured ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Configured ✅
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-1" />
                      Not Configured
                    </>
                  )}
                </Badge>
              )}
            </div>

            {configured === false && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  ❌ Pinata is not configured. Please set PINATA_API_KEY and PINATA_SECRET_KEY in .env.local
                </p>
                <a
                  href="https://pinata.cloud"
                  target="_blank"
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  Get free API keys →
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup Instructions - Show when not configured */}
        {configured === false && (
          <IPFSSetupInstructions />
        )}

        {/* Upload Test */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📤 Test IPFS Upload</CardTitle>
            <CardDescription>
              Upload a test image to verify IPFS integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={testUpload}
              disabled={status === 'uploading' || configured === false}
              size="lg"
              className="w-full mb-4"
            >
              {status === 'uploading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading to IPFS...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Test Image
                </>
              )}
            </Button>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">❌ {error}</p>
              </div>
            )}

            {status === 'success' && result && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-400 mb-2">
                    ✅ Upload successful!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Note: IPFS content may take 10-30 seconds to propagate to gateways
                  </p>
                </div>

                {/* Results */}
                <div className="grid gap-4">
                  <div className="p-4 bg-card border border-card-border rounded-lg">
                    <p className="text-sm font-semibold mb-2">Image CID:</p>
                    <code className="text-xs text-primary break-all">
                      {result.imageCID}
                    </code>
                    <a
                      href={result.imageUrl}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-primary hover:underline mt-2"
                    >
                      View Image <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 bg-card border border-card-border rounded-lg">
                    <p className="text-sm font-semibold mb-2">Metadata CID:</p>
                    <code className="text-xs text-primary break-all">
                      {result.metadataCID}
                    </code>
                    <a
                      href={result.metadataUrl}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-primary hover:underline mt-2"
                    >
                      View Metadata <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 bg-card border border-card-border rounded-lg">
                    <p className="text-sm font-semibold mb-2">Image Preview:</p>
                    <img
                      src={result.imageUrl}
                      alt="IPFS Test"
                      className="w-32 h-32 border border-card-border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📚 Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">1. Get Pinata API Keys</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Visit{' '}
                <a
                  href="https://pinata.cloud"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  pinata.cloud
                </a>{' '}
                and sign up for a free account.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-2">2. Configure Environment Variables</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Add to <code className="text-primary">.env.local</code>:
              </p>
              <pre className="p-3 bg-card border border-card-border rounded-lg text-xs overflow-x-auto">
                PINATA_API_KEY=your_api_key_here{'\n'}PINATA_SECRET_KEY=your_secret_key_here
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-2">3. Restart Dev Server</h3>
              <pre className="p-3 bg-card border border-card-border rounded-lg text-xs">
                npm run dev
              </pre>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
