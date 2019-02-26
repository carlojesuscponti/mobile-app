import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ListItem from "./ListItem";

const flatList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.collegeData}
      renderItem={info => (
        <ListItem
          collegeName={info.item.name.fullName}
          collegeImage={
            "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/collegeLogos/" +
            info.item.logo
          }
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

/*

 

      {props.collegeInfo.colleges.map(({ college }) => (
        <View>
          <Text>{college._id}</Text>
        </View>
      ))}
      
       {this.props.CollegeData.map(({ id, collegeName, logo }) => (
          <View key={id}>
            <Text>{collegeName}</Text>
            <Image source={logo} style={{ width: 100, height: 100 }} />
          </View>
        ))}

      <FlatList
        style={styles.listContainer}
        data={props.collegeInfo}
        renderItem={info => (
          <ListItem
            collegeName={info.item.name.initials}
            collegeImage={info.item.logo}
            onItemPressed={() =>
              props.onItemSelected(info.item.key, info.item.collegeName)
            }
          />
        )}
      />
      
    <FlatList
      style={styles.listContainer}
      data={props.collegeInfo}
      renderItem={info => (
        <ListItem
          collegeName={info.item.name}
          collegeImage={info.item.image}
          onItemPressed={() =>
            props.onItemSelected(info.item.key, info.item.name)
          }
        />
      )}
    />
*/
