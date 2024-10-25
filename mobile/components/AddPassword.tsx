import { addPassword } from "@/api/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export function AddPassword() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");

  const addPasswordMutation = useMutation({
    mutationKey: ["addPassword"],
    mutationFn: () => addPassword({ title, password }),
    onSuccess: () => {
      setTitle("");
      setPassword("");
      queryClient.invalidateQueries({
        queryKey: ["passwords"],
      });
    },
  });

  return (
    <>
      <View
        style={{
          gap: 10,
          width: "80%",
          marginHorizontal: "auto",
          marginVertical: 20,
        }}
      >
        <View style={{ gap: 5, padding: 5 }}>
          <Text>Title:</Text>
          <TextInput
            onChangeText={setTitle}
            value={title}
            style={styles.inputBox}
            placeholder="type your title"
          />
        </View>
        <View style={{ gap: 5, padding: 5 }}>
          <Text>Password:</Text>
          <TextInput
            onChangeText={setPassword}
            value={password}
            style={styles.inputBox}
            placeholder="type your password"
          />
        </View>

        <Pressable
          style={{
            backgroundColor: "black",
            padding: 15,
            borderRadius: 10,
            margin: 5,
          }}
          onPress={async () => {
            await addPasswordMutation.mutateAsync();
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 15 }}>
            Add password
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});
