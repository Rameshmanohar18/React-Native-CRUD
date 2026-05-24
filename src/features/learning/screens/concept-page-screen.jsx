import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '../../../components/common/themed-text';
import { ThemedView } from '../../../components/common/themed-view';
import { CONCEPT_PAGES } from '../data/concept-pages';

const COLORS = {
  page: '#EAEDED',
  ink: '#111111',
  navy: '#131921',
  navySoft: '#232F3E',
  card: '#FFFFFF',
  border: '#D5D9D9',
  muted: '#565959',
  orange: '#FF9900',
  codeBg: '#F3F6F6',
  successBg: '#E7F4EA',
  successText: '#067D62',
};

export default function ConceptPageScreen({ pageKey }) {
  const page = CONCEPT_PAGES[pageKey] ?? CONCEPT_PAGES.basics;

  return (
    <ThemedView lightColor={COLORS.page} darkColor="#0F1111" style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <ThemedText lightColor={COLORS.orange} darkColor={COLORS.orange} type="defaultSemiBold">
            {page.eyebrow}
          </ThemedText>
          <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" type="title" style={styles.title}>
            {page.title}
          </ThemedText>
          <ThemedText lightColor="#D5DBDB" darkColor="#D5DBDB" style={styles.intro}>
            {page.intro}
          </ThemedText>
        </View>

        <View style={styles.sectionList}>
          {page.sections.map((section, index) => (
            <View key={section.title} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.stepBadge}>
                  <ThemedText
                    lightColor={COLORS.ink}
                    darkColor={COLORS.ink}
                    type="defaultSemiBold"
                    style={styles.stepText}>
                    {index + 1}
                  </ThemedText>
                </View>
                <ThemedText lightColor={COLORS.ink} darkColor={COLORS.ink} type="subtitle" style={styles.cardTitle}>
                  {section.title}
                </ThemedText>
              </View>
              <ThemedText lightColor={COLORS.muted} darkColor={COLORS.muted} style={styles.bodyText}>
                {section.body}
              </ThemedText>
              <View style={styles.codeBlock}>
                <ThemedText
                  lightColor={COLORS.ink}
                  darkColor={COLORS.ink}
                  style={styles.codeText}>
                  {section.example}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.challenge}>
          <ThemedText
            lightColor={COLORS.successText}
            darkColor={COLORS.successText}
            type="defaultSemiBold">
            Try it
          </ThemedText>
          <ThemedText lightColor={COLORS.ink} darkColor={COLORS.ink} style={styles.bodyText}>
            {page.challenge}
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 16,
    paddingBottom: 36,
    paddingTop: 0,
  },
  hero: {
    backgroundColor: COLORS.navy,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    gap: 10,
    marginHorizontal: -16,
    padding: 20,
    paddingTop: 58,
  },
  title: {
    lineHeight: 38,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionList: {
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  stepBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: 8,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  stepText: {
    fontSize: 15,
  },
  cardTitle: {
    flex: 1,
    fontSize: 19,
    lineHeight: 24,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
  },
  codeBlock: {
    backgroundColor: COLORS.codeBg,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 19,
  },
  challenge: {
    backgroundColor: COLORS.successBg,
    borderColor: '#B7DDC1',
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 14,
  },
});
