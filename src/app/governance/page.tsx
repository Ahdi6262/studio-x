
import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Landmark, ListChecks, PlusCircle, Archive } from "lucide-react";
import Link from "next/link";

// Mock data for proposals - replace with actual data fetching later
const mockProposals = [
  { id: "prop1", title: "Implement New 'Challenges' Feature", status: "Active Vote", proposer: "AliceW.eth", endDate: "2024-08-15" },
  { id: "prop2", title: "Allocate 5% of Treasury to Marketing Budget", status: "Pending Vote", proposer: "BobCreator.eth", endDate: "2024-08-20" },
  { id: "prop3", title: "Update Community Guidelines for AI Content", status: "Passed", proposer: "AdminTeam", endDate: "2024-07-10" },
  { id: "prop4", title: "Partnership with XYZ Art Collective", status: "Failed", proposer: "DAOUser123", endDate: "2024-06-25" },
];


export default function GovernancePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="DAO Governance"
        description="Participate in the decision-making process of HEX THE ADD HUB. View proposals, cast your votes, and help shape the future of the platform."
        actions={
          <Button disabled> {/* Enable when functionality is ready */}
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Proposal
          </Button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Landmark className="mr-2 h-5 w-5 text-primary" />
              How Governance Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              HEX THE ADD HUB utilizes a decentralized autonomous organization (DAO) model for key platform decisions.
              HEXA token holders (and potentially NFT holders) will have voting power to influence proposals.
            </p>
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
                <ListChecks className="mr-2 h-5 w-5 text-primary" />
                Your Voting Power
            </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">Connect your wallet to see your current voting power based on your HEXA token holdings.</p>
             <Button variant="outline" className="mt-3 w-full" disabled>Connect Wallet to Vote</Button>
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
                <Archive className="mr-2 h-5 w-5 text-primary" />
                Archived Proposals
            </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">View the history of all past proposals and their outcomes.</p>
             <Button variant="secondary" className="mt-3 w-full" disabled>View Archive</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Active & Recent Proposals</CardTitle>
          <CardDescription>Review current proposals and cast your vote if eligible.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockProposals.length > 0 ? (
            <div className="space-y-6">
              {mockProposals.map(proposal => (
                <Card key={proposal.id} className="bg-secondary/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl hover:text-primary transition-colors">
                      <Link href={`/governance/${proposal.id}`}>{proposal.title}</Link>
                    </CardTitle>
                     <div className="flex items-center text-xs text-muted-foreground">
                        <span>Proposed by: {proposal.proposer}</span>
                        <span className="mx-1.5">•</span>
                        <span>Status: <span className={`font-semibold ${
                            proposal.status === "Active Vote" ? "text-green-500" : 
                            proposal.status === "Pending Vote" ? "text-yellow-500" :
                            proposal.status === "Passed" ? "text-blue-500" : "text-red-500"
                        }`}>{proposal.status}</span></span>
                        {proposal.status !== "Passed" && proposal.status !== "Failed" && 
                            <><span className="mx-1.5">•</span> Voting ends: {proposal.endDate}</>
                        }
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-foreground/80 line-clamp-2">
                      A brief description of the proposal would go here. Click to see full details and discussion...
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                     <Link href={`/governance/${proposal.id}`} passHref>
                        <Button variant="outline" size="sm">View Details & Vote</Button>
                     </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">No active proposals at the moment. Check back soon!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Placeholder for individual proposal page
// src/app/governance/[proposalId]/page.tsx would be created for real implementation.
