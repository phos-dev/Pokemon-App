import React from "react";
import { Image, StatusBar, StyleSheet, Text, View, FlatList } from "react-native";

const styles = StyleSheet.create({
  img: {
    width: 100,
    height: 100,
  },
  page: {
    paddingTop: StatusBar.currentHeight,
  },
  flatlist: {
    backgroundColor: "blue",
  },
  comp: {
    height: 20,
    backgroundColor: "green",
    marginLeft: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 23,
  },
});

const capitalize = (string: string) => {
  return string[0].toUpperCase() + string.slice(1);
};

const Poke = ({ route }) => {
  const { item } = route.params;
  const sprites = Object.values(item.sprites);
  return (
    <View style={styles.page}>
      <Text style={styles.title}>{capitalize(item.name)}</Text>
      <FlatList
        data={sprites}
        horizontal={true}
        renderItem={({ item }) => {
          return <Image style={styles.img} source={{ uri: item }} />;
        }}
      />
      <FlatList
        style={{ ...styles.flatlist, padding: 10 }}
        data={item.types}
        horizontal={true}
        renderItem={({ item }) => {
          return (
            <View style={styles.comp}>
              <Text>{capitalize(item.type.name)}</Text>
            </View>
          );
        }}
      />
      <FlatList
        data={item.details.stats}
        renderItem={({ item }) => {
          return (
            <Text>{`${capitalize(item.stat.name)} - ${item.base_stat}`}</Text>
          );
        }}
      />
    </View>
  );
};

export default Poke;
