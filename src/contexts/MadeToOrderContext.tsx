import React, { createContext, useContext, useState, ReactNode } from "react";
import { Designer } from "@/types";

export interface BaseDesign {
  id: string;
  name: string;
  image: string;
  startingPrice: number;
  category: string;
}

export interface MTOCustomizations {
  dressType: string;
  fabric: string;
  color: string;
  embroideryLevel: string;
}

export interface MTOState {
  currentStep: number;
  entryPath: "inspiration" | "designer" | "base-design" | null;
  inspirationImages: File[];
  occasion: string;
  budget: [number, number];
  notes: string;
  selectedDesigner: Designer | null;
  selectedBaseDesign: BaseDesign | null;
  customizations: MTOCustomizations;
  generatedPreviews: string[];
  selectedPreview: string | null;
  designerReviewStatus: "pending" | "approved" | "changes-suggested";
  designerComments: string[];
  estimatedPrice: [number, number];
}

interface MTOContextType {
  state: MTOState;
  setEntryPath: (path: MTOState["entryPath"]) => void;
  setCurrentStep: (step: number) => void;
  setInspirationImages: (images: File[]) => void;
  setOccasion: (occasion: string) => void;
  setBudget: (budget: [number, number]) => void;
  setNotes: (notes: string) => void;
  setSelectedDesigner: (designer: Designer | null) => void;
  setSelectedBaseDesign: (design: BaseDesign | null) => void;
  setCustomizations: (customizations: Partial<MTOCustomizations>) => void;
  setGeneratedPreviews: (previews: string[]) => void;
  setSelectedPreview: (preview: string | null) => void;
  resetJourney: () => void;
}

const initialState: MTOState = {
  currentStep: 0,
  entryPath: null,
  inspirationImages: [],
  occasion: "",
  budget: [25000, 500000],
  notes: "",
  selectedDesigner: null,
  selectedBaseDesign: null,
  customizations: {
    dressType: "Lehenga",
    fabric: "Silk",
    color: "#8B0000",
    embroideryLevel: "Moderate",
  },
  generatedPreviews: [],
  selectedPreview: null,
  designerReviewStatus: "pending",
  designerComments: [],
  estimatedPrice: [45000, 65000],
};

const MadeToOrderContext = createContext<MTOContextType | undefined>(undefined);

export const MadeToOrderProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<MTOState>(initialState);

  const setEntryPath = (path: MTOState["entryPath"]) => {
    setState((prev) => ({ ...prev, entryPath: path, currentStep: 1 }));
  };

  const setCurrentStep = (step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

  const setInspirationImages = (images: File[]) => {
    setState((prev) => ({ ...prev, inspirationImages: images }));
  };

  const setOccasion = (occasion: string) => {
    setState((prev) => ({ ...prev, occasion }));
  };

  const setBudget = (budget: [number, number]) => {
    setState((prev) => ({ ...prev, budget }));
  };

  const setNotes = (notes: string) => {
    setState((prev) => ({ ...prev, notes }));
  };

  const setSelectedDesigner = (designer: Designer | null) => {
    setState((prev) => ({ ...prev, selectedDesigner: designer }));
  };

  const setSelectedBaseDesign = (design: BaseDesign | null) => {
    setState((prev) => ({ ...prev, selectedBaseDesign: design }));
  };

  const setCustomizations = (customizations: Partial<MTOCustomizations>) => {
    setState((prev) => ({
      ...prev,
      customizations: { ...prev.customizations, ...customizations },
    }));
  };

  const setGeneratedPreviews = (previews: string[]) => {
    setState((prev) => ({ ...prev, generatedPreviews: previews }));
  };

  const setSelectedPreview = (preview: string | null) => {
    setState((prev) => ({ ...prev, selectedPreview: preview }));
  };

  const resetJourney = () => {
    setState(initialState);
  };

  return (
    <MadeToOrderContext.Provider
      value={{
        state,
        setEntryPath,
        setCurrentStep,
        setInspirationImages,
        setOccasion,
        setBudget,
        setNotes,
        setSelectedDesigner,
        setSelectedBaseDesign,
        setCustomizations,
        setGeneratedPreviews,
        setSelectedPreview,
        resetJourney,
      }}
    >
      {children}
    </MadeToOrderContext.Provider>
  );
};

export const useMadeToOrder = () => {
  const context = useContext(MadeToOrderContext);
  if (context === undefined) {
    throw new Error("useMadeToOrder must be used within a MadeToOrderProvider");
  }
  return context;
};
