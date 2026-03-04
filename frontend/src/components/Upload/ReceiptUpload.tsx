import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Image, Upload } from "antd";
import type { RcFile } from "antd/es/upload";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { GroupExpenseRequest } from "../../models/Group";

interface Props {
  form: UseFormReturn<GroupExpenseRequest>;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

const ReceiptUpload = ({ form }: Props) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    const latestFile = fileList.slice(-1);
    setFileList(latestFile);

    const fileObj = latestFile[0]?.originFileObj;

    if (fileObj) {
      form.setValue("receiptUrl", fileObj);
    }
  };

  const handleRemove: UploadProps["onRemove"] = () => {
    form.setValue("receiptUrl", undefined);
    setFileList([]);
    return true;
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        beforeUpload={() => false}
        maxCount={1}
      >
        {fileList.length >= 1 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>

      {previewImage && (
        <Image
          style={{ display: "none" }}
          preview={{
            open: previewOpen,
            onOpenChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default ReceiptUpload;
