import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet, StatusBar } from "react-native";
import ListComponent from "../../components/listComponent/listComponent.component";

const styles = StyleSheet.create({
  flatlist: {
    display: "flex",
  },
  view: {
    paddingTop: StatusBar.currentHeight,
  },
});
class Favorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fav: [],
    };
  }

  componentDidMount() {
    const { route } = this.props;
    const { favorites } = route.params;
    this.setState({ fav: favorites });
  }

  render() {
    const { fav } = this.state;
    const { route } = this.props;
    const { onRemove, navigation } = route.params;

    return (
      <View style={styles.view}>
        <FlatList
          style={styles.flatlist}
          data={fav}
          numColumns={1}
          renderItem={({ item, index }) => {
            return (
              <ListComponent
                disabled
                key={item.id.toString()}
                idx={index}
                isDelete
                onClick={(idx) => {
                  onRemove(idx);
                  navigation.goBack();
                }}
                {...item}
              />
            );
          }}
        />
      </View>
    );
  }
}

export default Favorites;
