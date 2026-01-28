import { Card, Typography } from "antd";
import { useEffect, useState } from "react";
import AppButton from "../../components/Button/AppButton";
import AppInput from "../../components/Input/AppInput";

const { Title, Text } = Typography;

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // countdown chỉ để mở khóa nút resend
  useEffect(() => {
    if (canResend) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [canResend]);

  const handleVerifyOtp = () => {
    console.log("Verify OTP:", otp);
    // call verify otp api
  };

  const handleResendOtp = () => {
    console.log("Resend OTP clicked");
    setCanResend(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3}>Xác thực OTP</Title>
          <Text type="secondary">Nhập mã OTP đã gửi về email của bạn</Text>
        </div>

        <AppInput
          placeholder="Nhập mã OTP"
          value={otp}
          maxLength={6}
          inputMode="numeric"
          onChange={(e) => setOtp(e.target.value)}
        />

        <AppButton
          type="primary"
          block
          style={{ marginTop: 16 }}
          disabled={otp.length !== 6}
          onClick={handleVerifyOtp}
        >
          Xác nhận
        </AppButton>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <AppButton
            type="primary"
            block
            disabled={!canResend}
            onClick={handleResendOtp}
          >
            {canResend ? "Gửi lại OTP" : `Gửi lại sau ${countdown}s`}
          </AppButton>
        </div>
      </Card>
    </div>
  );
};

export default VerifyOtp;
