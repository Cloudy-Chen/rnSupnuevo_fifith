
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
    Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import InputWithCalendar from '../../../components/InputWithCalendar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TYPE_TEXT,InformationItem} from '../../../components/InformationItem'
import TableView from "../../../components/TableView";

var {height, width} = Dimensions.get('window');
const orderHead = ["商品名称","数量","价格","小计"];
const orderList=[
    ["Coca cola 1.5L","6","50.00","300.00"],
    ["Sanco leche 300ml","5","40.00","200.00"],
    ["Shampoo 1000ml","1","140.00","140.00"],
];

class UnionOrder extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            orderDate:'请输入订单日期',
        };
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {/* header bar */}

                <View style={{backgroundColor: '#387ef5', height: 55, padding: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                    <TouchableOpacity style={{flex: 1, height: 45, marginRight: 10, marginTop:10}}
                                      onPress={() => {this.goBack();}}>
                        <Icon name="angle-left" color="#fff" size={40}></Icon>
                    </TouchableOpacity>
                    <Text style={{fontSize: 22, marginTop:7,flex: 3, textAlign: 'center',color: '#fff'}}>
                        {this.props.username}
                    </Text>
                    <View style={{flex:1}}>
                    </View>
                </View>
                {/* body */}
                <ScrollView>
                    <View style={styles.scrollViewContanier}>
                        <InputWithCalendar
                            title={"日期"}
                            date={this.state.orderDate}
                            onDateChange={(value)=>{
                                this.setState({orderDate:value});
                            }}/>
                        <View style={styles.basicInfoContainer}>
                            <InformationItem key = {0} type = {TYPE_TEXT} title = "客户手机号码" content = "11549878988"/>
                            <InformationItem key = {1} type = {TYPE_TEXT} title = "送货地址" content = "san martin 2110 olivos bs.as"/>
                            <InformationItem key = {2} type = {TYPE_TEXT} title = "接货人电话" content = "114399892990"/>
                            <InformationItem key = {3} type = {TYPE_TEXT} title = "接货人" content = "Fermando laguna"/>
                        </View>
                        <View style={styles.tableInfoCard}>
                            <TableView title={"订单内容"} headerList={orderHead} dataList={orderList} renderAux={null}/>
                        </View>
                    </View>
                </ScrollView>

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
    scrollViewContanier:{
        alignItems: 'center',
        marginBottom: 100,
    },
    basicInfoContainer:{
        flex:1,
        width: width,
    },
    tableInfoCard:{
        width:width-40,
        flex:1,
        borderColor:"#666",
        borderWidth:1,
        borderRadius:10,
        marginTop: 10,
    },
});


module.exports = connect(state => ({

        username: state.user.username,

    })
)(UnionOrder);

