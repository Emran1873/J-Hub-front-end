import React from 'react';
import { Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
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
    paddingHorizontal: 2,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 12,
    paddingBottom: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(248, 250, 252, 0.92)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 6,
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
