import { useAuth } from "@/context/AuthContext";
import { Redirect, router } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Landing() {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return (
    <>
      <View style={styles.body}>
        <Text style={{ fontSize: 30, letterSpacing: 1, fontWeight: "700" }}>
          Password Manager
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            letterSpacing: 1,
            fontWeight: "400",
          }}
        >
          A secure and easy-to-use tool designed to help you store and manage
          your passwords for different platforms. The app ensures that your
          passwords are safely encrypted and easily retrievable.
        </Text>

        <View style={{ width: "100%", gap: 15, marginVertical: 20 }}>
          <Pressable
            style={[styles.button, { backgroundColor: "black" }]}
            onPress={() => {
              console.log("pressed login");
              router.push("/login");
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 15 }}>
              Login
            </Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: "#ddd" }]}
            onPress={() => {
              console.log("pressed signup");
              router.push("/signup");
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 15 }}>Signup</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
