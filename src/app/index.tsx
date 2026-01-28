import { useCallback, useState } from "react";
import { Button } from "@/components/Button";
import { HomeHeader } from "@/components/HomeHeader";
import { List } from "@/components/List";
import { Target, TargetProps } from "@/components/Target";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { router, useFocusEffect } from "expo-router";
import { View, StatusBar, Alert } from "react-native";
import { Loading } from "@/components/Loading";

const summary = {
  total: "R$ 2.680,00",
  input: { label: "Entradas", value: "R$ 6.184,90" },
  output: { label: "Saídas", value: "-R$ 184,90" },
};

export default function Index() {
  const [isFetching, setIsFeching] = useState(true);
  const [targets, setTarget] = useState<TargetProps[]>([]);

  const targetDatabase = useTargetDatabase();

  async function fetchTargets(): Promise<TargetProps[]> {
    try {
      const response = await targetDatabase.listBySavedValue();

      return response.map((item) => ({
        id: String(item.id),
        name: item.name,
        current: String(item.current),
        percentage: item.percentage.toFixed(0) + "%",
        target: String(item.amount),
      }));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as metas.");
      console.log(error);
    }
  }

  async function fetchData() {
    const targetDataPromise = fetchTargets();

    const [targetData] = await Promise.all([targetDataPromise]);

    setTarget(targetData);
    setIsFeching(false);
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  if (isFetching) {
    return <Loading />;
  }

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
