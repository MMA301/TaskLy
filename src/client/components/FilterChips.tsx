import { Pressable, Text, View } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

type FilterChipsProps = {
  filters: {
    id: string;
    label: string;
    hasDropdown?: boolean;
    hasClose?: boolean;
  }[];
  activeFilterId: string;
  onFilterPress: (id: string) => void;
};

export default function FilterChips({
  filters,
  activeFilterId,
  onFilterPress,
}: FilterChipsProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: Layout.spacing.md,
        gap: 8,
      }}
    >
      {filters.map((filter) => {
        const isActive = filter.id === activeFilterId;
        return (
          <Pressable
            key={filter.id}
            onPress={() => onFilterPress(filter.id)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: isActive ? Colors.primary : Colors.surface,
              borderWidth: 1,
              borderColor: isActive ? Colors.primary : Colors.outlineVariant,
            }}
          >
            <Text
              style={{
                color: isActive ? Colors.white : Colors.onSurface,
                fontWeight: "600",
                fontSize: 13,
              }}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
