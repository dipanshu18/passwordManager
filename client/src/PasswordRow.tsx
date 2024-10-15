import axios, { AxiosError } from "axios";
import { useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { toast } from "sonner";

export default function PasswordRow({
  password,
  idx,
}: {
  idx: number;
  password: { _id: string; title: string; password: string };
}) {
  const [showPass, setShowPass] = useState(false);
  const [decryptedPass, setDecryptedPass] = useState("");

  async function handleShowPass(id: string) {
    try {
      setShowPass(true);
      const response = await axios.get(`http://localhost:8080/passwords/${id}`);

      if (response.status === 200) {
        const data = await response.data.password;

        setDecryptedPass(data);
      }
    } catch (error) {
      console.log("Error:", error);

      if (error instanceof AxiosError) {
        const errorData = await error.response?.data.msg;

        toast.error(errorData);
      }
    }
  }

  return (
    <tr className="hover" key={password._id}>
      <th>{idx + 1}</th>
      <td>{password.title}</td>
      <td className="flex gap-5 min-w-[150px]">
        {decryptedPass ? decryptedPass : "*".repeat(password.password.length)}{" "}
        {showPass ? (
          <IoIosEyeOff
            onClick={() => {
              setDecryptedPass("");
              setShowPass(false);
            }}
          />
        ) : (
          <IoIosEye onClick={() => handleShowPass(password._id)} />
        )}
      </td>
    </tr>
  );
}
