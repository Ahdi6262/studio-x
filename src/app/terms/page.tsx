
import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Terms of Service"
        description="Please read these terms carefully before using HEX THE ADD HUB."
      />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <FileText className="mr-3 h-6 w-6 text-primary" />
            Our Terms & Conditions
          </CardTitle>
          <CardDescription>Last Updated: July 26, 2024 (Placeholder Date)</CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none text-foreground/90">
          <p>Welcome to HEX THE ADD HUB!</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using our platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.</p>

          <h2>2. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.</p>
          
          <h2>3. User Conduct</h2>
          <p>You agree not to use the platform for any unlawful purpose or in any way that interrupts, damages, or impairs the service. Prohibited behavior includes harassment, uploading malicious content, and infringing on intellectual property rights.</p>

          <h2>4. Content Ownership</h2>
          <p>You retain ownership of the content you create and upload to HEX THE ADD HUB. However, by posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with the service.</p>
          
          <h2>5. Web3 Interactions</h2>
          <p>HEX THE ADD HUB integrates with Web3 technologies. You are solely responsible for managing your private keys, wallet security, and any transactions you initiate. We are not liable for any losses incurred due to your interactions with blockchain technologies.</p>

          <h2>6. Disclaimers</h2>
          <p>The platform is provided "as is" without any warranties. We do not guarantee that the service will be error-free or uninterrupted.</p>
          
          <h2>7. Limitation of Liability</h2>
          <p>HEX THE ADD HUB shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.</p>

          <h2>8. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. We will notify users of any significant changes. Your continued use of the platform after such changes constitutes your acceptance of the new terms.</p>
          
          <h2>9. Governing Law</h2>
          <p>These terms shall be governed by the laws of [Your Jurisdiction - Placeholder].</p>

          <h2>10. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at [Your Contact Email - Placeholder].</p>

          <p className="mt-6 text-sm text-muted-foreground">
            <em>This is a placeholder Terms of Service document. You should consult with a legal professional to draft terms appropriate for your specific platform and jurisdiction.</em>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
