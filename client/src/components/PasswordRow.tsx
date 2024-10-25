import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FaTrashCan } from "react-icons/fa6";
import { decryptPassword } from "../api/queries";
import { deletePassword } from "../api/mutations";

export function PasswordRow({
  password,
  idx,
}: {
  idx: number;
  password: { _id: string; title: string; password: string };
}) {
  const queryClient = useQueryClient();
  const [showPass, setShowPass] = useState(false);
  const { data } = useQuery({
    enabled: !!showPass,
    queryKey: ["decryptPassword", password._id],
    queryFn: () => decryptPassword(password._id),
  });

  const deletePasswordMutation = useMutation({
    mutationKey: ["deletePassword"],
    mutationFn: (id: string) => deletePassword(id),
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ["passwords"],
      });
    },
  });

  return (
    <tr className="hover" key={password._id}>
      <th>{idx + 1}</th>
      <td>{password.title}</td>
      <td className="flex gap-5 min-w-[150px]">
        {showPass ? data : "*".repeat(password.password.length)}{" "}
      </td>
      <td>
        {showPass ? (
          <IoIosEyeOff
            onClick={(e) => {
              e.preventDefault();
              setShowPass(false);
            }}
          />
        ) : (
          <IoIosEye
            onClick={(e) => {
              e.preventDefault();
              setShowPass(true);
            }}
          />
        )}
      </td>
      <td>
        <FaTrashCan
          onClick={async () =>
            await deletePasswordMutation.mutateAsync(password._id)
          }
        />
      </td>
    </tr>
  );
}
