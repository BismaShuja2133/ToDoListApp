import React, { useState, useEffect } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Task from './components/Task';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function App() {
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('taskItems');
      if (savedTasks !== null) {
        setTaskItems(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks from AsyncStorage:', error);
    }
  };

  const addNewTask = async () => {
    if (task) {
      const newTaskItems = [...taskItems, task];
      setTaskItems(newTaskItems);
      setTask(null);
      try {
        await AsyncStorage.setItem('taskItems', JSON.stringify(newTaskItems));
      } catch (error) {
        console.error('Error saving tasks to AsyncStorage:', error);
      }
      Keyboard.dismiss();
    }
  };

  const completeTask = async (index) => {
    let copy = [...taskItems];
    copy.splice(index, 1);
    setTaskItems(copy);

    try {
      await AsyncStorage.setItem('taskItems', JSON.stringify(copy));
    } catch (error) {
      console.error('Error saving tasks to AsyncStorage:', error);
    }
  };

  const currentDate = format(new Date(), 'MMMM d, yyyy');

  return (
    <KeyboardAvoidingView behavior="" style={styles.container}>

      {/* content */}
      <View>
        <View style={{ ...styles.header }} />
        <Text style={styles.taskTitle}>Tasks for {currentDate}</Text>
      </View>

      <FlatList style={styles.tasks} 
        data={taskItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
            <Task text={item} index={index} onComplete={() => completeTask(index)} />
        )}
        ListEmptyComponent={
          <Text style={styles.noTasks}>Great Job! No tasks Due</Text>
        }
      />

      {/* footer */}
      <View style={styles.inputContainer} >
        <TextInput
          style={styles.input}
          placeholder='Write a task'
          value={task}
          onChangeText={text => setTask(text)} />
        <TouchableOpacity style={styles.addNewTask} onPress={() => addNewTask()} >
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003566',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  header: {
    height: 80,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginHorizontal: 12,
    // position: 'fixed',
  },
  addNewTask: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#e63946",
    borderRadius: 25,
  },
  taskWrapper: {
    paddingTop: 90,
    paddingHorizontal: 20,
  },
  taskTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: "#FEFBEA",

  },
  tasks: {
    flex:1,
    width: '100%'
  },
  input: {
    padding: 12,
    backgroundColor: '#FEFBEA',
    // width: 270,
    width:"81%",
    borderRadius: 25,
  },
  addText: {
    width: 53,
    height: 53,
    fontSize: 25,
    color: "white",
    fontWeight: 'bold',
    paddingLeft: 19,
    paddingTop: 7,
  },
  noTasks: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 20,
    backgroundColor: '#119822',
    padding: 20,
    width: 335,
    borderRadius: 22,
  },
});
