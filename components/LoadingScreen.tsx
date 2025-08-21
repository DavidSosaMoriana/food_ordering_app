import { ActivityIndicator, Text, View } from "react-native";

const LoadingScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#FF6B35" />
      <Text className="mt-4 text-gray-600 font-medium">Loading...</Text>
    </View>
  );
};

export default LoadingScreen;
