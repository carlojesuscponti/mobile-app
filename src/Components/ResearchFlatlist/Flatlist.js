import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ListItem from "./ListItem";

const flatList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.researchesData}
      renderItem={info => (
        <ListItem
          researchesName={info.item.title}
          researchesCollege={info.item.college}
          researchesCourse={info.item.course}
          onItemPressed={() => props.onItemSelected(info.item._id)}
        />
      )}
      keyExtractor={item => item._id}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%"
  }
});

export default flatList;
