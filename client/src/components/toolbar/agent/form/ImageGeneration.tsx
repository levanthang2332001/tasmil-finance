import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import React from "react";

interface ImageGeneratorProps {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageGeneration = ({
  selectedImage,
  setSelectedImage,
  handleImageChange,
}: ImageGeneratorProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="avatar-upload"
      />
      <div className="relative group">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <Avatar className="size-28 border-4 border-background">
            <AvatarImage src={selectedImage || ""} />
            <AvatarFallback className="text-2xl">AI</AvatarFallback>
          </Avatar>
        </label>
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("avatar-upload")?.click();
            }}
          >
            <Upload className="h-4 w-4" />
          </Button>
          {selectedImage && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e) => {
                e.preventDefault();
                setSelectedImage(null);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGeneration;
