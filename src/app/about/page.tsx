
import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Target, Eye, Users } from "lucide-react"; // Icons for sections

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="About HEX THE ADD HUB"
        description="Learn more about our mission, vision, and the values that drive our community."
      />
      <div className="space-y-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Info className="mr-3 h-6 w-6 text-primary" /> Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-foreground/90 prose dark:prose-invert max-w-none">
            <p>
              To empower Web3 creators, educators, and learners by providing a comprehensive and accessible platform for showcasing talent, sharing knowledge, fostering collaboration, and driving innovation in the decentralized ecosystem.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Target className="mr-3 h-6 w-6 text-primary" /> Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-foreground/90 prose dark:prose-invert max-w-none">
            <p>
              To be the leading global hub where the future of Web3 is built, learned, and shared, creating a vibrant and supportive community that pushes the boundaries of technology and creativity.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Eye className="mr-3 h-6 w-6 text-primary" /> Core Values
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-foreground/90 prose dark:prose-invert max-w-none">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Innovation:</strong> Continuously exploring and implementing cutting-edge solutions.</li>
              <li><strong>Collaboration:</strong> Fostering a connected community where ideas and projects flourish.</li>
              <li><strong>Education:</strong> Providing high-quality learning resources for all skill levels.</li>
              <li><strong>Empowerment:</strong> Giving creators the tools and platform to succeed.</li>
              <li><strong>Transparency:</strong> Operating with openness and clarity in our processes.</li>
              <li><strong>Inclusivity:</strong> Welcoming individuals from all backgrounds to participate and contribute.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Users className="mr-3 h-6 w-6 text-primary" /> The Team
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-foreground/90 prose dark:prose-invert max-w-none">
            <p>
              HEX THE ADD HUB is developed and maintained by a passionate team of developers, designers, and Web3 enthusiasts dedicated to building a valuable resource for the community. More details about the core team will be available soon.
            </p>
            <p className="mt-4">
              Interested in contributing or learning more? Visit our <Link href="/contact" className="text-primary hover:underline">Contact Page</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
