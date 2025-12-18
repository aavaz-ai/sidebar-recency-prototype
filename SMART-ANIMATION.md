# Smart Animation Mode

## Overview

The **Smart** animation mode is an intelligent animation system that automatically chooses the most appropriate animation technique based on whether the item being moved is currently visible in the viewport. This provides the best user experience by using smooth FLIP animations for visible items and efficient fade transitions for off-screen items.

## How It Works

The smart mode uses a **viewport detection** strategy to determine which animation to apply:

### 1. Viewport Detection

Before animating, the system checks if the item is currently visible:

```typescript
const isInViewport =
  startRect && sidebarRect && 
  startRect.top >= sidebarRect.top && 
  startRect.bottom <= sidebarRect.bottom
```

This checks if the item's bounding box is fully within the sidebar's visible area.

### 2. Animation Strategy

#### **Off-Screen Items** (Not in Viewport)
When an item is not visible, the system uses a **fade animation**:

1. **Fade Out** (200ms): The item fades to opacity 0
2. **State Update**: The item is moved to the top of the list (group changed to "today")
3. **Scroll Reset**: Sidebar scrolls to top
4. **Fade In** (250ms): The item fades back in at its new position
5. **Highlight**: Brief highlight pulse to draw attention

**Total Duration**: ~500ms

**Why fade for off-screen?**
- Off-screen items aren't visible during the transition anyway
- Fade is more performant than calculating complex transforms
- Provides smooth visual feedback when the item appears at the top

#### **Visible Items** (In Viewport)
When an item is visible, the system uses a **FLIP animation**:

1. **First**: Capture the item's current position (`startRect`)
2. **Last**: Update state and capture new position (`endRect`)
3. **Invert**: Calculate the delta (`deltaY = startRect.top - endRect.top`)
4. **Play**: Animate from the calculated offset to the final position

**FLIP Animation Steps**:
```typescript
// 1. Calculate distance to move
const deltaY = startRect.top - endRect.top

// 2. Position element at starting point (inverted)
newElement.style.transform = `translateY(${deltaY}px)`
newElement.style.transition = "none"

// 3. Force reflow
newElement.offsetHeight

// 4. Animate to final position
newElement.style.transition = "transform 350ms ease-out"
newElement.style.transform = "translateY(0)"
```

**Total Duration**: ~350ms

**Why FLIP for visible items?**
- Creates a smooth, continuous motion that users can follow
- Provides spatial context - users see the item moving from its old position
- More engaging and polished than instant teleportation
- Follows the item's natural path, making the UI feel more responsive

### 3. Highlight Effect

After the animation completes, the item receives a subtle highlight pulse:
- **Duration**: 1 second
- **Effect**: Gentle blue background fade from 15% to 2% opacity
- **Purpose**: Draws user attention to the newly moved item

## Code Location

The smart animation logic is implemented in `app/page.tsx`:
- **Lines 209-287**: Main smart mode implementation
- **Lines 116-117**: Viewport detection logic
- **Lines 211-248**: Off-screen fade animation path
- **Lines 249-286**: Visible item FLIP animation path

## Comparison with Other Modes

| Mode | Use Case | Animation Type | Duration |
|------|----------|----------------|----------|
| **Smart** | Default (automatic) | Fade or FLIP based on visibility | 350-500ms |
| Fade | Simple transitions | Always fade | ~500ms |
| Scroll | Long distances | Scroll then FLIP | ~950ms |
| Teleport | Instant updates | No animation, strong highlight | ~50ms |

## Benefits

1. **Performance**: Uses the most efficient animation for each situation
2. **User Experience**: Visible items get smooth motion, off-screen items don't waste resources
3. **Automatic**: No manual configuration needed - it just works
4. **Responsive**: Adapts to scroll position and viewport state

## Technical Details

- Uses `getBoundingClientRect()` for position calculations
- Leverages `requestAnimationFrame` for smooth animations
- CSS transitions for hardware-accelerated animations
- Transform-based animations (better performance than position changes)
