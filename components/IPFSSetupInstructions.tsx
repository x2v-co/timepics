/**
 * IPFS Setup Instructions Component
 * Shows detailed setup guide when API key is not configured
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Key, AlertCircle } from 'lucide-react';

export function IPFSSetupInstructions() {
  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <CardTitle className="text-amber-500">Pinata API Keys Required</CardTitle>
        </div>
        <CardDescription>
          Follow these steps to get your free Pinata API keys
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step 1 */}
        <div className="flex gap-4">
          <Badge className="h-fit">1</Badge>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">Visit Pinata</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Go to Pinata and create a free account
            </p>
            <a
              href="https://pinata.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              Open Pinata <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <Badge className="h-fit">2</Badge>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">Create API Keys</h4>
            <p className="text-sm text-muted-foreground">
              After logging in, go to "API Keys" → "New Key" → Select all permissions → Copy both API Key and API Secret
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <Badge className="h-fit">3</Badge>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">Configure Environment</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Add to your <code className="text-primary">.env.local</code> file:
            </p>
            <pre className="p-3 bg-card border border-card-border rounded-lg text-xs overflow-x-auto">
              PINATA_API_KEY=your_api_key_here{'\n'}PINATA_SECRET_KEY=your_secret_key_here
            </pre>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-4">
          <Badge className="h-fit">4</Badge>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">Restart Server</h4>
            <pre className="p-3 bg-card border border-card-border rounded-lg text-xs">
              npm run dev
            </pre>
          </div>
        </div>

        {/* Note */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-400">
            <Key className="w-4 h-4 inline mr-1" />
            <strong>Note:</strong> Pinata is completely free with 1GB storage and 100GB bandwidth.
            You need both API Key and Secret Key for authentication.
          </p>
        </div>

        {/* Guide Link */}
        <div className="pt-2 border-t border-card-border">
          <a
            href="https://docs.pinata.cloud/introduction"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            📚 View Pinata Documentation <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
