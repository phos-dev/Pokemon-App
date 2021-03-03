import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import ListComponent from "../../components/listComponent/listComponent.component";
import DropDownPicker from "react-native-dropdown-picker";

interface MyProps {}

interface MyState {
  page: number;
  got: boolean;
  pokemons: Array<Object>;
}

const styles = StyleSheet.create({
  view: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
  title: {
    fontSize: 30,
    margin: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
  flatlist: {
    display: "flex",
    padding: 5,
  },
  loading: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading_text: {
    fontSize: 30,
  },
  bottomBar: {
    display: "flex",
    flexDirection: "row",
    height: "10%",
  },
  btn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "blue",
  },
  toolb: {
    display: "flex",
    width: "100%",
    backgroundColor: "yellow",
    flexDirection: "row",
  },
  favoritebtn: {
    backgroundColor: "green",
    display: "flex",
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
class Home extends Component<MyProps, MyState> {
  constructor(props: object) {
    super(props);
    this.state = {
      got: false,
      pokemons: [],
      page: 0,
      sort_by: "id",
      types: new Set(),
      fav: [],
      showing: [],
    };
  }

  addTypes = (toAdd) => {
    let newSet = new Set(this.state.types);
    toAdd.map((e) => newSet.add(e.type.name));
    this.setState({ types: newSet });
  };

  sort = () => {
    const { sort_by, pokemons } = this.state;
    switch (sort_by) {
      case "weight-a":
        return this.setState({
          showing: pokemons.sort((a, b) => a.weight - b.weight),
        });
      case "weight-d":
        return this.setState({
          showing: pokemons.sort((a, b) => b.weight - a.weight),
        });
      case "id":
        return this.setState({ showing: pokemons.sort((a, b) => a.id - b.id) });
      default:
        return this.setState({
          showing: pokemons.filter((k) => {
            k.types.map((e) => e.type.name);
          }),
        });
    }
  };
  prepareArray = async (pokemons) => {
    const filter = (sprites: { [key: string]: any }) => {
      let newObj: { [key: string]: any } = {},
        key: string;

      for (key in sprites) {
        if (typeof sprites[key] === "string") {
          newObj[key] = sprites[key];
        }
      }

      return newObj;
    };
    const array = await Promise.all(
      pokemons.map(async (data) => {
        return await fetch(data.url)
          .then((response) => response.json())
          .then((data) => {
            this.addTypes(data.types);
            return {
              id: data.id,
              name: data.name,
              types: data.types,
              weight: data.weight,
              details: {
                stats: data.stats,
                types: data.types,
              },
              sprites: filter(data.sprites),
            };
          });
      })
    );
    this.setState({ got: true, pokemons: array }, () => this.sort());
  };
	/*
	Eu primeiro pensei em pegar os dados para aquela página que está sendo mostrada, 
	vi que a api facilitava apontando pra a URL da próxima página e da anterior, 
	mas se eu fosse ordenar, só ordenaria os itens que eu consegui. 
	
	A segunda solução que pensei foi pegar todos os dados logo de primeira, 
	mas eu precisava da foto do pokemon no item, aí pensei em pegar o dados da URL
	e deixar o componente (foto, id, nome) do pokemon carregando, mas, na hora de 
	ordenar eu precisaria do peso. 
	
	A terceira opção foi a mais custosa mas não vi outra opção, 
	que foi pegar todos os dados e resolver todas as promises para que 
	no final eu tenha um array de objeto com 1118 pokémons já contendo 
	URL de foto, id, nome, detalhes, peso... 
	Mas essa solução não me deixa por um número grande já que seria MUITAS 
	promises para resolver, consigo resolver 100, 200 o app crasha.
	
	*/
  getPokemons = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=100`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => this.prepareArray(data.results))
      .catch((e) => alert(e));
  };

  componentDidMount() {
    this.getPokemons();
  }

  goToPrevious = () => {
    const { page } = this.state;
    if (page > 0) {
      this.setState({ page: page - 10 });
    }
  };

  removeFromFav = (idx) => {
    const { fav } = this.state;
    const array = fav.filter((_e, index) => index !== idx);
    this.setState({ fav: array });
  };
  addToFav = (item) => {
    const { fav } = this.state;
    const found = fav.find((e) => item.name === e.name);
    if (!found) {
      const array = [...fav, item];
      this.setState({ fav: array });
    }
  };
  capitalize = (string: string) => {
    return string[0].toUpperCase() + string.slice(1);
  };
  goToNext = () => {
    const { page } = this.state;
    if (page < 100) {
      this.setState({ page: page + 10 });
    }
  };
  getTypes = () => {
    const { types } = this.state;
    let array = [];
    for (item of types)
      array.push({ label: this.capitalize(item), value: item, parent: "type" });
    return array;
  };
  render() {
    const { pokemons, got, page, sort_by, showing } = this.state;
    const { navigation } = this.props;

    return got ? (
      <View style={styles.view}>
        <View>
          <Text style={styles.title}>Pokemón</Text>
          <View
            style={{ display: "flex", flexDirection: "row", paddingBottom: 20 }}
          >
            <DropDownPicker
              items={[
                { label: "Id - Ascendente", value: "id", selected: true },
                {
                  label: "Peso - Ascendente",
                  value: "weight-a",
                  untouchable: false,
                },
                {
                  label: "Peso - Descendente",
                  value: "weight-d",
                  untouchable: false,
                },
                { label: "Tipo", value: "type", untouchable: true },
                ...this.getTypes(),
              ]}
              defaultValue={sort_by}
              containerStyle={{ height: 40 }}
              style={{ width: 300 }}
              itemStyle={{
                justifyContent: "flex-start",
              }}
              onChangeItem={(item) =>
                this.setState(
                  {
                    sort_by: item.value,
                  },
                  () => this.sort()
                )
              }
            />
            <TouchableOpacity
              style={styles.favoritebtn}
              onPress={() =>
                navigation.navigate("Fav", {
                  favorites: this.state.fav,
                  navigation: navigation,
                  onRemove: (e) => {
                    this.removeFromFav(e);
                  },
                })
              }
            >
              <Text>Favoritos</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          style={styles.flatlist}
          data={showing.slice(page, page + 10)}
          numColumns={2}
          renderItem={({ item, index }) => {
            return (
              <ListComponent
                onItemClick={(e) => {
                  navigation.navigate("Poke", {
                    item: e,
                  });
                }}
                key={item.id}
                idx={index}
                onClick={(e) => this.addToFav(e)}
                {...item}
              />
            );
          }}
        />
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.btn}
            disabled={page > 0 ? false : true}
            onPress={this.goToPrevious}
          >
            <Text style={{ color: "white" }}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            disabled={page < 100 ? false : true}
            onPress={this.goToNext}
          >
            <Text style={{ color: "white" }}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={styles.loading}>
        <Text style={styles.loading_text}>Capturando Pokémons...</Text>
      </View>
    );
  }
}

export default Home;
