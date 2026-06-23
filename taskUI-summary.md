# Tasker UI Summary

## Overview


Role mapping hiện tại:

```txt
staff = tasker
```

Nghĩa là login bằng staff account sẽ thấy Tasker UI thay vì Admin UI.

## Implemented Screens

Đã implement đủ 12 màn hình Tasker:

1. `TaskerHomeScreen` - Dashboard 
2. `NearbyTasksScreen` - Nearby tasks/map
3. `TaskDetailScreen` - Task detail 
4. `AcceptTaskScreen` - Accept success/action 
5. `MyAcceptedTasksScreen` - Accepted tasks 
6. `TaskHistoryScreen` - History 
7. `MessagesScreen` - Chat 
8. `NotificationsScreen` - Notifications
9. `TaskerProfileScreen` - Profile 
10. `EarningsDashboardScreen` - Earnings 
11. `ReviewsRatingsScreen` - Reviews 
12. `ScheduleCalendarScreen` - Schedule 

## Bottom Navigation

Đã thêm custom Tasker bottom navigation theo Stitch, gồm 5 item:

```txt
Home | Search | Create | History | Profile
```

Chi tiết:

- `Home`: icon home, mở Dashboard
- `Search`: icon search, mở Nearby Tasks
- `Create`: nút tròn tím nổi ở giữa, icon plus, mở Accept/action screen
- `History`: icon clock/history, mở Task History
- `Profile`: icon user, mở Tasker Profile

Với role `staff`, Expo tab bar mặc định được ẩn để tránh chỉ còn 2 tab `Tìm việc / Cá nhân`. Admin/client vẫn giữ tab behavior cũ.

## Files Created

```txt
mockdata/tasker.json
src/tasker/index.tsx
src/tasker/types.ts
src/tasker/taskerTheme.ts
src/tasker/components/TaskerBottomNav.tsx
src/tasker/taskerHomeLayout/index.tsx
src/tasker/taskerHomeLayout/components/TaskerPrimitives.tsx
src/tasker/taskerHomeLayout/screen/taskerHomeScreen.tsx
src/tasker/taskerTasksLayout/index.tsx
src/tasker/taskerTasksLayout/screen/nearbyTasksScreen.tsx
src/tasker/taskerTasksLayout/screen/taskDetailScreen.tsx
src/tasker/taskerTasksLayout/screen/acceptTaskScreen.tsx
src/tasker/taskerTasksLayout/screen/myAcceptedTasksScreen.tsx
src/tasker/taskerTasksLayout/screen/taskHistoryScreen.tsx
src/tasker/taskerMessagesLayout/index.tsx
src/tasker/taskerMessagesLayout/screen/messagesScreen.tsx
src/tasker/taskerMessagesLayout/screen/notificationsScreen.tsx
src/tasker/taskerProfileLayout/index.tsx
src/tasker/taskerProfileLayout/screen/taskerProfileScreen.tsx
src/tasker/taskerProfileLayout/screen/earningsDashboardScreen.tsx
src/tasker/taskerProfileLayout/screen/reviewsRatingsScreen.tsx
src/tasker/taskerProfileLayout/screen/scheduleCalendarScreen.tsx
```

## Files Modified

```txt
app/(tabs)/_layout.tsx
mockdata/index.tsx
nativewind-env.d.ts
src/layouts/tabsLayout/screen/homeScreen.tsx
src/layouts/tabsLayout/screen/profileScreen.tsx
```

## Integration Details

### `homeScreen.tsx`

Staff session now renders:

```txt
TaskerHomeScreen
```

Client and admin behavior is preserved.

### `profileScreen.tsx`

Staff session now renders:

```txt
TaskerProfileScreen
```

Client and admin profile behavior is preserved.

### `app/(tabs)/_layout.tsx`

For staff:

- Expo default tab bar is hidden.
- Custom Tasker bottom nav is used inside Tasker screens.

For admin/client:

- Existing Expo tabs stay active.
- Existing tab colors and icons are preserved.

### `mockdata/index.tsx`

Added export:

```ts
export const mockTaskerData = mockTasker;
```

## Styling

Tasker UI follows Stitch visual direction:

- Background: `#F9F9FF`
- Primary: `#3525CD`
- Secondary: `#831ADA`
- Card surface: white
- Soft border: `#C7C4D8`
- Rounded cards, mostly `rounded-xl`
- Light shadows via shared `taskerShadow`
- Icons via `lucide-react-native`
- NativeWind `className` preferred

Shared Tasker primitives:

```txt
TaskerHeader
TaskerCard
TaskerPill
IconTile
GradientButton
SectionTitle
MiniBarChart
TaskerBottomNav
```

## Mock Data

Tasker mock data lives in:

```txt
mockdata/tasker.json
```

It contains:

- profile info
- nearby tasks
- accepted tasks
- task history
- messages
- notifications
- transactions
- reviews
- schedule

No backend, realtime, or persistent storage was added.

## How To Test

Run app:

```bash
npm start
```

Login with staff account:

```txt
Email: mai.lt@taskly.com
Password: Taskly@123
```

Expected:

```txt
Home tab -> Tasker Dashboard
Bottom nav -> Home | Search | Create | History | Profile
```

Test bottom nav:

1. `Home` opens Dashboard.
2. `Search` opens Nearby Tasks.
3. `Create` opens Accept/action screen.
4. `History` opens Task History.
5. `Profile` opens Tasker Profile.

Dashboard quick actions still open the remaining screens:

- Task Detail
- My Accepted Tasks
- Messages
- Notifications
- Earnings
- Reviews
- Schedule

## Quality Checks

Both commands passed:

```bash
npx tsc --noEmit
npm run lint
```

## Notes / Limitations

- UI is mock-only.
- Map is a React Native placeholder, no map SDK.
- Charts are View-based placeholders, no chart package.
- Stitch Material Symbols were replaced with nearest `lucide-react-native` icons.
- No backend.
- No realtime chat.
- No persistent session.
- Admin/client flows were intentionally kept unchanged.
