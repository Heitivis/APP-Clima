import * as React from "react";
import { Text, View, StyleSheet, Image } from 'react-native';
import * as Location from 'expo-location';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      api: {},
      location: null,
      errorMessage: null,
    };
  }

  async componentDidMount() {
    await this.getLocation();
  }

  // Obtendo a localização atual
  getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      this.setState({ errorMessage: 'Permissão negada' });
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location }, () => {
      this.pegarDados();
    });
  };

  pegarDados = async () => {
    const { latitude, longitude } = this.state.location.coords;
    var link = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=143454aa39bbe3442a890cdbf3f9db36`;

    return await fetch(link)
      .then((resposta) => resposta.json())
      .then((respostaJson) => {
        this.setState({ api: respostaJson });
      })
      .catch((erro) => console.error(erro));
  };

  render() {
    if (!this.state.api || !this.state.api.main) {
      return (
        <View style={styles.container}>
          <Text>Carregando....</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Previsão do tempo</Text>
          <Image 
            source={require("./clima 2.png")}
            style={styles.imagem}
          />
          <Text style={styles.text}> {this.state.api.name} - {this.state.api.main.temp}°C</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
  },
  title: {
    marginTop: 50,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagem: {
    width: 150,
    height: 150,
    marginTop: 30,
    alignSelf: 'center',
    marginVertical: 30,
  },
  text: {
    marginHorizontal: 20,
    fontSize: 20,
    textAlign: 'left',
  },
});

