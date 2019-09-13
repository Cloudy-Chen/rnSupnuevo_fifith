
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';

const Dimensions = require('Dimensions');
const {height, width} = Dimensions.get('window');
const dropdownIcon = <Ionicons name={'md-arrow-dropdown'} size={22}/>;
const dropupIcon = <Ionicons name={'md-arrow-dropup'} size={22}/>;
const dropdownWidth = width * 2/3;

class CommodityDiscount extends Component {
    cancel() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            showDropDown:false,
            commodityDiscountList:["折扣1","折扣2","折扣3"],
            discountName:'折扣名称',
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

                        <View style={{flex: 1}}>
                            {this._renderDiscountSelector()}
                            {this._renderDateSelector()}
                            {this._renderBaseCommodity()}
                            {this._renderAuxCommodity()}
                        </View>
                </View>
            </ScrollView>)
    }

    _renderDiscountSelector(){

        const {isDropDown, discountName} = this.state;

        return(
            <View style={{flex:1,flexDirection:'column'}}>
                <View style={{flexDirection:'row', padding:10}}>
                    <TouchableOpacity style={{borderWidth:1,padding:3,paddingHorizontal:8,borderRadius:3,backgroundColor:'#8bb3f4'}}><Text>启用</Text></TouchableOpacity>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:18}}>{discountName}</Text></View>
                </View>

                <View style={{flexDirection:'row',marginLeft:10}}>
                    <ModalDropdown
                        style={styles.cell}
                        textStyle={styles.textstyle}
                        dropdownStyle={styles.dropdownstyle}
                        options={this.state.commodityDiscountList}
                        renderRow={this.dropdown_renderRow.bind(this)}
                        onSelect={(idx, value) => this.dropdown_onSelect(idx, value)}
                    >
                        <View style={styles.viewcell}>
                            <View style={{flex:1}}><Text style={styles.textstyle}>{this.state.discountName}</Text></View>
                            {isDropDown?dropupIcon:dropdownIcon}
                        </View>
                    </ModalDropdown>
                    <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:1,paddingHorizontal:10}}>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            borderRadius: 4,
                            backgroundColor: '#8bb3f4'
                        }} onPress={() => {}}>
                            <Text style={{padding: 5, color: '#fff', fontSize: setSpText(22)}}>+</Text>
                        </TouchableOpacity>
                    </View>

                        <View style={{flex:1,paddingHorizontal:10}}>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            borderRadius: 4,
                            backgroundColor: '#8bb3f4'
                        }} onPress={() => {}}>
                            <Text style={{padding: 5, color: '#fff', fontSize: setSpText(22)}}>-</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
            </View>
        );
    }

    _renderDateSelector(){
        return(
            <View style={{flex:2}}>

            </View>
        );
    }

    _renderBaseCommodity(){
        return(
            <View style={{flex:3}}>

            </View>
        );
    }

    _renderAuxCommodity(){
        return(
            <View style={{flex:3}}>

            </View>
        );
    }

    dropdown_renderRow(rowData, rowID, highlighted){
        return (
            <TouchableOpacity >
                <View style={[styles.dropdown_row]}>
                    <Text style={[styles.dropdown_row_text, highlighted && {color: 'mediumaquamarine'}]}>
                        {rowData}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    dropdown_onSelect(idx, value){
        this.setState({discountName:value});
    }
}


var styles = StyleSheet.create
({
    text: {
        fontSize: setSpText(20),
        paddingLeft: 10,
        borderColor: '#DEDEDE',
        borderLeftWidth: 1,
        marginLeft:5,
    },
    touch: {
        flex: 1,
        marginRight: 10,
        marginLeft: 10,
        borderBottomWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#DEDEDE',
    },
    card: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    box: {
        position: 'absolute',
        right: 1 / 2 * width - 100,
        top: 1 / 2 * height - 100,
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#387ef5',
        backgroundColor: 'transparent'

    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },
    textstyle: {
        fontSize: 13,
        textAlign: 'center',
        color:'#646464',
        justifyContent:'center',
    },
    dropdownstyle: {
        height: 150,
        width:dropdownWidth,
        borderColor: '#cdcdcd',
        borderWidth: 0.7,
    },
    dropdown_row: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    dropdown_row_text: {
        fontSize: 13,
        color: '#646464',
        textAlignVertical: 'center',
        justifyContent:'center',
        marginLeft: 5,
    },
    dropdown_image: {
        width: 20,
        height: 20,
    },
    viewCell: {
        height: 50,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    viewcell: {
        width:dropdownWidth,
        borderWidth:1,
        paddingHorizontal:5,
        alignItems:'center',
        height:35,
        justifyContent:'center',
        flexDirection:'row',
    },
    cell: {
        width:dropdownWidth,
        alignItems:'center',
        flexDirection:'row',
        height:35,
        borderRightColor:'#cdcdcd',
        borderRightWidth:0.7,

    },
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        sessionId: state.user.sessionId,
    })
)(CommodityDiscount);

