
import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Privacy Policy"
        description="Your privacy is important to us. This policy explains how we collect, use, and protect your information."
      />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Shield className="mr-3 h-6 w-6 text-primary" />
            Our Commitment to Your Privacy
          </CardTitle>
          <CardDescription>Last Updated: July 26, 2024 (Placeholder Date)</CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none text-foreground/90">
          <p>HEX THE ADD HUB ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>

          <h2>1. Information We Collect</h2>
          <p>We may collect personal information such as:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, password, profile picture, bio when you register.</li>
            <li><strong>User Content:</strong> Projects, courses, blog posts, comments, and other content you create or upload.</li>
            <li><strong>Usage Data:</strong> Information about how you use our platform, including IP address, browser type, pages visited, and time spent.</li>
            <li><strong>Web3 Data:</strong> Public wallet addresses you connect to our platform. We do not store your private keys.</li>
            <li><strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance your experience.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide, operate, and maintain our platform.</li>
            <li>Improve, personalize, and expand our services.</li>
            <li>Understand and analyze how you use our platform.</li>
            <li>Develop new products, services, features, and functionality.</li>
            <li>Communicate with you, including for customer service, updates, and marketing.</li>
            <li>Process your transactions (e.g., course enrollments).</li>
            <li>Prevent fraud and ensure security.</li>
          </ul>

          <h2>3. Sharing Your Information</h2>
          <p>We do not sell your personal information. We may share information with:</p>
          <ul>
            <li><strong>Service Providers:</strong> Third-party vendors who help us operate our platform (e.g., payment processors, hosting services).</li>
            <li><strong>Legal Requirements:</strong> If required by law or in response to valid requests by public authorities.</li>
            <li><strong>With Your Consent:</strong> For any other purpose with your explicit consent.</li>
          </ul>
          <p>Your public Web3 wallet address may be visible on the platform if you choose to connect it for features like displaying NFTs or token-gated access.</p>
          
          <h2>4. Data Security</h2>
          <p>We implement security measures to protect your information. However, no electronic transmission or storage is 100% secure.</p>

          <h2>5. Your Data Rights</h2>
          <p>Depending on your jurisdiction, you may have rights regarding your personal data, such as access, correction, deletion, or restriction of processing. Please contact us to exercise these rights.</p>
          
          <h2>6. Third-Party Links</h2>
          <p>Our platform may contain links to other websites. We are not responsible for the privacy practices of these external sites.</p>

          <h2>7. Children's Privacy</h2>
          <p>Our services are not intended for individuals under the age of 13 (or a higher age if stipulated by local law). We do not knowingly collect personal data from children.</p>

          <h2>8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

          <h2>9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at [Your Contact Email for Privacy - Placeholder].</p>

           <p className="mt-6 text-sm text-muted-foreground">
            <em>This is a placeholder Privacy Policy. You should consult with a legal professional to ensure compliance with all applicable laws and regulations, such as GDPR, CCPA, etc.</em>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
