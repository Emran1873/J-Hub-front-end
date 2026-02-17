import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function HeaderBar({ bookmarkedCount, onOpenBookmarks }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Top Job Matches</Text>
        <Text style={styles.subtitle}>Tap any job card to view full details.</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open bookmarked jobs"
        onPress={onOpenBookmarks}
        style={styles.bookmarkHeaderButton}
      >
        <Text style={styles.bookmarkIcon}>🔖</Text>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{bookmarkedCount}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
