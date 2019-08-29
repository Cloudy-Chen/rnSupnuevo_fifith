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
    View,
    Alert,
    Modal,
    TouchableOpacity, ListView
} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import goods from "../../../test/goods";
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');

var advertisements = [{url:""},{url:""},{url:""},{url:""},{url:""},{url:""},]

class PricePublicity extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        var advertisementListView=
            <ScrollView>
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(advertisements)}
                    renderRow={this.renderRow.bind(this)}
                />
            </ScrollView>;
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
                    <TouchableOpacity style={{
                        flex: 1,
                        height: 45,
                        marginRight: 10,
                        marginTop:10
                    }}
                                      onPress={() => {
                                          this.goBack();
                                      }}>
                        <Icon name="angle-left" color="#fff" size={40}></Icon>
                    </TouchableOpacity>
                    <Text style={{fontSize: 22, marginTop:7,flex: 3, textAlign: 'center',color: '#fff'}}>
                        {this.props.username}
                    </Text>
                    <View style={{flex:1}}>

                    </View>
                </View>
                {/* body */}
                <View style={{padding: 10, marginTop: 20}}>
                    {advertisementListView}
                </View>
            </View>
        )
    }

    renderRow(rowData) {

        const image = rowData.url?{uri:rowData.url}:require('../../../img/img_logo.png');

        var row =
            <TouchableOpacity onPress={() => {}}>
                <View style={{
                    flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                    justifyContent: 'flex-start', backgroundColor: '#fff',width:width
                }}>
                    <Image source={image} resizeMode={"contain"} style={styles.image}/>
                </View>
            </TouchableOpacity>;
        return row;
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
    image:{
        width: width,
        height: 100,
    },
});


module.exports = connect(state => ({

        username: state.user.username,

    })
)(PricePublicity);

