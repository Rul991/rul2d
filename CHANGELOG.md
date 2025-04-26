## Rul2d's Changelog

### v2.1.0

- Initial release

### v2.1.1-2.1.2

- Fixed camera bug with viewport
- Added new classes: LocalStorageManager and StorageEvent
- Other minor changes:
  - Added method `emitDefault` to EventEmitter
  - Added flag to GameWorld: `useCulling`

### v2.1.3

- Fixed bugs with PointerInputManager in GameWorld
- Added support for image drawing with CanvasImage
- Added AssetsManager, Triangle, and FollowedCamera classes
- Created documentation in Russian and English

### v2.1.4

- AssetsManager can cache audio and binary data
- AssetsManager can clear cache
- Added audio support with BaseAudio
- Added logging class and logging level enum
- Some classes became logged
- Added new enums for error messages
- Added new classes:
  - RangeWrapper
    - Class behaves like bounds, but when a number exceeds the limit, it wraps around to the opposite boundary
  - AnimatedSprite
    - Class for image animations
  - SpriteSheet
    - Class that divides an image into a grid and renders a selected cell
- Added timers
- Package uses only UMD now
- The package size was reduced by Terser
