import axios from "axios";

const verifyToken = async (accessToken) => {
  try {
    const { data } = await axios.post(
      "https://api.msg91.com/api/v5/widget/verifyAccessToken",
      { 
        authkey: process.env.MSG91_AUTHKEY, 
        "access-token": accessToken.trim() 
      },
      { headers: { 'Content-Type': 'application/json' } }
    );


    if (data.type !== "success") {
      throw new Error(`MSG91 failed: ${data.message} (code: ${data.code})`);
    }

    let mobile = data.data?.mobile || data.data?.identifier;

    if (!mobile && data.message && /^\d{10,13}$/.test(data.message)) {
      mobile = data.message;
    }

    if (!mobile) {
      throw new Error(`No mobile/identifier found. Full response: ${JSON.stringify(data)}`);
    }

    return mobile;

  } catch (err) {
    if (err.response) {
      console.error("MSG91 HTTP Error:", err.response.status, err.response.data);
      throw new Error(`MSG91 API error ${err.response.status}: ${JSON.stringify(err.response.data)}`);
    }
    throw err;
  }
};

export default verifyToken;