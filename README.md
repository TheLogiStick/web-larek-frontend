# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- `src/` — исходные файлы проекта.
- `src/components/` — папка с JS компонентами.
- `src/components/base/` — папка с базовым кодом.
- `src/components/models` - папка с моделями данных.
- `src/components/view/` - папка с компонентами слоя представления.

Важные файлы:

- `src/pages/index.html` — HTML-файл главной страницы.
- `src/types/index.ts` — файл с типами.
- `src/index.ts` — точка входа приложения.
- `src/scss/styles.scss` — корневой файл стилей.
- `src/utils/constants.ts` — файл с константами.
- `src/utils/utils.ts` — файл с утилитами.

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

_Интерфейс для карточки товара_

```
interface ICard {
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
	id: string;
	index: string | null;
}
```

_Интерфейс каталога_

```
interface ICardsData {
	total: number;
	cards: ICard[];
	preview: ICard;
}
```

_Интерфейс корзины_

```
interface IBasketData {
	items: ICard[];
	total: number;
	price: number;
}
```

_Интерфейс для данных заказа_

```
interface IOrder {
	items: string[];
	payment: 'card' | 'cash' | null;
	address: string;
	email: string;
	phone: string;
	total: number;
}
```

_Интерфейс формы заказа_

```
type TOrderForm = Pick<IOrder, 'payment' | 'address'>;
```

_Интерфейс формы контактов_

```
type TContactsForm = Pick<IOrder, 'email' | 'phone'>;
```

_Интерфейс методов запроса к серверу_

```
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';
```

_Интерфейс api_

```
interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```

## Архитектура приложения

Код организован согласно парадигме MVP:

- Слой представления — отображает данные.
- Слой данных — отвечает за хранение данных.
- Слой коммуникации — связывает представление и данные.

## Базовый код

### Класс Api

Класс `Api` реализует интерфейс `IApi`, предназначен для выполнения HTTP-запросов к API. Он принимает базовый URL и опции запроса, а также предоставляет методы для выполнения GET и POST запросов.

Поля класса:

- `baseUrl: string` - базовый URL для API.
- `options: RequestInit` - настройки запроса по умолчанию, включая заголовки.

Конструктор класса:

- Принимает параметры: `baseUrl` - базовый URL и `options` - дополнительные настройки запроса (по умолчанию пустой объект).
- Инициализирует базовый URL и объединяет переданные заголовки с необходимыми заголовками по умолчанию.

Методы класса:

- `async handleResponse<T>(response: Response): Promise<T>` - обрабатывает ответ от сервера. Если запрос успешен (статус 200-299), возвращает данные в формате JSON. В противном случае выбрасывает ошибку с текстом ответа.
- `async get<T>(uri: string)` - выполняет GET запрос к указанному URI. Принимает параметр `uri` - путь к ресурсу относительно базового URL.
- `async post<T>(uri: string, data: object, method: ApiPostMethods = 'POST')` - выполняет POST запрос к указанному URI. Принимает параметры: `uri` - путь к ресурсу относительно базового URL, `data` - данные для отправки в теле запроса и необязательный параметр `method` - HTTP-метод (по умолчанию 'POST').

### Класс AppApi

Класс `AppApi` расширяет базовый класс `Api`, предназначен для взаимодействия с сервером приложения. Он предоставляет методы для получения данных карточек товаров и отправки заказов.

Поля класса:

- `cdn: string` - URL CDN, используемый для загрузки изображений карточек.
- `baseUrl: string` - базовый URL сервера приложения.
- `options?: RequestInit` - дополнительные опции для HTTP запросов.

Конструктор класса:

- Принимает параметры: `cdn` - URL CDN, `baseUrl` - базовый URL сервера и опциональные `options` для HTTP запросов.
- Инициализирует поля `cdn`, `baseUrl` и передает `baseUrl` и `options` в конструктор базового класса `Api`.

Методы класса:

- `async fetchCardsData(): Promise<TCardListResponse<ICard>>` - асинхронный метод для получения данных карточек товаров с сервера.

  - Отправляет GET запрос на эндпоинт `/product`.
  - Преобразует полученные данные, добавляя к URL изображений префикс `cdn`.
  - Возвращает объект с общим количеством товаров и массивом карточек.

- `async sendOrder(order: IOrder): Promise<IOrderResponse>` - асинхронный метод для отправки заказа на сервер.
  - Отправляет POST запрос на эндпоинт `/order` с данными о заказе.
  - Возвращает объект, содержащий идентификатор заказа и общую стоимость.

### Класс Component

Класс `Component` является абстрактным базовым классом для создания других компонентов в приложении. Он предоставляет общие методы для работы с DOM и управление состоянием элементов.

#### Поля класса:

- `container: HTMLElement` - корневой HTML-элемент компонента, доступный только для чтения.

#### Конструктор:

- Принимает параметр:
  - `container: HTMLElement` - корневой HTML-элемент, в котором будет отображаться компонент.
- Внутри конструктора выполняются инициализирующие действия, которые могут быть переопределены в дочерних классах.

#### Методы:

1. **toggleClass(element: HTMLElement, className: string, force?: boolean): void**

   - Переключает указанный CSS-класс у элемента.
   - Если передан параметр `force`, то класс будет добавлен или удалён в зависимости от его значения (`true`/`false`).

2. **setText(element: HTMLElement, value: unknown): void**

   - Устанавливает текстовое содержимое указанного элемента.
   - Преобразует переданное значение к строке и присваивает его `textContent`.

3. **setDisabled(element: HTMLElement, state: boolean): void**

   - Устанавливает атрибут `disabled` у элемента в зависимости от переданного состояния (`true`/`false`).
   - Если состояние активно (`state = true`), добавляет атрибут `disabled`, иначе — удаляет его.

4. **setHidden(element: HTMLElement): void**

   - Скрывает указанный элемент, задавая его свойству `display` значение `'none'`.

5. **setVisible(element: HTMLElement): void**

   - Показывает указанный элемент, удаляя из его стиля свойство `display`.

6. **setImage(element: HTMLImageElement, src: string, alt?: string): void**

   - Устанавливает URL и альтернативный текст для изображения.
   - Если передан параметр `alt`, он будет установлен в качестве альтернативного текста.

7. **render(data?: Partial<T>): HTMLElement**
   - Абстрактный метод, который должен быть реализован в дочерних классах.
   - Принимает опциональные данные для отображения компонента и возвращает корневой DOM-элемент компонента.

#### Наследование:

Данный базовый класс предназначен для наследования, позволяя создавать специализированные компоненты с собственными методами и свойствами. Каждый дочерний класс может расширять функциональность, добавлять новые методы или переопределять существующие.

Пример наследования:

```typescript
class MyComponent extends Component<MyData> {
	// Реализация специфических методов и свойств для компонента
}
```

Этот базовый класс обеспечивает структуру для создания модульных и повторно используемых компонентов в приложении, что упрощает управление состоянием и поведением отдельных частей интерфейса.

### Класс EventEmitter

Брокер событий предназначен для отправки и подписки на события, происходящие в системе. Этот класс используется в презентере для обработки событий и в различных слоях приложения для их генерации. Основные методы, реализуемые классом, описаны интерфейсом `IEvents`:

- `on` — подписаться на событие.
- `emit` — инициировать событие.
- `trigger` — возвращает функцию, которая при вызове инициирует указанное событие с переданными параметрами.

## Слой данных

Слой данных отвечает за хранение и управление данными приложения. Он содержит бизнес-логику, которая определяет, как данные должны быть обрабатываться, валидироваться и трансформироваться.

### Класс CardsData

Класс `CardsData` реализует интерфейс `ICardsData`, и предназначен для управления данными о карточках товаров. Он принимает инстант брокера событий, а также устанавливает необходимые поля.

Поля класса:

- `_cards: ICard[]` - массив всех доступных карточек товаров.
- `_total: number` - общая стоимость всех товаров в корзине.
- `preview: ICard` - предварительный просмотр выбранной карточки.

Конструктор класса:

- Принимает параметр: `events` - инстант брокера событий.

Методы класса:

- `set cards(items: ICard[])` - устанавливает массив всех доступных карточек товаров и вызывает событие `cards:changed`.
- `get cards()` - возвращает текущий массив всех доступных карточек товаров.
- `set total(total: number)` - устанавливает общую стоимость всех товаров в корзине.
- `get total()` - возвращает общую стоимость всех товаров в корзине.
- `getCard(cardId: string): ICard` - ищет карточку товара по её уникальному идентификатору и возвращает её.
- `setPreview(card: ICard)` - устанавливает предварительный просмотр выбранной карточки и вызывает событие `preview:change`.

### Класс BasketData

Класс `BasketData` реализует интерфейс `IBasketData`, и предназначен для управления данными о корзине товаров. Он принимает инстант брокера событий, а также устанавливает необходимые поля.

Поля класса:

- `_items: ICard[]` - массив товаров в корзине.
- `_total: number` - общее количество товаров в корзине.
- `_price: number` - общая стоимость всех товаров в корзине.

Конструктор класса:

- Принимает параметр: `events` - инстант брокера событий. Инициализирует массив товаров, общее количество и общей стоимость как 0.

Методы класса:

- `setItem(item: ICard)` - добавляет товар в корзину и обновляет общее количество товаров.
- `deleteItem(itemId: string)` - удаляет товар из корзины по его уникальному идентификатору, обновляет общую стоимость и общее количество товаров.
- `checkItemInBasket(cardID: string)` - проверяет наличие товара в корзине по его уникальному идентификатору и возвращает логическое значение.
- `get items()` - возвращает текущий массив товаров в корзине.
- `set total(total: number)` - устанавливает общее количество товаров в корзине.
- `get total()` - возвращает общее количество товаров в корзине.
- `set price(price: number)` - увеличивает или уменьшает общую стоимость всех товаров на переданное значение.
- `get price()` - возвращает общую стоимость всех товаров в корзине.
- `clearBasket()` - очищает корзину, устанавливая количество товаров и общую стоимость в 0, а также вызывает событие `basket:change`.

### Класс OrderData

Класс `OrderData` реализует интерфейс `IOrder` и предназначен для хранения данных о заказе. Конструктор класса принимает инстант брокера событий (`events`) и устанавливает данные заказа по умолчанию.

#### Поля класса:

- `_order: IOrder`
  - Объект, содержащий все необходимые данные заказа.
- `formErrors: Partial<Record<keyof IOrder, string>>`
  - Объект ошибок валидации. По умолчанию пустой объект.

#### Поля объекта `_order: IOrder`:

- `items: []`
  - Массив карточек товаров, инициализируется пустым массивом.
- `payment: null`
  - Способ оплаты, инициализируется как `null`.
- `address: ''`
  - Адрес доставки, инициализируется пустой строкой.
- `email: ''`
  - Электронная почта клиента, инициализируется пустой строкой.
- `phone: ''`
  - Номер телефона клиента, инициализируется пустой строкой.
- `total: 0`
  - Общая стоимость заказа, инициализируется как `0`.

#### Методы класса:

- `getOrderField<K extends keyof IOrder>(field: K): IOrder[K]`
  - Возвращает значение указанного поля объекта `_order`.
- `setOrderField<K extends keyof IOrder>(field: K, value: IOrder[K])`
  - Устанавливает значение в указанное поле объекта `_order`.
- `validate<K extends keyof IOrder>(field: K, errorMessage: string, formType: string): boolean`
  - Валидирует указанное поле объекта `_order`. Если поле пустое, устанавливает ошибку валидации и вызывает событие `${formType}:change`.
- `validateOrder(): boolean`
  - Устанавливает параметры для валидации формы заказа (`OrderForm`). Проверяет наличие способа оплаты и адреса доставки. Возвращает `true`, если оба поля заполнены.
- `validateContacts(): boolean`
  - Устанавливает параметры для валидации формы контактов (`ContactsForm`). Проверяет наличие электронной почты и номера телефона. Возвращает `true`, если оба поля заполнены.
- `clearOrder()`
  - Очищает данные заказа, устанавливая все поля объекта `_order` в их начальные значения.

## Слой представления

Слой представления отвечает за взаимодействие с пользователем. Он визуализирует данные, предоставляемые моделью через презентер, и обрабатывает действия пользователя, такие как нажатия кнопок или ввод текста.

### Класс Page

Класс `Page` расширяет базовый класс `Component`, предназначен для управления основной страницей приложения. Он принимает контейнер и инстант брокера событий, а также устанавливает необходимые элементы интерфейса.

Поля класса:

- `_catalog: HTMLElement` - элемент каталога товаров.
- `_wrapper: HTMLElement` - обёртка для основного содержимого страницы.
- `_counter: HTMLElement` - счетчик товаров в корзине.
- `_openBasketButton: HTMLButtonElement` - кнопка открытия корзины.

Конструктор класса:

- Принимает параметры: `container` - контейнер для страницы и `events` - инстант брокера событий.
- Инициализирует элементы интерфейса.
- Добавляет обработчик события нажатия на кнопку открытия корзины.

Методы класса:

- `set catalog(items: HTMLElement[])` - устанавливает товары в каталоге. Заменяет содержимое элемента каталога переданными карточками товаров.
- `set locked(isLocked: boolean)` - устанавливает состояние блокировки страницы. Если страница заблокирована, добавляет класс `page__wrapper_locked` к обёртке основного содержимого; если не заблокирована — удаляет этот класс.
- `set counter(value: number)` - устанавливает значение счетчика товаров в корзине.

### Класс Modal

Класс `Modal` расширяет базовый класс `Component`, и предназначен для управления модальным окном. Он принимает контейнер и инстант брокера событий, а также устанавливает необходимые элементы интерфейса.

Поля класса:

- `_closeButton: HTMLButtonElement` - кнопка закрытия модального окна.
- `_content: HTMLElement` - содержимое модального окна.
- `_escKeyListener: (event: KeyboardEvent) => void` - функция слушатель события нажатия клавиши `Escape`.

Конструктор класса:

- Принимает параметры: `container` - контейнер для модального окна и `events` - инстант брокера событий.
- Инициализирует элементы интерфейса и добавляет обработчики событий для кнопки закрытия, клика по модальному окну и нажатия клавиши `Escape`.

Методы класса:

- `set content(value: HTMLElement | null)` - устанавливает содержимое модального окна.
- `open()` - открывает модальное окно, добавляет обработчик события нажатия клавиши `Escape` и вызывает событие `modal:open`.
- `close()` - закрывает модальное окно, очищает содержимое и удаляет обработчик события нажатия клавиши `Escape`. Также вызывает событие `modal:close`.
- `render(data: IModal): HTMLElement` - рендерит контейнер с данными о модальном окне, открывает его и возвращает контейнер.

### Класс Form

Класс `Form` расширяет базовый класс `Component`, предназначен для управления формой. Он принимает HTML-форму и инстант брокера событий, а также устанавливает необходимые элементы интерфейса.

Поля класса:

- `_submit: HTMLButtonElement` - кнопка отправки формы.
- `_errors: HTMLElement` - элемент для отображения ошибок валидации.

Конструктор класса:

- Принимает параметры: `container` - HTML-форма и `events` - инстант брокера событий.
- Инициализирует кнопку отправки формы и элемент для отображения ошибок.
- Добавляет обработчики событий для ввода данных (`input`) и отправки формы (`submit`).

Методы класса:

- `protected onInputChange(field: keyof T, value: string)` - метод, вызываемый при изменении значения поля. Вызывает событие с названием формы и имени поля.
- `set valid(value: boolean)` - отключает/включает кнопку отправки.
- `set errors(value: string)` - устанавливает текст ошибок валидации, отображая их пользователю.
- `render(state: Partial<T> & IForm)` - рендерит форму с данными о состоянии и полях формы.

### Класс OrderForm

Класс `OrderForm` расширяет базовый класс `Form`, предназначен для управления формой заказа. Он принимает HTML-форму и инстант брокера событий, а также устанавливает необходимые элементы интерфейса.

Поля класса:

- `_card: HTMLButtonElement` - кнопка выбора оплаты картой.
- `_cash: HTMLButtonElement` - кнопка выбора наличной оплаты.
- `_address: HTMLInputElement` - поле ввода адреса.

Конструктор класса:

- Принимает параметры: `container` - HTML-форма и `events` - инстант брокера событий.
- Инициализирует кнопки выбора оплаты и поле ввода адреса.
- Добавляет обработчики событий для нажатия на кнопки выбора оплаты.

Методы класса:

- `set payment(method: 'card' | 'cash')` - устанавливает способ оплаты. Обновляет состояние формы и отключает соответствующую кнопку.
- `set address(value: string)` - устанавливает значение поля ввода адреса.

### Класс ContactsForm

Класс `ContactsForm` расширяет базовый класс `Form`, предназначен для управления формой контактов. Он принимает HTML-форму и инстант брокера событий, а также устанавливает необходимые элементы интерфейса.

Поля класса:

- `_email: HTMLInputElement` - поле ввода email.
- `_phone: HTMLInputElement` - поле ввода номера телефона.

Конструктор класса:

- Принимает параметры: `container` - HTML-форма и `events` - инстант брокера событий.
- Инициализирует поля ввода email и номера телефона.

Методы класса:

- `set email(value: string)` - устанавливает значение поля ввода email.
- `set phone(value: string)` - устанавливает значение поля ввода номера телефона.

### Класс Success

Класс `Success` расширяет базовый класс `Component`, предназначен для отображения страницы успешного завершения заказа. Он принимает контейнер и интерфейс действий, а также устанавливает необходимые элементы интерфейса.

Поля класса:

- `_button: HTMLButtonElement` - кнопка закрытия страницы успешного завершения.
- `_total: HTMLElement` - элемент для отображения суммы заказа.

Конструктор класса:

- Принимает параметры: `container` - контейнер для страницы и `actions` - интерфейс действий, включающий метод `onClick`.
- Инициализирует кнопку закрытия и элемент для отображения суммы заказа.
- Добавляет обработчик события нажатия на кнопку закрытия, если передан соответствующий метод в интерфейсе действий.

Методы класса:

- `set total(value: number)` - устанавливает значение элемента для отображения суммы заказа, формируя строку с текстом и переданным значением.

### Класс Basket

Класс `Basket` расширяет базовый класс `Component`, предназначен для отображения корзины товаров. Он принимает контейнер и инстант брокера событий, а также устанавливает необходимые элементы интерфейса.

Поля класса:

- `_list: HTMLElement` - список товаров в корзине.
- `_price: HTMLElement` - элемент для отображения общей стоимости товаров.
- `_button: HTMLButtonElement` - кнопка отправки заказа.

Конструктор класса:

- Принимает параметры: `container` - контейнер для корзины и `events` - инстант брокера событий.
- Инициализирует список товаров, элемент стоимости и кнопку отправки.
- Добавляет обработчик события нажатия на кнопку отправки заказа.

Методы класса:

- `set items(items: HTMLElement[])` - устанавливает товары в корзине. Если передан пустой массив, отображает сообщение "Корзина пуста".
- `set price(price: number)` - устанавливает общую стоимость товаров, формируя строку с текстом и переданным значением.
- `set button(disabled: boolean)` - устанавливает состояние активности кнопки отправки заказа.

### Класс Card

Класс `Card` расширяет базовый класс `Component`, предназначен для управления отдельной карточкой товара. Он принимает контейнер и интерфейс действий, а также устанавливает необходимые элементы интерфейса.

Поля класса:

- `_id: string` - уникальный идентификатор карточки.
- `_title: HTMLElement` - заголовок товара.
- `_image: HTMLImageElement` - изображение товара.
- `_description: HTMLElement` - описание товара.
- `_category: HTMLElement` - категория товара.
- `_price: HTMLElement` - цена товара.
- `_button: HTMLButtonElement` - кнопка для взаимодействия с карточкой (например, "Добавить в корзину").
- `_index: HTMLElement` - индекс карточки.

Конструктор класса:

- Принимает параметры: `container` - контейнер для карточки и `actions` - интерфейс действий, включающий метод `onClick`.
- Инициализирует все необходимые элементы интерфейса.
- Добавляет обработчик события нажатия на кнопку или контейнер карточки, если передан соответствующий метод в интерфейсе действий.

Методы класса:

- `set buttonText(text: string)` - устанавливает текст кнопки для взаимодействия с карточкой.
- `set buttonState(disabled: boolean)` - устанавливает состояние активности (отключена/активна) кнопки для взаимодействия с карточкой.
- `set id(id: string)` и `get id()` - устанавливают и возвращают уникальный идентификатор карточки соответственно.
- `set title(title: string)` - устанавливает заголовок товара.
- `set description(desc: string)` - устанавливает описание товара.
- `set category(category: string)` - устанавливает категорию товара.
- `setCategoryColor(category: string, categoriesCards: { [key: string]: string })` - устанавливает цвет элемента категории товара.
- `set image(value: string)` - устанавливает изображение товара, задавая его URL и альтернативный текст.
- `set price(price: string)` - устанавливает цену товара. Если цена пустая, отображается "бесценно".
- `set index(index: number)` - устанавливает индекс карточки.

## Слой коммуникации

Слой коммуникации отвечает за управление бизнес-логикой приложения, обрабатывая события от View и взаимодействуя с Model для получения или сохранения данных.\
Файл `index.ts` играет роль презентера в приложении, управляя взаимодействием между представлением и моделью данных. Он отвечает за координацию различных компонентов, таких как API, события, модели данных и представления.

### Инициализация

1. **Создание экземпляров событий и моделей данных:**

   - `events`: Экземпляр `EventEmitter` для управления событиями.
   - `orderData`, `cardsData`, `basketData`: Экземпляры классов моделей данных, отвечающих за управление данными заказа, каталогом товаров и корзиной соответственно.

2. **Создание экземпляров представлений:**

   - `page`, `modal`: Экземпляры классов представлений, отвечающих за основную страницу и модальное окно.
   - `templates`: Объект с ссылками на HTML-шаблоны, используемые для создания различных компонентов.
   - `basket`, `order`, `contacts`: Экземпляры классов представлений форм и корзины.

3. **Инициализация API:**

   - `appApi`: Экземпляр `AppApi` для взаимодействия с сервером, используя константы URL и настройки.

4. **Загрузка данных каталога товаров:**
   - `loadCardsData()`: Асинхронная функция для загрузки данных о товарах из API и обновления модели данных `cardsData`.

### Обработчики событий

1. **Каталог товаров (`catalog:loaded`):**

   - После успешной загрузки каталога, отображаются карточки товаров на странице.
   - Для каждой карточки создается экземпляр компонента `Card`, задается цвет категории и добавляется обработчик события `card:select`.

2. **Модальное окно (`modal:open`, `modal:close`):**

   - При открытии модального окна блокируется основная страница.
   - При закрытии модального окна разблокируется основная страница.

3. **Превью товара (`card:select`, `preview:change`):**

   - При выборе карточки в каталоге отображается превью товара в модальном окне.
   - Обновляется текст, цвет категории и состояние кнопки добавления/удаления товара из корзины.

4. **Корзина (`basket:open`, `add-to-basket:submit`, `remove-from-basket:submit`, `basket:change`):**

   - При открытии корзины, отображаются элементы корзины и устанавливается состояние кнопки отправки.
   - При добавлении/удалении товара из корзины обновляются данные модели `basketData`.
   - При изменении данных корзины обновляется представление корзины.

5. **Оформление заказа (`order:open`, `/^order\..*:change/`, `formOrder:change`, `order:submit`):**

   - Отображается форма оформления заказа в модальном окне.
   - При изменении полей формы обновляются данные модели `orderData`.
   - При валидации формы обновляется состояние и ошибки формы.
   - При отправке формы открывается форма контактов для ввода контактной информации.

6. **Контакты (`contacts:open`, `/^contacts\..*:change/`, `formContacts:change`, `contacts:submit`):**

   - Отображается форма ввода контактной информации в модальном окне.
   - При изменении полей формы обновляются данные модели `orderData`.
   - При валидации формы обновляется состояние и ошибки формы.
   - При отправке формы заказ отправляется на сервер, пока идет загрузка данных заказа кнопка блокируется, после успешного завершения данные корзины и заказа очищаются и отображается страница успешного оформления заказа.

7. **Успешное оформление заказа (`success:open`):**
   - Отображается страница успешного оформления заказа в модальном окне.
   - При нажатии на кнопку модальное окно закрывается.

### Загрузка данных

При запуске приложения вызывается функция `loadCardsData()`, которая начинает процесс загрузки данных о товарах из API.
