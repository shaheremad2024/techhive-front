import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <View style={styles.paginationContainer}>
      {pages.map((page) => (
        <TouchableOpacity key={page} onPress={() => onPageChange(page)}>
          <Text style={[styles.pageNumber, page === currentPage ? styles.currentPage : null]}>
            {page}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom:20
  },
  pageNumber: {
    marginHorizontal: 5,
    fontSize: 16,
    color: 'blue',
  },
  currentPage: {
    fontWeight: 'bold',
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});

export default Pagination;
