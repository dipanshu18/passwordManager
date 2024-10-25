import { decryptPassword, getPasswords } from "@/api/queries";
import { IPassword } from "@/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { AddPassword } from "@/components/AddPassword";
import { deletePassword } from "@/api/mutations";

export default function Home() {
  const queryClient = useQueryClient();
  const [showPassId, setShowPassId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<IPassword[]>({
    queryKey: ["passwords"],
    queryFn: getPasswords,
  });

  const { data: decryptedPassword } = useQuery({
    queryKey: ["decryptPassword", showPassId],
    queryFn: () => decryptPassword(showPassId as string),
    enabled: !!showPassId,
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

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <AddPassword />

      <Text
        style={{
          margin: 20,
          fontSize: 20,
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        Your saved passwords:
      </Text>

      <View style={{ width: "90%", marginHorizontal: "auto" }}>
        {data && data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={({ item }) => {
              const isPasswordVisible = showPassId === item._id;
              return (
                <View
                  key={item._id}
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 15 }}>{item.title}</Text>
                  <Text style={{ textAlign: "left", fontSize: 15, flex: 1 }}>
                    {isPasswordVisible
                      ? decryptedPassword
                      : "*".repeat(item.password.length)}
                  </Text>
                  <>
                    {isPasswordVisible ? (
                      <Entypo
                        onPress={() => setShowPassId(null)}
                        name="eye-with-line"
                        size={24}
                      />
                    ) : (
                      <Entypo
                        onPress={() => setShowPassId(item._id)}
                        name="eye"
                        size={24}
                      />
                    )}
                  </>
                  <>
                    <FontAwesome
                      name="trash"
                      size={24}
                      color="black"
                      onPress={async () => {
                        await deletePasswordMutation.mutateAsync(item._id);
                      }}
                      style={{ marginHorizontal: 10 }}
                    />
                  </>
                </View>
              );
            }}
          />
        ) : (
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
            }}
          >
            No passwords added yet :(
          </Text>
        )}
      </View>
    </>
  );
}
