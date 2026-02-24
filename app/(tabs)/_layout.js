import { Tabs } from "expo-router";
import { COLORS } from "../../constants/colors";
// You can import icons here later, like Ionicons from @expo/vector-icons

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.mainColor, // Colors the active tab
        headerShown: false, // Hides the header for all tabs
        tabBarStyle: {
          backgroundColor: COLORS.background, // Matches your app theme
          borderTopWidth: 0,
        },
      }}
    >
      {/* This 'index' refers to your app/(tabs)/index.js (the old profile) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Profile",
          // tabBarIcon: ({ color }) => <YourIconComponent name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}