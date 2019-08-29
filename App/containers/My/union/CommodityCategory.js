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
    TouchableOpacity,
    KeyboardAvoidingView, ListView,
} from 'react-native';

import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import goods from "../../../test/goods";
import TableView from "../../../components/TableView";
import AISearchBar from "../../../components/AISearchBar";
import {SwipeRow} from "react-native-swipe-list-view";
import {setSpText} from "../../../utils/ScreenUtil";

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var primaryGray = "#666";

const merchantsHead = ["","店数","商品数"];
const merchantsOfGood=[
    ["","14","1420"],
    ["","13","1890"],
    ["","12","2489"],
    ["","11","3456"],
];

class CommodityCategory extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchResult: [],
            selectedPrice: null,
            isSearchStatus: false,
        };
    }

    render() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        var priceListView=
            <ScrollView>
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(goods)}
                    renderRow={this.renderRow.bind(this)}
                />
            </ScrollView>;

        return (
            <View style={{flex: 1,alignItems:"center",justifyContents:'center'}}>
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
                        Supnuevo(5.2)-{this.props.username}
                    </Text>
                    <View style={{flex:1}}>

                    </View>
                </View>
                {/* body */}
                <View style={{padding:3,justifyContent:'center',alignItems:'center'}}>
                    <View style={styles.tableInfoCard}>
                        <TableView title={null} headerList={merchantsHead} dataList={merchantsOfGood} renderAux={null}/>
                    </View>
                    <AISearchBar
                        _onMicrophonePress={this._onMicrophonePress}
                        _searchTextChange={(text) => this._searchTextChange(text)}
                        _onSearchPress={this._onSearchPress}
                        searchResult={this.state.searchResult}
                        searchText={this.state.searchText}
                    />
                    <View style={{flex:2}}>
                    {priceListView}
                    </View>
                </View>
            </View>
        )
    }

    renderRow(rowData) {
            var row =
                    <TouchableOpacity onPress={() => {}}>
                        <View style={{
                            flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                            justifyContent: 'flex-start', backgroundColor: '#fff',width:width
                        }}>

                            <View style={{paddingTop: 5, flexDirection: 'row'}}>
                                <Text style={styles.renderText}>codigo：</Text>
                                <Text style={styles.renderText}>{rowData.codigo}</Text>
                            </View>
                            <View style={{paddingTop: 5, flexDirection: 'row'}}>
                                <Text style={styles.renderText}>descripcion：</Text>
                                <Text style={styles.renderText}>{rowData.name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>;
        return row;
    }

    _onMicrophonePress = () => {
    };

    _searchTextChange = (text) => {
        this.setState({searchText: text});
        if (!text) {
            this._clearSearchInput()
            return;
        }
    };

    _clearSearchInput = () => this.setState({searchText: ''})

    _onSearchPress = () => {
        this.setState({isSearchStatus: true});
    };
}


var styles = StyleSheet.create({
    tableInfoCard:{
        width:width-40,
        flex:1,
        borderColor:primaryGray,
        borderWidth:1,
        borderRadius:10,
        marginTop: 10,
    },
    renderText: {
        fontSize: setSpText(18),
        alignItems: 'center'
    },
});


module.exports = connect(state => ({
        username: state.user.username,
    })
)(CommodityCategory);

