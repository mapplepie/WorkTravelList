import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setTodos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => {
    setText(payload);
  };
  const saveToDos = async(toSave) => {
    try{
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }catch(e){
      console.log("couldnt save JSON");
    }
  };

  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setTodos(JSON.parse(s));
    }
    // payload.persist();
    // payload.stopPropagation();
    //({EventTarget: payload})=> onChangeText(payload)
  useEffect(() => {loadToDos(),[]})

  const addToDos = async() => {
    if(text === ""){
      return;
    }
      const newToDos = {...toDos, [Date.now()]: {text, working},};
    //   const newToDos = Object.assign({}, toDos, {[Date.now()]: {text, work: working},});
      console.log(newToDos);
      console.log(Object.keys(newToDos).map(key => newToDos[key]));
      setTodos(newToDos);
      console.log(toDos);
      console.log(toDos.text);
      await saveToDos(newToDos);
      setText("");
    };
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity> 
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color:!working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput 
      returnKeyType="done" 
      onSubmitEditing={addToDos}
      onChangeText={(text) => onChangeText(text)} 
      value={text}  
      placeholder={ working ? "Add a To Do" : "Your Destination"} style={styles.input}/>
      <ScrollView>
        {Object.keys(toDos).map((key) => toDos[key].working === working ? (
          <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>
              {toDos[key].text}
            </Text>
          </View>
        ): null)}
      </ScrollView>
      {/* <ScrollView>
        {toDos.map((key, index)=> (
          <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>({toDos[index].text})</Text>
          </View>
        ))}
      </ScrollView> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header:{
    justifyContent:"space-between",
    flexDirection:"row",
    marginTop: 100,
  },
  btnText:{
    fontSize: 38,
    fontWeight: "600",
    color:"white",
  },
  input:{
    backgroundColor:"white",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  toDo:{
    backgroundColor:theme.toDobg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal:40,
    borderRadius:15,
    marginTop:30,
  },
  toDoText:{
    color: "white", 
    fontSize:18,
    fontWeight:"500",
  }

});
