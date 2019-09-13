
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
    TouchableOpacity,
    ListView,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import {MicrosoftMap} from "../../../components/rnMap/index";
import Config from "../../../../config";
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var proxy = require('../../../proxy/Proxy');

class MemberList extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            memberList:[],
            edgeList:[],
        };
    }

    componentDidMount(): void {
        this.getMemberList();
    }

    render() {

        const {edgeList,memberList } = this.state;

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
                <View style={{flex:1}}>
                    <MicrosoftMap edges={edgeList} merchants={memberList}/>
                    <View style={styles.listViewWrapper}>
                        <ListView
                            style={styles.listView}
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(memberList)}
                            renderRow={this.renderRow.bind(this)}/>
                    </View>
                </View>
            </View>
        )
    }

    renderRow(rowData) {
        var row =
            <TouchableOpacity onPress={() => {}}>
                <View style={{
                    flex: 1,height:50, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                    justifyContent: 'flex-start', backgroundColor: '#fff',width:width
                }}>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>{rowData.direccion}</Text>
                    </View>
                </View>
            </TouchableOpacity>;
        return row;
    };

    getMemberList(){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionMapInfo",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            if(json.re == 1){
                this.setState({memberList:json.data.memberList,edgeList:json.data.edgeList})
            }
        }).catch((err)=>{alert(err);});
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
    listViewWrapper:{
        width:width,
        height:height/3,
    },
    listView:{
        flex:1,
    },
    listItemStyle:{
        flex:1,
        borderBottomWidth: 0.8,
        borderColor: "#eee",
    },
});


module.exports = connect(state => ({
        unionId: state.user.unionId,
        username: state.user.username,
    })
)(MemberList);

