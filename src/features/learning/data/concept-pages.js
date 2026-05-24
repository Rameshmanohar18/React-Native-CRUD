export const CONCEPT_PAGES = {
  basics: {
    eyebrow: 'Core building blocks',
    title: 'React Native Basics',
    intro:
      'Start here to understand how screens are built from small components, styled with JavaScript objects, and arranged with Flexbox.',
    sections: [
      {
        title: 'Components',
        body:
          'A component is a reusable function that returns UI. This app uses components like ThemedText, ThemedView, and AdminCrudScreen to split the interface into focused pieces.',
        example: `<View>
  <Text>Hello React Native</Text>
</View>`,
      },
      {
        title: 'Views and text',
        body:
          'React Native does not use HTML tags. Use View instead of div, Text instead of p/span, Pressable instead of button, and TextInput for typing.',
        example: `<Pressable onPress={handleSave}>
  <Text>Create user</Text>
</Pressable>`,
      },
      {
        title: 'Flexbox layout',
        body:
          'Most layouts use flexDirection, gap, alignItems, and justifyContent. The admin cards use row layout for names, badges, and action buttons.',
        example: `cardTop: {
  flexDirection: 'row',
  justifyContent: 'space-between',
}`,
      },
    ],
    challenge: 'Find one View in the admin screen and change its flexDirection to see how the layout responds.',
  },
  state: {
    eyebrow: 'Data that changes',
    title: 'State, Events, and Forms',
    intro:
      'This CRUD app is a good place to learn state because creating, editing, filtering, and deleting users all update the UI immediately.',
    sections: [
      {
        title: 'useState',
        body:
          'useState stores values that can change. In the admin screen, admins, form, search, filter, error, and editingId are all state values.',
        example: `const [search, setSearch] = useState('');

<TextInput value={search} onChangeText={setSearch} />`,
      },
      {
        title: 'Events',
        body:
          'Events are functions passed into props. Pressable uses onPress, TextInput uses onChangeText, and Switch uses onValueChange.',
        example: `<Switch
  value={form.isActive}
  onValueChange={(isActive) =>
    setForm((current) => ({ ...current, isActive }))
  }
/>`,
      },
      {
        title: 'Derived data',
        body:
          'useMemo calculates visible users from admins, search, and filter. This keeps the render code simple and makes the list easier to reason about.',
        example: `const visibleAdmins = useMemo(() => {
  return admins.filter((admin) => admin.isActive);
}, [admins]);`,
      },
    ],
    challenge: 'Add another filter option, like role, and derive a new visibleAdmins list from that state.',
  },
  patterns: {
    eyebrow: 'App structure',
    title: 'Navigation and Project Patterns',
    intro:
      'Expo Router turns files into screens. This project also separates auth, admin features, shared components, hooks, and theme values.',
    sections: [
      {
        title: 'File-based routing',
        body:
          'Files inside app/(tabs) become tab screens. The _layout.jsx file configures the bottom tab navigator and protects tabs when logged out.',
        example: `app/(tabs)/index.jsx     -> Users tab
app/(tabs)/explore.jsx   -> Basics tab
app/(tabs)/state.jsx     -> State tab`,
      },
      {
        title: 'Context',
        body:
          'AuthProvider wraps the app and useAuth reads the logged-in admin from anywhere. Context is useful for data many screens need.',
        example: `const { currentAdmin, logout } = useAuth();`,
      },
      {
        title: 'Feature folders',
        body:
          'The src/features folder groups screens, data, services, and context by topic. This makes the app easier to grow as more screens are added.',
        example: `src/features/admins
src/features/auth
src/features/learning`,
      },
    ],
    challenge: 'Create one more file inside app/(tabs), import a screen, and add it to Tabs.Screen in _layout.jsx.',
  },
};
