import { Input } from "antd";
import type { InputProps } from "antd";
import { forwardRef } from "react";

interface AppInputProps extends InputProps {
  type?: "text" | "email" | "password";
}

const AppInput = forwardRef<any, AppInputProps>((props, ref) => {
  if (props.type === "password") {
    const { type, ...rest } = props;
    return <Input.Password {...rest} ref={ref} size="large" />;
  }

  return <Input {...props} ref={ref} size="large" />;
});

export default AppInput;
