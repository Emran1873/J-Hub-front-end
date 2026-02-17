import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function BookmarksModal({ visible, bookmarkedJobs, onClose }) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bookmarked Jobs</Text>
            <Pressable accessibilityRole="button" onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </Pressable>
          </View>

          {bookmarkedJobs.length === 0 ? (
            <Text style={styles.emptyStateText}>
              No jobs bookmarked yet. Tap 🔖 on a job to save it.
            </Text>
          ) : (
            <FlatList
              data={bookmarkedJobs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.bookmarkedItem}>
                  <View style={styles.bookmarkedTextWrap}>
                    <Text style={styles.bookmarkedJobTitle}>{item.title}</Text>
                    <Text style={styles.bookmarkedCompany}>{item.company}</Text>
                  </View>
                  <Text style={styles.bookmarkedSalary}>{item.salary}</Text>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '65%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalClose: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  emptyStateText: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bookmarkedItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  bookmarkedTextWrap: {
    marginBottom: 4,
  },
  bookmarkedJobTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  bookmarkedCompany: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  bookmarkedSalary: {
    color: colors.success,
    fontWeight: '700',
  },
});
