import type { InputProps } from "antd";
import { Input } from "antd";
import type { PasswordProps } from "antd/es/input";

type Props =
  | ({ type?: "text" | "email" } & InputProps)
  | ({ type: "password" } & PasswordProps);

const AppInput = (props: Props) => {
  if (props.type === "password") {
    const { type, ...rest } = props;
    return <Input.Password size="large" {...rest} />;
  }

  return <Input size="large" {...props} />;
};

export default AppInput;
