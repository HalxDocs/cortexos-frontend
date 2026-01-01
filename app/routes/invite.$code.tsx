import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function InviteGate() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function redeem() {
      const res = await fetch(
        `http://localhost:8080/v1/invite/${code}`,
        { method: "POST" }
      );

      if (res.ok) {
        localStorage.setItem("cortex_access", "granted");
        navigate("/");
      } else {
        navigate("/denied");
      }
    }

    redeem();
  }, [code, navigate]);

  return null;
}
