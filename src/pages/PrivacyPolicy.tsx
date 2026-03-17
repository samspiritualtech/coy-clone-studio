import { CustomerLayout } from "@/layouts/CustomerLayout";

const PrivacyPolicy = () => {
  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Effective Date: March 17, 2025</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/80 leading-relaxed">
          <p>
            Ogura ("we", "our", "us") is committed to protecting your privacy and ensuring transparency in the way your personal data is handled.
          </p>
          <p>
            This Privacy Policy is issued in accordance with applicable laws in India, including the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.
          </p>
          <p>
            By accessing or using the Ogura platform, you agree to the collection and use of your information in accordance with this Policy.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Information We Collect</h2>
          <p>
            Ogura may collect personal information such as your name, email address, phone number, delivery address, and transaction details when you use the platform. In addition, certain technical information including device details, IP address, and browsing behavior may be collected to improve platform functionality and user experience.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">How We Use Your Information</h2>
          <p>
            Your information is used for purposes including processing orders, enabling transactions between buyers and sellers, improving services, providing customer support, and ensuring compliance with legal obligations.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Communication Consent</h2>
          <p>
            By submitting your information on the platform, you expressly consent to receive communications from Ogura and acknowledge as follows:
          </p>
          <blockquote className="border-l-4 border-primary/30 pl-4 italic text-foreground/70">
            "We collect personal details like your name, email address, and phone number etc. By sharing your information, you authorize Ogura to contact you via SMS, RCS, WhatsApp, Email, and other communication channels. This consent overrides any NDNC/DND registration as per TRAI regulations."
          </blockquote>

          <h2 className="text-xl font-semibold text-foreground pt-4">Information Sharing</h2>
          <p>
            Ogura may share relevant information with sellers, logistics partners, and payment service providers strictly for the purpose of order fulfillment and service delivery. Such sharing is limited to what is necessary and is done under appropriate confidentiality obligations.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Data Security</h2>
          <p>
            Ogura implements reasonable security measures to protect your information from unauthorized access, misuse, or disclosure. While we strive to safeguard your data, no system can be completely secure, and users are advised to exercise caution.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Cookies</h2>
          <p>
            The platform uses cookies and similar technologies to enhance user experience and analyze usage trends. You may manage cookie preferences through your browser settings.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data, or withdraw consent for its use, by contacting us at{" "}
            <a href="mailto:foundercares@ogura.in" className="text-primary underline">foundercares@ogura.in</a>.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Data Retention</h2>
          <p>
            Ogura retains personal data only for as long as necessary for the purposes outlined in this Policy or as required under applicable law.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Changes to This Policy</h2>
          <p>
            Ogura reserves the right to update this Privacy Policy from time to time. Continued use of the platform constitutes acceptance of such updates.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Contact Us</h2>
          <p>
            For any concerns or grievances relating to data privacy, you may contact us at{" "}
            <a href="mailto:foundercares@ogura.in" className="text-primary underline">foundercares@ogura.in</a>.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default PrivacyPolicy;
