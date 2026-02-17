import React from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const formatPostedDate = (days) => {
  if (days === 0) {
    return 'Posted today';
  }

  if (days === 1) {
    return 'Posted 1 day ago';
  }

  return `Posted ${days} days ago`;
};

const DetailSection = ({ title, items }) => (
  <View style={styles.detailSection}>
    <Text style={styles.detailHeading}>{title}</Text>
    {items.map((item) => (
      <Text style={styles.detailText} key={item}>
        • {item}
      </Text>
    ))}
  </View>
);

export function JobCard({ job, isExpanded, onToggle }) {
  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle(job.id);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${job.title} at ${job.company}`}
      onPress={handlePress}
      style={[styles.card, isExpanded && styles.cardExpanded]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleArea}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{job.company}</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{formatPostedDate(job.postedDaysAgo)}</Text>
        </View>
      </View>

      <Text style={styles.salary}>{job.salary}</Text>

      {isExpanded ? (
        <View style={styles.detailsContainer}>
          <Text style={styles.description}>{job.description}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>📍 {job.location}</Text>
            <Text style={styles.metaItem}>🧭 {job.level}</Text>
            <Text style={styles.metaItem}>🕒 {job.employmentType}</Text>
          </View>

          <DetailSection items={job.responsibilities} title="Responsibilities" />
          <DetailSection items={job.requirements} title="Requirements" />

          <Text style={styles.tapHint}>Tap card again to collapse</Text>
        </View>
      ) : (
        <Text style={styles.tapHint}>Tap to view full job details</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  cardExpanded: {
    borderColor: colors.accent,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  company: {
    marginTop: 2,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  pill: {
    backgroundColor: colors.pillBackground,
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  pillText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  salary: {
    marginTop: 12,
    color: colors.success,
    fontSize: 16,
    fontWeight: '700',
  },
  detailsContainer: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  detailSection: {
    marginTop: 12,
  },
  detailHeading: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  detailText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  tapHint: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
});
