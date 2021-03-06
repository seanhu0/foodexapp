import React, { Component } from "react";
import {
  Image,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Input,
  View,
  Item,
  Left,
  Body,
  Right
} from "native-base";
import CategoryScreen from "./CategoryScreen";
import store from "../store";
import { observer } from "mobx-react";
import { Devless } from "../utils/devless";

// componentDidMount() {
//   console.log(props)
// }
const SearchItem = props => {
  return (
    <Card>
      <CardItem cardBody>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Order", { data: props.data })
          }
          style={{ flex: 1, height: 200, width: null }}
          acitveOpacity={0.8}
        >
          <Image
            source={{ uri: props.data.image }}
            style={{ height: 200, width: null, flex: 1 }}
          />
        </TouchableOpacity>
      </CardItem>

      <CardItem>
        <Left style={{ flex: 2 }}>
          <Body>
            <Text>{props.data.name}</Text>
            <Text note style={{ color: "red" }}>
              GHS
              {props.data.price}
              <Text> </Text>
              {/* <Icon active ios='ios-pizza' android="md-pizza" style={{fontSize: 15, color: 'red'}} /> */}
              <Text note>
                {props.data.vendors[0] && props.data.vendors[0].username}
              </Text>
            </Text>
          </Body>
        </Left>
        <Right>
          <TouchableOpacity onPress={() => store.addToFavorites(props.data)}>
            <Icon
              active
              ios="ios-heart-outline"
              android="md-heart-outline"
              style={{ fontSize: 40, color: "pink" }}
            />
          </TouchableOpacity>
        </Right>
      </CardItem>
    </Card>
  );
};

@observer
export default class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      foods: []
    };

    this._fetchFoods = this._fetchFoods.bind(this);
    this._callbackParent = this._callbackParent.bind(this);
  }

  componentWillMount() {
    this._fetchFoods();
  }

  async _callbackParent(cid) {
    const res = await Devless.queryData("Menu", "get_food", {
      where: cid,
      related: "*"
    });

    if (res.status_code == 1005) {
      this.setState({
        foods: res.payload
      });
    }
  }

  async _fetchFoods() {
    const userToken = await AsyncStorage.getItem("userToken");
    Devless.setToken(userToken);
    const res = await Devless.queryData("Menu", "mobile_food", {
      related: "*"
    });
    if (res.status_code == 1000) {
      this.setState({
        foods: res.payload
      });
    }
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container style={styles.wrapper}>
        <Content>
          <CategoryScreen call={this._callbackParent} />
          <View style={{ paddingHorizontal: 5 }}>
            {this.state.foods.length === 0 ? (
              <ActivityIndicator />
            ) : (
              this.state.foods.map((v, i) => (
                <SearchItem
                  navigation={this.props.navigation}
                  data={v}
                  key={i}
                />
              ))
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = {
  wrapper: {}
};
