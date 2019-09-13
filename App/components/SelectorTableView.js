import React from 'react';
import {View, Image, StyleSheet, TextInput, ViewPropTypes, Text, TouchableOpacity, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';

var uncheckedIcon = <Ionicons name={"md-square-outline"} size={18}/>;
var checkedIcon = <Ionicons name={"md-checkbox-outline"} size={18}/>;

export default class TableView extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    headerList: PropTypes.array,
    dataList: PropTypes.array,
    onItemSelected:PropTypes.func || null,
    renderAux: PropTypes.func || null,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIdx:-1,
    };
  }

  render() {

    const {title, headerList, dataList} = this.props;
    const {selectedIdx} = this.state;

    return (
        <ScrollView style={styles.container}>
          {this._renderTitle(title)}
          {this._renderHeader(headerList)}
          {this._renderInfoList(dataList, selectedIdx)}
          {this.props.renderAux?this.props.renderAux():null}
        </ScrollView>
    );
  }

  _renderTitle(title){
    return (
        title !== null?
        <View style={styles.titleWrapperStyle}>
        <Text style={styles.titleStyle}>{title}</Text>
        </View>:null
    );
  }

  _renderHeader(headerList){
    var headerItemList = [];
    headerList.map((headerItem,i)=>{
      headerItemList.push(<View style={styles.tableItemStyle}/>);
      headerItemList.push(
          <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{headerItem}</Text></View>
      )
    });
    return(
      <View style={styles.tableWrapperStyle}>{headerItemList}</View>
    );
  }

  _renderInfoList(dataList, selectedIdx){
    if(!dataList || dataList.length<=0) return;
    var dataListView = [];
    dataList.map((dataListItem,i)=>{
      const dataRow = dataListItem;
      var dataRowList = [];
      if(dataRow && dataRow.length>0){
        dataRowList.push(
            <TouchableOpacity
                style={styles.tableItemStyle}
                onPress={()=>{
                  this.setState({selectedIdx:i});
                  this.props.onItemSelected(i)}}
            >{selectedIdx === i?checkedIcon:uncheckedIcon}</TouchableOpacity>);

        dataRow.map((dataRowItem,i)=>{
          dataRowList.push(
            <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{dataRowItem}</Text></View>
          );
        });
        dataListView.push(
            <View style={styles.tableWrapperStyle}>{dataRowList}</View>
        );}});

    return dataListView;
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  titleWrapperStyle:{
    height:40,
    width:"100%",
    justifyContent: "center",
    alignItems: "center"
  },
  titleStyle:{
    fontSize:16,
  },
  tableWrapperStyle:{
    height:45,
    width:"100%",
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:10,
    borderBottomWidth:1,
    borderColor:'#888'
  },
  tableItemStyle:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    paddingVertical:10
  },
  headerItemTextStyle:{
    fontSize:14,
    color:'#333'
  },
  dataItemTextStyle:{
    fontSize:14,
    color:'#888'
  },
});
