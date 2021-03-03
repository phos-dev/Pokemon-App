import React, { Component } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity } from "react-native";

interface MyProps {
  pokemonLink: string;
  name: string;
  sprites: object;
}

const styles = StyleSheet.create({
  pokemonLink: {
    width: 96,
    height: 96,
  },
  list: {
    display: "flex",
    flex: 1,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  loading: {
    display: "flex",
    flex: 1,
    backgroundColor: "green",
    width: 140,
    height: 140,
    margin: 5,
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textloading: {
    fontSize: 20,
  },
  info: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "yellow",
    width: "100%",
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 10,
  },
  btnAdd: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "black",
  },
});

class ListComponent extends Component<MyProps> {
  capitalize = (string: string) => {
    return string[0].toUpperCase() + string.slice(1);
  };
  render() {
    const {
      id,
      name,
      sprites,
      onClick,
      isDelete,
      disabled,
      onItemClick,
      ...otherProps
    } = this.props;
    return (
      <TouchableOpacity
        style={styles.list}
        disabled={disabled}
        onPress={() => {
          if (!disabled) {
            onItemClick({
              id: id,
              name: name,
              sprites: sprites,
              weight: otherProps.weight,
              ...otherProps,
            });
          }
        }}
      >
        <Image
          style={styles.pokemonLink}
          source={{ uri: sprites.front_default }}
        />
        <View style={styles.info}>
          <Text style={{ flex: 1 }}>{`${id} - ${this.capitalize(name)}`}</Text>
          <TouchableOpacity
            style={styles.btnAdd}
            onPress={() => {
              if (disabled) {
                onClick(this.props.idx);
              } else {
                onClick({
                  name: name,
                  id: id,
                  sprites: sprites,
                });
              }
            }}
          >
            <Text style={{ color: "white" }}>{isDelete ? "-" : "+"}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}

export default ListComponent;
