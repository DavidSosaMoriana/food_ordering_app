import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { useAuth } from "@/contexts/AuthContext";
import { signIn } from "@/lib/appwrite";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import * as Sentry from "@sentry/react-native";

const SignIn = () => {
  const [isSubmitting, setisSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const { refetchUser } = useAuth();

  const submit = async () => {
    const { email, password } = form;
    if (!email || !password)
      return Alert.alert("Error", "Please enter valid email & password.");

    setisSubmitting(true);

    try {
      await signIn({ email, password });

      // Refetch user data after successful sign in
      await refetchUser();

      // Navigation will be handled automatically by AuthContext
    } catch (error: any) {
      Alert.alert("Error", error.message);
      Sentry.captureEvent(error);
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        secureTextEntry={false}
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />
      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Don&#39;t have an account?
        </Text>
        <Link href="/sign-up" className="base-bold text-primary">
          Sign Up
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
