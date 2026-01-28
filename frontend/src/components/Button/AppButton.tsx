import { Button } from "antd";
import type { ButtonProps } from "antd";

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
      size="large"
      {...rest}
      style={{
        ...(centerContent
          ? {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </Button>
  );
};

export default AppButton;
