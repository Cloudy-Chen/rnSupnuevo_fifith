
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
import InputWithCalendar from '../../../components/InputWithCalendar';
import Config from "../../../../config";
import {loginAction} from "../../../action/actionCreator";
import CodesModal from '../../../components/modal/CodesModal';
import RNCamera from "react-native-camera";

const Dimensions = require('Dimensions');
const {height, width} = Dimensions.get('window');
const dropdownWidth = width * 2/3;
const dropdownIcon = <Ionicons name={'md-arrow-dropdown'} size={22}/>;
const dropupIcon = <Ionicons name={'md-arrow-dropup'} size={22}/>;

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var proxy = require('../../../proxy/Proxy');

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
            commodityDiscountList:[],
            discountName:'折扣名称',
            discountId:null,
            startDate:null,
            endData:null,
            baseCommodityList: [],
            auxCommodityList: [],

            // 扫码搜索
            searchIdx:1,

            goods1: {},
            goodsList1: [],
            codigo1: null,
            commodityId1: null,
            amount1: null,

            goods2: {},
            goodsList2: [],
            codigo2:null,
            commodityId2:null,
            amount2:null,
            price2:null,

            wait: false,
            codesModalVisible: false,
            camera: {},
            cameraModalVisible: false,
            openFlash: false,
            showProgress: false,
        }
    }

    componentDidMount(): void {
        this.getSupnuevoBuyerUnionCommodityDiscountList();
    }

    render() {
        var {openFlash, searchIdx} = this.state;

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

                    {/*条码*/}
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.codesModalVisible}
                        onRequestClose={() => {
                            this.setState({codesModalVisible: false})
                        }}>
                        <CodesModal
                            onClose={() => {
                                this.closeCodesModal(!this.state.codesModalVisible)
                            }}
                            onCodigoSelect={
                                (code) => {
                                    this.onCodigoSelect(code);
                                }}
                            codes={this.state.codes}
                        />
                    </Modal>
                    {/*相机*/}
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.cameraModalVisible}
                        onRequestClose={() => {
                            this.closeCamera()
                        }}
                    >
                        <RNCamera
                            ref={(cam) => {
                                this.camera = cam;
                            }}
                            style={styles.preview}
                            permissionDialogTitle={'Permission to use camera'}
                            permissionDialogMessage={'We need your permission to use your camera phone'}
                            torchMode={openFlash ? RNCamera.constants.TorchMode.on:RNCamera.constants.TorchMode.off}
                            onBarCodeRead={(barcode) => {
                                this.closeCamera();
                                var {type, data, bounds} = barcode;
                                if (data !== undefined && data !== null) {
                                    console.log('barcode data=' + data + 'barcode type=' + type);
                                    if(searchIdx == 1) {
                                        this.state.goods1.codeNum = data;
                                        var goods = this.state.goods1;
                                        goods.codeNum = data;
                                        setTimeout(() => this.queryGoodsCode(data), 1000)
                                    }else{
                                        this.state.goods2.codeNum = data;
                                        var goods = this.state.goods2;
                                        goods.codeNum = data;
                                        setTimeout(() => this.queryGoodsCode(data), 1000)
                                    }
                                }
                            }}
                        />
                        <View style={[styles.box]}>
                        </View>
                        <View style={{
                            position: 'absolute',
                            right: 1 / 2 * width - 100,
                            top: 1 / 2 * height,
                            height: 100,
                            width: 200,
                            borderTopWidth: 1,
                            borderColor: '#e42112',
                            backgroundColor: 'transparent'
                        }}>
                        </View>
                        <View style={[styles.overlay, styles.bottomOverlay]}>

                            <TouchableOpacity
                                onPress={() => {
                                    this.changeFlash()
                                }}
                            >
                                <Icon name="flash" size={30} color="#fff"/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.captureButton,{marginTop:20}]}
                                onPress={() => {
                                    this.closeCamera()
                                }}
                            >
                                <Icon name="times-circle" size={50} color="#343434"/>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </ScrollView>)
    }

    _renderDiscountSelector(){

        const {isDropDown, discountName} = this.state;

        return(
            <View style={{flex:1,flexDirection:'column'}}>
                <View style={{flexDirection:'row', padding:10}}>
                    <TouchableOpacity
                        style={{borderWidth:1,padding:3,paddingHorizontal:8,borderRadius:3,backgroundColor:'#8bb3f4'}}
                        onPress={()=>{
                            this.setSupnuevoBuyerUnionCommodityDiscountIsAlive();
                        }}
                        ><Text>启用</Text></TouchableOpacity>
                    <TouchableOpacity
                        style={{borderWidth:1,padding:3,paddingHorizontal:8,borderRadius:3,backgroundColor:'#8bb3f4',marginLeft:10}}
                        onPress={()=>{
                            this.saveOrUpdateSupnuevoBuyerUnionCommodityDiscount();
                        }}><Text>提交</Text></TouchableOpacity>
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
                            <View style={{flex:1}}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    onChangeText={(value) => {this.setState({discountName:value})}}
                                    value={this.state.discountName}
                                    placeholder='折扣名称'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                            {isDropDown?dropupIcon:dropdownIcon}
                        </View>
                    </ModalDropdown>
                    <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:1,paddingHorizontal:10}}>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            borderRadius: 4,
                            backgroundColor: '#8bb3f4'
                        }} onPress={() => {this.addSupnuevoBuyerUnionCommodityDiscount()}}>
                            <Text style={{padding: 5, color: '#fff', fontSize: setSpText(22)}}>+</Text>
                        </TouchableOpacity>
                    </View>

                        <View style={{flex:1,paddingHorizontal:10}}>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            borderRadius: 4,
                            backgroundColor: '#8bb3f4'
                        }} onPress={() => {this.deleteSupnuevoBuyerUnionCommodityDiscount()}}>
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
            <View style={{flex:1}}>
                <InputWithCalendar
                    title={"开始日期"}
                    date={this.state.startDate}
                    onDateChange={(value)=>{
                        this.setState({startDate:value});
                    }}/>
                <InputWithCalendar
                    title={"结束日期"}
                    date={this.state.endDate}
                    onDateChange={(value)=>{
                        this.setState({endDate:value});
                    }}/>
            </View>
        );
    }

    _renderBaseCommodity(){

        const {goodsList1} = this.state;

        let baseCommodityListView =
            goodsList1 ?
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(goodsList1)}
                        renderRow={this.renderBaseCommodityRow.bind(this)}
                    />
                </ScrollView>:null;

        return(
            <View style={{flex:3,height:200}}>
                <View style={{padding: 10}}>
                    <View style={[styles.row, {borderBottomWidth: 0}]}>

                        <View style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: '#ddd',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <TextInput
                                style={{
                                    flex: 8,
                                    height: 50,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    paddingTop: 6,
                                    paddingBottom: 6
                                }}
                                onChangeText={(codeNum) => {
                                    if (codeNum.toString().length == 13 || codeNum.toString().length == 12 || codeNum.toString().length == 8) {
                                        this.state.goods1.codeNum = codeNum;
                                        this.setState({goods1: this.state.goods1});
                                        //this.queryGoodsCode(codeNum.toString());
                                    }
                                    else {
                                        if (codeNum !== undefined && codeNum !== null) {
                                            this.state.goods1.codeNum = codeNum;
                                            this.setState({goods1: this.state.goods1});
                                        }
                                    }
                                }}
                                value={this.state.goods1.codeNum}
                                keyboardType="numeric"
                                placeholder='请输入商品条码尾数'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />

                            <TouchableOpacity style={{
                                flex: 2,
                                height: 40,
                                marginRight: 10,
                                paddingTop: 6,
                                paddingBottom: 6,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 0,
                                borderRadius: 4,
                                backgroundColor: 'rgba(17, 17, 17, 0.6)'
                            }}
                                              onPress={() => {
                                                  if (this.state.goods1.codeNum !== undefined && this.state.goods1.codeNum !== null) {
                                                      var codeNum = this.state.goods1.codeNum;
                                                      if (codeNum.toString().length >= 4 && codeNum.toString().length <= 13) {
                                                          this.setState({searchIdx:1});
                                                          this.queryGoodsCode(this.state.goods1.codeNum.toString());
                                                      }
                                                      else {
                                                          Alert.alert(
                                                              '提示信息',
                                                              '请输入4-13位的商品条码进行查询',
                                                              [
                                                                  {
                                                                      text: 'OK',
                                                                      onPress: () => console.log('OK Pressed!')
                                                                  },
                                                              ]
                                                          )
                                                      }
                                                  }
                                                  else {
                                                      Alert.alert(
                                                          '提示信息',
                                                          '请输入4-13位的商品条码进行查询',
                                                          [
                                                              {
                                                                  text: 'OK',
                                                                  onPress: () => console.log('OK Pressed!')
                                                              },
                                                          ]
                                                      )
                                                  }

                                              }}>

                                <Text style={{color: '#fff', fontSize: setSpText(16)}}>查询</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                flex: 2,
                                height: 40,
                                marginRight: 10,
                                paddingTop: 6,
                                paddingBottom: 6,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 0,
                                borderRadius: 4,
                                backgroundColor: 'rgba(17, 17, 17, 0.6)'
                            }}
                                              onPress={() => {
                                                  this.setState({cameraModalVisible: true,searchIdx:1})
                                              }}>

                                <View>
                                    <Text style={{color: '#fff', fontSize: setSpText(16)}}>扫码</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
                <View style={{flex:2}}>
                    {baseCommodityListView}
                </View>
            </View>
        );
    }

    _renderAuxCommodity(){

        const {goodsList2} = this.state;

        let auxCommodityListView =
            goodsList2 ?
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(goodsList2)}
                        renderRow={this.renderAuxCommodityRow.bind(this)}
                    />
                </ScrollView>:null;

        return(
            <View style={{flex:3,height:200}}>
                <View style={{padding: 10}}>
                    <View style={[styles.row, {borderBottomWidth: 0}]}>

                        <View style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: '#ddd',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <TextInput
                                style={{
                                    flex: 8,
                                    height: 50,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    paddingTop: 6,
                                    paddingBottom: 6
                                }}
                                onChangeText={(codeNum) => {
                                    if (codeNum.toString().length == 13 || codeNum.toString().length == 12 || codeNum.toString().length == 8) {
                                        this.state.goods2.codeNum = codeNum;
                                        this.setState({goods2: this.state.goods2});
                                        //this.queryGoodsCode(codeNum.toString());
                                    }
                                    else {
                                        if (codeNum !== undefined && codeNum !== null) {
                                            this.state.goods2.codeNum = codeNum;
                                            this.setState({goods2: this.state.goods2});
                                        }
                                    }
                                }}
                                value={this.state.goods2.codeNum}
                                keyboardType="numeric"
                                placeholder='请输入商品条码尾数'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />

                            <TouchableOpacity style={{
                                flex: 2,
                                height: 40,
                                marginRight: 10,
                                paddingTop: 6,
                                paddingBottom: 6,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 0,
                                borderRadius: 4,
                                backgroundColor: 'rgba(17, 17, 17, 0.6)'
                            }}
                                              onPress={() => {
                                                  if (this.state.goods2.codeNum !== undefined && this.state.goods2.codeNum !== null) {
                                                      var codeNum = this.state.goods2.codeNum;
                                                      if (codeNum.toString().length >= 4 && codeNum.toString().length <= 13) {
                                                          this.setState({searchIdx:2});
                                                          this.queryGoodsCode(this.state.goods2.codeNum.toString());
                                                      }
                                                      else {
                                                          Alert.alert(
                                                              '提示信息',
                                                              '请输入4-13位的商品条码进行查询',
                                                              [
                                                                  {
                                                                      text: 'OK',
                                                                      onPress: () => console.log('OK Pressed!')
                                                                  },
                                                              ]
                                                          )
                                                      }
                                                  }
                                                  else {
                                                      Alert.alert(
                                                          '提示信息',
                                                          '请输入4-13位的商品条码进行查询',
                                                          [
                                                              {
                                                                  text: 'OK',
                                                                  onPress: () => console.log('OK Pressed!')
                                                              },
                                                          ]
                                                      )
                                                  }

                                              }}>

                                <Text style={{color: '#fff', fontSize: setSpText(16)}}>查询</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                flex: 2,
                                height: 40,
                                marginRight: 10,
                                paddingTop: 6,
                                paddingBottom: 6,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 0,
                                borderRadius: 4,
                                backgroundColor: 'rgba(17, 17, 17, 0.6)'
                            }}
                                              onPress={() => {
                                                  this.setState({cameraModalVisible: true,searchIdx:2})
                                              }}>

                                <View>
                                    <Text style={{color: '#fff', fontSize: setSpText(16)}}>扫码</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
                <View style={{flex:2}}>
                    {auxCommodityListView}
                </View>
            </View>
        );
    }

    renderBaseCommodityRow(rowData) {
        var row =
            <TouchableOpacity onPress={() => {}}>
                <View style={{
                    flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                    justifyContent: 'flex-start', backgroundColor: '#fff',width:width
                }}>
                    <View style={{paddingTop: 5, flexDirection: 'row',alignItems:"flex-end",justifyContent:'flex-end'}}>
                        <View style={{borderWidth:1,padding:3,marginRight:10}}><Text style={{fontSize:18}}>amount：{rowData.amount}</Text></View>

                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.renderText}>codigo：</Text>
                        <Text style={styles.renderText}>{rowData.codigo}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.renderText}>descripcion：</Text>
                        <Text style={styles.renderText}>{rowData.nombre}</Text>
                    </View>
                </View>
            </TouchableOpacity>;
        return row;
    }

    renderAuxCommodityRow(rowData) {
        var row =
            <TouchableOpacity onPress={() => {}}>
                <View style={{
                    flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                    justifyContent: 'flex-start', backgroundColor: '#fff',width:width
                }}>
                    <View style={{paddingTop: 5, flexDirection: 'row',alignItems:"flex-end",justifyContent:'flex-end'}}>
                        <View style={{borderWidth:1,padding:3,marginRight:10}}><Text style={{fontSize:18}}>discountAmount：{rowData.discountAmount}</Text></View>
                        <View style={{borderWidth:1,padding:3,marginRight:10}}><Text style={{fontSize:18}}>discountPrice：{rowData.discountPrice}</Text></View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.renderText}>codigo：</Text>
                        <Text style={styles.renderText}>{rowData.codigo}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.renderText}>descripcion：</Text>
                        <Text style={styles.renderText}>{rowData.nombre}</Text>
                    </View>
                </View>
            </TouchableOpacity>;
        return row;
    }

    dropdown_renderRow(rowData, rowID, highlighted){
        return (
            <TouchableOpacity >
                <View style={[styles.dropdown_row]}>
                    <Text style={[styles.dropdown_row_text, highlighted && {color: 'mediumaquamarine'}]}>
                        {rowData.discountName}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    dropdown_onSelect(idx, value){
        this.setState({discountName:value.discountName,discountId:value.discountId});
        this.getSupnuevoBuyerUnionCommodityDiscountListByDiscountId(value.discountId);
    }

    queryGoodsCode(codeNum) {
        const {merchantId} = this.props;
        proxy.postes({
            url: Config.server + '/func/commodity/getQueryDataListByInputStringMobile',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                codigo: codeNum,
                merchantId: merchantId
            }
        }).then((json) => {

            if(json.re == -2){
                this.props.dispatch(loginAction(username, password))
            }

            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                //this.reset();
                if (json.array !== undefined && json.array !== null && json.array.length > 0) {
                    var codes = json.array;
                    this.setState({codes: codes, codesModalVisible: true});
                }
                else {
                    var code = {codigo: json.object.codigo, commodityId: json.object.commodityId};
                    this.onCodigoSelect(code);
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    onCodigoSelect(code) {
        var {codigo, commodityId} = code;

        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionPriceByCommodityId",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                commodityId: commodityId,
                unionId: this.props.unionId,
            }
        }).then((json) => {
            if(json.re === 1){
                if(json.data == null){
                    if(this.state.searchIdx === 1)this.resetGoods1();
                    else this.resetGoods2();
                    return;
                }

                var goodInfo = json.data;
                var goodsList = [];
                if (goodInfo.setSizeValue != undefined && goodInfo.setSizeValue != null
                    && goodInfo.sizeUnit != undefined && goodInfo.sizeUnit != null) {
                    goodInfo.nombre = goodInfo.nombre + ',' + goodInfo.setSizeValue + ',' + goodInfo.sizeUnit;
                }
                goodInfo.codeNum = codigo;
                goodsList.push(goodInfo);
                if(this.state.searchIdx === 1)
                    this.setState({goods1: goodInfo, codigo1: codigo, goodsList1: goodsList, commodityId1:commodityId});
                else
                    this.setState({goods2: goodInfo, codigo2: codigo, goodsList2: goodsList, commodityId2:commodityId});
            }
            else {this.resetGoods1();this.resetGoods2();}
        }).catch((e) => {
            this.setState({codesModalVisible: false});
        });
    }

    resetGoods1(){this.setState({commodityId1:null,goods1:{},goodsList1:[]})}

    resetGoods2(){this.setState({commodityId2:null,goods2:{},goodsList2:[]})}

    changeFlash() {
        this.setState({
            openFlash: !this.state.openFlash,
        });
    }

    closeCodesModal(val) {
        this.setState({codesModalVisible: val, goods1: {},goods2: {}});
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    getSupnuevoBuyerUnionCommodityDiscountList(){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionCommodityDiscountList",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            if(json.re === 1){
                var dataList = json.data;
                this.setState({commodityDiscountList:dataList})
            }
        }).catch((err)=>{alert(err);});
    }

    saveOrUpdateSupnuevoBuyerUnionCommodityDiscount(){
        proxy.postes({
            url: Config.server + "/func/union/saveOrUpdateSupnuevoBuyerUnionCommodityDiscount",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                discountId: this.state.discountId,
                commodityId: this.state.commodityId1,
                discountCommodityId: this.state.commodityId2,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
            }
        }).then((json)=> {
            if(json.re === 1){
                alert('success');
            }
        }).catch((err)=>{alert(err);});
    }

    setSupnuevoBuyerUnionCommodityDiscountIsAlive(){
        proxy.postes({
            url: Config.server + "/func/union/setSupnuevoBuyerUnionCommodityDiscountIsAlive",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                discountId: this.state.discountId,
                isAlive: 1,
            }
        }).then((json)=> {
            if(json.re === 1){
                alert('success');
            }
        }).catch((err)=>{alert(err);});
    }

    addSupnuevoBuyerUnionCommodityDiscount(){
        proxy.postes({
            url: Config.server + "/func/union/addSupnuevoBuyerUnionCommodityDiscount",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                discountName: this.state.discountName,
            }
        }).then((json)=> {
            if(json.re === 1){
                alert("add success");
                this.getSupnuevoBuyerUnionCommodityDiscountList();
            }
        }).catch((err)=>{alert(err);});
    }

    deleteSupnuevoBuyerUnionCommodityDiscount(){
        proxy.postes({
            url: Config.server + "/func/union/deleteSupnuevoBuyerUnionCommodityDiscount",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                discountId: this.state.discountId,
            }
        }).then((json)=> {
            if(json.re === 1){
                alert("add success");
                this.getSupnuevoBuyerUnionCommodityDiscountList();
            }
        }).catch((err)=>{alert(err);});
    }

    // 获取某个折扣信息
    getSupnuevoBuyerUnionCommodityDiscountListByDiscountId(discountId){
        // 获取某个折扣信息
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionCommodityDiscountListByDiscountId",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                discountId: discountId,
            }
        }).then((json)=> {
            if(json.re === 1){
                const {discount,commodity,discountCommodity} = json.data;
                var goodsList1 = [];goodsList1.push(commodity);
                var goodsList2 = [];goodsList2.push(discountCommodity);
                this.setState({discountId:discount.discountId,startDate:discount.startDate,endDate:discount.endDate,
                goodsList1:goodsList1,goodsList2:goodsList2})
            }
        }).catch((err)=>{alert(err);});
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
    textInputStyle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
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
    renderText: {
        fontSize: setSpText(18),
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        height: 50,
        width: width,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
    },
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        sessionId: state.user.sessionId,
        unionId: state.user.unionId,
    })
)(CommodityDiscount);

