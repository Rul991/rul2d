# Документация Rul2D

Rul2D — это библиотека для разработки 2D-игр, предназначенная для создания интерактивных приложений и игр в браузере с использованием HTML5 canvas. Она предоставляет набор классов и утилит для управления игровыми объектами, рендеринга графики, обработки ввода и многого другого. Эта документация содержит подробное руководство по всем компонентам библиотеки, включая описания классов, свойств, методов и примеры.

## Содержание

- [Документация Rul2D](#документация-rul2d)
  - [Содержание](#содержание)
  - [Основные классы](#основные-классы)
    - [CustomObject](#customobject)
    - [DrawableObject](#drawableobject)
    - [GameObject](#gameobject)
    - [GameScene](#gamescene)
    - [GameWorld](#gameworld)
    - [Point](#point)
    - [Shape](#shape)
    - [Rectangle](#rectangle)
    - [Circle](#circle)
    - [Triangle](#triangle)
    - [ShapeableObject](#shapeableobject)
    - [PointerableObject](#pointerableobject)
    - [CanvasImage](#canvasimage)
    - [Camera](#camera)
    - [FollowedCamera](#followedcamera)
    - [GameEntity](#gameentity)
  - [Утилитарные классы](#утилитарные-классы)
    - [Angle](#angle)
    - [AssetsManager](#assetsmanager)
    - [Bounds](#bounds)
    - [CachedValue](#cachedvalue)
    - [Color](#color)
    - [MathUtils](#mathutils)
    - [Random](#random)
    - [Size](#size)
    - [SimpleRect](#simplerect)
    - [Search](#search)
    - [Sorting](#sorting)
    - [VectorUtils](#vectorutils)
    - [CanvasManager](#canvasmanager)
    - [KeyboardManager](#keyboardmanager)
    - [KeyStateManager](#keystatemanager)
    - [PointerInputManager](#pointerinputmanager)
    - [LocalStorageManager](#localstoragemanager)
  - [Интерфейсы](#интерфейсы)
    - [IAngle](#iangle)
    - [IAngleable](#iangleable)
    - [IMinMax](#iminmax)
    - [ISimplePoint](#isimplepoint)
    - [IPointerable](#ipointerable)
    - [IRoot](#iroot)
    - [ISimpleSize](#isimplesize)
    - [ISizeable](#isizeable)
    - [IRectangle](#irectangle)
    - [ISimpleRect](#isimplerect)
    - [ISimpleDrawableObject](#isimpledrawableobject)
    - [ISimpleCamera](#isimplecamera)
    - [ISimpleShape](#isimpleshape)
    - [IGameWorldBuilder](#igameworldbuilder)
    - [IKeyOptions](#ikeyoptions)
    - [IShapeConfig](#ishapeconfig)
    - [IManager](#imanager)
    - [IEventOptions](#ieventoptions)
    - [IControlManager](#icontrolmanager)
  - [Классы событий](#классы-событий)
    - [ValueEvent](#valueevent)
    - [StorageEvent](#storageevent)

---

## Основные классы

### CustomObject

> *Абстрактный*

**Описание:**  
Базовый класс для всех классов в Rul2D. Предоставляет базовую функциональность, такую как уникальный идентификатор и методы для логирования, сериализации и представления в виде строки или числа.

**Свойства:**

- **Статические:**
  - `createdObjectsCount`: *number* - Счетчик созданных экземпляров `CustomObject`.

- **Экземпляра:**
  - `_id`: *number* - Приватный уникальный идентификатор экземпляра.

**Геттеры/Сеттеры:**

- `get id`: *number* - Возвращает уникальный идентификатор объекта, основанный на количестве созданных экземпляров.

**Методы:**

- `log(): void`  
  Выводит объект в консоль через `console.log`.

- `simplify(): object`  
  Возвращает упрощенную версию объекта для сериализации или передачи по сети. По умолчанию возвращает пустой объект.

- `toString(): string`  
  Возвращает строковое представление объекта в формате `ИмяКласса {ключ1: значение1, ключ2: значение2, ...}` на основе метода `simplify`.

- `valueOf(): number`  
  Возвращает числовое представление объекта. По умолчанию `NaN`.

**Пример:**
```javascript
const obj = new CustomObject();
console.log(obj.id); // 0
obj.log(); // Выводит объект в консоль
console.log(obj.toString()); // "CustomObject {}"
console.log(obj.valueOf()); // NaN
```

---

### DrawableObject

> *Абстрактный, Наследует [CustomObject](#customobject)*

**Описание:**  
Базовый класс для объектов, которые могут быть отрисованы на HTML5 canvas. Предоставляет свойства и методы для управления видимостью, рендерингом и иерархическими отношениями.

**Свойства:**

- **Статические:**
  - `positiveNumberBounds`: [Bounds](#bounds) - Ограничивает значения диапазоном от `Number.EPSILON` до `Number.MAX_SAFE_INTEGER`.
  - `opacityBounds`: [Bounds](#bounds) - Ограничивает прозрачность диапазоном от 0 до 1.

- **Экземпляра:**
  - `isVisible`: *boolean* - Определяет, виден ли объект на канвасе.
  - `isInViewport`: *boolean* - Указывает, находится ли объект в области видимости камеры.
  - `managers`: *Set<[IManager](#imanager)>* - Множество менеджеров, связанных с объектом.
  - `root`: [CurrentRoot](#currentroot) - Родительский объект (например, `GameEntity` или `GameScene`). По умолчанию `null`.
  - `eventEmitter`: [EventEmitter](#eventemitter) - Обработчик событий объекта.
  - `_lineWidth`: *number* - Толщина линий для рендеринга (по умолчанию 1).
  - `_color`: [Color](#color) - Цвет объекта (по умолчанию зеленый).
  - `_opacity`: *number* - Прозрачность объекта (по умолчанию 1).
  - `_zIndex`: *number* - Порядок отрисовки (по умолчанию 1).
  - `_offset`: [ISimplePoint](#isimplepoint) - Смещение относительно корня (по умолчанию `{ x: 0, y: 0 }`).

**Геттеры/Сеттеры:**

- `get canBeSubObject`: *boolean* - Указывает, может ли объект быть дочерним для `GameObject`. По умолчанию `true`.
- `set/get zIndex`: *number* - Устанавливает или возвращает порядок отрисовки; обновляет менеджеры при установке.
- `get inheritOpacity`: *number* - Возвращает эффективную прозрачность с учетом родителя.
- `set/get color`: [Color](#color) - Устанавливает или возвращает цвет объекта.
- `set/get opacity`: *number* - Устанавливает или возвращает прозрачность, ограниченную `opacityBounds`.
- `set/get lineWidth`: *number* - Устанавливает или возвращает толщину линии, ограниченную `positiveNumberBounds`.
- `set/get offset`: [ISimplePoint](#isimplepoint) - Устанавливает или возвращает смещение.
- `abstract get factRect`: [ISimpleRect](#isimplerect) - Должен возвращать ограничивающий прямоугольник для отсечения.

**Методы:**

- `setVisibility(value: boolean): void`  
  Устанавливает видимость объекта.

- `setColor(color: Color): void`  
  Устанавливает цвет объекта.

- `setOffset(x: number, y: number): void`  
  Устанавливает позицию смещения.

- `abstract updatePositionByOffset(point: ISimplePoint): void`  
  Обновляет позицию объекта на основе смещения и позиции корня (должен быть реализован в подклассах).

- `updateColor(ctx: Context, color?: Color): void`  
  Обновляет стили заливки и обводки контекста канваса указанным цветом (по умолчанию цвет объекта).

- `updateContextParameters(ctx: Context, color?: Color): void`  
  Обновляет параметры контекста: цвет, толщину линии и глобальную прозрачность.

- `init(world: GameWorld): void`  
  Инициализирует объект при добавлении в `GameWorld` или `GameScene`. По умолчанию пустой.

- `needDraw(): boolean`  
  Возвращает `true`, если объект видим и находится в области видимости.

- `update(delta: number): void`  
  Обновляет состояние объекта каждый кадр. По умолчанию пустой.

- `protected abstract _draw(ctx: Context): void`  
  Определяет основную логику отрисовки без изменения параметров контекста (должен быть реализован в подклассах).

- `abstract isObjectInViewport(camera: Camera): boolean`  
  Проверяет, находится ли объект в области видимости камеры (должен быть реализован в подклассах).

- `draw(ctx: Context): void`  
  Отрисовывает объект, если `needDraw` возвращает `true`, управляя настройкой и восстановлением контекста.

**Пример:**
```javascript
class MyDrawable extends DrawableObject {
  get factRect() { return new SimpleRect(0, 0, 10, 10); }
  updatePositionByOffset(point) { /* Реализация */ }
  _draw(ctx) { ctx.fillRect(0, 0, 10, 10); }
  isObjectInViewport(camera) { return true; }
}
const drawable = new MyDrawable();
drawable.draw(context); // Отрисовывает зеленый прямоугольник 10x10
```

---

### GameObject

> *Наследует [DrawableObject](#drawableobject)*

**Описание:**  
Контейнерный класс для группировки и управления несколькими экземплярами `DrawableObject`, отвечающий за их отрисовку и обновление.

**Свойства:**

- `_objects`: *DrawableObject[]* - Массив дочерних объектов.

**Методы:**

- `addObject(object: DrawableObject): boolean`  
  Добавляет дочерний объект, если он может быть подчиненным, сортируя по `zIndex`. Возвращает `true` при успехе.

- `removeObject(object: DrawableObject): boolean`  
  Удаляет дочерний объект, возвращая `true` при успехе.

- `forEach(callback?: (obj: DrawableObject, index: number) => void): void`  
  Перебирает дочерние объекты, вызывая callback.

- `protected _draw(ctx: Context): void`  
  Отрисовывает все дочерние объекты.

- `updateObjects(delta: number): void`  
  Обновляет все дочерние объекты.

- `updatePositionByOffset(point: ISimplePoint): void`  
  По умолчанию ничего не делает.

- `protected _update(delta: number): void`  
  Вызывает `updateObjects`.

- `update(delta: number): void`  
  Вызывает `_update`.

- `updateZIndex(): void`  
  Сортирует дочерние объекты по `zIndex` с использованием сортировки слиянием.

- `isObjectInViewport(camera: Camera): boolean`  
  Всегда возвращает `true`.

- `get factRect`: [ISimpleRect](#isimplerect)  
  Возвращает прямоугольник 1x1 в точке (0,0).

---

### GameScene

> *Наследует [GameObject](#gameobject)*

**Описание:**  
Представляет игровую сцену, управляющую набором экземпляров `GameObject` в пределах `GameWorld`.

**Геттеры/Сеттеры:**

- `get canBeSubObject`: *boolean* - Возвращает `false`.

**Методы:**

- `init(world: GameWorld): void`  
  Инициализирует сцену и ее дочерние объекты при добавлении в `GameWorld`.

---

### GameWorld

> *Наследует [CustomObject](#customobject)*

**Описание:**  
Основной класс для управления игрой, включая канвас, камеру, ввод и сцены.

**Свойства:**

- `downKeyboardManager`: [KeyboardManager](#keyboardmanager) - Обрабатывает события нажатия клавиш.
- `upKeyboardManager`: [KeyboardManager](#keyboardmanager) - Обрабатывает события отпускания клавиш.
- `keyStateManager`: [KeyStateManager](#keystatemanager) - Отслеживает состояния клавиш.
- `pointerManager`: [PointerInputManager](#pointerinputmanager) - Управляет вводом указателя.
- `isUseCulling`: *boolean* - Включает/отключает отсечение.

**Геттеры/Сеттеры:**

- `get zIndex`: *number* - Возвращает 1.
- `get inheritOpacity`: *number* - Возвращает глобальную прозрачность контекста канваса.
- `get canvasManager`: [CanvasManager](#canvasmanager) - Возвращает менеджер канваса.
- `set/get camera`: [Camera](#camera) - Устанавливает или возвращает камеру.

**Методы:**

- `static createGameLoop(callback: (delta: number, lastDelta: number, prevTime: number) => void): number`  
  Запускает игровой цикл, возвращая ID анимационного кадра.

- `constructor({ root, camera, size, useCulling }?: IGameWorldBuilder)`  
  Инициализирует игровой мир с опциональными параметрами.

- `addScene(key: string, scene: GameScene): void`  
  Добавляет сцену с ключом.

- `removeScene(key: string): void`  
  Удаляет сцену по ключу.

- `setScene(key: string): void`  
  Устанавливает активную сцену.

- `getScene(): GameScene | null`  
  Возвращает текущую сцену.

- `addControls(): void`  
  Настраивает обработчики ввода.

- `start(): void`  
  Запускает игровой цикл и обработку ввода.

---

### Point

> *Наследует [DrawableObject](#drawableobject)*

**Описание:**  
Представляет 2D-точку, которую можно отрисовать на канвасе.

**Свойства:**

- **Статические:**
  - `drawRadius`: *number* - Радиус для отрисовки точки (по умолчанию 3).

- **Экземпляра:**
  - `_x`, `_y`: *number* - Координаты.

**Геттеры/Сеттеры:**

- `set/get x`, `y`: *number* - Координаты.
- `set/get point`: [ISimplePoint](#isimplepoint) - Устанавливает или возвращает позицию.
- `get factRect`: [ISimpleRect](#isimplerect) - Возвращает прямоугольник 1x1 в точке.

**Методы:**

- `static get NaN(): Point`  
  Возвращает точку с координатами NaN.

- `static fromSimplePoint({ x, y }: ISimplePoint): Point`  
  Создает точку из координат.

- `updatePositionByOffset({ x, y }: ISimplePoint): void`  
  Корректирует позицию на основе смещения.

- `setPosition(x?: number, y?: number): void`  
  Устанавливает координаты, по умолчанию 0.

- `addPosition(x: number, y: number): void`  
  Добавляет к текущей позиции.

- `move({ x, y }: ISimplePoint, delta: number): void`  
  Перемещает на масштабированный вектор.

- `drawPoint(ctx: Context): void`  
  Отрисовывает точку как концентрические круги.

- `protected _draw(ctx: Context): void`  
  Вызывает `drawPoint`.

- `isObjectInViewport(camera: Camera): boolean`  
  Проверяет, находится ли точка в области видимости.

---

### Shape

> *Абстрактный, Наследует [Point](#point)*

**Описание:**  
Абстрактный класс для 2D-форм, предоставляющий позиционирование, размеры, вращение и проверку столкновений.

**Свойства:**

- `_size`: [Size](#size) - Размеры формы.
- `_angle`: [Angle](#angle) - Угол поворота.
- `_flipDirection`: [Point](#point) - Коэффициенты отражения.

**Геттеры/Сеттеры:**

- `get bottom`, `right`: *number* - Границы ограничивающего прямоугольника.
- `set/get size`: [ISimpleSize](#isimplesize) - Размеры формы.
- `set/get center`: [ISimplePoint](#isimplepoint) - Центр формы.
- `set/get angle`: [Angle](#angle) - Угол поворота.

**Методы:**

- `flip(x: boolean, y: boolean): void`  
  Отражает форму по горизонтали и/или вертикали.

- `getCorners(): Point[]`  
  Возвращает углы формы.

- `getBox(): ISimpleRect`  
  Возвращает ограничивающий прямоугольник.

- `getPath(): Path2D`  
  Возвращает Path2D формы.

- `needUpdate(value?: boolean | null): void`  
  Помечает кэшированные значения для обновления.

- `isObjectInViewport(camera: Camera): boolean`  
  Проверяет пересечение с областью видимости.

- `setPosition(x?: number, y?: number): void`  
  Устанавливает позицию и обновляет кэш.

- `setSize(width?: number, height?: number): void`  
  Устанавливает размеры и обновляет кэш.

- `setAngle(angle: Angle): void`  
  Устанавливает угол и обновляет кэш.

- `addAngle(angle: Angle): void`  
  Добавляет угол и обновляет кэш.

- `stroke(ctx: Context, color?: Color): void`  
  Обводит контур формы.

- `fill(ctx: Context, color?: Color): void`  
  Заполняет форму.

- `clip(ctx: Context, callback: (path: Path2D) => void): void`  
  Обрезает контекст по форме.

- `drawOutline(ctx: Context, color?: Color): void`  
  Отрисовывает контур.

- `protected _draw(ctx: Context): void`  
  По умолчанию заполняет форму.

- `isPointInBoundingBox(point: Point): boolean`  
  Проверяет, находится ли точка в ограничивающем прямоугольнике.

- `isBoxesIntersects(other: ISimpleRect): boolean`  
  Проверяет пересечение прямоугольников.

- `isPointInShape(point: Point): boolean`  
  Проверяет, находится ли точка внутри формы.

- `drawTransformed(ctx: Context, cb: (x: number, y: number, width: number, height: number) => void): void`  
  Применяет трансформации и вызывает callback.

---

### Rectangle

> *Наследует [Shape](#shape)*

**Описание:**  
Прямоугольная форма с поддержкой вращения.

**Геттеры/Сеттеры:**

- `set/get rect`: [ISimpleRect](#isimplerect) - Позиция и размеры.
- `set/get rotatedRectangle`: [Rectangle](#rectangle) - Повернутый прямоугольник.

**Методы:**

- `protected _updateCorners(): Point[]`  
  Вычисляет повернутые углы.

- `static from(position: ISimplePoint, size: ISimpleSize): Rectangle`  
  Создает из позиции и размеров.

- `static fromSimpleRectangle(rect: ISimpleRect): Rectangle`  
  Создает из простого прямоугольника.

- `static fromPoints(first: Point, second: Point): Rectangle`  
  Создает из двух точек.

---

### Circle

> *Наследует [Shape](#shape)*

**Описание:**  
Круглая форма с радиусом.

**Свойства:**

- `_radius`: *number* - Радиус круга.

**Геттеры/Сеттеры:**

- `set/get radius`: *number* - Радиус круга.

**Методы:**

- `protected _updateCorners(): Point[]`  
  Приближает углы для проверки столкновений.

- `protected _updateBox(): ISimpleRect`  
  Возвращает ограничивающий прямоугольник.

- `protected _updatePath(): Path2D`  
  Создает круговой Path2D.

- `isPointInShape(point: Point): boolean`  
  Использует расстояние для проверки включения точки.

- `setRadius(radius?: number): void`  
  Устанавливает радиус и обновляет размеры.

- `setSize(width?: number, height?: number): void`  
  Корректирует радиус на основе размеров.

---

### Triangle

> *Наследует [Shape](#shape)*

**Описание:**  
Треугольная форма с тремя вершинами.

**Методы:**

- `protected _updateCorners(): Point[]`  
  Вычисляет углы треугольника.

---

### ShapeableObject

> *Наследует [DrawableObject](#drawableobject)*

**Описание:**  
Комбинирует `DrawableObject` с `Shape` для рендеринга и взаимодействия.

**Свойства:**

- `_shape`: [Shape](#shape) - Связанная форма.

**Геттеры/Сеттеры:**

- `set/get shape`: [Shape](#shape) - Форма.
- Делегирует `point`, `x`, `y` и т.д. форме.

**Методы:**

- `setShape(shape: Shape): void`  
  Устанавливает форму.

- `setAngle(angle: Angle): void`  
  Устанавливает угол формы.

- `addAngle(angle: Angle): void`  
  Добавляет угол формы.

- `isPointInShape(point: Point): boolean`  
  Проверяет включение точки.

- `protected _draw(ctx: Context): void`  
  Отрисовывает форму.

- `update(delta: number): void`  
  Обновляет форму.

- `isObjectInViewport(camera: Camera): boolean`  
  Делегирует проверку форме.

---

### PointerableObject

> *Наследует [ShapeableObject](#shapeableobject)*

**Описание:**  
Добавляет взаимодействие с указателем к `ShapeableObject`.

**Свойства:**

- `isPressed`: *boolean* - Указывает, нажат ли объект.

**Методы:**

- `doWhenDown(cb: PointerCallback): void`  
  Устанавливает callback для нажатия.

- `doWhenUp(cb: PointerCallback): void`  
  Устанавливает callback для отпускания.

- `doWhenPressed(cb: PointerCallback): void`  
  Устанавливает callback для удержания.

- `doWhenHover(cb: PointerCallback): void`  
  Устанавливает callback для наведения.

- `doIfNotAnyInteracted(cb: PointerCallback): void`  
  Устанавливает callback для отсутствия взаимодействия.

- `drawOutline(ctx: Context, color?: Color): void`  
  Отрисовывает контур, красный при нажатии.

---

### CanvasImage

> *Наследует [ShapeableObject](#shapeableobject)*

**Описание:**  
Отрисовывает изображение на канвасе с обрезкой и трансформациями.

**Свойства:**

- `_image`: *HTMLImageElement | null* - Изображение.
- `_isLoaded`: *boolean* - Указывает, загружено ли изображение.

**Методы:**

- `setImage(image: HTMLImageElement): void`  
  Устанавливает изображение.

- `loadImage(src: string): void`  
  Загружает изображение по URL.

- `isLoaded(): boolean`  
  Проверяет, загружено ли изображение.

- `cutImage(x: number, y: number, width: number, height: number): void`  
  Устанавливает прямоугольник обрезки.

- `protected _draw(ctx: Context): void`  
  Отрисовывает изображение с трансформациями.

---

### Camera

> *Наследует [CustomObject](#customobject)*

**Описание:**  
Управляет видом игры с помощью трансляции, масштабирования и вращения.

**Свойства:**

- `_ctx`: *Context | null* - Контекст канваса.
- `_zoom`: *number* - Уровень масштаба.
- `_position`: [Point](#point) - Позиция камеры.
- `_angle`: [Angle](#angle) - Угол поворота.

**Геттеры/Сеттеры:**

- `set/get zoom`: *number* - Уровень масштаба.
- `set/get point`: [PointType](#pointtype) - Позиция.
- `get viewport`: [Rectangle](#rectangle) - Видимая область.

**Методы:**

- `static addStandardWheelListener(camera: Camera): boolean`  
  Добавляет обработчики масштабирования/панорамирования.

- `setSmoothFactor(factor: number): void`  
  Устанавливает коэффициент сглаживания.

- `setSmoothing(enabled: boolean, quality: SmoothingQuality): void`  
  Настраивает сглаживание изображения.

- `updatePosition(): void`  
  Обновляет позицию к цели.

- `setPosition(x?: number, y?: number): void`  
  Устанавливает целевую позицию.

- `addPosition(x: number, y: number): void`  
  Добавляет к целевой позиции.

- `move(point: ISimplePoint, delta: number): void`  
  Перемещает целевую позицию.

- `begin(): void`  
  Сохраняет состояние контекста.

- `translate(): void`  
  Применяет трансляцию.

- `scale(): void`  
  Применяет масштабирование.

- `rotate(): void`  
  Применяет вращение.

- `end(): void`  
  Восстанавливает состояние контекста.

- `update(callback: (ctx: Context) => void): void`  
  Применяет трансформации и рендерит.

---

### FollowedCamera

> *Наследует [Camera](#camera)*

**Описание:**  
Камера, отслеживающая определенный объект.

**Свойства:**

- `_followedObject`: [FollowedCameraObject](#followedcameraobject) - Отслеживаемый объект.

**Методы:**

- `setFollowedObject(obj: FollowedCameraObject): void`  
  Устанавливает отслеживаемый объект.

- `updatePosition(): void`  
  Центрирует камеру на объекте.

- `update(callback: (ctx: Context) => void): void`  
  Обновляет с логикой родителя.

---

### GameEntity

> *Наследует [GameObject](#gameobject)*

**Описание:**  
Позиционированный `GameObject`, обновляющий позиции дочерних объектов.

**Свойства:**

- `_position`: [Point](#point) - Позиция сущности.
- `_factRect`: [CachedValue](#cachedvalue)<[ISimpleRect](#isimplerect)> - Ограничивающий прямоугольник.

**Геттеры/Сеттеры:**

- `set/get point`: [PointType](#pointtype) - Позиция.
- `get factRect`: [ISimpleRect](#isimplerect) - Ограничивающий прямоугольник.

**Методы:**

- `addObject(object: DrawablePointerable): boolean`  
  Добавляет дочерний объект и устанавливает смещение.

- `removeObject(object: DrawablePointerable): boolean`  
  Удаляет дочерний объект и сбрасывает смещение.

- `updateObjectsPosition(): void`  
  Обновляет позиции дочерних объектов.

- `protected _updateFactRect(): ISimpleRect`  
  Вычисляет ограничивающий прямоугольник.

- `isObjectInViewport(camera: Camera): boolean`  
  Проверяет пересечение с областью видимости.

- `updatePositionByOffset({ x, y }: ISimplePoint): void`  
  Обновляет позицию со смещением.

- `update(delta: number): void`  
  Обновляет сущность и дочерние объекты.

---

## Утилитарные классы

### Angle

> *Наследует [CustomObject](#customobject)*

**Описание:**  
Представляет и манипулирует углами в радианах или градусах.

**Свойства:**

- **Статические:**
  - `Pi`: *number* - π.
  - `Pi2`: *number* - 2π.
  - `Rad_1`: *number* - Радианы на градус.

- **Экземпляра:**
  - `_radians`: *number* - Угол в радианах.

**Геттеры/Сеттеры:**

- `set/get radians`: *number* - Угол в радианах, нормализованный в [0, 2π).
- `set/get degrees`: *number* - Угол в градусах.

**Методы:**

- `static degToRad(deg: number): number`  
  Конвертирует градусы в радианы.

- `static radToDeg(rad: number): number`  
  Конвертирует радианы в градусы.

- `static from(rad: number): Angle`  
  Создает из радиан.

- `static fromRadians(rad: number): Angle`  
  Псевдоним для `from`.

- `static fromDegrees(deg: number): Angle`  
  Создает из градусов.

- `setAngle(angle: Angle): void`  
  Устанавливает угол.

- `addAngle(angle: Angle): void`  
  Добавляет угол.

- `valueOf(): number`  
  Возвращает радианы.

- `toString(): string`  
  Возвращает градусы как строку.

---

### AssetsManager

> *Наследует [CustomObject](#customobject)*

**Описание:**  
Синглтон для загрузки и кэширования активов.

**Свойства:**

- **Статические:**
  - `instance`: [AssetsManager](#assetsmanager) - Экземпляр синглтона.

- **Экземпляра:**
  - `_cachedImages`, `_cachedTexts`, `_cachedJSON`: *Map* - Кэши активов.

**Методы:**

- `loadTextFile(src: string): Promise<string>`  
  Загружает и кэширует текстовый файл.

- `loadJSONFile(src: string): Promise<Record<string, any>>`  
  Загружает и кэширует JSON-файл.

---

### Bounds

> *Наследует [CustomObject](#customobject)*

**Описание:**  
Определяет диапазон для ограничения значений.

**Свойства:**

- `min`, `max`: *number* - Границы диапазона.

**Методы:**

- `set(min: number, max: number): void`  
  Устанавливает границы.

- `get(value: number): number`  
  Ограничивает значение в диапазоне.

- `simplify(): IMinMax`  
  Возвращает `{ min, max }`.

---

### CachedValue

> *Наследует [CustomObject](#customobject)*

**Описание:**  
Кэширует значение для ленивых обновлений.

**Свойства:**

- `_cachedValue`: *T* - Кэшированное значение.
- `_isNeedUpdate`: *boolean* - Флаг обновления.
- `_updateCallback`: *() => T* - Функция обновления.

**Методы:**

- `constructor(defaultValue: T)`  
  Инициализирует с начальным значением.

- `needUpdate(value?: boolean | null): void`  
  Устанавливает флаг обновления.

- `setUpdateCallback(callback?: () => T): void`  
  Устанавливает callback обновления.

- `get(): T`  
  Возвращает кэшированное значение, обновляя при необходимости.

- `update(): T`  
  Принудительно обновляет.

---

### Color

> *Наследует [CustomObject](#customobject)*

**Описание:**  
Представляет RGBA-цвет.

**Свойства:**

- **Статические:**
  - `componentBounds`: [Bounds](#bounds) - Ограничивает компоненты диапазоном [0, 255].

- **Экземпляра:**
  - `_r`, `_g`, `_b`: *number* - RGB-компоненты.
  - `_a`: *number* - Альфа (0-1).

**Методы:**

- `setRGBA(r: number, g: number, b: number, a?: number): this`  
  Устанавливает компоненты цвета.

- `toString(): string`  
  Возвращает RGBA-строку.

- `simplify(): { r: number, g: number, b: number, a: number }`  
  Возвращает компоненты цвета.

- `static from(r: number, g: number, b: number, a?: number): Color`  
  Создает цвет.

- `static random(a?: number): Color`  
  Создает случайный цвет.

- `static get Black`, `White`, `Red`, `Blue`, `Green`: *Color*  
  Предопределенные цвета.

---

### MathUtils

**Описание:**  
Предоставляет математические утилиты.

**Методы:**

- `static lerp(value: number, target: number, factor: number): number`  
  Линейная интерполяция.

- `static floor(x: number, afterDot?: number): number`  
  Округляет вниз.

- `static ceil(x: number, afterDot?: number): number`  
  Округляет вверх.

- `static round(x: number, afterDot?: number): number`  
  Округляет до ближайшего числа.

- `static updateWithAfterDotNumber(x: number, afterDot: number, callback: (power: number) => number): number`  
  Применяет функцию с точностью десятичных.

- `static percents(value: number, { min, max }?: IMinMax): number`  
  Вычисляет процент.

- `static getArrayValueByCondition<T>(array: T[], conditionCallback: (value: number, last: number) => boolean, valueCallback?: (value: T) => number): T | null`  
  Находит значение массива по условию.

- `static min<T>(values: T[], valueCallback?: (value: T) => number): T | null`  
  Находит минимальное значение.

- `static max<T>(values: T[], valueCallback?: (value: T) => number): T | null`  
  Находит максимальное значение.

---

### Random

**Описание:**  
Генерирует случайные значения.

**Методы:**

- `static number(max: number, afterDot?: number): number`  
  Случайное число до `max`.

- `static range(min: number, max: number, afterDot?: number): number`  
  Случайное число в диапазоне от min до max.

- `static chance(value: number, max: number): boolean`  
  Случайное булевое значение по вероятности.

- `static array(count: number, { min, max }?: IMinMax, afterDot?: number): number[]`  
  Возвращает массив случайных чисел.

---

### Size

> *Наследует [CustomObject](#customobject)*

**Описание:**  
Представляет ширину и высоту.

**Свойства:**

- `width`, `height`: *number* - Размеры.

**Геттеры/Сеттеры:**

- `set/get size`: [ISimpleSize](#isimplesize) - Ширина и высота.
- `set center`: Предупреждает, что не устанавливается.
- `get center`: [PointType](#pointtype) - Центральная точка.

**Методы:**

- `setSize(width?: number, height?: number): void`  
  Устанавливает размеры.

---

### SimpleRect

> *Наследует [CustomObject](#customobject)*

**Описание:**  
Простой прямоугольник с позицией и размерами.

**Свойства:**

- `x`, `y`, `width`, `height`: *number* - Параметры прямоугольника.

---

### Search

**Описание:**  
Предоставляет алгоритмы поиска.

**Методы:**

- `static binary<T>(arr: T[], target: T, callback?: SearchCallback<T>): number`  
  Бинарный поиск.

- `static findInsertPosition<T>(arr: T[], value: T, callback?: SearchCallback<T>): number`  
  Находит позицию вставки.

- `static linear<T>(arr: T[], target: number, callback?: SearchCallback<T>): number`  
  Линейный поиск.

---

### Sorting

**Описание:**  
Предоставляет утилиты сортировки.

**Методы:**

- `static addToArray<T>(arr: T[], value: T, callback?: SearchCallback<T>): number`  
  Добавляет в отсортированный массив.

- `static merge<T>(arr: T[], callback?: SearchCallback<T>): T[]`  
  Сортировка слиянием.

- `static quick<T>(arr: T[], callback?: (value: T) => number): T[]`  
  Быстрая сортировка.

---

### VectorUtils

**Описание:**  
Операции с 2D-векторами.

**Методы:**

- `static getAngle({ x, y }: ISimplePoint, { x: x1, y: y1 }: ISimplePoint): Angle`  
  Угол между точками.

- `static getDoubleDistance({ x, y }: ISimplePoint, { x: x1, y: y1 }: ISimplePoint): number`  
  Квадрат расстояния.

- `static getDistance(first: ISimplePoint, second: ISimplePoint): number`  
  Расстояние.

- `static isInDistance(first: ISimplePoint, second: ISimplePoint, maxDistance: number): boolean`  
  Проверка расстояния.

- `static magnitude(vector: ISimplePoint): number`  
  Длина вектора.

- `static cross(first: ISimplePoint, second: ISimplePoint): number`  
  Векторное произведение.

- `static dot(first: ISimplePoint, second: ISimplePoint): number`  
  Скалярное произведение.

- `static normalize(point: ISimplePoint): ISimplePoint`  
  Нормализует вектор.

- `static plus(first: ISimplePoint, second: ISimplePoint): ISimplePoint`  
  Складывает точки.

- `static minus(first: ISimplePoint, second: ISimplePoint): ISimplePoint`  
  Вычитает точки.

- `static multiply(first: ISimplePoint, second: ISimplePoint): ISimplePoint`  
  Умножает точки.

- `static div(first: ISimplePoint, second: ISimplePoint): ISimplePoint`  
  Делит точки.

- `static negative({ x, y }: ISimplePoint): ISimplePoint`  
  Отрицательный вектор.

- `static multiplyOnNumber({ x, y }: ISimplePoint, num: number): ISimplePoint`  
  Умножение на скаляр.

---

### CanvasManager

> *Наследует [CustomObject](#customobject)*

**Описание:**  
Управляет канвасом и контекстом.

**Свойства:**

- `_canvas`: *Canvas | null* - Элемент канваса.
- `_ctx`: *Context | null* - 2D-контекст.

**Методы:**

- `get canvas`: *Canvas | null* - Возвращает канвас.
- `get ctx`: *Context | null* - Возвращает контекст.
- `setCanvas(canvas: Canvas): void`  
  Устанавливает канвас.

- `getContext(): Context | null`  
  Получает или создает контекст.

- `resize({ width, height }: ISimpleSize): void`  
  Изменяет размеры канваса.

- `resizeToClientRect(): void`  
  Изменяет размеры до клиентского прямоугольника.

- `create({ root, size }?: { root?: HTMLElement, size?: ISimpleSize | null }): Canvas`  
  Создает канвас.

- `clear({ x, y }?: ISimplePoint): void`  
  Очищает канвас.

- `addStandardResizeHandler(): void`  
  Добавляет обработчик изменения размера.

---

### KeyboardManager

> *Наследует [EventEmitter](#eventemitter)<KeyboardEvent>*

**Описание:**  
Управляет вводом с клавиатуры.

**Свойства:**

- **Статические:**
  - `defaultOptions`: [IKeyOptions](#ikeyoptions) - Опции клавиш по умолчанию.

**Методы:**

- `static stringify(key: string, options?: IKeyOptions): string`  
  Создает строку клавиши с модификаторами.

- `static from(event: KeyboardEvent): string`  
  Создает строку клавиши из события.

- `addKey(key: KeyCodes, callback: KeyboardEventCallback, options?: IKeyOptions): void`  
  Добавляет callback для клавиши.

- `addKeys(keys: KeyCodes[], callback: KeyboardEventCallback, options?: IKeyOptions): void`  
  Добавляет callback для нескольких клавиш.

- `removeKey(key: string, callback: KeyboardEventCallback, options?: IKeyOptions): boolean`  
  Удаляет callback клавиши.

- `onceKey(key: KeyCodes, callback: EventCallback<KeyboardEvent>, options?: IKeyOptions): void`  
  Добавляет одноразовый callback.

- `anyKey(callback: KeyboardEventCallback, options?: IKeyOptions): void`  
  Обрабатывает любой ввод клавиши.

- `allKey(callback: KeyboardEventCallback): void`  
  Обрабатывает все события клавиш.

- `addControls(key: 'keydown' | 'keyup'): void`  
  Добавляет обработчики событий клавиш.

---

### KeyStateManager

> *Наследует [CustomObject](#customobject)*

**Описание:**  
Отслеживает состояния клавиш.

**Свойства:**

- `downKeyboardManager`, `upKeyboardManager`: [KeyboardManager](#keyboardmanager) | null - Менеджеры событий клавиш.

**Методы:**

- `setKey(key: KeyCodes, options?: IKeyOptions): void`  
  Устанавливает отслеживаемую клавишу.

- `setManager(down: KeyboardManager, up: KeyboardManager): void`  
  Устанавливает менеджеры.

- `addKeyStateHandler(downCallback: KeyboardEventCallback, upCallback: KeyboardEventCallback): void`  
  Добавляет обработчики состояния.

- `removeKeyStateHandler(downCallback?: KeyboardEventCallback, upCallback?: KeyboardEventCallback): void`  
  Удаляет обработчики.

---

### PointerInputManager

> *Наследует [CustomObject](#customobject)*

**Описание:**  
Управляет вводом указателя.

**Свойства:**

- `_pointersLocation`: *Point[]* - Позиции указателей.
- `_cursorPosition`: [Point](#point) - Позиция курсора.
- `_pointerables`: *PointerableObject[]* - Управляемые объекты.
- `_camera`: [Camera](#camera) | null - Связанная камера.

**Методы:**

- `setCamera(camera: Camera): void`  
  Устанавливает камеру.

- `getCursorPosition(): Point`  
  Возвращает позицию курсора.

- `addPointerable(obj: PointerableObject): void`  
  Добавляет объект для взаимодействия.

- `removePointerable(obj: PointerableObject): void`  
  Удаляет объект.

- `addControls(canvas: Canvas): void`  
  Добавляет обработчики событий указателя.

- `updateZIndex(): void`  
  Сортирует объекты по `zIndex`.

- `update(): void`  
  Обновляет взаимодействия указателя.

---

### LocalStorageManager

> *Наследует [EventEmitter](#eventemitter)<[StorageEvent](#storageevent)<T>, [LocalStorageEmitKeys](#localstorageemitkeys)>*

**Описание:**  
Управляет локальным хранилищем с событиями.

**Методы:**

- `set<K extends keyof T>(key: K, value: T[K]): void`  
  Устанавливает значение и вызывает событие `set`.

- `get<K extends keyof T>(key: K, defaultValue?: T[K] | null): T[K] | null`  
  Возвращает значение или значение по умолчанию.

- `getAll(): Partial<T>`  
  Возвращает все хранимые значения.

- `emitDefault(key: string): void`  
  Вызывает событие по умолчанию по заданному ключу.

---

## Интерфейсы

### IAngle

**Свойства:**

- `radians`: *number* - Угол в радианах.

---

### IAngleable

**Методы:**

- `setAngle(angle: Angle): void`
- `addAngle(angle: Angle): void`

---

### IMinMax

**Свойства:**

- `min`, `max`: *number*

---

### ISimplePoint

**Свойства:**

- `x`, `y`: *number*

---

### IPointerable

**Свойства:**

- `point`: [PointType](#pointtype)
- `x`, `y`: *number*

**Методы:**

- `setPosition(x?: number, y?: number): void`
- `addPosition(x: number, y: number): void`
- `move(point: ISimplePoint, delta: number): void`

---

### IRoot

**Свойства:**

- `inheritOpacity`, `zIndex`: *number*

---

### ISimpleSize

**Свойства:**

- `width`, `height`: *number*

---

### ISizeable

**Свойства:**

- `center`: [PointType](#pointtype)
- `size`: [ISimpleSize](#isimplesize)

**Методы:**

- `setSize(width?: number, height?: number): void`

---

### IRectangle

**Наследует:** [ISizeable](#isizeable), [IPointerable](#ipointerable)

**Свойства:**

- `bottom`, `right`: *number*

---

### ISimpleRect

**Наследует:** [ISimplePoint](#isimplepoint), [ISimpleSize](#isimplesize)

---

### ISimpleDrawableObject

**Свойства:**

- `color`: *{ r: number, g: number, b: number, a: number }*
- `lineWidth`, `opacity`, `zIndex`: *number*

---

### ISimpleCamera

**Свойства:**

- `zoom`, `x`, `y`: *number*
- `zoomLimit`: [IMinMax](#iminmax)

---

### ISimpleShape

**Свойства:**

- `size`: [ISimpleSize](#isimplesize)
- `angle`: [IAngle](#iangle)

---

### IGameWorldBuilder

**Свойства:**

- `root?`: *HTMLElement*
- `camera?`: [Camera](#camera)
- `size?`: [ISimpleSize](#isimplesize) | null
- `useCulling?`: *boolean*

---

### IKeyOptions

**Свойства:**

- `altKey?`, `ctrlKey?`, `metaKey?`, `shiftKey?`: *boolean*

---

### IShapeConfig

**Методы:**

- `setShape(shape: Shape): void`
- `set shape(shape: Shape)`
- `get shape(): Shape`

---

### IManager

**Методы:**

- `updateZIndex(): void`

---

### IEventOptions

**Свойства:**

- `isOnce?`: *boolean*

---

### IControlManager

**Методы:**

- `addControls(key: string): void`

---

## Классы событий

### ValueEvent

> *Наследует Event*

**Описание:**  
Пользовательское событие с значением.

**Свойства:**

- `value`: *any* - Значение события.

---

### StorageEvent

> *Наследует Event*

**Описание:**  
Событие для операций с хранилищем.

**Свойства:**

- `key?`: *keyof T* - Ключ хранилища.
- `value?`: *T[keyof T]* - Значение хранилища.

---

Created by [Grok](https://grok.com/chat)