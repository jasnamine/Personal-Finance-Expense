import type { ButtonProps } from "antd";
import { Button } from "antd";

type Props = ButtonProps & {
  centerContent?: boolean;
};

const AppButton = ({
  centerContent = false,
  style,
  children,
  ...rest
}: Props) => {
  return (
    <Button
      {...rest}
      style={{
        ...style,
      }}
    >
      {children}
    </Button>
  );
};

export default AppButton;
