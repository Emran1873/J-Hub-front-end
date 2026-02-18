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

export function JobCard({
  job,
  isExpanded,
  onToggle,
  isBookmarked,
  onToggleBookmark,
  onApply,
}) {
  const handleExpandPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle(job.id);
  };

  return (
    <View style={[styles.card, isExpanded && styles.cardExpanded]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark this job'}
        hitSlop={8}
        onPress={() => onToggleBookmark(job.id)}
        style={[styles.bookmarkIconButton, isBookmarked && styles.bookmarkIconButtonActive]}
      >
        <Text style={styles.bookmarkIcon}>{isBookmarked ? '🔖' : '📑'}</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${job.title} at ${job.company}`}
        onPress={handleExpandPress}
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

        <View style={styles.previewContainer}>
          <Text numberOfLines={2} style={styles.previewText}>{job.description}</Text>
          <View style={styles.previewMetaRow}>
            <Text style={styles.previewMetaItem}>📍 {job.location}</Text>
            <Text style={styles.previewMetaItem}>🧭 {job.level}</Text>
            <Text style={styles.previewMetaItem}>🕒 {job.employmentType}</Text>
          </View>
        </View>

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

            <Text style={styles.tapHint}>Tap card area again to collapse</Text>
          </View>
        ) : null}
      </Pressable>

      <View style={styles.actionsRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Apply to this job"
          onPress={() => onApply(job.id)}
          style={[styles.actionButton, styles.applyButton]}
        >
          <Text style={[styles.actionButtonText, styles.applyButtonText]}>Apply</Text>
        </Pressable>
      </View>
    </View>
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
    position: 'relative',
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
  previewContainer: {
    marginTop: 10,
    opacity: 0.72,
  },
  previewText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  previewMetaRow: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  previewMetaItem: {
    backgroundColor: 'rgba(248, 250, 252, 0.7)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
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
  actionsRow: {
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.8)',
    backgroundColor: 'rgba(59, 130, 246, 0.34)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
  },
  actionButtonText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  applyButton: {
    width: '100%',
  },
  applyButtonText: {
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  bookmarkIconButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  bookmarkIconButtonActive: {
    backgroundColor: colors.pillBackground,
    borderColor: '#93C5FD',
  },
  bookmarkIcon: {
    fontSize: 16,
  },
  bookmarkIconButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  bookmarkIconButtonActive: {
    backgroundColor: colors.pillBackground,
    borderColor: '#93C5FD',
  },
  bookmarkIcon: {
    fontSize: 16,
  },
});
