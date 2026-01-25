import { useCallback } from "react";
import { Button } from "@/components/Button";
import { HomeHeader } from "@/components/HomeHeader";
import { List } from "@/components/List";
import { Target } from "@/components/Target";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { router, useFocusEffect } from "expo-router";
import { View, StatusBar, Alert } from "react-native";

const summary = {
  total: "R$ 2.680,00",
  input: { label: "Entradas", value: "R$ 6.184,90" },
  output: { label: "Saídas", value: "-R$ 184,90" },
};

const targets = [
  {
    id: "1",
    name: "Comprar uma cadeira ergonômica",
    percentage: "75%",
    current: "900,00",
    target: "1.200,00",
  },
  {
    id: "2",
    name: "Comprar uma cadeira ergonômica",
    percentage: "75%",
    current: "900,00",
    target: "1.200,00",
  },
  {
    id: "3",
    name: "Comprar uma cadeira ergonômica",
    percentage: "75%",
    current: "900,00",
    target: "1.200,00",
  },
];

export default function Index() {
  const targetDatabase = useTargetDatabase();

  async function fetchTargets() {
    try {
      const response = await targetDatabase.listBySavedValue();
      console.log(response);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as metas.");
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchTargets();
    }, []),
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <HomeHeader data={summary} />

      <List
        title="Metas"
        data={targets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Target
            data={targets[0]}
            onPress={() => router.navigate("/in-progress/1")}
          />
        )}
        emptyMessage="Nenhuma meta. Toque em nova meta para criar."
        containerStyle={{ paddingHorizontal: 24 }}
      />

      <View style={{ paddingBottom: 32, padding: 24 }}>
        <Button title="Nova Meta" onPress={() => router.navigate("/target")} />
      </View>
    </View>
  );
}
