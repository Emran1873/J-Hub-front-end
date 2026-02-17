import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { BookmarksModal } from './src/components/BookmarksModal';
import { HeaderBar } from './src/components/HeaderBar';
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

  const toggleExpandedCard = useCallback((id) => {
    setExpandedJobId((current) => (current === id ? null : id));
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

  const openBookmarks = useCallback(() => {
    setIsBookmarkedModalVisible(true);
  }, []);

  const closeBookmarks = useCallback(() => {
    setIsBookmarkedModalVisible(false);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ExpoStatusBar style="dark" translucent />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={sortedJobs}
        initialNumToRender={6}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <HeaderBar
            bookmarkedCount={bookmarkedJobIds.length}
            onOpenBookmarks={openBookmarks}
          />
        }
        maxToRenderPerBatch={8}
        removeClippedSubviews
        renderItem={({ item }) => (
          <JobCard
            isBookmarked={bookmarkedJobIds.includes(item.id)}
            isExpanded={expandedJobId === item.id}
            job={item}
            onApply={handleApply}
            onToggle={toggleExpandedCard}
            onToggleBookmark={toggleBookmark}
          />
        )}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        windowSize={10}
      />

      <BookmarksModal
        bookmarkedJobs={bookmarkedJobs}
        onApply={handleApply}
        onClose={closeBookmarks}
        onToggleBookmark={toggleBookmark}
        visible={isBookmarkedModalVisible}
      />
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
});
