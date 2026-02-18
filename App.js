import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { HeaderBar } from './src/components/HeaderBar';
import { JobCard } from './src/components/JobCard';
import { jobs } from './src/data/jobs';
import { colors } from './src/theme/colors';

export default function App() {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [bookmarkedExpandedJobId, setBookmarkedExpandedJobId] = useState(null);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState([]);
  const [activePage, setActivePage] = useState('jobs');

  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo),
    []
  );

  const bookmarkedJobs = useMemo(
    () => sortedJobs.filter((job) => bookmarkedJobIds.includes(job.id)),
    [bookmarkedJobIds, sortedJobs]
  );

  const toggleExpandedCard = useCallback((id) => {
    setExpandedJobId((current) => (current === id ? null : id));
  }, []);

  const toggleBookmarkedExpandedCard = useCallback((id) => {
    setBookmarkedExpandedJobId((current) => (current === id ? null : id));
  }, []);

  const toggleBookmark = useCallback((id) => {
    setBookmarkedJobIds((current) =>
      current.includes(id)
        ? current.filter((jobId) => jobId !== id)
        : [...current, id]
    );
  }, []);

  const handleApply = useCallback(
    (id) => {
      const selectedJob = sortedJobs.find((job) => job.id === id);
      if (selectedJob) {
        Alert.alert('Application Started', `You are applying for ${selectedJob.title}.`);
      }
    },
    [sortedJobs]
  );

  const openBookmarksPage = useCallback(() => {
    setActivePage('bookmarks');
  }, []);

  const openJobsPage = useCallback(() => {
    setActivePage('jobs');
  }, []);

  const renderJobCard = useCallback(
    ({ item }) => (
      <JobCard
        isBookmarked={bookmarkedJobIds.includes(item.id)}
        isExpanded={expandedJobId === item.id}
        job={item}
        onApply={handleApply}
        onToggle={toggleExpandedCard}
        onToggleBookmark={toggleBookmark}
      />
    ),
    [bookmarkedJobIds, expandedJobId, handleApply, toggleBookmark, toggleExpandedCard]
  );

  const renderBookmarkedCard = useCallback(
    ({ item }) => (
      <JobCard
        isBookmarked={bookmarkedJobIds.includes(item.id)}
        isExpanded={bookmarkedExpandedJobId === item.id}
        job={item}
        onApply={handleApply}
        onToggle={toggleBookmarkedExpandedCard}
        onToggleBookmark={toggleBookmark}
      />
    ),
    [bookmarkedJobIds, bookmarkedExpandedJobId, handleApply, toggleBookmarkedExpandedCard, toggleBookmark]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ExpoStatusBar style="dark" translucent />

      {activePage === 'jobs' ? (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={sortedJobs}
          initialNumToRender={6}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <HeaderBar
              bookmarkedCount={bookmarkedJobIds.length}
              onOpenBookmarks={openBookmarksPage}
            />
          }
          maxToRenderPerBatch={8}
          removeClippedSubviews
          renderItem={renderJobCard}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          windowSize={10}
        />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={bookmarkedJobs}
          initialNumToRender={6}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No saved jobs yet</Text>
              <Text style={styles.emptyStateText}>Tap the star icon on jobs to save them here.</Text>
            </View>
          }
          ListHeaderComponent={
            <View style={styles.bookmarkedHeader}>
              <View style={styles.bookmarkedTitleRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back to all jobs"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={openJobsPage}
                  style={styles.backArrowTap}
                >
                  <Text style={styles.backArrowText}>←</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back to all jobs"
                  onPress={openJobsPage}
                >
                  <Text style={styles.bookmarkedHeaderTitle}>Saved Jobs</Text>
                </Pressable>
              </View>

              <Text style={styles.bookmarkedHeaderMeta}>{bookmarkedJobs.length} saved</Text>
            </View>
          }
          renderItem={renderBookmarkedCard}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          windowSize={10}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bookmarkedHeader: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 10,
    paddingBottom: 12,
    marginBottom: 10,
    backgroundColor: 'rgba(248, 250, 252, 0.82)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148, 163, 184, 0.45)',
  },
  bookmarkedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backArrowTap: {
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  backArrowText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },
  bookmarkedHeaderTitle: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
  },
  bookmarkedHeaderMeta: {
    marginTop: 3,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
  },
  emptyStateTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  emptyStateText: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
