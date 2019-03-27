import React from "react";
import { StyleSheet, FlatList } from "react-native";
import ListItem from "./ListItem";

const flatList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.journalsData}
      renderItem={info => (
        <ListItem
          journalName={info.item.title}
          status={parseInt(info.item.deleted)}
          hidden={parseInt(info.item.hidden)}
          journalCollege={info.item.college}
          journalCourse={info.item.course}
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
