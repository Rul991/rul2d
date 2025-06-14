## Rul2d Changelog

### v2.1.0

- Initial release

### v2.1.1-2.1.2

- Fixed camera bug with viewport
- Added new classes: `LocalStorageManager` and `StorageEvent`
- Other minor changes:
  - Added method `emitDefault` to `EventEmitter`
  - Added flag to `GameWorld`: `useCulling`

### v2.1.3

- Fixed bugs with `PointerInputManager` in `GameWorld`
- Added support for image drawing with `CanvasImage`
- Added `AssetsManager`, `Triangle`, and `FollowedCamera` classes
- Created documentation in Russian and English

### v2.1.4

- `AssetsManager` can cache audio and binary data
- `AssetsManager` can clear cache
- Added audio support with `BaseAudio`
- Added `Logging` class and logging level enum
- Some classes became logged
- Added new enums for error messages
- Added new classes:
  - `RangeWrapper`
    - Class behaves like bounds, but when a number exceeds the limit, it wraps around to the opposite boundary
  - `AnimatedSprite`
    - Class for image animations
  - `SpriteSheet`
    - Class that divides an image into a grid and renders a selected cell
- Added timers
- Package uses only UMD now
- The package size was reduced by Terser

### v2.1.5

- Added support for UI drawing
- Added import from JSON file for `CanvasImage`, `SpriteSheet`, and `AnimatedSprite`
- Fixed bug with z-index drawing
- Culling now works fully
- `Shape.isPointInShape` now uses ray casting
- Added collision checking support for `Shape`
- Added new class: `SAT`
- Updated `simplify` for some classes

### v2.1.6

- Added new classes: 
  - `PositionedAudio`
  - `StereoPositionedAudio`
  - `RelativeShape`
- Fixed bug with `GameEntity`'s factRect
- Updated culling
- Added new `Camera`'s static methods:
  - `loadCameraFromStorage` - set camera's position and zoom from localStorage
  - `addStandardCameraSaver` - save camera's position and zoom in localStorage
- Changed `BaseAudio`'s parent to `DrawableObject`
- Fixed `Shape`'s bug with empty corners' array
- Added new enums:
  - `DrawMode`

### v2.1.7

- Added new classes:
  - `DrawableText` - draw text on canvas
  - `RoundedRectangle` - draw rectangle with rounded corners on canvas
- `CachedValue` can use one parameter for update which is passed via the `CachedValue.get`
- `_drawMode_` replaced to `DrawableObject` from `Shape`
- Fixed bug with uiObjects' `init` in `GameScene`

### v2.1.8-2.1.9

- Renamed `DrawableText` to `DynamicText`
- Added new class: `StaticText`
  - Similar to `DynamicText`, but uses texture rendering for drawing
- Fixed bug with camera viewport updates
- Corrected text alignment issue
- Added `INetClient` interface for network functionality

### v2.2.0

- Added new methods for `GameObject`: `_preload` and `_create`
- `GameWorld` can process new `GameObject`'s methods
- Fixed bug with `viewport` in `FollowedCamera`
- Added new methods for `KeyStateManager`: 
  - `trackKeyState`
  - `trackVector`
  - `trackAxis`
- Added new methods for `CanvasImage`: 
  - `setSizeByImage`
- Added new classes:
  - `LinearGradient`
  - `HotKey`

### v2.2.1

- `GameWorld` now automatically adds `PointerableObject`.
- `KeyboardManager` can now process keys with ignored modifiers.
- Fixed a bug with updating the `Camera.viewport` via `Camera.zoom` setting.
- `KeyboardManager` and `KeyStateManager` now use `HotKey` instead of `key` and `options`.
- `PointerInputManager` now works as expected.

### v2.2.2

- `ShapeDrawMode` renamed to `DrawMode`
- Added new classes:
  - `DrawablePath`
- `Shape` has `outlineColor` now
- Fixed support of touches
- Add support custom functionalities in `GameWorld`

### v2.2.3

- `DynamicText` get custom text rendering

### 2.2.4

- `DrawableObject` get `_fill` and `_stroke`
- All objects get `_fill` and `_stroke`
- New objects has `zIndex` like his id for default
- `UIObject`, `GameEntity`, `GameScene` now abstract
- `UIObject` get abstract `setSize`
- `EventEmitter` stopped using events
- `ValueEvent` deleted
- Start make `FormattedTextRendering`