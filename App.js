import React, { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { JobCard } from './src/components/JobCard';
import { jobs } from './src/data/jobs';
import { colors } from './src/theme/colors';

export default function App() {
  const [expandedJobId, setExpandedJobId] = useState(null);

  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo),
    []
  );

  const toggleExpandedCard = (id) => {
    setExpandedJobId((current) => (current === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ExpoStatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>Top Job Matches</Text>
        <Text style={styles.subtitle}>
          Tap any job card to view full details.
        </Text>
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
            isExpanded={expandedJobId === item.id}
            job={item}
            onToggle={toggleExpandedCard}
          />
        )}
        showsVerticalScrollIndicator={false}
        windowSize={10}
      />
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
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 24,
  },
});
