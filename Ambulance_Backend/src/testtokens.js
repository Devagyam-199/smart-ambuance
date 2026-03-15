import fetch from "node-fetch"

const FIREBASE_WEB_API_KEY = "AIzaSyAboQAqSc7RYVtIEPRn1pAI3QHp276-IUE"

async function getTestToken() {

  const sendOTP = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=${FIREBASE_WEB_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: "+911234567890",
        recaptchaToken: "testing"
      })
    }
  )
  const { sessionInfo } = await sendOTP.json()
  console.log("sessionInfo:", sessionInfo)

  const verifyOTP = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=${FIREBASE_WEB_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionInfo,
        code: "123456" 
      })
    }
  )
  const { idToken } = await verifyOTP.json()
  console.log("\n✅ YOUR ID TOKEN:\n")
  console.log(idToken)
  console.log("\nPaste this into Postman → POST /api/auth/verify → Body → idToken\n")
  console.log("⚠️  Expires in 1 hour — run this script again if it stops working\n")
}

getTestToken()