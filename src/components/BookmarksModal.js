import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function BookmarksModal({
  visible,
  bookmarkedJobs,
  onClose,
  onToggleBookmark,
  onApply,
}) {
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
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.bookmarkedItem}>
                  <View style={styles.bookmarkedItemTop}>
                    <View style={styles.bookmarkedTextWrap}>
                      <Text style={styles.bookmarkedJobTitle}>{item.title}</Text>
                      <Text style={styles.bookmarkedCompany}>{item.company}</Text>
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Remove bookmark"
                      onPress={() => onToggleBookmark(item.id)}
                      style={styles.iconButton}
                    >
                      <Text style={styles.iconText}>🔖</Text>
                    </Pressable>
                  </View>

                  <Text style={styles.bookmarkedSalary}>{item.salary}</Text>
                  <Text numberOfLines={3} style={styles.bookmarkedDescription}>
                    {item.description}
                  </Text>

                  <View style={styles.previewMetaRow}>
                    <Text style={styles.previewMetaItem}>📍 {item.location}</Text>
                    <Text style={styles.previewMetaItem}>🧭 {item.level}</Text>
                    <Text style={styles.previewMetaItem}>🕒 {item.employmentType}</Text>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Apply to this job"
                    onPress={() => onApply(item.id)}
                    style={styles.applyButton}
                  >
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </Pressable>
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
    maxHeight: '78%',
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
  bookmarkedItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  bookmarkedTextWrap: {
    marginBottom: 4,
    flex: 1,
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
    marginBottom: 8,
  },
  bookmarkedDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  previewMetaRow: {
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  previewMetaItem: {
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.pillBackground,
    borderWidth: 1,
    borderColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.34)',
    borderColor: 'rgba(191, 219, 254, 0.8)',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
