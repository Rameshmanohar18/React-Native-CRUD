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

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

const INITIAL_ADMINS: AdminUser[] = [
  {
    id: '1',
    name: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    role: 'Manager',
    isActive: true,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'Editor',
    isActive: true,
  },
  {
    id: '3',
    name: 'Kishore Kanna',
    email: 'kishore@example.com',
    role: 'Admin',
    isActive: false,
  },
];

const EMPTY_FORM = {
  name: '',
  email: '',
  role: '',
  isActive: true,
};

type FilterValue = 'all' | 'active' | 'inactive';

export default function AdminCrudScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterValue>('all');
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
    setForm(EMPTY_FORM);
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

  const handleEdit = (admin: AdminUser) => {
    setEditingId(admin.id);
    setForm({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
    });
    setError('');
  };

  const deleteAdmin = (adminId: string) => {
    setAdmins((currentAdmins) => currentAdmins.filter((admin) => admin.id !== adminId));

    if (editingId === adminId) {
      resetForm();
    }
  };

  const handleDelete = (admin: AdminUser) => {
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
    <ThemedView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText type="title">Admin CRUD</ThemedText>
            <ThemedText style={styles.subtitle}>
              Create, view, update, and delete admin records.
            </ThemedText>
          </View>

          <View style={[styles.panel, { borderColor: palette.icon }]}>
            <ThemedText type="subtitle">{isEditing ? 'Update admin' : 'Create admin'}</ThemedText>

            <TextInput
              placeholder="Full name"
              placeholderTextColor={palette.icon}
              style={[styles.input, { borderColor: palette.icon, color: palette.text }]}
              value={form.name}
              onChangeText={(name) => setForm((currentForm) => ({ ...currentForm, name }))}
            />
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email address"
              placeholderTextColor={palette.icon}
              style={[styles.input, { borderColor: palette.icon, color: palette.text }]}
              value={form.email}
              onChangeText={(email) => setForm((currentForm) => ({ ...currentForm, email }))}
            />
            <TextInput
              placeholder="Role"
              placeholderTextColor={palette.icon}
              style={[styles.input, { borderColor: palette.icon, color: palette.text }]}
              value={form.role}
              onChangeText={(role) => setForm((currentForm) => ({ ...currentForm, role }))}
            />

            <View style={styles.switchRow}>
              <View>
                <ThemedText type="defaultSemiBold">Active status</ThemedText>
                <ThemedText style={styles.helperText}>
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
                style={[styles.primaryButton, { backgroundColor: palette.tint }]}
                onPress={handleSave}>
                <ThemedText lightColor="#FFFFFF" darkColor="#11181C" type="defaultSemiBold">
                  {isEditing ? 'Update' : 'Create'}
                </ThemedText>
              </Pressable>

              {isEditing ? (
                <Pressable
                  accessibilityRole="button"
                  style={[styles.secondaryButton, { borderColor: palette.icon }]}
                  onPress={resetForm}>
                  <ThemedText type="defaultSemiBold">Cancel</ThemedText>
                </Pressable>
              ) : null}
            </View>
          </View>

          <View style={styles.tools}>
            <TextInput
              autoCapitalize="none"
              placeholder="Search admins"
              placeholderTextColor={palette.icon}
              style={[styles.searchInput, { borderColor: palette.icon, color: palette.text }]}
              value={search}
              onChangeText={setSearch}
            />

            <View style={styles.filterRow}>
              {(['all', 'active', 'inactive'] as FilterValue[]).map((item) => {
                const selected = filter === item;

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={item}
                    style={[
                      styles.filterButton,
                      {
                        backgroundColor: selected ? palette.tint : 'transparent',
                        borderColor: selected ? palette.tint : palette.icon,
                      },
                    ]}
                    onPress={() => setFilter(item)}>
                    <ThemedText
                      lightColor={selected ? '#FFFFFF' : undefined}
                      darkColor={selected ? '#11181C' : undefined}
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
            <ThemedText type="subtitle">Admins</ThemedText>
            <ThemedText style={styles.countText}>{visibleAdmins.length} shown</ThemedText>
          </View>

          <View style={styles.list}>
            {visibleAdmins.length ? (
              visibleAdmins.map((admin) => (
                <View key={admin.id} style={[styles.card, { borderColor: palette.icon }]}>
                  <View style={styles.cardTop}>
                    <View style={styles.cardIdentity}>
                      <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                        {admin.name}
                      </ThemedText>
                      <ThemedText style={styles.cardEmail}>{admin.email}</ThemedText>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: admin.isActive ? '#DDF6E8' : '#FFE3E3' },
                      ]}>
                      <ThemedText
                        lightColor={admin.isActive ? '#116B38' : '#A92727'}
                        darkColor={admin.isActive ? '#116B38' : '#A92727'}
                        type="defaultSemiBold"
                        style={styles.badgeText}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText style={styles.roleText}>Role: {admin.role}</ThemedText>

                  <View style={styles.cardActions}>
                    <Pressable
                      accessibilityRole="button"
                      style={[styles.secondaryButton, { borderColor: palette.icon }]}
                      onPress={() => handleEdit(admin)}>
                      <ThemedText type="defaultSemiBold">Edit</ThemedText>
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
              <View style={[styles.emptyState, { borderColor: palette.icon }]}>
                <ThemedText type="defaultSemiBold">No admins found</ThemedText>
                <ThemedText style={styles.helperText}>
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
    gap: 18,
    padding: 20,
    paddingBottom: 36,
    paddingTop: 64,
  },
  header: {
    gap: 6,
  },
  subtitle: {
    opacity: 0.72,
  },
  panel: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
    padding: 16,
  },
  input: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
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
    opacity: 0.68,
  },
  errorText: {
    color: '#C73232',
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
    borderRadius: 8,
    minHeight: 46,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  tools: {
    gap: 12,
  },
  searchInput: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
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
    borderWidth: StyleSheet.hairlineWidth,
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
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
    padding: 14,
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
    opacity: 0.72,
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
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
    padding: 18,
  },
});
