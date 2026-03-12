import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardHome } from "./pages/DashboardHome";
import { DashboardProducts } from "./pages/DashboardProducts";
import { DashboardAddProduct } from "./pages/DashboardAddProduct";
import { DashboardOrders } from "./pages/DashboardOrders";
import { DashboardCustomers } from "./pages/DashboardCustomers";
import { DashboardCollections } from "./pages/DashboardCollections";
import { DashboardInventory } from "./pages/DashboardInventory";
import { DashboardDiscounts } from "./pages/DashboardDiscounts";
import { DashboardAnalytics } from "./pages/DashboardAnalytics";
import { DashboardGiftCards } from "./pages/DashboardGiftCards";
import { DashboardTransfers } from "./pages/DashboardTransfers";
import { DashboardMarketing } from "./pages/DashboardMarketing";
import { DashboardContent } from "./pages/DashboardContent";
import { DashboardMarkets } from "./pages/DashboardMarkets";
import { DashboardSettings } from "./pages/DashboardSettings";

export const SellerDashboardShowcase = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showAddProduct, setShowAddProduct] = useState(false);

  const renderContent = () => {
    if (showAddProduct) return <DashboardAddProduct onBack={() => setShowAddProduct(false)} />;

    switch (activeTab) {
      case "home": return <DashboardHome />;
      case "orders": return <DashboardOrders />;
      case "products": return <DashboardProducts onAddProduct={() => setShowAddProduct(true)} />;
      case "collections": return <DashboardCollections />;
      case "inventory": return <DashboardInventory />;
      case "transfers": return <DashboardTransfers />;
      case "gift-cards": return <DashboardGiftCards />;
      case "customers": return <DashboardCustomers />;
      case "marketing": return <DashboardMarketing />;
      case "discounts": return <DashboardDiscounts />;
      case "content": return <DashboardContent />;
      case "markets": return <DashboardMarkets />;
      case "analytics": return <DashboardAnalytics />;
      case "settings": return <DashboardSettings />;
      default: return <DashboardHome />;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowAddProduct(false);
  };

  return (
    <div className="border rounded-xl overflow-hidden shadow-2xl bg-background" style={{ height: "85vh", minHeight: "600px" }}>
      <div className="flex h-full">
        <DashboardSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto bg-[#F1F1F1] p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};
