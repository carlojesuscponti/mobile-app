import React from "react";
import { StyleSheet, FlatList, View } from "react-native";

import ListItem from "./GridView";

const gridList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.collegeData}
      renderItem={info => (
        <ListItem
          collegeName={info.item.name.fullName}
          itemWidth={props.width}
          collegeImage={
            "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/collegeLogos/" +
            info.item.logo
          }
          onItemPressed={() => props.onItemSelected(info.item._id)}
        />
      )}
      numColumns={2}
      keyExtractor={item => item._id}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%"
  }
});

export default gridList;
