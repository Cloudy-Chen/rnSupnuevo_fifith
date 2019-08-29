
import React, {Component} from 'react';

import  {
    NetInfo,
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    TextInput,
    View,
    Alert,
    Modal,
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import {setSpText} from "../../../utils/ScreenUtil";
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');


class UnionRule extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            minPrice:32,
            maxPercent: 56.55,
            statement: "说明文字"
        };
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {/* header bar */}

                <View style={{
                    backgroundColor: '#387ef5',
                    height: 55,
                    padding: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <TouchableOpacity style={{flex: 1, height: 45, marginRight: 10, marginTop:10}}
                                      onPress={() => {
                                          this.goBack();
                                      }}>
                        <Icon name="angle-left" color="#fff" size={40}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 22, marginTop:7,flex: 3, textAlign: 'center',color: '#fff'}}>
                        Supnuevo(5.2)-{this.props.username}
                    </Text>
                    <View style={{flex:1}}>

                    </View>
                </View>
                {/* body */}
                <View style={{marginTop: 20,flex:1}}>
                    <View style={[{borderTopWidth: 1}, styles.touch]}>
                        <Text style={styles.text}>本店最低最终最小购买量为：</Text>
                        <Text style={[styles.text,{marginTop:20}]}>{this.state.minPrice} peso</Text>
                    </View>

                    <View style={[{borderTopWidth: 1}, styles.touch]}>
                        <Text style={styles.text}>本店折扣商品占总购买量的百分比为：</Text>
                        <Text style={[styles.text,{marginTop:20}]}>{this.state.maxPercent} %</Text>
                    </View>

                    <View style={[{borderTopWidth: 1}, styles.touch]}>
                        <Text style={styles.text}>本店其他关于购买及送货的文字说明为（西语）：</Text>
                        <View style={[{borderWidth: 1}, styles.textInput]}>
                        <Text style={styles.text}>{this.state.statement} </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}


var styles = StyleSheet.create({
    row: {
        height:65,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#aaa',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft:10
    },
    popoverText: {
        fontSize: 16
    },
    touch: {
        flex: 1,
        padding:5,
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent:'center',
        flexDirection: 'column',
        borderColor: '#DEDEDE',
    },
    text: {
        fontSize: setSpText(20),
        paddingLeft: 10,
        borderColor: '#DEDEDE',
        borderLeftWidth: 1,
        marginLeft:5,
    },
    textInput:{
        flex:1,
        width:width-20,
        margin:10,
        padding:10,
    }
});


module.exports = connect(state => ({

        username: state.user.username,

    })
)(UnionRule);

