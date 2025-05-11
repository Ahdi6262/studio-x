
import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, PieChart, Handshake } from "lucide-react";
import Link from "next/link";

export default function CommunityTokenPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Community Token (HEXA)"
        description="Learn about the HEX THE ADD HUB (HEXA) token, its utility, and how to participate in the ecosystem."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Coins className="mr-3 h-6 w-6 text-primary" />
              Token Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The HEXA token is the native utility token of the HEX THE ADD HUB platform. It's designed to empower creators, reward participation, and facilitate governance.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-foreground/90">
              <li><strong>Ticker:</strong> HEXA</li>
              <li><strong>Contract Address:</strong> (To be deployed)</li>
              <li><strong>Max Supply:</strong> (To be determined)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <PieChart className="mr-3 h-6 w-6 text-primary" />
              Token Utility & Staking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              HEXA tokens can be used for various platform features, including course payments, accessing exclusive content, and participating in governance.
            </p>
            <p className="mt-3 text-muted-foreground">
              Staking HEXA tokens will allow users to earn rewards and potentially gain additional voting power. (Staking feature coming soon).
            </p>
            <Button variant="outline" className="mt-4 w-full" disabled>
              Stake Your HEXA (Soon)
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Handshake className="mr-3 h-6 w-6 text-primary" />
              Distribution & Airdrops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Information about token distribution, airdrops for early adopters, and community rewards will be announced here.
            </p>
            <Link href="/blog" className="mt-4 block">
              <Button variant="secondary" className="w-full">
                Check Blog for Updates
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
       <Card className="mt-12 shadow-xl">
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The HEXA token is a utility token for use within the HEX THE ADD HUB platform. It is not an investment vehicle.
            The information provided here is for informational purposes only and does not constitute financial advice.
            Smart contracts and tokenomics are under development and subject to change.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
