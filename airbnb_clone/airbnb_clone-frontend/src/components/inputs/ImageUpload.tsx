import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
    var cloudinary: any;
}

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange
}) => { 
    const handleUpload = useCallback(() => {
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: "dvgdqljso",
                uploadPreset: "airbnb_clone",
                maxFiles: 1,
            },
            (error: any, result: any) => {
                if (!error && result.event === "success") {
                    onChange(result.info.secure_url);
                }
            }
        );
    
        widget.open();
    }, [onChange]);
    
    return (
        <div className="w-full">
            {value ? (
                <div className="relative w-full h-[500px]">
                    <img
                        src={value}
                        alt="Uploaded"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
            ) : (
                <div
                    onClick={handleUpload}
                    className="
                        relative 
                        cursor-pointer 
                        hover:opacity-70 
                        transition 
                        border-dashed 
                        border-2 
                        p-20 
                        border-neutral-300 
                        flex 
                        flex-col 
                        justify-center 
                        items-center 
                        gap-4 
                        text-neutral-600
                        rounded-lg
                    "
                >
                    <TbPhotoPlus size={50} />
                    <div className="font-semibold text-lg">
                        Click to upload your image
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;




