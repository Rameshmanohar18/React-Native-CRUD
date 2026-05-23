# Project Structure

This Expo app keeps route files in `app` and production code in `src`.

```text
AdminCrud/
  app/                         Expo Router screens and layouts
    (tabs)/
      _layout.jsx              Bottom tab navigation
      index.jsx                Thin route for the Admin CRUD feature
      explore.jsx              About/help tab
    _layout.jsx                Root providers and stack navigation
    modal.jsx                  Modal route

  src/
    components/
      common/                  Reusable app components
      navigation/              Navigation-specific components
      ui/                      Small UI primitives
    constants/                 Theme and app constants
    features/
      admins/
        data/                  Admin seed data and defaults
        screens/               Admin feature screens
    hooks/                     Shared React hooks

  assets/                      Images and native app icons
  scripts/                     Project maintenance scripts
```

## Rules For New Code

- Put route files only in `app`.
- Put business features in `src/features/<feature-name>`.
- Put reusable UI in `src/components`.
- Put shared hooks in `src/hooks`.
- Put constants in `src/constants`.
- Keep route files small; import the real screen from `src/features`.
