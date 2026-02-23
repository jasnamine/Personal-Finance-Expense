import { Col, DatePicker, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { GroupRequest } from "../../models/Group";

interface GroupFormProps {
  form: UseFormReturn<GroupRequest>;
}

const GroupForm = ({ form }: GroupFormProps) => {
  return (
    <form>
      <label className="block mb-1 ">Tên nhóm</label>
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => (
          <Input {...field} placeholder="Tên nhóm" size="large" />
        )}
      />
      {/* Tiền tệ cơ bản */}

      <label className="block mb-1 font-medium">Tiền tệ cơ bản</label>
      <Controller
        name="baseCurrency"
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            className="w-full"
            size="large"
            placeholder="Chọn loại tiền tệ"
            options={[
              { value: "VND", label: "VNĐ (Việt Nam Đồng)" },
              { value: "USD", label: "USD (Đô la Mỹ)" },
            ]}
          />
        )}
      />

      <Row gutter={16} className="mt-4">
        <Col span={12}>
          <label className="block mb-1 font-medium">Ngày bắt đầu</label>
          <Controller
            name="startDate"
            control={form.control}
            rules={{ required: "Ngày bắt đầu là bắt buộc" }}
            render={({ field }) => (
              <>
                <DatePicker
                  className="w-full"
                  size="large"
                  placeholder="Chọn ngày bắt đầu"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? date.toDate() : null)
                  }
                />
              </>
            )}
          />
        </Col>

        <Col span={12}>
          <label className="block mb-1 font-medium">Ngày kết thúc</label>
          <Controller
            name="endDate"
            control={form.control}
            rules={{ required: "Ngày kết thúc là bắt buộc" }}
            render={({ field }) => (
              <>
                <DatePicker
                  className="w-full"
                  size="large"
                  placeholder="Chọn ngày kết thúc"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? date.toDate() : null)
                  }
                />
              </>
            )}
          />
        </Col>
      </Row>

      {/* Mô tả */}
      <label className="block mb-1 font-medium">Mô tả (không bắt buộc)</label>
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <Input.TextArea
            {...field}
            placeholder="Mô tả ngắn gọn về nhóm..."
            rows={3}
            size="large"
          />
        )}
      />
    </form>
  );
};

export default GroupForm;
