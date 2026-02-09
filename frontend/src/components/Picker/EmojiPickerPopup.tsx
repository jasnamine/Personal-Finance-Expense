import EmojiPicker from "emoji-picker-react";
import { Image } from "lucide-react";
import { useState } from "react";
import AppButton from "../Button/AppButton";
import {
CloseOutlined
} from "@ant-design/icons";
interface EmojiPickerPopupProps {
  icon: string;
  onSelected: (emoji: string) => void;
}
const EmojiPickerPopup = ({ icon, onSelected }: EmojiPickerPopupProps) => {
  const [isOpen, setIsModalOpen] = useState(false);
  return (
    <div
      className="flex flex-col gap-2 mb-2"
      onClick={() => setIsModalOpen(true)}
    >
      <section className="flex items-center bg-purple-20 gap-2 mt-2 ">
        <section className="flex items-center justify-center w-10 h-10 bg-purple-50 text-purple-500">
          {icon ? <img src={icon} alt="Icon" /> : <Image />}
        </section>

        <p className=" text-sm text-bold">
          {icon ? "Change icon" : "Pick icon"}
        </p>
      </section>

      {isOpen && (
        <section className="flex relative">
          <EmojiPicker
            open={isOpen}
            onEmojiClick={(emoji) => onSelected(emoji?.imageUrl || "")}
          />
          <AppButton
            className="absolute right-6 outline-transparent"
            size="small"
            icon={<CloseOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
          />
        </section>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
