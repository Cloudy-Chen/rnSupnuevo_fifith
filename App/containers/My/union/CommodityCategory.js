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
    KeyboardAvoidingView, ListView, ActivityIndicator,
} from 'react-native';

import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectorTableView from "../../../components/SelectorTableView";
import {setSpText} from "../../../utils/ScreenUtil";
import Config from "../../../../config";
import {loginAction} from "../../../action/actionCreator";
import CodesModal from '../../../components/modal/CodesModal';
import RNCamera from "react-native-camera";

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../../proxy/Proxy');
var primaryGray = "#666";

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const merchantsHead = ["店数","商品数"];
const is_not_alive_icon = <Ionicons name={"md-radio-button-off"} size={25}/>;
const is_alive_icon = <Ionicons name={"md-checkmark-circle-outline"} size={25}/>;

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
            // 类列表
            priceClassList: [],
            // 扫码搜索
            goods: [],
            goodsList: [],
            wait: false,
            codesModalVisible: false,
            codigo: null,
            commodityId:null,
            camera: {},
            cameraModalVisible: false,
            openFlash: false,
            showProgress: false,
        };
    }

    componentDidMount(): void {
        // 获取联盟价格种类表
        this.getSupnuevoBuyerUnionPriceClassList();
    }

    render() {
        const {priceClassList, goodsList} = this.state;
        var openFlash = this.state.openFlash;

        var priceListView=
            goodsList ?
            <ScrollView>
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(goodsList)}
                    renderRow={this.renderRow.bind(this)}
                />
            </ScrollView>:null;

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
                        <SelectorTableView title={null} headerList={merchantsHead} dataList={priceClassList} renderAux={null}
                        onItemSelected={(idx)=>{this._onTableItemSelected(idx)}}
                        />
                    </View>
                    {this._renderSearchBar()}
                    <View style={{flex:2}}>
                    {priceListView}
                    </View>
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
                                this.state.goods.codeNum = data;
                                var goods = this.state.goods;
                                goods.codeNum = data;
                                setTimeout(() => this.queryGoodsCode(data), 1000)
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
                {/*进度条*/}
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.showProgress}
                    onRequestClose={() => {
                        this.setState({showProgress: false})
                    }}
                >
                    <View style={[styles.modalContainer, styles.modalBackgroundStyle]}>
                        <ActivityIndicator
                            animating={true}
                            style={[{height: 80}]}
                            size="large"
                            color="black"
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{color: '#000', fontSize: 22, alignItems: 'center'}}>
                                请求中。。。
                            </Text>
                        </View>
                    </View>
                </Modal>
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
                            <View style={{paddingTop: 5, flexDirection: 'row',alignItems:"flex-end",justifyContent:'flex-end'}}>
                                <View style={{borderWidth:1,padding:3,marginRight:10}}><Text style={{fontSize:18}}>disountPrice：{rowData.discountPrice}</Text></View>
                                {rowData.isAlive === true?is_alive_icon:is_not_alive_icon}
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

    _renderSearchBar(){
        return(
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
                                    this.state.goods.codeNum = codeNum;
                                    this.setState({goods: this.state.goods});
                                    this.queryGoodsCode(codeNum.toString());
                                }
                                else {
                                    if (codeNum !== undefined && codeNum !== null) {
                                        this.state.goods.codeNum = codeNum;
                                        this.setState({goods: this.state.goods});
                                    }
                                }
                            }}
                            value={this.state.goods.codeNum}
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
                                              if (this.state.goods.codeNum !== undefined && this.state.goods.codeNum !== null) {
                                                  var codeNum = this.state.goods.codeNum;
                                                  if (codeNum.toString().length >= 4 && codeNum.toString().length <= 13) {
                                                      this.queryGoodsCode(this.state.goods.codeNum.toString());
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
                                              this.setState({cameraModalVisible: true})
                                          }}>

                            <View>
                                <Text style={{color: '#fff', fontSize: setSpText(16)}}>扫码</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
            );
    }

    _onTableItemSelected(idx){
        // 选中表格某项
        var priceClassItem = this.state.priceClassList[idx];
        this.getSupnuevoBuyerUnionPriceListByPriceCount(priceClassItem[0]);
    }

    changeFlash() {
        this.setState({
            openFlash: !this.state.openFlash,
        });
    }

    closeCodesModal(val) {
        this.setState({codesModalVisible: val, goods: {}});
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    getSupnuevoBuyerUnionPriceClassList(){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionPriceClassList",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            if(json.re === 1){
                var dataList = json.data;
                this.setState({priceClassList:this._transformPriceClassToArray(dataList)})
            }
        }).catch((err)=>{alert(err);});
    }

    _transformPriceClassToArray(classList){
        var array = [];
        classList.map((classItem,i)=>{
            var item = [];
            item.push(classItem.priceCount);
            item.push(classItem.count);
            array.push(item);
        });
        return array;
    }

    getSupnuevoBuyerUnionPriceListByPriceCount(priceCount){
        this.setState({showProgress:true})
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionPriceListByPriceCount",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                priceCount:priceCount,
            }
        }).then((json)=> {
            if(json.re === 1){
                this.setState({showProgress:false})
                var goodsList = json.data;
                this.setState({goodsList: goodsList});
            }
        }).catch((err)=>{alert(err);});
    }

    queryGoodsCode(codeNum) {
        const {merchantId} = this.props;
        proxy.postes({
            url: Config.server + '/func/commodity/getQueryDataListByInputStringMobile',
            headers: {
                'Content-Type': 'application/json',
                //'Cookie': sessionId,
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
                this.reset();
                if (json.array !== undefined && json.array !== null && json.array.length > 0) {
                    var codes = json.array;
                    this.setState({codes: codes, codesModalVisible: true});
                }
                else {
                    var code = {codigo: json.object.codigo, commodityId: json.object.commodityId}
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
                codigo: codigo,
                commodityId: commodityId,
                unionId: this.props.unionId,
            }
        }).then((json) => {
            if(json.re === 1){
                var goodInfo = json.data;
                var goodsList = [];
                if (goodInfo.setSizeValue != undefined && goodInfo.setSizeValue != null
                    && goodInfo.sizeUnit != undefined && goodInfo.sizeUnit != null) {
                    goodInfo.nombre = goodInfo.nombre + ',' + goodInfo.setSizeValue + ',' + goodInfo.sizeUnit;
                }
                goodInfo.codeNum = codigo;
                goodsList.push(goodInfo);
                this.setState({goods: goodInfo, codigo: codigo, goodsList: goodsList});}
            else {return;}
        }).catch((e) => {
            this.setState({codesModalVisible: false});
        });
    }

    reset(){this.setState({commodityId:null,goods:{},goodsList:[]})}
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
        username: state.user.username,
        password: state.user.password,
        unionId: state.user.unionId,
        merchantId: state.user.merchantId,
    })
)(CommodityCategory);

