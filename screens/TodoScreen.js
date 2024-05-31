import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from '@env';
import Pagination from './Pagination';

export default function TodoScreen() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos(1);
  }, []);

  const fetchTodos = async (page) => {
    if (loading) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${SERVER_URL}/tasks?page=${page}`, {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      });
      setTodos(response.data.tasks);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error.response.data);
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${SERVER_URL}/task`, { taskName: newTodo }, {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      });
      fetchTodos(currentPage)
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.delete(`${SERVER_URL}/task/${id}`, {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        fetchTodos(currentPage);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (id, status) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(`${SERVER_URL}/task/${id}`, { status: status }, {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setTodos(todos.map(todo => {
          if (todo.id === id) {
            return { ...todo, status: status };
          } else {
            return todo;
          }
        }));
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const loadMoreTodos = () => {
    if (currentPage < totalPages) {
      fetchTodos(currentPage + 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTodos(page);
  };

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <View style={styles.todoRow}>
        <Text style={styles.taskName}>
          {item.taskName}
        </Text>
        <Text style={[styles.status, item.status === 'ACTIVE' ? styles.active : styles.done]}>
          {item.status}
        </Text>
      </View>
      {item.status === "ACTIVE" ? <View style={styles.buttonContainer}>
        <Button title="Done" color="green" onPress={() => updateTodo(item.id, "DONE")} />
      </View> :
        <View style={styles.buttonContainer}>
          <Button title="Un done" color="orange" onPress={() => updateTodo(item.id, "ACTIVE")} />
        </View>
      }
      <View style={styles.buttonContainer}>
        <Button title="Delete" color="red" onPress={() => deleteTodo(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={newTodo}
        onChangeText={setNewTodo}
        placeholder="Enter a new todo"
      />
      <Button title="Add Todo" onPress={addTodo} />
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.todoList}
        onEndReached={loadMoreTodos}
        onEndReachedThreshold={0.5}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  todoList: {
    width: '100%',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 20,
  },
  taskName: {
    flex: 1,
    marginLeft: 10,
  },
  status: {
    marginRight: 10,
  },
  active: {
    color: 'blue',
  },
  done: {
    color: 'green',
  },
  buttonContainer: {
    marginLeft: 10,
  },
});
