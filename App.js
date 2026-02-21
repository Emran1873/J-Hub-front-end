import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { HeaderBar } from './src/components/HeaderBar';
import { JobCard } from './src/components/JobCard';
import { colors } from './src/theme/colors';

const API_BASE_URL = 'http://192.168.1.50:5000';

const toPostedDaysAgo = (postedAt) => {
  if (!postedAt) {
    return 0;
  }

  const postedDate = new Date(postedAt);
  if (Number.isNaN(postedDate.getTime())) {
    return 0;
  }

  const diffMs = Date.now() - postedDate.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
};

const normalizeJob = (job, index) => ({
  id: String(job.id ?? job._id ?? `job-${index}`),
  title: job.title ?? 'Untitled role',
  company: job.company ?? job.companyName ?? 'Unknown company',
  salary: job.salary ?? 'Salary not provided',
  deadline: job.deadline ?? job.applicationDeadline ?? 'Rolling',
  postedDaysAgo:
    typeof job.postedDaysAgo === 'number' ? job.postedDaysAgo : toPostedDaysAgo(job.postedAt),
  location: job.location ?? 'Location not specified',
  employmentType: job.employmentType ?? 'Not specified',
  level: job.level ?? 'Not specified',
  description: job.description ?? 'No description available yet.',
  responsibilities: Array.isArray(job.responsibilities)
    ? job.responsibilities
    : ['Responsibilities will be shared by the employer.'],
  requirements: Array.isArray(job.requirements)
    ? job.requirements
    : ['Requirements will be shared by the employer.'],
});

export default function App() {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [bookmarkedExpandedJobId, setBookmarkedExpandedJobId] = useState(null);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState([]);
  const [activePage, setActivePage] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState('');
  const [debugChecklist, setDebugChecklist] = useState([]);
  const isPollingRef = useRef(false);

  const addDebugStep = useCallback((label, status = 'info') => {
    const stamp = new Date().toLocaleTimeString();
    setDebugChecklist((current) => [
      ...current.slice(-39),
      { id: `${Date.now()}-${Math.random()}`, stamp, label, status },
    ]);
  }, []);

  const fetchJobs = useCallback(async () => {
    if (isPollingRef.current) {
      return;
    }

    isPollingRef.current = true;
    setIsLoadingJobs(true);
    setJobsError('');
    const requestUrl = `${API_BASE_URL}/jobs`;

    addDebugStep(`Trying API: ${requestUrl}`);
    addDebugStep(`Checking backend health: ${API_BASE_URL}/`);

    try {
      const healthResponse = await fetch(`${API_BASE_URL}/`);
      addDebugStep(
        `Backend health returned status ${healthResponse.status}`,
        healthResponse.ok ? 'success' : 'error'
      );

      addDebugStep('Checking internet path: https://clients3.google.com/generate_204');
      const internetResponse = await fetch('https://clients3.google.com/generate_204');
      addDebugStep(
        `Google connectivity status ${internetResponse.status}`,
        internetResponse.ok ? 'success' : 'error'
      );

      addDebugStep(`Fetching jobs from ${requestUrl}`);
      const response = await fetch(requestUrl);
      addDebugStep(`Jobs endpoint status ${response.status}`, response.ok ? 'success' : 'error');

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      const incomingJobs = Array.isArray(payload) ? payload : payload.jobs;

      if (!Array.isArray(incomingJobs)) {
        addDebugStep('Payload shape mismatch (expected array or { jobs: [] })', 'error');
        throw new Error('Invalid jobs response format. Expected an array.');
      }

      setJobs(incomingJobs.map(normalizeJob));
      addDebugStep(`Loaded ${incomingJobs.length} jobs`, 'success');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Could not load jobs from API. Please try again.';

      setJobsError(errorMessage);
      addDebugStep(`Fetch failed: ${errorMessage}`, 'error');
      setJobs([]);
    } finally {
      setIsLoadingJobs(false);
      isPollingRef.current = false;
    }
  }, [addDebugStep]);

  useEffect(() => {
    addDebugStep(`Debug runner started. Auto-retry every 2s. API base: ${API_BASE_URL}`);
    fetchJobs();

    const intervalId = setInterval(() => {
      fetchJobs();
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [addDebugStep, fetchJobs]);

  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo),
    [jobs]
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
    [
      bookmarkedJobIds,
      bookmarkedExpandedJobId,
      handleApply,
      toggleBookmarkedExpandedCard,
      toggleBookmark,
    ]
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
          ListEmptyComponent={
            isLoadingJobs ? (
              <View style={styles.messageState}>
                <ActivityIndicator color={colors.accent} size="small" />
                <Text style={styles.messageText}>Loading jobs from API...</Text>
              </View>
            ) : jobsError ? (
              <View style={styles.messageState}>
                <Text style={styles.messageError}>Could not load jobs</Text>
                <Text style={styles.messageText}>{jobsError}</Text>
                <Pressable onPress={fetchJobs} style={styles.retryButton}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.messageState}>
                <Text style={styles.messageText}>No jobs available right now.</Text>
              </View>
            )
          }
          ListHeaderComponent={
            <View>
              <HeaderBar
                bookmarkedCount={bookmarkedJobIds.length}
                onOpenBookmarks={openBookmarksPage}
              />
              <View style={styles.debugPanel}>
                <Text style={styles.debugPanelTitle}>Live Debug Checklist</Text>
                <Text style={styles.debugPanelMeta}>Auto-retry: every 2 seconds</Text>
                {debugChecklist.map((step) => (
                  <Text
                    key={step.id}
                    style={[
                      styles.debugLine,
                      step.status === 'error'
                        ? styles.debugLineError
                        : step.status === 'success'
                          ? styles.debugLineSuccess
                          : null,
                    ]}
                  >
                    {step.status === 'error' ? '❌' : step.status === 'success' ? '✅' : '•'} [
                    {step.stamp}] {step.label}
                  </Text>
                ))}
              </View>
            </View>
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
  debugPanel: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(248, 250, 252, 0.9)',
  },
  debugPanelTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  debugPanelMeta: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 6,
  },
  debugLine: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 2,
  },
  debugLineSuccess: {
    color: '#166534',
  },
  debugLineError: {
    color: '#991B1B',
  },
  messageState: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    backgroundColor: 'rgba(248, 250, 252, 0.85)',
    alignItems: 'center',
    gap: 8,
  },
  messageText: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  messageError: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  retryButton: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
  },
  retryButtonText: {
    color: colors.accent,
    fontWeight: '700',
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
