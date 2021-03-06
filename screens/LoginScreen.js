import React from "react";
import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Text,
  Button
} from "native-base";
import { View, AsyncStorage } from 'react-native';
import Spacer from "../components/Spacer";
import store from '../store'
import { Devless } from "../utils/devless";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit () {
    const res = await Devless.call('devless', 'login', ['', this.state.email, '', this.state.password])
    if(res.status_code === 637 && res.payload.result) {
      AsyncStorage.setItem('userToken', res.payload.result.token)
      store.changeAuthenticated()
    }
  }
  render() {
    const {navigate} = this.props.navigation
    return (
      <Container style={{ backgroundColor: '#fff'}}>
        <Content>
          <Spacer size={80} />
          <Text style={styles.labelText}>FoodExpress</Text>
          <Spacer size={70} />
          <Form>
            <Item stackedLabel>
              <Label>Email</Label>
              <Input
                autoCapitalize="none"
                value={this.state.email}
                keyboardType="email-address"
                onChangeText={email => this.setState({email})}
              />
            </Item>
            <Item stackedLabel>
              <Label>Password</Label>
              <Input
                secureTextEntry
                onChangeText={password => this.setState({password})}
              />
            </Item>
            <Spacer size={20} />

            <View style={styles.btnWrapper}>
              <Button block onPress={this.handleSubmit}>
                <Text>Login</Text>
              </Button>
            </View>
            <Spacer size={20} />
            <Text style={styles.registerWrapper}>Don't have an account? 
              <Text style={styles.registerText} onPress={()=>navigate('Register')}> Register Now</Text>
            </Text>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = {
  labelText: {
    fontSize: 30,
    alignSelf: 'center'
  },
  btnWrapper: {
    paddingHorizontal: 16
  },
  registerWrapper: {
    alignSelf: 'center'
  },
  registerText: {
    color: 'blue',
    textDecorationLine: 'underline'
  }
}