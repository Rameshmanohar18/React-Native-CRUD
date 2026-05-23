import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '../../../components/common/themed-text';
import { ThemedView } from '../../../components/common/themed-view';
import { EMPTY_ADMIN_FORM, INITIAL_ADMINS } from '../data/admin-data';

const AMAZON_COLORS = {
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
  successBg: '#E7F4EA',
  successText: '#067D62',
  warningBg: '#FFF4DE',
  warningText: '#8A4B00',
};

export default function AdminCrudScreen() {
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [form, setForm] = useState(EMPTY_ADMIN_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const editingAdmin = admins.find((admin) => admin.id === editingId);
  const isEditing = Boolean(editingAdmin);

  const visibleAdmins = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return admins.filter((admin) => {
      const matchesSearch =
        admin.name.toLowerCase().includes(searchText) ||
        admin.email.toLowerCase().includes(searchText) ||
        admin.role.toLowerCase().includes(searchText);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && admin.isActive) ||
        (filter === 'inactive' && !admin.isActive);

      return matchesSearch && matchesFilter;
    });
  }, [admins, filter, search]);

  const resetForm = () => {
    setForm(EMPTY_ADMIN_FORM);
    setEditingId(null);
    setError('');
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) {
      return 'Please fill name, email, and role.';
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      return 'Please enter a valid email address.';
    }

    const emailExists = admins.some(
      (admin) =>
        admin.email.toLowerCase() === form.email.trim().toLowerCase() && admin.id !== editingId
    );

    if (emailExists) {
      return 'This email is already used by another admin.';
    }

    return '';
  };

  const handleSave = () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const nextAdmin = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
      isActive: form.isActive,
    };

    if (isEditing && editingId) {
      setAdmins((currentAdmins) =>
        currentAdmins.map((admin) =>
          admin.id === editingId
            ? {
                ...admin,
                ...nextAdmin,
              }
            : admin
        )
      );
    } else {
      setAdmins((currentAdmins) => [
        {
          id: Date.now().toString(),
          ...nextAdmin,
        },
        ...currentAdmins,
      ]);
    }

    resetForm();
  };

  const handleEdit = (admin) => {
    setEditingId(admin.id);
    setForm({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
    });
    setError('');
  };

  const deleteAdmin = (adminId) => {
    setAdmins((currentAdmins) => currentAdmins.filter((admin) => admin.id !== adminId));

    if (editingId === adminId) {
      resetForm();
    }
  };

  const handleDelete = (admin) => {
    if (Platform.OS === 'web') {
      deleteAdmin(admin.id);
      return;
    }

    Alert.alert('Delete admin?', `Remove ${admin.name} from the admin list.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteAdmin(admin.id),
      },
    ]);
  };

  return (
    <ThemedView lightColor={AMAZON_COLORS.page} darkColor="#0F1111" style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" type="title" style={styles.title}>
              Admin Console
            </ThemedText>
            <ThemedText lightColor="#D5DBDB" darkColor="#D5DBDB" style={styles.subtitle}>
              Manage users, roles, and access status from one place.
            </ThemedText>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" type="defaultSemiBold">
                  {admins.length}
                </ThemedText>
                <ThemedText lightColor="#D5DBDB" darkColor="#D5DBDB" style={styles.summaryLabel}>
                  Total
                </ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" type="defaultSemiBold">
                  {admins.filter((admin) => admin.isActive).length}
                </ThemedText>
                <ThemedText lightColor="#D5DBDB" darkColor="#D5DBDB" style={styles.summaryLabel}>
                  Active
                </ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" type="defaultSemiBold">
                  {admins.filter((admin) => !admin.isActive).length}
                </ThemedText>
                <ThemedText lightColor="#D5DBDB" darkColor="#D5DBDB" style={styles.summaryLabel}>
                  Paused
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.panel}>
            <ThemedText lightColor="#111111" darkColor="#111111" type="subtitle">
              {isEditing ? 'Update admin' : 'Create admin'}
            </ThemedText>

            <TextInput
              placeholder="Full name"
              placeholderTextColor={AMAZON_COLORS.muted}
              style={styles.input}
              value={form.name}
              onChangeText={(name) => setForm((currentForm) => ({ ...currentForm, name }))}
            />
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email address"
              placeholderTextColor={AMAZON_COLORS.muted}
              style={styles.input}
              value={form.email}
              onChangeText={(email) => setForm((currentForm) => ({ ...currentForm, email }))}
            />
            <TextInput
              placeholder="Role"
              placeholderTextColor={AMAZON_COLORS.muted}
              style={styles.input}
              value={form.role}
              onChangeText={(role) => setForm((currentForm) => ({ ...currentForm, role }))}
            />

            <View style={styles.switchRow}>
              <View>
                <ThemedText lightColor="#111111" darkColor="#111111" type="defaultSemiBold">
                  Active status
                </ThemedText>
                <ThemedText lightColor={AMAZON_COLORS.muted} darkColor={AMAZON_COLORS.muted} style={styles.helperText}>
                  {form.isActive ? 'This admin can access the app.' : 'Access is paused.'}
                </ThemedText>
              </View>
              <Switch
                value={form.isActive}
                onValueChange={(isActive) =>
                  setForm((currentForm) => ({ ...currentForm, isActive }))
                }
              />
            </View>

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

            <View style={styles.actionRow}>
              <Pressable
                accessibilityRole="button"
                style={styles.primaryButton}
                onPress={handleSave}>
                <ThemedText lightColor="#111111" darkColor="#111111" type="defaultSemiBold">
                  {isEditing ? 'Update' : 'Create'}
                </ThemedText>
              </Pressable>

              {isEditing ? (
                <Pressable
                  accessibilityRole="button"
                  style={styles.secondaryButton}
                  onPress={resetForm}>
                  <ThemedText lightColor="#111111" darkColor="#111111" type="defaultSemiBold">
                    Cancel
                  </ThemedText>
                </Pressable>
              ) : null}
            </View>
          </View>

          <View style={styles.tools}>
            <TextInput
              autoCapitalize="none"
              placeholder="Search admins"
              placeholderTextColor={AMAZON_COLORS.muted}
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />

            <View style={styles.filterRow}>
              {['all', 'active', 'inactive'].map((item) => {
                const selected = filter === item;

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={item}
                    style={[
                      styles.filterButton,
                      {
                        backgroundColor: selected ? AMAZON_COLORS.navySoft : AMAZON_COLORS.card,
                        borderColor: selected ? AMAZON_COLORS.navySoft : AMAZON_COLORS.border,
                      },
                    ]}
                    onPress={() => setFilter(item)}>
                    <ThemedText
                      lightColor={selected ? '#FFFFFF' : undefined}
                      darkColor={selected ? '#FFFFFF' : '#111111'}
                      type="defaultSemiBold"
                      style={styles.filterText}>
                      {item[0].toUpperCase() + item.slice(1)}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.listHeader}>
            <ThemedText lightColor="#111111" darkColor="#FFFFFF" type="subtitle">
              Admins
            </ThemedText>
            <ThemedText lightColor={AMAZON_COLORS.muted} darkColor="#D5DBDB" style={styles.countText}>
              {visibleAdmins.length} shown
            </ThemedText>
          </View>

          <View style={styles.list}>
            {visibleAdmins.length ? (
              visibleAdmins.map((admin) => (
                <View key={admin.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.cardIdentity}>
                      <ThemedText lightColor="#111111" darkColor="#111111" type="defaultSemiBold" style={styles.cardTitle}>
                        {admin.name}
                      </ThemedText>
                      <ThemedText lightColor={AMAZON_COLORS.muted} darkColor={AMAZON_COLORS.muted} style={styles.cardEmail}>
                        {admin.email}
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: admin.isActive
                            ? AMAZON_COLORS.successBg
                            : AMAZON_COLORS.warningBg,
                        },
                      ]}>
                      <ThemedText
                        lightColor={admin.isActive ? AMAZON_COLORS.successText : AMAZON_COLORS.warningText}
                        darkColor={admin.isActive ? AMAZON_COLORS.successText : AMAZON_COLORS.warningText}
                        type="defaultSemiBold"
                        style={styles.badgeText}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText lightColor="#111111" darkColor="#111111" style={styles.roleText}>
                    Role: {admin.role}
                  </ThemedText>

                  <View style={styles.cardActions}>
                    <Pressable
                      accessibilityRole="button"
                      style={styles.secondaryButton}
                      onPress={() => handleEdit(admin)}>
                      <ThemedText lightColor="#111111" darkColor="#111111" type="defaultSemiBold">
                        Edit
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      style={styles.deleteButton}
                      onPress={() => handleDelete(admin)}>
                      <ThemedText lightColor="#A92727" darkColor="#FF9A9A" type="defaultSemiBold">
                        Delete
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <ThemedText lightColor="#111111" darkColor="#111111" type="defaultSemiBold">
                  No admins found
                </ThemedText>
                <ThemedText lightColor={AMAZON_COLORS.muted} darkColor={AMAZON_COLORS.muted} style={styles.helperText}>
                  Try changing your search or filter, or create a new admin.
                </ThemedText>
              </View>
            )}
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
    gap: 16,
    padding: 16,
    paddingBottom: 36,
    paddingTop: 0,
  },
  header: {
    backgroundColor: AMAZON_COLORS.navy,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    gap: 8,
    marginHorizontal: -16,
    marginBottom: 2,
    padding: 20,
    paddingTop: 58,
  },
  title: {
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  summaryItem: {
    backgroundColor: AMAZON_COLORS.navySoft,
    borderRadius: 8,
    flex: 1,
    minHeight: 58,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  summaryLabel: {
    fontSize: 12,
    lineHeight: 17,
  },
  panel: {
    backgroundColor: AMAZON_COLORS.card,
    borderColor: AMAZON_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  input: {
    backgroundColor: AMAZON_COLORS.input,
    borderColor: AMAZON_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    color: '#111111',
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  helperText: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    color: AMAZON_COLORS.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: AMAZON_COLORS.orange,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AMAZON_COLORS.orangeDark,
    minHeight: 46,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: AMAZON_COLORS.border,
    borderWidth: 1,
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  tools: {
    gap: 12,
  },
  searchInput: {
    backgroundColor: AMAZON_COLORS.card,
    borderColor: AMAZON_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    color: '#111111',
    fontSize: 16,
    minHeight: 46,
    paddingHorizontal: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  filterText: {
    fontSize: 14,
  },
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countText: {
    opacity: 0.68,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: AMAZON_COLORS.card,
    borderColor: AMAZON_COLORS.border,
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
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardIdentity: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 18,
  },
  cardEmail: {
    fontSize: 14,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
  },
  roleText: {
    fontSize: 15,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  deleteButton: {
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyState: {
    backgroundColor: AMAZON_COLORS.card,
    borderColor: AMAZON_COLORS.border,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    gap: 4,
    padding: 18,
  },
});
