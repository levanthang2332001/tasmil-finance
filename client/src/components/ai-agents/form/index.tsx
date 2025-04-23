"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import FeatureCheckbox from "./FeatureCheckbox";
import ImageGeneration from "./ImageGeneration";

interface FeatureOption {
  id: string;
  label: string;
  checked: boolean;
  description: string;
}

interface FormProps {
  type: "create" | "edit";
}

const Form = ({ type }: FormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("You are a professional trader and you are trading on the Binance exchange.");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [features, setFeatures] = useState<FeatureOption[]>([
    { 
      id: "price-monitoring", 
      label: "Price Monitoring", 
      checked: false, 
      description: "Track real-time price movements and set alerts for specific tokens" 
    },
    { 
      id: "liquidity-analysis", 
      label: "Liquidity Analysis", 
      checked: false, 
      description: "Analyze DEX liquidity pools and identify optimal trading opportunities" 
    },
    { 
      id: "risk-assessment", 
      label: "Risk Assessment", 
      checked: false, 
      description: "Evaluate smart contract risks and token metrics for safer trading" 
    },
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFeature = (id: string) => {
    setFeatures(features.map(feature => 
      feature.id === id ? { ...feature, checked: !feature.checked } : feature
    ));
  };

  const handleSubmit = () => {
    // TODO: Implement create AI agent logic
    console.log({ name, description, selectedImage, features });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <ImageGeneration
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          handleImageChange={handleImageChange}
        />

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter agent name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter agent description"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Features</Label>
          <div className="space-y-2">
            {features.map((feature) => (
              <FeatureCheckbox
                key={feature.id}
                id={feature.id}
                title={feature.label}
                description={feature.description}
                checked={feature.checked}
                onCheckedChange={() => toggleFeature(feature.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <Button 
          className="w-full" 
          onClick={handleSubmit}
        >
          {type === "create" ? "Create AI Agent" : "Update AI Agent"}
        </Button>
      </div>
    </div>
  );
};

export default Form;