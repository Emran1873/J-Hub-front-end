import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { JobCard } from './src/components/JobCard';
import { jobs } from './src/data/jobs';
import { colors } from './src/theme/colors';

export default function App() {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState([]);
  const [isBookmarkedModalVisible, setIsBookmarkedModalVisible] = useState(false);

  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo),
    []
  );

  const bookmarkedJobs = useMemo(
    () => sortedJobs.filter((job) => bookmarkedJobIds.includes(job.id)),
    [bookmarkedJobIds, sortedJobs]
  );

  const toggleExpandedCard = (id) => {
    setExpandedJobId((current) => (current === id ? null : id));
  };

  const toggleBookmark = (id) => {
    setBookmarkedJobIds((current) =>
      current.includes(id)
        ? current.filter((jobId) => jobId !== id)
        : [...current, id]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ExpoStatusBar style="dark" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Top Job Matches</Text>
          <Text style={styles.subtitle}>
            Tap any job card to view full details.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open bookmarked jobs"
          onPress={() => setIsBookmarkedModalVisible(true)}
          style={styles.bookmarkHeaderButton}
        >
          <Text style={styles.bookmarkIcon}>🔖</Text>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{bookmarkedJobIds.length}</Text>
          </View>
        </Pressable>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={sortedJobs}
        initialNumToRender={6}
        keyExtractor={(item) => item.id}
        maxToRenderPerBatch={8}
        removeClippedSubviews
        renderItem={({ item }) => (
          <JobCard
            isBookmarked={bookmarkedJobIds.includes(item.id)}
            isExpanded={expandedJobId === item.id}
            job={item}
            onApply={() => {}}
            onToggle={toggleExpandedCard}
            onToggleBookmark={toggleBookmark}
          />
        )}
        showsVerticalScrollIndicator={false}
        windowSize={10}
      />

      <Modal
        animationType="slide"
        transparent
        visible={isBookmarkedModalVisible}
        onRequestClose={() => setIsBookmarkedModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bookmarked Jobs</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setIsBookmarkedModalVisible(false)}
              >
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  bookmarkHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkIcon: {
    fontSize: 20,
  },
  counterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  counterText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 24,
  },
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
