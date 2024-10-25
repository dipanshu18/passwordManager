import { Redirect, router, Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { deleteValue } from "@/utils/secureStore";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function DashboardLayout() {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: "Password Manager",
          headerLeft: () => {
            return <></>;
          },
          headerRight: () => {
            return (
              <>
                <FontAwesome
                  onPress={async () => {
                    await deleteValue("token");
                    router.replace("/");
                  }}
                  name="sign-out"
                  size={24}
                  color="black"
                />
              </>
            );
          },
        }}
      />
    </Stack>
  );
}
