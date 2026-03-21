import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

const WIDGET_ID = import.meta.env.MSG91_WIDGETID;
const TOKEN_AUTH = import.meta.env.MSG91_TOKEN;

export default function OtpInput() {
  const [phone, setPhone] = useState("+91");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [resendTime, setResendTime] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (document.querySelector('script[src*="otp-provider.js"]')) {
      if (typeof window.initSendOTP === "function") {
        window.initSendOTP(window.configuration);
      }
      return;
    }

    window.configuration = {
      widgetId: WIDGET_ID,
      tokenAuth: TOKEN_AUTH,
      identifier: "mobile",
      exposeMethods: true,
      success: (data) => console.log("SDK Success:", data),
      failure: (error) => console.log("SDK Failure:", error),
    };

    const script = document.createElement("script");
    script.src = "https://verify.msg91.com/otp-provider.js";
    script.async = true;

    script.onload = () => {
      if (typeof window.initSendOTP === "function") {
        window.initSendOTP(window.configuration);
        console.log("✅ MSG91 SDK loaded");
      }
    };

    document.head.appendChild(script);

  }, []);

  const sendOtp = () => {
    if (typeof window.sendOtp !== "function") {
      setError("SDK not ready. Please refresh.");
      return;
    }

    setLoading(true);
    setError("");

    const rawPhone = phone.replace("+", "");
    window.sendOtp(
      rawPhone,
      () => {
        setStep("otp");
        setResendTime(60);
        setLoading(false);
      },
      (err) => {
        setError(`Failed to send OTP: ${JSON.stringify(err)}`);
        setLoading(false);
      },
    );
  };

  const verifyOtp = (completedOtp) => {
    if (typeof window.verifyOtp !== "function") return;

    setLoading(true);
    setError("");

    window.verifyOtp(
  completedOtp,
  async (data) => {
    console.log("Full response:", data);

    const accessToken =
      data.message ||
      data.accessToken ||
      data.access_token ||
      data.token ||
      data.data?.accessToken;

    if (!accessToken) {
      setError("Could not extract token from OTP response");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/verify",
        { accessToken }
      );
      localStorage.setItem("token", res.data.data.accessToken);
      alert("✅ Login Successful!");
      window.location.href = "/dashboard";
    } catch (e) {
      console.error("Backend error:", e.response?.data); // ← log actual backend error
      setError("Backend verification failed");
    } finally {
      setLoading(false);
    }
  },
  (err) => {
    setError(`Invalid OTP: ${JSON.stringify(err)}`);
    setLoading(false);
  }
);
  };

  useEffect(() => {
    if (resendTime > 0) {
      const timer = setTimeout(() => setResendTime((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTime]);

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Smart Ambulance Login
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === "phone" ? (
          <>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="text-lg"
            />
            <Button
              onClick={sendOtp}
              disabled={loading}
              className="w-full h-12"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </>
        ) : (
          <>
            <p className="text-center text-sm text-muted-foreground">
              Enter 6-digit code sent to <strong>{phone}</strong>
            </p>
            <InputOTP maxLength={6} onComplete={verifyOtp}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Button
              variant="link"
              disabled={resendTime > 0}
              onClick={sendOtp}
              className="w-full"
            >
              {resendTime > 0 ? `Resend in ${resendTime}s` : "Resend OTP"}
            </Button>
            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
