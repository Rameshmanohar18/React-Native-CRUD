import { Link, Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '../../../components/common/themed-text';
import { ThemedView } from '../../../components/common/themed-view';
import { useAuth } from '../context/auth-context';

const COLORS = {
  navy: '#131921',
  navySoft: '#232F3E',
  orange: '#FF9900',
  orangeDark: '#C45500',
  page: '#EAEDED',
  card: '#FFFFFF',
  border: '#D5D9D9',
  muted: '#565959',
  input: '#F7FAFA',
  danger: '#B12704',
};

export default function AuthScreen({ mode }) {
  const router = useRouter();
  const { isAuthenticated, login, register } = useAuth();
  const isRegister = mode === 'register';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  const validateForm = () => {
    if (isRegister && !form.name.trim()) {
      return 'Please enter your full name.';
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (form.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    return '';
  };

  const handleSubmit = () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const result = isRegister ? register(form) : login(form);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.replace('/');
  };

  return (
    <ThemedView lightColor={COLORS.page} darkColor="#0F1111" style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.brandHeader}>
            <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" type="title" style={styles.brand}>
              AdminCrud
            </ThemedText>
            <ThemedText lightColor="#D5DBDB" darkColor="#D5DBDB" style={styles.brandSubtitle}>
              Secure admin access for managing users.
            </ThemedText>
          </View>

          <View style={styles.card}>
            <ThemedText lightColor="#111111" darkColor="#111111" type="subtitle">
              {isRegister ? 'Create admin account' : 'Sign in'}
            </ThemedText>

            {isRegister ? (
              <TextInput
                placeholder="Full name"
                placeholderTextColor={COLORS.muted}
                style={styles.input}
                value={form.name}
                onChangeText={(name) => setForm((currentForm) => ({ ...currentForm, name }))}
              />
            ) : null}

            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email address"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              value={form.email}
              onChangeText={(email) => setForm((currentForm) => ({ ...currentForm, email }))}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={COLORS.muted}
              secureTextEntry
              style={styles.input}
              value={form.password}
              onChangeText={(password) => setForm((currentForm) => ({ ...currentForm, password }))}
            />

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

            <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={handleSubmit}>
              <ThemedText lightColor="#111111" darkColor="#111111" type="defaultSemiBold">
                {isRegister ? 'Register' : 'Login'}
              </ThemedText>
            </Pressable>

            {!isRegister ? (
              <View style={styles.demoBox}>
                <ThemedText lightColor={COLORS.muted} darkColor={COLORS.muted} style={styles.demoText}>
                  Demo admin: admin@example.com / admin123
                </ThemedText>
              </View>
            ) : null}

            <View style={styles.footerRow}>
              <ThemedText lightColor={COLORS.muted} darkColor={COLORS.muted}>
                {isRegister ? 'Already have an account?' : 'Need an admin account?'}
              </ThemedText>
              <Link href={isRegister ? '/login' : '/register'} replace>
                <ThemedText lightColor={COLORS.orangeDark} darkColor={COLORS.orange} type="defaultSemiBold">
                  {isRegister ? 'Login' : 'Register'}
                </ThemedText>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 18,
    padding: 18,
  },
  brandHeader: {
    backgroundColor: COLORS.navy,
    borderRadius: 8,
    gap: 8,
    padding: 20,
  },
  brand: {
    lineHeight: 38,
  },
  brandSubtitle: {
    fontSize: 15,
    lineHeight: 21,
  },
  card: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  input: {
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    color: '#111111',
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orangeDark,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 46,
  },
  demoBox: {
    backgroundColor: '#FFF4DE',
    borderRadius: 8,
    padding: 10,
  },
  demoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
});
