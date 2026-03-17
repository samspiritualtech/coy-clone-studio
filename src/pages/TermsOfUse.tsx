import { CustomerLayout } from "@/layouts/CustomerLayout";

const TermsOfUse = () => {
  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Use</h1>
        <p className="text-sm text-muted-foreground mb-8">Effective Date: March 17, 2025</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/80 leading-relaxed">
          <p>
            These Terms of Use govern your access to and use of the Ogura platform. By accessing or using the platform, you agree to be bound by these Terms.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Platform Overview</h2>
          <p>
            Ogura operates as an online marketplace that enables independent sellers and brands to list and sell products to users. Ogura acts as an intermediary and does not own or directly sell the products listed on the platform.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">User Responsibilities</h2>
          <p>
            Users agree to provide accurate and complete information while using the platform and to maintain the confidentiality of their account credentials. Any activity conducted through your account shall be your responsibility.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Purchases & Payments</h2>
          <p>
            All purchases made on the platform are subject to acceptance by the respective sellers. Payments are processed through third-party payment service providers, and Ogura shall not be responsible for any issues arising from such services.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Seller Responsibility</h2>
          <p>
            Sellers are solely responsible for the quality, pricing, and fulfillment of products. Ogura does not guarantee product quality and shall not be liable for disputes arising between users and sellers, although it may assist in resolution.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Returns, Refunds & Cancellations</h2>
          <p>
            Returns, refunds, and cancellations shall be governed by the applicable policies displayed on the platform or by the respective sellers.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Intellectual Property</h2>
          <p>
            All content on the platform, including but not limited to text, graphics, and trademarks, is owned by or licensed to Ogura and is protected under applicable laws. Unauthorized use is prohibited.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Communication Consent</h2>
          <p>
            By using the platform and providing your information, you consent to receive communications from Ogura and acknowledge as follows:
          </p>
          <blockquote className="border-l-4 border-primary/30 pl-4 italic text-foreground/70">
            "We collect personal details like your name, email address, and phone number etc. By sharing your information, you authorize Ogura to contact you via SMS, RCS, WhatsApp, Email, and other communication channels. This consent overrides any NDNC/DND registration as per TRAI regulations."
          </blockquote>

          <h2 className="text-xl font-semibold text-foreground pt-4">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Ogura shall not be liable for any indirect, incidental, or consequential damages arising from use of the platform, including delays, product issues, or seller actions.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Termination</h2>
          <p>
            Ogura reserves the right to suspend or terminate access to the platform in case of violation of these Terms or applicable laws.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of India, and any disputes shall be subject to the jurisdiction of the courts in Agra, Uttar Pradesh.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default TermsOfUse;
