
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
import Config from "../../../../config";
var proxy = require('../../../proxy/Proxy');

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
            orderList:[],
        };
    }

    componentDidMount(): void {
        this.getOrderListOfDate(null);
    }

    render() {

        const {orderList} = this.state;

        return (
            <View style={{flex: 1}}>
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
                                this.getOrderListOfDate(value);
                            }}/>
                        {this._renderOrderList(orderList)}
                    </View>
                </ScrollView>

            </View>
        )
    }

    _renderOrderList(orderList){
        let orderListView=[];
        if(orderList && orderList.length>0){
            orderList.map((order,i)=>{
                const telephone = order.telephone;
                const orderInfo = order.order;
                orderListView.push([
                    <View style={styles.basicInfoContainer}>
                        <InformationItem key = {0} type = {TYPE_TEXT} title = "客户手机号码" content = {telephone}/>
                        <InformationItem key = {1} type = {TYPE_TEXT} title = "送货地址" content = {orderInfo.receiverAddr}/>
                        <InformationItem key = {2} type = {TYPE_TEXT} title = "接货人电话" content = {orderInfo.receiverPhone}/>
                        <InformationItem key = {3} type = {TYPE_TEXT} title = "接货人" content = {orderInfo.receiverName}/>
                    </View>,
                    <View style={styles.tableInfoCard}>
                        <TableView title={"订单内容"} headerList={orderHead} dataList={this._transformOrderListToArray(orderInfo.itemList)} renderAux={null}/>
                    </View>]
                );
            })}
            return orderListView;
        }

    _transformOrderListToArray(itemList){
        var array=[];
        if(itemList && itemList.length>0){
        itemList.map((order,i)=>{
            //"商品名称","数量","价格","小计"
            var item = [];
            item.push(order.nombre);
            item.push(order.amount);
            item.push(order.price);
            item.push(order.total);
            array.push(item);
        })}
        return array;
    }

    getOrderListOfDate(orderDate){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoCustomerOrderListOfDateByUnion",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                orderDate: orderDate,
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            if(json.re === 1){
                var data = json.data;
                this.setState({orderList:data})
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
        unionId: state.user.unionId,
        username: state.user.username,

    })
)(UnionOrder);

