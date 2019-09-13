
import React, {Component} from 'react';
import {
    NetInfo,
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    TextInput,
    ListView,
    View,
    Alert,
    Modal,
    TouchableOpacity,
    Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {setSpText} from '../../../utils/ScreenUtil'
import Icon from 'react-native-vector-icons/FontAwesome';

const Dimensions = require('Dimensions');
const {height, width} = Dimensions.get('window');

class OrderDiscount extends Component {
    cancel() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
        }

    }

    render() {
        return (
            <ScrollView>
                <View style={{flex: 1}}>
                    {/*header*/}
                    <View style={[{backgroundColor:'#387ef5',padding:4,paddingTop:Platform.OS=='ios'?40:15,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                        <View style={{flex:1,paddingLeft:10}}>
                            <TouchableOpacity
                                style={{flexDirection:'row',height:40,alignItems:'flex-end'}}
                                onPress={
                                    ()=>{
                                        this.cancel();
                                    }
                                }>
                                <Icon name="arrow-left" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{fontSize: setSpText(20), flex: 3, textAlign: 'center', color: '#fff'}}>
                            Supnuevo(5.2)-{this.props.username}
                        </Text>
                        <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                        </View>
                    </View>

                    <View style={{height: height - 140,}}>
                        <View style={{flex: 2}}>
                            <TouchableOpacity style={[{borderTopWidth: 1}, styles.touch]}
                                              onPress={() => {}}>
                                <Text style={styles.text}>免量折扣</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.touch}
                                              onPress={() => {}}>
                                <Text style={styles.text}>总量百分比折扣</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touch}
                                              onPress={() => {}}>
                                <Text style={styles.text}>积分</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touch}
                                              onPress={() => {}}>
                                <Text style={styles.text}>折扣券</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touch}
                                              onPress={() => {}}>
                                <Text style={styles.text}>本次折扣纵览</Text>
                            </TouchableOpacity>

                            <View style={{flex: 1}}/>
                        </View>
                    </View>
                </View>
            </ScrollView>)
    }
}


var styles = StyleSheet.create
({
    container:{
        flex:1
    }
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        sessionId: state.user.sessionId,
    })
)(OrderDiscount);

