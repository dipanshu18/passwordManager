import { signup } from "@/api/mutations";
import { useMutation } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: () => signup({ email, password }),
    onSuccess: () => {
      setEmail("");
      setPassword("");

      router.replace("/home");
    },
  });

  return (
    <>
      <View style={{ padding: 10, flex: 1, justifyContent: "center" }}>
        <Text
          style={{
            marginVertical: 20,
            textAlign: "center",
            fontWeight: "700",
            fontSize: 30,
          }}
        >
          Hey, welcome!
        </Text>

        <View style={{ gap: 10 }}>
          <View style={{ gap: 5, padding: 5 }}>
            <Text>Email:</Text>
            <TextInput
              style={[styles.inputBox, {}]}
              placeholder="type your email"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
            />
          </View>
          <View style={{ gap: 5, padding: 5 }}>
            <Text>Password:</Text>
            <TextInput
              style={[styles.inputBox, {}]}
              placeholder="type your password"
              onChangeText={setPassword}
              value={password}
            />
          </View>

          <View style={{ flexDirection: "row", gap: 5, margin: 5 }}>
            <Text>Already have an account?</Text>
            <Link href="/login">
              <Text style={{ textDecorationLine: "underline" }}>Login</Text>
            </Link>
          </View>

          <Pressable
            style={{
              backgroundColor: "black",
              padding: 15,
              borderRadius: 10,
              margin: 5,
            }}
            onPress={async () => {
              console.log("Pressed signup");
              await signupMutation.mutateAsync();
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 15 }}>
              Signup
            </Text>
          </Pressable>
        </View>
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