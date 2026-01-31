import { Input } from "antd";
import type { InputProps } from "antd";
import type { PasswordProps } from "antd/es/input";
import { forwardRef } from "react";

type Props =
  | ({ type?: "text" | "email" } & InputProps)
  | ({ type: "password" } & PasswordProps);

const AppInput = forwardRef<any, Props>((props, ref) => {
  if (props.type === "password") {
    const { type, ...rest } = props;
    return <Input.Password {...rest} ref={ref} size="large" />;
  }

  return <Input {...props} ref={ref} size="large" />;
});

export default AppInput;
