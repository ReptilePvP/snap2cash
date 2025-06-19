import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AnalysisResult } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { colors } = useTheme();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {result.imageUrl && (
          <Image source={{ uri: result.imageUrl }} style={styles.image} />
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="pricetag" size={24} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>{result.title}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text" size={20} color={colors.textSecondary} />
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                Description
              </Text>
            </View>
            <Text style={[styles.description, { color: colors.text }]}>
              {result.description}
            </Text>
          </View>

          <View style={[styles.valueSection, { backgroundColor: colors.primary + '20' }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cash" size={24} color={colors.primary} />
              <Text style={[styles.valueLabel, { color: colors.primary }]}>
                Estimated Value
              </Text>
            </View>
            <Text style={[styles.value, { color: colors.primary }]}>{result.value}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb" size={20} color={colors.textSecondary} />
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                AI Explanation
              </Text>
            </View>
            <Text style={[styles.explanation, { color: colors.text }]}>
              {result.aiExplanation}
            </Text>
          </View>

          {result.visualMatches && result.visualMatches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="images" size={20} color={colors.textSecondary} />
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                  Visual Matches
                </Text>
              </View>
              <View style={styles.matches}>
                {result.visualMatches.slice(0, 3).map((match, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.matchItem, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={() => openLink(match.link)}
                  >
                    {match.thumbnail && (
                      <Image source={{ uri: match.thumbnail }} style={styles.matchImage} />
                    )}
                    <View style={styles.matchContent}>
                      <Text style={[styles.matchTitle, { color: colors.text }]} numberOfLines={2}>
                        {match.title}
                      </Text>
                      {match.source_icon && (
                        <Image source={{ uri: match.source_icon }} style={styles.sourceIcon} />
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={[styles.provider, { color: colors.textSecondary }]}>
              Analyzed by: {result.apiProvider}
            </Text>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {new Date(result.timestamp).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  valueSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  valueLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  explanation: {
    fontSize: 16,
    lineHeight: 24,
  },
  matches: {
    gap: 8,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  matchImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  matchContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchTitle: {
    fontSize: 14,
    flex: 1,
  },
  sourceIcon: {
    width: 16,
    height: 16,
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  provider: {
    fontSize: 12,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
  },
});

export default ResultCard;