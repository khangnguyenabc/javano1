export const designPatternsData = {
  slug: "design-patterns",
  module: "XIII.",
  title: "Design Patterns & SOLID",
  description:
    "GoF Patterns, DDD, Clean Architecture, Enterprise Patterns (CQRS, Event Sourcing, Outbox, Saga), Microservices Patterns, SOLID, Refactoring — kiến trúc phần mềm sạch cho Senior Java.",
  tags: ["GoF", "SOLID", "DDD", "Clean Architecture", "CQRS", "Microservices"],
  stats: [
    { num: "14", label: "Chương mục" },
    { num: "23", label: "GoF Patterns" },
    { num: "Senior", label: "Level" },
  ],
  sections: [
    // ─── SECTION 1 ───────────────────────────────────────────────────────────
    {
      id: "solid",
      title: "SOLID Principles",
      badge: "Core concept",
      content: [
        {
          type: "text",
          value:
            "SOLID là 5 nguyên lý thiết kế hướng đối tượng — nền tảng cho code dễ maintain, test và mở rộng. Đặt ra bởi Robert C. Martin (Uncle Bob).",
        },
        { type: "subheading", value: "S — Single Responsibility Principle" },
        {
          type: "text",
          value:
            "Một class chỉ nên có 1 lý do để thay đổi. Nếu class phải thay đổi vì 2 lý do khác nhau → nó đang có 2 responsibilities.",
        },
        {
          type: "code",
          lang: "java",
          value: `// ❌ Vi phạm SRP — UserService làm quá nhiều
class UserService {
    public void createUser(User user) {
        // 1. Business logic
        validateUser(user);
        userRepository.save(user);
        // 2. Email — khác responsibility
        emailClient.send(user.getEmail(), "Welcome!");
        // 3. Reporting — khác responsibility
        auditLog.record("USER_CREATED", user.getId());
    }
}

// ✅ Tuân thủ SRP — mỗi class 1 trách nhiệm
class UserService {
    public User createUser(User user) {
        validateUser(user);
        return userRepository.save(user);
    }
}
class WelcomeEmailService {
    public void sendWelcome(User user) { emailClient.send(user.getEmail(), "Welcome!"); }
}
class UserAuditService {
    public void logCreation(User user) { auditLog.record("USER_CREATED", user.getId()); }
}`,
        },
        { type: "subheading", value: "O — Open/Closed Principle" },
        {
          type: "text",
          value:
            "Mở cho extension (thêm tính năng mới), đóng cho modification (không sửa code cũ). Dùng abstraction để đạt được điều này.",
        },
        {
          type: "code",
          lang: "java",
          value: `// ❌ Vi phạm OCP — mỗi lần thêm payment method phải sửa switch-case
class PaymentService {
    public void processPayment(Order order, String method) {
        switch (method) {
            case "CREDIT_CARD" -> chargeCreditCard(order);
            case "PAYPAL"      -> chargePayPal(order);
            // Thêm CRYPTO → phải sửa class này ❌
        }
    }
}

// ✅ Tuân thủ OCP — thêm method mới không cần sửa PaymentService
interface PaymentStrategy {
    boolean supports(String method);
    PaymentResult process(Order order);
}

@Component class CreditCardPayment implements PaymentStrategy {
    public boolean supports(String m) { return "CREDIT_CARD".equals(m); }
    public PaymentResult process(Order order) { /* ... */ return null; }
}
@Component class CryptoPayment implements PaymentStrategy {   // ← chỉ thêm class mới
    public boolean supports(String m) { return "CRYPTO".equals(m); }
    public PaymentResult process(Order order) { /* ... */ return null; }
}

@Service class PaymentService {
    private final List<PaymentStrategy> strategies;
    public PaymentResult processPayment(Order order, String method) {
        return strategies.stream()
            .filter(s -> s.supports(method))
            .findFirst()
            .orElseThrow(() -> new UnsupportedPaymentException(method))
            .process(order);
    }
}`,
        },
        { type: "subheading", value: "L — Liskov Substitution Principle" },
        {
          type: "text",
          value:
            "Subclass phải thay thế được base class mà không thay đổi behavior. Nếu phải override method để throw exception hoặc không làm gì → LSP bị vi phạm.",
        },
        {
          type: "code",
          lang: "java",
          value: `// ❌ Vi phạm LSP — Square extends Rectangle gây lỗi
class Rectangle {
    protected int width, height;
    public void setWidth(int w)  { this.width = w; }
    public void setHeight(int h) { this.height = h; }
    public int area() { return width * height; }
}
class Square extends Rectangle {
    @Override public void setWidth(int w)  { width = height = w; } // ← thay đổi behavior!
    @Override public void setHeight(int h) { width = height = h; }
}
// Bug: rectangle.setWidth(5); rectangle.setHeight(10); area() = 50 → OK
//      square.setWidth(5);    square.setHeight(10);    area() = 100 ← WRONG!

// ✅ Tuân thủ LSP — dùng interface chung
interface Shape { int area(); }
record Rectangle(int width, int height) implements Shape { public int area() { return width * height; } }
record Square(int side) implements Shape { public int area() { return side * side; } }`,
        },
        { type: "subheading", value: "I — Interface Segregation Principle" },
        {
          type: "text",
          value:
            "Nhiều interface nhỏ, chuyên biệt tốt hơn 1 interface lớn. Client không nên bị ép implement method mà nó không dùng.",
        },
        {
          type: "code",
          lang: "java",
          value: `// ❌ Vi phạm ISP — Robot phải implement eat() mà không cần
interface Worker {
    void work();
    void eat();  // Robot không ăn!
    void sleep(); // Robot không ngủ!
}
class Robot implements Worker {
    public void work()  { /* OK */ }
    public void eat()   { throw new UnsupportedOperationException(); } // ❌
    public void sleep() { throw new UnsupportedOperationException(); } // ❌
}

// ✅ Tuân thủ ISP — tách interface
interface Workable  { void work(); }
interface Eatable   { void eat(); }
interface Sleepable { void sleep(); }

class Human implements Workable, Eatable, Sleepable {
    public void work()  { /* ... */ }
    public void eat()   { /* ... */ }
    public void sleep() { /* ... */ }
}
class Robot implements Workable {
    public void work() { /* ... */ }  // chỉ implement cái cần
}`,
        },
        { type: "subheading", value: "D — Dependency Inversion Principle" },
        {
          type: "text",
          value:
            "High-level modules không nên phụ thuộc vào low-level modules. Cả hai nên phụ thuộc vào abstraction. Đây là nền tảng của Dependency Injection trong Spring.",
        },
        {
          type: "code",
          lang: "java",
          value: `// ❌ Vi phạm DIP — OrderService tự tạo dependency
class OrderService {
    // Phụ thuộc vào concrete class ← khó test, khó thay thế
    private MySQLOrderRepository repository = new MySQLOrderRepository();
    private SmtpEmailSender emailSender = new SmtpEmailSender();
}

// ✅ Tuân thủ DIP — phụ thuộc vào abstraction, inject từ ngoài
interface OrderRepository { Order save(Order order); Optional<Order> findById(UUID id); }
interface EmailSender     { void send(String to, String subject, String body); }

@Service
class OrderService {
    private final OrderRepository repository;
    private final EmailSender emailSender;

    // Spring inject implementation phù hợp (MySQL, InMemory, Mock...)
    public OrderService(OrderRepository repository, EmailSender emailSender) {
        this.repository  = repository;
        this.emailSender = emailSender;
    }
}
// Test: inject MockOrderRepository + FakeEmailSender — không cần DB, không gửi email thật`,
        },
        {
          type: "tip",
          value:
            "SOLID không phải luật tuyệt đối — đây là hướng dẫn. Áp dụng có chọn lọc: small utility class không cần SOLID đầy đủ. Over-engineering cũng là anti-pattern.",
        },
      ],
    },

    // ─── SECTION 2 ───────────────────────────────────────────────────────────
    {
      id: "creational",
      title: "Creational Patterns Deep Dive",
      badge: "GoF Patterns",
      content: [
        {
          type: "text",
          value:
            "Creational patterns giải quyết vấn đề tạo object — khi nào, ai tạo, và tạo như thế nào. 5 patterns: Singleton, Factory Method, Abstract Factory, Builder, Prototype.",
        },
        { type: "subheading", value: "So sánh 5 Creational Patterns" },
        {
          type: "table",
          headers: ["Pattern", "Mục đích", "Dùng khi", "Java / Spring"],
          rows: [
            ["Singleton", "1 instance duy nhất toàn app", "Shared resource: config, connection pool, cache", "Spring beans (default scope), enum Singleton"],
            ["Factory Method", "Subclass quyết định class nào được tạo", "Framework cho phép extend creation logic", "BeanFactory, DocumentBuilderFactory"],
            ["Abstract Factory", "Tạo family of related objects", "Cần đổi toàn bộ product family (UI theme, DB vendor)", "Spring DataSource config cho các DB khác nhau"],
            ["Builder", "Tạo complex object từng bước", "Constructor có nhiều optional params (>4)", "Lombok @Builder, StringBuilder, Stream.Builder"],
            ["Prototype", "Clone object", "Tạo object giống nhau tốn kém, cần copy", "Object.clone(), BeanUtils.copyProperties"],
          ],
        },
        { type: "subheading", value: "Singleton — 4 cách implement (thread-safe)" },
        {
          type: "code",
          lang: "java",
          value: `// 1. Eager initialization — đơn giản, thread-safe
public class EagerSingleton {
    private static final EagerSingleton INSTANCE = new EagerSingleton();
    private EagerSingleton() {}
    public static EagerSingleton getInstance() { return INSTANCE; }
}

// 2. Double-Checked Locking — lazy, thread-safe (Java 5+)
public class DCLSingleton {
    private static volatile DCLSingleton instance;  // volatile bắt buộc!
    private DCLSingleton() {}
    public static DCLSingleton getInstance() {
        if (instance == null) {                     // check 1 — no lock
            synchronized (DCLSingleton.class) {
                if (instance == null) {             // check 2 — with lock
                    instance = new DCLSingleton();
                }
            }
        }
        return instance;
    }
}

// 3. Initialization-on-demand (Bill Pugh) — lazy, thread-safe, best practice
public class HolderSingleton {
    private HolderSingleton() {}
    private static class Holder {
        static final HolderSingleton INSTANCE = new HolderSingleton();
    }
    public static HolderSingleton getInstance() { return Holder.INSTANCE; }
}

// 4. Enum Singleton — best for serialization safety (Effective Java)
public enum EnumSingleton {
    INSTANCE;
    public void doSomething() { /* ... */ }
}
// Usage: EnumSingleton.INSTANCE.doSomething();`,
        },
        {
          type: "warning",
          value:
            "Singleton khó test (global state), khó mock. Trong Spring — dùng @Bean (Spring quản lý lifecycle). Tránh Singleton thủ công trừ khi có lý do cụ thể.",
        },
        { type: "subheading", value: "Factory Method vs Abstract Factory" },
        {
          type: "code",
          lang: "java",
          value: `// ── Factory Method ── (1 product, subclass quyết định loại)
abstract class NotificationFactory {
    // Factory Method — subclass override
    protected abstract Notification createNotification();

    // Template Method dùng Factory Method
    public void sendNotification(String message) {
        Notification n = createNotification(); // polymorphic creation
        n.send(message);
    }
}
class EmailNotificationFactory extends NotificationFactory {
    @Override protected Notification createNotification() { return new EmailNotification(); }
}
class SmsNotificationFactory extends NotificationFactory {
    @Override protected Notification createNotification() { return new SmsNotification(); }
}

// ── Abstract Factory ── (family of products, swap toàn bộ family)
interface UIFactory {
    Button createButton();
    TextField createTextField();
    Dialog createDialog();
}
class WindowsUIFactory implements UIFactory {
    public Button    createButton()    { return new WindowsButton(); }
    public TextField createTextField() { return new WindowsTextField(); }
    public Dialog    createDialog()    { return new WindowsDialog(); }
}
class MacUIFactory implements UIFactory {
    public Button    createButton()    { return new MacButton(); }
    public TextField createTextField() { return new MacTextField(); }
    public Dialog    createDialog()    { return new MacDialog(); }
}
// Swap toàn bộ UI bằng 1 dòng: UIFactory factory = new MacUIFactory();`,
        },
        { type: "subheading", value: "Builder — Lombok + Manual so sánh" },
        {
          type: "code",
          lang: "java",
          value: `// Manual Builder — khi cần validation trong build()
public class DatabaseConfig {
    private final String host;
    private final int port;
    private final String database;
    private final int maxConnections;
    private final Duration connectionTimeout;

    private DatabaseConfig(Builder builder) {
        this.host              = builder.host;
        this.port              = builder.port;
        this.database          = builder.database;
        this.maxConnections    = builder.maxConnections;
        this.connectionTimeout = builder.connectionTimeout;
    }

    public static class Builder {
        private String host = "localhost"; // default
        private int port = 5432;
        private String database;
        private int maxConnections = 10;
        private Duration connectionTimeout = Duration.ofSeconds(30);

        public Builder host(String host)   { this.host = host; return this; }
        public Builder port(int port)      { this.port = port; return this; }
        public Builder database(String db) { this.database = db; return this; }
        public Builder maxConnections(int n) { this.maxConnections = n; return this; }

        public DatabaseConfig build() {
            // Validation trong build — không thể có nếu dùng constructor
            if (database == null || database.isBlank())
                throw new IllegalStateException("database is required");
            if (maxConnections < 1 || maxConnections > 100)
                throw new IllegalStateException("maxConnections must be 1-100");
            return new DatabaseConfig(this);
        }
    }
}
// DatabaseConfig config = new DatabaseConfig.Builder()
//     .host("prod-db.company.com")
//     .database("orders")
//     .maxConnections(20)
//     .build();

// Lombok @Builder — khi không cần custom validation
@Builder
@Value // immutable
public class CreateOrderRequest {
    @NonNull String customerId;
    @NonNull List<OrderItemRequest> items;
    String couponCode;          // optional
    String shippingAddress;     // optional
}`,
        },
        { type: "subheading", value: "Prototype — clone object" },
        {
          type: "code",
          lang: "java",
          value: `// Prototype với deep copy
public class OrderTemplate implements Cloneable {
    private String customerId;
    private List<OrderItem> items;  // mutable list — cần deep copy

    @Override
    public OrderTemplate clone() {
        try {
            OrderTemplate clone = (OrderTemplate) super.clone(); // shallow copy
            clone.items = new ArrayList<>(this.items);           // deep copy list
            return clone;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError("Never happens");
        }
    }
}

// Hoặc dùng copy constructor (thường được prefer hơn Cloneable)
public class Order {
    public Order(Order source) {
        this.customerId = source.customerId;
        this.items = source.items.stream()
            .map(OrderItem::new) // copy constructor của OrderItem
            .collect(Collectors.toList());
    }
}`,
        },
      ],
    },

    // ─── SECTION 3 ───────────────────────────────────────────────────────────
    {
      id: "structural",
      title: "Structural Patterns Deep Dive",
      badge: "GoF Patterns",
      content: [
        {
          type: "text",
          value:
            "Structural patterns giải quyết cách kết hợp class/object thành cấu trúc lớn hơn. 7 patterns: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.",
        },
        { type: "subheading", value: "So sánh nhanh" },
        {
          type: "table",
          headers: ["Pattern", "Mục đích", "Analogy", "Ví dụ Java/Spring"],
          rows: [
            ["Adapter", "Convert interface không tương thích", "Ổ cắm điện 3 chân → 2 chân", "Slf4j (Adapter cho Log4j/Logback), Arrays.asList()"],
            ["Bridge", "Tách abstraction khỏi implementation (2 hierarchy)", "Remote control ↔ TV/Radio", "JDBC Driver + Connection API"],
            ["Composite", "Cây cấu trúc, treat leaf và composite như nhau", "File system: folder chứa file và folder khác", "javax.swing.JComponent, Spring Security FilterChain"],
            ["Decorator", "Thêm behavior tại runtime không sửa class gốc", "Cà phê + sữa + đường từng bước", "BufferedInputStream, Collections.unmodifiableList()"],
            ["Facade", "Simplified interface cho subsystem phức tạp", "Remote TV — 1 nút thay vì bảng điện tử", "Spring JdbcTemplate, SLF4J Logger"],
            ["Flyweight", "Chia sẻ state giữa nhiều object nhỏ để tiết kiệm RAM", "Ký tự trong font — 1 instance per character", "String pool (intern), Integer cache -128→127"],
            ["Proxy", "Surrogate/placeholder kiểm soát access đến object khác", "Bảo vệ tại cửa tòa nhà", "Spring AOP (@Transactional, @Cacheable), Hibernate lazy loading"],
          ],
        },
        { type: "subheading", value: "Adapter Pattern" },
        {
          type: "code",
          lang: "java",
          value: `// Ví dụ: tích hợp legacy payment system với interface mới
// Interface hiện tại của hệ thống
interface PaymentGateway {
    PaymentResult charge(String customerId, BigDecimal amount, String currency);
}

// Legacy system có interface khác — không thể sửa
class LegacyPaymentSystem {
    public int processTransaction(String cust, double amt, int currencyCode) { return 0; }
}

// Adapter: wrap legacy, expose interface mới
class LegacyPaymentAdapter implements PaymentGateway {
    private final LegacyPaymentSystem legacy = new LegacyPaymentSystem();

    @Override
    public PaymentResult charge(String customerId, BigDecimal amount, String currency) {
        int currencyCode = mapCurrencyCode(currency); // translate
        int legacyResult = legacy.processTransaction(customerId, amount.doubleValue(), currencyCode);
        return mapResult(legacyResult); // translate back
    }
    private int mapCurrencyCode(String c) { return "USD".equals(c) ? 840 : 978; }
    private PaymentResult mapResult(int code) { return code == 0 ? PaymentResult.SUCCESS : PaymentResult.FAILURE; }
}`,
        },
        { type: "subheading", value: "Proxy — 4 loại quan trọng" },
        {
          type: "code",
          lang: "java",
          value: `// 1. Protection Proxy — kiểm soát quyền truy cập
class SecureOrderRepository implements OrderRepository {
    private final OrderRepository delegate;
    private final SecurityContext secCtx;

    public Optional<Order> findById(UUID id) {
        Order order = delegate.findById(id).orElseThrow();
        if (!secCtx.currentUser().canAccess(order))
            throw new AccessDeniedException("Not your order");
        return Optional.of(order);
    }
    public Order save(Order order) {
        secCtx.requireRole("ADMIN");
        return delegate.save(order);
    }
}

// 2. Caching Proxy — cache kết quả
class CachingProductRepository implements ProductRepository {
    private final ProductRepository delegate;
    private final Map<UUID, Product> cache = new ConcurrentHashMap<>();

    public Optional<Product> findById(UUID id) {
        return Optional.ofNullable(
            cache.computeIfAbsent(id, k -> delegate.findById(k).orElse(null))
        );
    }
}

// 3. Virtual Proxy — lazy loading (Hibernate dùng cách này)
// Hibernate tạo proxy cho @OneToMany — không load đến khi access

// 4. Spring AOP Proxy — @Transactional, @Cacheable, @Async
// Spring wrap bean bằng CGLIB proxy, intercept method calls
@Service
class OrderService {
    @Transactional  // Spring proxy bắt đầu/commit/rollback transaction
    @Cacheable(key = "#id")
    public Order findById(UUID id) { return repository.findById(id).orElseThrow(); }
}
// ⚠️ Self-invocation bypass proxy:
// this.findById(id) trong cùng class — @Transactional KHÔNG chạy!
// Fix: inject self, hay dùng ApplicationContext.getBean()`,
        },
        { type: "subheading", value: "Decorator vs Inheritance" },
        {
          type: "code",
          lang: "java",
          value: `// ── Decorator ── thêm behavior không sửa class gốc
interface CoffeeOrder {
    String getDescription();
    double getCost();
}
record Espresso() implements CoffeeOrder {
    public String getDescription() { return "Espresso"; }
    public double getCost() { return 2.0; }
}

// Decorator — wrap và thêm behavior
abstract class CoffeeDecorator implements CoffeeOrder {
    protected final CoffeeOrder wrapped;
    CoffeeDecorator(CoffeeOrder c) { this.wrapped = c; }
}
class MilkDecorator extends CoffeeDecorator {
    MilkDecorator(CoffeeOrder c) { super(c); }
    public String getDescription() { return wrapped.getDescription() + ", Milk"; }
    public double getCost() { return wrapped.getCost() + 0.5; }
}
class SugarDecorator extends CoffeeDecorator {
    SugarDecorator(CoffeeOrder c) { super(c); }
    public String getDescription() { return wrapped.getDescription() + ", Sugar"; }
    public double getCost() { return wrapped.getCost() + 0.3; }
}
// Espresso + Milk + Sugar = 2.8
CoffeeOrder order = new SugarDecorator(new MilkDecorator(new Espresso()));
// Espresso(2.0) → MilkDecorator(2.5) → SugarDecorator(2.8)`,
        },
        { type: "subheading", value: "Flyweight — String Pool & Integer Cache" },
        {
          type: "code",
          lang: "java",
          value: `// Java String Pool — Flyweight built-in
String s1 = "hello";          // từ pool
String s2 = "hello";          // cùng instance từ pool
String s3 = new String("hello"); // object mới trên heap

System.out.println(s1 == s2); // true — cùng instance
System.out.println(s1 == s3); // false — object khác

// Integer cache -128 to 127 — Flyweight
Integer a = 127; Integer b = 127; // a == b → true (cached)
Integer c = 128; Integer d = 128; // c == d → false (new objects)

// Custom Flyweight — font rendering
class CharacterFactory {
    private static final Map<Character, CharacterGlyph> cache = new HashMap<>();
    public static CharacterGlyph get(char c) {
        return cache.computeIfAbsent(c, CharacterGlyph::new); // shared instance
    }
}`,
        },
      ],
    },

    // ─── SECTION 4 ───────────────────────────────────────────────────────────
    {
      id: "behavioral",
      title: "Behavioral Patterns Deep Dive",
      badge: "GoF Patterns",
      content: [
        {
          type: "text",
          value:
            "Behavioral patterns quan tâm đến giao tiếp giữa objects. 11 patterns — quan trọng nhất với Java developer: Strategy, Observer, Template Method, State, Command, Chain of Responsibility, Visitor, Iterator, Mediator, Memento, Interpreter.",
        },
        { type: "subheading", value: "Strategy Pattern — Interchangeable Algorithms" },
        {
          type: "code",
          lang: "java",
          value: `// Sorting strategy — runtime swap
interface SortStrategy<T> {
    List<T> sort(List<T> data);
}
class QuickSort<T extends Comparable<T>> implements SortStrategy<T> {
    public List<T> sort(List<T> data) { /* quicksort impl */ return data; }
}
class MergeSort<T extends Comparable<T>> implements SortStrategy<T> {
    public List<T> sort(List<T> data) { /* mergesort impl */ return data; }
}

class DataProcessor<T extends Comparable<T>> {
    private SortStrategy<T> strategy;
    public void setStrategy(SortStrategy<T> s) { this.strategy = s; }
    public List<T> process(List<T> data) {
        return strategy.sort(data);
    }
}
// Runtime: processor.setStrategy(new QuickSort<>());`,
        },
        { type: "subheading", value: "Observer Pattern — Event-driven" },
        {
          type: "code",
          lang: "java",
          value: `// Manual Observer
interface StockObserver {
    void onPriceChange(String symbol, BigDecimal newPrice);
}
class StockMarket {
    private final Map<String, List<StockObserver>> subscribers = new HashMap<>();

    public void subscribe(String symbol, StockObserver obs) {
        subscribers.computeIfAbsent(symbol, k -> new ArrayList<>()).add(obs);
    }
    public void updatePrice(String symbol, BigDecimal price) {
        subscribers.getOrDefault(symbol, List.of())
            .forEach(obs -> obs.onPriceChange(symbol, price));
    }
}

// Spring Events — preferred approach
record PriceChangedEvent(String symbol, BigDecimal price) {}

@Service class StockService {
    @Autowired ApplicationEventPublisher publisher;
    public void updatePrice(String symbol, BigDecimal price) {
        // ... update DB ...
        publisher.publishEvent(new PriceChangedEvent(symbol, price));
    }
}
@Component class AlertService {
    @EventListener
    public void onPriceChange(PriceChangedEvent e) { /* send alert */ }
}
@Component class AnalyticsService {
    @Async @EventListener
    public void onPriceChange(PriceChangedEvent e) { /* async analytics */ }
}`,
        },
        { type: "subheading", value: "State Pattern — Traffic Light & Order Lifecycle" },
        {
          type: "code",
          lang: "java",
          value: `// State Pattern — Order lifecycle
interface OrderState {
    void pay(OrderContext ctx);
    void ship(OrderContext ctx);
    void deliver(OrderContext ctx);
    void cancel(OrderContext ctx);
    String name();
}

class PendingState implements OrderState {
    public void pay(OrderContext ctx) { ctx.setState(new PaidState()); }
    public void ship(OrderContext ctx) { throw new InvalidStateException("Pay first"); }
    public void deliver(OrderContext ctx) { throw new InvalidStateException("Pay first"); }
    public void cancel(OrderContext ctx) { ctx.setState(new CancelledState()); }
    public String name() { return "PENDING"; }
}
class PaidState implements OrderState {
    public void pay(OrderContext ctx) { throw new InvalidStateException("Already paid"); }
    public void ship(OrderContext ctx) { ctx.setState(new ShippedState()); }
    public void deliver(OrderContext ctx) { throw new InvalidStateException("Ship first"); }
    public void cancel(OrderContext ctx) { ctx.setState(new CancelledState()); } // refund
    public String name() { return "PAID"; }
}
class ShippedState implements OrderState {
    public void pay(OrderContext ctx) { throw new InvalidStateException(); }
    public void ship(OrderContext ctx) { throw new InvalidStateException("Already shipped"); }
    public void deliver(OrderContext ctx) { ctx.setState(new DeliveredState()); }
    public void cancel(OrderContext ctx) { throw new InvalidStateException("Cannot cancel shipped"); }
    public String name() { return "SHIPPED"; }
}

class OrderContext {
    private OrderState state = new PendingState();
    public void setState(OrderState s) { this.state = s; }
    public String getStatus() { return state.name(); }
    public void pay()     { state.pay(this); }
    public void ship()    { state.ship(this); }
    public void deliver() { state.deliver(this); }
    public void cancel()  { state.cancel(this); }
}`,
        },
        { type: "subheading", value: "Chain of Responsibility — Request Pipeline" },
        {
          type: "code",
          lang: "java",
          value: `// Custom filter chain
abstract class RequestHandler {
    private RequestHandler next;
    public RequestHandler setNext(RequestHandler n) { this.next = n; return n; }
    public final Response handle(Request req) {
        if (canHandle(req)) return doHandle(req);
        if (next != null)   return next.handle(req);
        throw new UnhandledRequestException(req);
    }
    protected abstract boolean canHandle(Request req);
    protected abstract Response doHandle(Request req);
}
class AuthenticationHandler extends RequestHandler {
    protected boolean canHandle(Request req) { return !req.isAuthenticated(); }
    protected Response doHandle(Request req) { return Response.unauthorized(); }
}
class RateLimitHandler extends RequestHandler {
    protected boolean canHandle(Request req) { return rateLimiter.isExceeded(req.getUserId()); }
    protected Response doHandle(Request req) { return Response.tooManyRequests(); }
}
class BusinessHandler extends RequestHandler {
    protected boolean canHandle(Request req) { return true; }
    protected Response doHandle(Request req) { return businessService.process(req); }
}
// Chain: auth → rateLimit → business
// new AuthenticationHandler().setNext(new RateLimitHandler()).setNext(new BusinessHandler());`,
        },
        { type: "subheading", value: "Mediator Pattern — Reduce Coupling" },
        {
          type: "code",
          lang: "java",
          value: `// Mediator: objects communicate through mediator, not directly
interface EventBus {
    void publish(String topic, Object event);
    void subscribe(String topic, Consumer<Object> handler);
}
class SimpleEventBus implements EventBus {
    private final Map<String, List<Consumer<Object>>> handlers = new ConcurrentHashMap<>();
    public void publish(String topic, Object event) {
        handlers.getOrDefault(topic, List.of()).forEach(h -> h.accept(event));
    }
    public void subscribe(String topic, Consumer<Object> handler) {
        handlers.computeIfAbsent(topic, k -> new CopyOnWriteArrayList<>()).add(handler);
    }
}`,
        },
        { type: "subheading", value: "Template Method vs Strategy — Key Difference" },
        {
          type: "table",
          headers: ["Aspect", "Template Method", "Strategy"],
          rows: [
            ["Mechanism", "Inheritance (abstract class)", "Composition (interface + injection)"],
            ["Algorithm skeleton", "Defined in base class (final method)", "Defined by caller/context"],
            ["Variation point", "Hook methods (override steps)", "Swap entire algorithm"],
            ["Coupling", "Tight (subclass locked to base)", "Loose (strategy is interchangeable)"],
            ["When to use", "Steps are fixed, variation is small", "Multiple complete algorithms needed"],
            ["Prefer", "Legacy code / frameworks", "Modern OOP / testability"],
          ],
        },
      ],
    },

    // ─── SECTION 5 ───────────────────────────────────────────────────────────
    {
      id: "patterns_in_wild",
      title: "Design Patterns trong Java & Spring",
      badge: "Reference",
      content: [
        {
          type: "text",
          value:
            "Nhận biết patterns trong JDK và Spring giúp đọc hiểu code nhanh hơn và biết khi nào tái sử dụng thay vì tự viết.",
        },
        { type: "subheading", value: "Patterns trong Java Standard Library" },
        {
          type: "table",
          headers: ["Pattern", "Ví dụ trong JDK", "Giải thích"],
          rows: [
            ["Singleton", "Runtime.getRuntime()", "1 JVM runtime instance"],
            ["Factory Method", "Calendar.getInstance()", "Trả về subclass phù hợp với locale"],
            ["Abstract Factory", "DocumentBuilderFactory", "Tạo XML parser family"],
            ["Builder", "StringBuilder, Stream.Builder", "Xây dựng từng bước"],
            ["Prototype", "Object.clone(), Arrays.copyOf()", "Clone object"],
            ["Adapter", "Arrays.asList(), Collections.list()", "Convert array ↔ List"],
            ["Decorator", "BufferedInputStream wraps FileInputStream", "Thêm buffering behavior"],
            ["Flyweight", "String.intern(), Integer.valueOf(-128..127)", "Object pool/cache"],
            ["Proxy", "java.lang.reflect.Proxy", "Dynamic proxy cho interface"],
            ["Iterator", "Iterable/Iterator (for-each)", "Duyệt collection"],
            ["Observer", "java.util.Observer (deprecated), PropertyChangeListener", "Event notification"],
            ["Strategy", "Comparator, Runnable, Callable", "Pluggable algorithm"],
            ["Template Method", "AbstractList, HttpServlet (doGet/doPost)", "Skeleton với hook"],
            ["Command", "Runnable, Callable, java.swing.Action", "Encapsulate action"],
            ["Chain of Responsibility", "javax.servlet.FilterChain", "Sequential processing"],
          ],
        },
        { type: "subheading", value: "Patterns trong Spring Framework" },
        {
          type: "table",
          headers: ["Pattern", "Spring Component", "Cơ chế"],
          rows: [
            ["Singleton", "@Bean (default scope)", "ApplicationContext giữ 1 instance"],
            ["Factory Method", "BeanFactory.getBean()", "Factory tạo bean theo type/name"],
            ["Abstract Factory", "ApplicationContext", "Tạo tất cả beans cho môi trường"],
            ["Proxy", "@Transactional, @Cacheable, @Async, Spring AOP", "CGLIB/JDK Dynamic Proxy wrap bean"],
            ["Template Method", "JdbcTemplate, RestTemplate, KafkaTemplate", "execute() là template, callback là hook"],
            ["Observer", "ApplicationEventPublisher + @EventListener", "Loose-coupled event system"],
            ["Strategy", "HandlerMapping, ViewResolver, AuthenticationProvider", "Multiple implementations, strategy selection"],
            ["Decorator", "BeanPostProcessor, HandlerInterceptor", "Wrap và thêm behavior"],
            ["Chain of Responsibility", "Spring Security FilterChain, HandlerInterceptor chain", "Request passes through chain"],
            ["Front Controller", "DispatcherServlet", "Tất cả request qua 1 servlet trung tâm"],
            ["MVC", "Spring MVC (Model-View-Controller)", "Tách presentation, business, data"],
            ["Repository", "Spring Data JPA @Repository", "Collection abstraction cho persistence"],
            ["Facade", "Spring Data JPA (hide JPA complexity)", "Simple API cho phức tạp bên dưới"],
          ],
        },
        {
          type: "tip",
          value:
            "Khi phỏng vấn được hỏi về Spring internals — luôn map về Design Pattern. @Transactional = Proxy Pattern. Spring IoC = DIP + Factory. DispatcherServlet = Front Controller.",
        },
      ],
    },

    // ─── SECTION 6 ───────────────────────────────────────────────────────────
    {
      id: "clean_arch",
      title: "Clean Architecture & Hexagonal Architecture",
      badge: "Architecture",
      content: [
        {
          type: "text",
          value:
            "Clean Architecture (Robert C. Martin) và Hexagonal Architecture (Alistair Cockburn / Ports & Adapters) đều đặt business logic ở trung tâm, cô lập khỏi framework và infrastructure.",
        },
        { type: "subheading", value: "Clean Architecture — 4 vòng tròn đồng tâm" },
        {
          type: "table",
          headers: ["Layer", "Chứa gì", "Phụ thuộc vào", "Ví dụ"],
          rows: [
            ["Entities (innermost)", "Enterprise business rules, core domain objects", "Không phụ thuộc gì", "Order, User, Money, Address"],
            ["Use Cases", "Application business rules, orchestrate entities", "Chỉ Entities", "PlaceOrderUseCase, RegisterUserUseCase"],
            ["Interface Adapters", "Convert data giữa Use Cases và External", "Use Cases + Entities", "OrderController, JpaOrderRepository, OrderPresenter"],
            ["Frameworks & Drivers (outermost)", "Spring Boot, DB, Web, UI", "Tất cả layers bên trong", "Spring MVC, Hibernate, Kafka"],
          ],
        },
        {
          type: "tip",
          value:
            "Dependency Rule: mũi tên phụ thuộc chỉ từ ngoài vào trong. Entities không bao giờ import Spring. Use Cases không biết HTTP tồn tại.",
        },
        { type: "subheading", value: "Folder Structure — Clean Architecture" },
        {
          type: "code",
          lang: "text",
          value: `src/main/java/com/company/orders/
├── domain/                          ← Entities layer
│   ├── model/
│   │   ├── Order.java               (Entity / Aggregate Root)
│   │   ├── OrderItem.java           (Entity)
│   │   └── Money.java               (Value Object)
│   ├── event/
│   │   └── OrderPlacedEvent.java    (Domain Event)
│   └── repository/
│       └── OrderRepository.java     (Port — interface chỉ)
│
├── application/                     ← Use Cases layer
│   ├── usecase/
│   │   ├── PlaceOrderUseCase.java   (Input Port interface)
│   │   └── GetOrderUseCase.java
│   ├── service/
│   │   └── OrderService.java        (implements PlaceOrderUseCase)
│   └── dto/
│       ├── PlaceOrderCommand.java
│       └── OrderResponse.java
│
├── adapter/                         ← Interface Adapters layer
│   ├── in/
│   │   └── web/
│   │       └── OrderController.java (Inbound Adapter)
│   └── out/
│       ├── persistence/
│       │   ├── JpaOrderRepository.java (Outbound Adapter)
│       │   └── OrderEntity.java
│       └── messaging/
│           └── KafkaOrderPublisher.java
│
└── infrastructure/                  ← Frameworks & Drivers
    ├── config/
    │   └── SpringConfig.java
    └── SpringBootApplication.java`,
        },
        { type: "subheading", value: "Hexagonal Architecture — Ports & Adapters" },
        {
          type: "code",
          lang: "java",
          value: `// ── Inbound Port (Use Case interface — domain defines it) ──
public interface PlaceOrderUseCase {
    OrderId execute(PlaceOrderCommand command);
}

// ── Outbound Port (Repository interface — domain defines it) ──
public interface OrderRepository {
    Order save(Order order);
    Optional<Order> findById(OrderId id);
}
public interface PaymentGatewayPort {
    PaymentResult charge(CustomerId customerId, Money amount);
}
public interface OrderEventPublisher {
    void publish(DomainEvent event);
}

// ── Application Service (implements Inbound Port) ──
@Service
public class OrderApplicationService implements PlaceOrderUseCase {
    // Depends ONLY on outbound ports (interfaces) — not on Spring/JPA/Kafka
    private final OrderRepository orderRepository;
    private final PaymentGatewayPort paymentGateway;
    private final OrderEventPublisher eventPublisher;

    public OrderId execute(PlaceOrderCommand cmd) {
        Order order = Order.create(cmd.getCustomerId(), cmd.getItems());
        order.place();
        PaymentResult payment = paymentGateway.charge(cmd.getCustomerId(), order.calculateTotal());
        if (!payment.isSuccess()) throw new PaymentFailedException(payment.getReason());
        orderRepository.save(order);
        order.pullDomainEvents().forEach(eventPublisher::publish);
        return order.getId();
    }
}

// ── Inbound Adapter (Web controller — depends on Use Case interface) ──
@RestController @RequestMapping("/api/orders")
public class OrderController {
    private final PlaceOrderUseCase placeOrderUseCase; // Inbound Port

    @PostMapping
    public ResponseEntity<String> placeOrder(@RequestBody PlaceOrderRequest request) {
        PlaceOrderCommand cmd = PlaceOrderMapper.toCommand(request); // map HTTP → domain
        OrderId orderId = placeOrderUseCase.execute(cmd);
        return ResponseEntity.created(URI.create("/api/orders/" + orderId.value())).build();
    }
}

// ── Outbound Adapter (JPA — implements Outbound Port) ──
@Repository
class JpaOrderRepositoryAdapter implements OrderRepository {
    private final JpaOrderRepository jpa; // Spring Data JPA
    private final OrderEntityMapper mapper;

    public Order save(Order order) {
        return mapper.toDomain(jpa.save(mapper.toEntity(order)));
    }
    public Optional<Order> findById(OrderId id) {
        return jpa.findById(id.value()).map(mapper::toDomain);
    }
}

// ── Outbound Adapter (Kafka publisher) ──
@Component
class KafkaOrderEventPublisher implements OrderEventPublisher {
    private final KafkaTemplate<String, String> kafka;
    public void publish(DomainEvent event) {
        kafka.send(event.topic(), event.aggregateId(), objectMapper.writeValueAsString(event));
    }
}`,
        },
        { type: "subheading", value: "Clean Architecture vs Hexagonal — So sánh" },
        {
          type: "table",
          headers: ["Aspect", "Clean Architecture", "Hexagonal (Ports & Adapters)"],
          rows: [
            ["Tác giả", "Robert C. Martin (Uncle Bob)", "Alistair Cockburn"],
            ["Metaphor", "Vòng tròn đồng tâm", "Lục giác với ports"],
            ["Core concept", "4 layers với Dependency Rule", "Ports (interfaces) + Adapters (implementations)"],
            ["Điểm mạnh", "Rõ ràng layer boundaries", "Testability — easy mock adapters"],
            ["Điểm khác biệt", "Nhấn mạnh layer hierarchy", "Nhấn mạnh symmetry in/out"],
            ["Thực tế", "Thường dùng cả hai cùng nhau", "Complement nhau, không thay thế"],
          ],
        },
      ],
    },

    // ─── SECTION 7 ───────────────────────────────────────────────────────────
    {
      id: "ddd_strategic",
      title: "Domain-Driven Design — Strategic DDD",
      badge: "DDD",
      content: [
        {
          type: "text",
          value:
            "Strategic DDD giải quyết vấn đề ở quy mô lớn: chia hệ thống thành các Bounded Context, xác định quan hệ giữa chúng, và đặt ra ngôn ngữ chung.",
        },
        { type: "subheading", value: "Ubiquitous Language" },
        {
          type: "text",
          value:
            "Ngôn ngữ chung giữa developers và domain experts. Dùng nhất quán trong code, docs, meetings. Khi code và business nói cùng ngôn ngữ → giảm miscommunication.",
        },
        {
          type: "code",
          lang: "java",
          value: `// ❌ Technical names — developers hiểu, business không hiểu
class TransactionRecord { ... }
class UserAccount { ... }
void processItem(TransactionRecord tr, UserAccount ua) { ... }

// ✅ Ubiquitous Language — tất cả đều hiểu
class Order { ... }          // "đơn hàng" trong mọi cuộc họp
class Customer { ... }       // không gọi là "UserAccount"
void placeOrder(Order order, Customer customer) { ... }`,
        },
        { type: "subheading", value: "Bounded Context" },
        {
          type: "text",
          value:
            "Ranh giới rõ ràng nơi một model áp dụng. Cùng tên nhưng nghĩa khác nhau trong các context khác nhau.",
        },
        {
          type: "table",
          headers: ["Khái niệm", "Sales Context", "Warehouse Context", "Billing Context"],
          rows: [
            ["Order", "Customer, items, discount, promo code", "Picking list, weight, dimensions, location", "Invoice, tax, payment terms"],
            ["Customer", "Name, email, loyalty tier", "Delivery address, contact", "Billing address, payment method, credit limit"],
            ["Product", "Name, description, price, images", "SKU, weight, storage location, reorder level", "Price history, tax category"],
          ],
        },
        {
          type: "code",
          lang: "java",
          value: `// Mỗi Bounded Context có model riêng
// Sales Context
package com.company.sales.domain;
class Order { String customerId; List<OrderItem> items; Discount discount; }

// Warehouse Context — Order là picking list, không có discount
package com.company.warehouse.domain;
class ShipmentOrder { String orderId; List<PickItem> pickItems; String warehouseLocation; }

// Không bao giờ dùng Sales.Order trong Warehouse code — tạo model riêng!`,
        },
        { type: "subheading", value: "Context Map — 6 loại quan hệ" },
        {
          type: "table",
          headers: ["Quan hệ", "Mô tả", "Code pattern", "Ví dụ"],
          rows: [
            ["Partnership", "2 teams hợp tác chặt chẽ, thay đổi cùng nhau", "Shared interfaces, joint planning", "Frontend + Backend cùng team"],
            ["Shared Kernel", "Chia sẻ subset model, deploy cùng nhau", "Shared library/module", "Common domain events trong monorepo"],
            ["Customer-Supplier", "Downstream phụ thuộc upstream, upstream lên kế hoạch cho downstream", "API versioning, SLA", "Payment service (supplier) → Order service (customer)"],
            ["Conformist", "Downstream chấp nhận model của upstream, không đàm phán", "Map trực tiếp upstream model", "Integrate với third-party API, sử dụng model của họ"],
            ["Anti-Corruption Layer (ACL)", "Translation layer bảo vệ domain model khỏi bị 'nhiễm'", "Adapter/Translator class", "Tích hợp legacy system"],
            ["Open Host Service", "Upstream cung cấp well-defined API cho nhiều downstream", "Versioned REST API, gRPC contract", "Payment gateway cung cấp SDK"],
          ],
        },
        { type: "subheading", value: "Anti-Corruption Layer (ACL) — Code" },
        {
          type: "code",
          lang: "java",
          value: `// Legacy CRM có model khác hoàn toàn
class LegacyCrmCustomer {
    String CUST_NO;       // không dùng camelCase
    String FULL_NM;
    String ADDR_1;
    String CNTRY_CD;
    String ACT_STS;       // "A" = Active, "I" = Inactive, "S" = Suspended
    String TIER_CD;       // "G" = Gold, "S" = Silver, "B" = Bronze
}

// Bounded Context hiện tại
record Customer(CustomerId id, String name, Address address,
                CustomerStatus status, LoyaltyTier tier) {}

// ACL — translate, isolate legacy model
@Component
class LegacyCrmAcl {
    public Customer translateToCustomer(LegacyCrmCustomer crm) {
        return new Customer(
            CustomerId.of(crm.CUST_NO),
            crm.FULL_NM,
            new Address(crm.ADDR_1, mapCountry(crm.CNTRY_CD)),
            mapStatus(crm.ACT_STS),
            mapTier(crm.TIER_CD)
        );
    }
    private CustomerStatus mapStatus(String s) {
        return switch (s) {
            case "A" -> CustomerStatus.ACTIVE;
            case "I" -> CustomerStatus.INACTIVE;
            case "S" -> CustomerStatus.SUSPENDED;
            default  -> throw new IllegalArgumentException("Unknown status: " + s);
        };
    }
    private LoyaltyTier mapTier(String t) {
        return switch (t) {
            case "G" -> LoyaltyTier.GOLD;
            case "S" -> LoyaltyTier.SILVER;
            default  -> LoyaltyTier.BRONZE;
        };
    }
}`,
        },
        { type: "subheading", value: "Subdomain Types" },
        {
          type: "table",
          headers: ["Loại Subdomain", "Mô tả", "Strategy", "Ví dụ"],
          rows: [
            ["Core Domain", "Lợi thế cạnh tranh chính của business", "Build in-house, best engineers, DDD đầy đủ", "Recommendation engine của Netflix, Search của Google"],
            ["Supporting Subdomain", "Hỗ trợ core, nhưng không phải competitive advantage", "Build in-house hoặc customize", "User management, Notification service"],
            ["Generic Subdomain", "Commodity, không khác biệt", "Buy/use off-the-shelf", "Authentication (Keycloak), Payment (Stripe), Email (SendGrid)"],
          ],
        },
      ],
    },

    // ─── SECTION 8 ───────────────────────────────────────────────────────────
    {
      id: "ddd_tactical",
      title: "Domain-Driven Design — Tactical DDD",
      badge: "DDD",
      content: [
        {
          type: "text",
          value:
            "Tactical DDD cung cấp building blocks để implement domain model. Tập trung vào code cụ thể: Entity, Value Object, Aggregate, Domain Event, Repository.",
        },
        { type: "subheading", value: "Building Blocks — So sánh" },
        {
          type: "table",
          headers: ["Building Block", "Identity?", "Mutable?", "equals() dựa trên", "Ví dụ"],
          rows: [
            ["Entity", "✅ Có ID", "✅ Có", "ID", "Order, User, Product, Invoice"],
            ["Value Object", "❌ Không", "❌ Immutable", "Tất cả fields", "Money, Address, Email, PhoneNumber, DateRange"],
            ["Aggregate Root", "✅ Có ID", "✅ Có", "ID", "Order (root), Account (root)"],
            ["Domain Service", "N/A (stateless)", "N/A", "N/A", "TransferService, PricingService, TaxCalculator"],
            ["Domain Event", "✅ Event ID", "❌ Immutable", "Event ID", "OrderPlaced, PaymentFailed, UserRegistered"],
          ],
        },
        { type: "subheading", value: "Value Object — Immutable, self-validating" },
        {
          type: "code",
          lang: "java",
          value: `// Value Object: immutable, no identity, equals() by value
public record Money(BigDecimal amount, Currency currency) {
    // Compact constructor — validation
    public Money {
        Objects.requireNonNull(amount, "Amount required");
        Objects.requireNonNull(currency, "Currency required");
        if (amount.compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("Money cannot be negative");
        amount = amount.setScale(2, RoundingMode.HALF_UP); // normalize
    }

    public Money add(Money other) {
        assertSameCurrency(other);
        return new Money(this.amount.add(other.amount), this.currency);
    }
    public Money subtract(Money other) {
        assertSameCurrency(other);
        Money result = new Money(this.amount.subtract(other.amount), this.currency);
        return result;
    }
    public Money multiply(int quantity) {
        if (quantity < 0) throw new IllegalArgumentException("Quantity cannot be negative");
        return new Money(this.amount.multiply(BigDecimal.valueOf(quantity)), this.currency);
    }
    public boolean isGreaterThan(Money other) { assertSameCurrency(other); return amount.compareTo(other.amount) > 0; }
    private void assertSameCurrency(Money other) {
        if (!this.currency.equals(other.currency))
            throw new CurrencyMismatchException(this.currency, other.currency);
    }
    @Override public String toString() { return currency.getSymbol() + amount; }
    // Records auto-generate equals()/hashCode() based on ALL fields ✅
}

// Usage — intuitive domain language
Money price   = new Money(new BigDecimal("10.00"), Currency.USD);
Money tax     = new Money(new BigDecimal("0.80"), Currency.USD);
Money total   = price.add(tax);  // Money(10.80, USD)
Money subtotal = price.multiply(3);  // Money(30.00, USD)`,
        },
        { type: "subheading", value: "Aggregate — Design Rules" },
        {
          type: "code",
          lang: "java",
          value: `@Getter
public class Order {  // Aggregate Root
    private final OrderId id;
    private final CustomerId customerId; // Reference by ID, not Customer object
    private OrderStatus status;
    private final List<OrderItem> items = new ArrayList<>();  // part of aggregate
    private final List<DomainEvent> uncommittedEvents = new ArrayList<>();

    private Order(OrderId id, CustomerId customerId) {
        this.id = Objects.requireNonNull(id);
        this.customerId = Objects.requireNonNull(customerId);
        this.status = OrderStatus.DRAFT;
    }

    // Static factory — ensures valid initial state
    public static Order create(CustomerId customerId) {
        Order order = new Order(OrderId.generate(), customerId);
        order.uncommittedEvents.add(new OrderDraftedEvent(order.id, customerId));
        return order;
    }

    // Domain method — enforces invariants, raises events
    public void addItem(ProductId productId, int quantity, Money unitPrice) {
        assertStatus(OrderStatus.DRAFT, "Cannot add items to a non-draft order");
        if (quantity <= 0) throw new DomainException("Quantity must be positive");
        // Merge with existing item for same product
        items.stream()
             .filter(i -> i.getProductId().equals(productId))
             .findFirst()
             .ifPresentOrElse(
                 existing -> existing.increaseQuantity(quantity),
                 () -> items.add(new OrderItem(productId, quantity, unitPrice))
             );
    }

    public void place() {
        assertStatus(OrderStatus.DRAFT, "Only DRAFT orders can be placed");
        if (items.isEmpty()) throw new DomainException("Cannot place empty order");
        Money total = calculateTotal();
        if (total.isGreaterThan(new Money(new BigDecimal("10000"), Currency.USD)))
            throw new DomainException("Order exceeds maximum allowed value");
        this.status = OrderStatus.PLACED;
        uncommittedEvents.add(new OrderPlacedEvent(id, customerId, total, Instant.now()));
    }

    public Money calculateTotal() {
        return items.stream()
                    .map(OrderItem::lineTotal)
                    .reduce(Money.zero(Currency.USD), Money::add);
    }

    // Pull and clear — events published after successful save
    public List<DomainEvent> pullUncommittedEvents() {
        List<DomainEvent> events = List.copyOf(uncommittedEvents);
        uncommittedEvents.clear();
        return events;
    }

    private void assertStatus(OrderStatus expected, String msg) {
        if (this.status != expected) throw new InvalidStateException(msg + " (current: " + status + ")");
    }
}

// OrderItem — Entity inside Aggregate (no direct access from outside)
@Getter
class OrderItem {
    private final OrderItemId id = OrderItemId.generate();
    private final ProductId productId;
    private int quantity;
    private final Money unitPrice;

    // package-private constructor — only Order can create
    OrderItem(ProductId productId, int quantity, Money unitPrice) {
        this.productId = productId;
        this.unitPrice = unitPrice;
        setQuantity(quantity);
    }

    void increaseQuantity(int delta) { setQuantity(this.quantity + delta); }
    Money lineTotal() { return unitPrice.multiply(quantity); }
    private void setQuantity(int q) {
        if (q <= 0) throw new DomainException("Quantity must be positive");
        this.quantity = q;
    }
}`,
        },
        { type: "subheading", value: "Application Service — Thin Orchestration Layer" },
        {
          type: "code",
          lang: "java",
          value: `@Service
@Transactional
public class OrderApplicationService {
    // Depends on ports (interfaces) — not adapters
    private final OrderRepository orderRepository;
    private final DomainEventPublisher eventPublisher;

    // Orchestrates: load → execute domain logic → save → publish events
    public OrderId placeOrder(PlaceOrderCommand cmd) {
        Order order = Order.create(CustomerId.of(cmd.getCustomerId()));
        cmd.getItems().forEach(item ->
            order.addItem(
                ProductId.of(item.getProductId()),
                item.getQuantity(),
                new Money(item.getUnitPrice(), Currency.USD)
            )
        );
        order.place();
        orderRepository.save(order);
        order.pullUncommittedEvents().forEach(eventPublisher::publish);
        return order.getId();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(UUID orderId) {
        Order order = orderRepository.findById(OrderId.of(orderId))
            .orElseThrow(() -> new OrderNotFoundException(orderId));
        return OrderMapper.toResponse(order);
    }
}`,
        },
        {
          type: "warning",
          value:
            "Anemic Domain Model anti-pattern: domain objects chỉ là data bags (getters/setters), tất cả logic nằm trong Service. Dấu hiệu: order.setStatus(PLACED) thay vì order.place(). Fix: đưa business logic vào domain object.",
        },
      ],
    },

    // ─── SECTION 9 ───────────────────────────────────────────────────────────
    {
      id: "cqrs_es",
      title: "CQRS & Event Sourcing",
      badge: "Enterprise Patterns",
      content: [
        {
          type: "text",
          value:
            "CQRS (Command Query Responsibility Segregation) tách biệt write model và read model. Event Sourcing lưu trạng thái dưới dạng chuỗi events thay vì current state.",
        },
        { type: "subheading", value: "CQRS — Khi nào dùng và khi nào KHÔNG dùng" },
        {
          type: "table",
          headers: ["", "CQRS phù hợp khi", "KHÔNG cần CQRS khi"],
          rows: [
            ["Read/Write ratio", "Read >> Write, cần scale độc lập", "Balanced, đơn giản"],
            ["Query complexity", "Queries phức tạp, nhiều aggregate joins", "Simple CRUD, đơn giản"],
            ["Performance", "Write model và read model cần optimize khác nhau", "Cùng DB, cùng model đủ"],
            ["Team size", "Nhiều team, tách ownership rõ ràng", "Small team, overhead không đáng"],
            ["Complexity cost", "Chấp nhận eventual consistency + 2 models", "Cần strong consistency, đơn giản hơn"],
          ],
        },
        {
          type: "code",
          lang: "java",
          value: `// ── COMMAND SIDE (Write Model) ──
// Command: intent to change state
record PlaceOrderCommand(String customerId, List<OrderItemDto> items) {}

@Service
@Transactional
class OrderCommandService {
    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher publisher;

    public OrderId handle(PlaceOrderCommand cmd) {
        Order order = Order.create(CustomerId.of(cmd.customerId()));
        cmd.items().forEach(item ->
            order.addItem(ProductId.of(item.productId()), item.qty(),
                          new Money(item.price(), Currency.USD)));
        order.place();
        orderRepository.save(order);
        order.pullUncommittedEvents().forEach(publisher::publishEvent);
        return order.getId();
    }
}

// ── QUERY SIDE (Read Model — denormalized, optimized) ──
// Read model: flat, denormalized projection for fast queries
@Entity @Table(name = "order_summaries")  // separate table!
@Getter @Setter
class OrderSummary {
    @Id UUID orderId;
    String customerName;
    String customerEmail;
    BigDecimal totalAmount;
    String status;
    int itemCount;
    Instant placedAt;
}

@Service
@Transactional(readOnly = true)
class OrderQueryService {
    private final OrderSummaryRepository summaryRepo;  // reads from read model

    public Page<OrderSummary> getOrdersByCustomer(String customerId, Pageable page) {
        return summaryRepo.findByCustomerId(customerId, page);  // simple, fast query
    }
    public Optional<OrderSummary> getOrderDetail(UUID orderId) {
        return summaryRepo.findById(orderId);
    }
}

// ── EVENT HANDLER: Sync write model → read model ──
@Component
@Transactional
class OrderProjectionHandler {
    private final OrderSummaryRepository summaryRepo;
    private final CustomerQueryService customerService;

    @EventListener  // triggered after OrderCommandService saves
    public void on(OrderPlacedEvent event) {
        Customer customer = customerService.getById(event.customerId());
        OrderSummary summary = new OrderSummary();
        summary.setOrderId(event.orderId().value());
        summary.setCustomerName(customer.fullName());
        summary.setCustomerEmail(customer.email());
        summary.setTotalAmount(event.totalAmount().amount());
        summary.setStatus("PLACED");
        summary.setItemCount(event.itemCount());
        summary.setPlacedAt(event.occurredAt());
        summaryRepo.save(summary);
    }

    @EventListener
    public void on(OrderShippedEvent event) {
        summaryRepo.updateStatus(event.orderId().value(), "SHIPPED");
    }
}`,
        },
        { type: "subheading", value: "Event Sourcing — Lưu events thay vì state" },
        {
          type: "text",
          value:
            "Thay vì lưu current state (UPDATE orders SET status = 'PLACED'), lưu tất cả events đã xảy ra. Current state = replay tất cả events từ đầu.",
        },
        {
          type: "code",
          lang: "java",
          value: `// Event Store — append-only log
@Entity @Table(name = "event_store")
@Getter @Setter
class StoredEvent {
    @Id @GeneratedValue UUID id;
    UUID aggregateId;
    String aggregateType;    // "Order"
    String eventType;        // "OrderPlacedEvent"
    long sequenceNumber;     // version, incrementing
    String payload;          // JSON
    Instant occurredAt;
}

// Aggregate reconstructed by replaying events
public class OrderEventSourced {
    private OrderId id;
    private OrderStatus status;
    private List<OrderItem> items = new ArrayList<>();
    private long version = 0;

    // Reconstruct from event history
    public static OrderEventSourced reconstitute(List<StoredEvent> events) {
        OrderEventSourced order = new OrderEventSourced();
        events.forEach(order::apply);
        return order;
    }

    // Apply event — mutates state (no validation here, events already happened)
    private void apply(StoredEvent stored) {
        DomainEvent event = deserialize(stored);
        version = stored.getSequenceNumber();
        switch (event) {
            case OrderCreatedEvent e -> {
                this.id = e.orderId();
                this.status = OrderStatus.DRAFT;
            }
            case ItemAddedEvent e -> this.items.add(new OrderItem(e.productId(), e.quantity(), e.price()));
            case OrderPlacedEvent e -> this.status = OrderStatus.PLACED;
            case OrderCancelledEvent e -> this.status = OrderStatus.CANCELLED;
            default -> throw new UnknownEventException(event.getClass().getName());
        }
    }

    // Optimistic concurrency: version check prevents lost updates
    public long getVersion() { return version; }
}

// EventStore Repository with optimistic locking
@Repository
class EventSourcedOrderRepository {
    private final EventStoreJpaRepo eventStore;

    public OrderEventSourced findById(OrderId id) {
        List<StoredEvent> events = eventStore.findByAggregateIdOrderBySequenceNumber(id.value());
        if (events.isEmpty()) throw new OrderNotFoundException(id);
        return OrderEventSourced.reconstitute(events);
    }

    @Transactional
    public void save(OrderEventSourced order, List<DomainEvent> newEvents, long expectedVersion) {
        // Optimistic concurrency check
        long currentVersion = eventStore.getMaxSequenceNumber(order.getId().value());
        if (currentVersion != expectedVersion)
            throw new OptimisticConcurrencyException("Conflict on order " + order.getId());
        // Append new events
        long seq = expectedVersion;
        for (DomainEvent event : newEvents) {
            eventStore.save(new StoredEvent(order.getId().value(), "Order",
                                           event.getClass().getSimpleName(),
                                           ++seq, serialize(event), Instant.now()));
        }
    }
}`,
        },
        { type: "subheading", value: "Snapshot — Tối ưu Event Replay" },
        {
          type: "code",
          lang: "java",
          value: `// Sau 100 events — tạo snapshot để không cần replay từ đầu
@Entity @Table(name = "aggregate_snapshots")
class Snapshot {
    UUID aggregateId;
    String aggregateType;
    long atVersion;      // snapshot at this version
    String state;        // serialized aggregate state
    Instant createdAt;
}

// Load: tìm snapshot gần nhất → replay chỉ events SAU snapshot
public OrderEventSourced findById(OrderId id) {
    Optional<Snapshot> snapshot = snapshotRepo.findLatest(id.value());
    List<StoredEvent> events;
    if (snapshot.isPresent()) {
        events = eventStore.findByAggregateIdAndVersionAfter(id.value(), snapshot.get().getAtVersion());
        OrderEventSourced order = deserializeSnapshot(snapshot.get());
        events.forEach(order::apply);
        return order;
    } else {
        events = eventStore.findByAggregateIdOrderBySequenceNumber(id.value());
        return OrderEventSourced.reconstitute(events);
    }
}`,
        },
        {
          type: "tip",
          value:
            "Event Sourcing khi nào dùng: cần audit trail đầy đủ, temporal queries ('trạng thái lúc 3pm hôm qua là gì?'), event replay để xây dựng read models mới. Khi nào KHÔNG dùng: simple CRUD, team nhỏ, không cần audit trail.",
        },
      ],
    },

    // ─── SECTION 10 ──────────────────────────────────────────────────────────
    {
      id: "outbox_saga",
      title: "Outbox Pattern & Saga Pattern",
      badge: "Enterprise Patterns",
      content: [
        {
          type: "text",
          value:
            "Outbox Pattern giải quyết dual-write problem. Saga Pattern giải quyết distributed transactions trong microservices — không dùng 2PC.",
        },
        { type: "subheading", value: "Dual-Write Problem — Tại sao cần Outbox" },
        {
          type: "code",
          lang: "java",
          value: `// ❌ Dual-Write Problem — DB và Kafka không atomic
@Transactional
public Order createOrder(CreateOrderCommand cmd) {
    Order order = Order.create(cmd);
    orderRepository.save(order);         // step 1: DB save thành công
    kafkaTemplate.send("orders", event); // step 2: Kafka fail ← EVENT BỊ MẤT!
    // Nếu app crash sau bước 1 → Order tồn tại trong DB nhưng event không được gửi
    // → Inventory service không nhận được event → data inconsistent
    return order;
}`,
        },
        { type: "subheading", value: "Transactional Outbox Pattern — Giải pháp" },
        {
          type: "code",
          lang: "java",
          value: `@Entity @Table(name = "outbox_events")
@Getter @Setter
class OutboxEvent {
    @Id UUID id;
    String aggregateId;
    String aggregateType;
    String eventType;
    String payload;              // JSON
    OutboxStatus status;         // PENDING → PUBLISHED → FAILED
    int retryCount;
    Instant createdAt;
    Instant publishedAt;
}

// ✅ Save order + outbox event trong CÙNG transaction
@Transactional
public Order createOrder(CreateOrderCommand cmd) {
    Order order = Order.create(cmd);
    orderRepository.save(order);   // Step 1

    // Step 2: Write to outbox IN SAME TRANSACTION
    outboxRepository.save(OutboxEvent.builder()
        .id(UUID.randomUUID())
        .aggregateId(order.getId().toString())
        .aggregateType("Order")
        .eventType("OrderCreated")
        .payload(objectMapper.writeValueAsString(new OrderCreatedPayload(order)))
        .status(OutboxStatus.PENDING)
        .createdAt(Instant.now())
        .build());

    // If EITHER save fails → BOTH roll back
    // If app crashes here → BOTH are NOT saved
    return order;
}

// Option A: Outbox Poller (khi không có CDC)
@Scheduled(fixedDelay = 1000)
@Transactional
public void publishPendingEvents() {
    List<OutboxEvent> pending = outboxRepository.findPendingBatch(50);
    pending.forEach(event -> {
        try {
            kafkaTemplate.send(event.getEventType(), event.getAggregateId(), event.getPayload())
                         .get(5, TimeUnit.SECONDS); // synchronous for outbox
            event.setStatus(OutboxStatus.PUBLISHED);
            event.setPublishedAt(Instant.now());
        } catch (Exception e) {
            event.setRetryCount(event.getRetryCount() + 1);
            if (event.getRetryCount() >= 3) event.setStatus(OutboxStatus.FAILED);
        }
    });
    outboxRepository.saveAll(pending);
}

// Option B: Debezium CDC (Change Data Capture) — preferred
// Debezium reads MySQL binlog / PostgreSQL WAL → publishes to Kafka
// No polling needed, near real-time, transactional guarantees`,
        },
        { type: "subheading", value: "Saga Pattern — Distributed Transactions" },
        {
          type: "text",
          value:
            "Saga = chuỗi local transactions. Mỗi bước thành công → next step. Bất kỳ bước nào fail → chạy compensating transactions để rollback.",
        },
        { type: "subheading", value: "Choreography Saga — Event-driven" },
        {
          type: "code",
          lang: "java",
          value: `// Choreography: services lắng nghe events, phát events mới — không có coordinator
// Flow: OrderService → InventoryService → PaymentService → ShippingService

// 1. Order Service
@EventListener
public void onOrderPlaced(OrderPlacedEvent event) {
    // Publish event → Inventory Service lắng nghe
    kafkaTemplate.send("inventory.reserve", new ReserveInventoryCommand(
        event.orderId(), event.items()));
}

// 2. Inventory Service
@KafkaListener(topics = "inventory.reserve")
public void onReserveInventory(ReserveInventoryCommand cmd) {
    try {
        inventoryService.reserve(cmd.orderId(), cmd.items());
        kafkaTemplate.send("inventory.reserved",
            new InventoryReservedEvent(cmd.orderId())); // success → next step
    } catch (InsufficientStockException e) {
        kafkaTemplate.send("inventory.reserve.failed",
            new InventoryReservationFailed(cmd.orderId(), e.getMessage())); // fail → compensate
    }
}

// 3. Order Service lắng nghe failure → compensate
@KafkaListener(topics = "inventory.reserve.failed")
public void onInventoryFailed(InventoryReservationFailed event) {
    orderService.cancelOrder(event.orderId(), "Insufficient stock");
    // OrderCancelledEvent → các services khác compensate nếu cần
}`,
        },
        { type: "subheading", value: "Orchestration Saga — Central Coordinator" },
        {
          type: "code",
          lang: "java",
          value: `// Orchestration: Saga Orchestrator điều phối tất cả bước, biết toàn bộ flow
@Service
class CreateOrderSagaOrchestrator {

    @Transactional
    public void execute(PlaceOrderCommand cmd) {
        SagaInstance saga = sagaRepository.create(cmd);
        try {
            // Step 1: Create order
            OrderId orderId = orderService.createDraftOrder(cmd);
            saga.checkpoint("ORDER_CREATED", orderId);

            // Step 2: Reserve inventory
            try {
                inventoryService.reserve(orderId, cmd.getItems());
                saga.checkpoint("INVENTORY_RESERVED");
            } catch (InsufficientStockException e) {
                // Compensate: cancel order
                orderService.cancelOrder(orderId, "No stock");
                saga.fail("INSUFFICIENT_STOCK", e.getMessage());
                return;
            }

            // Step 3: Process payment
            try {
                PaymentResult payment = paymentService.charge(cmd.getCustomerId(), cmd.getTotal());
                saga.checkpoint("PAYMENT_COMPLETED");
            } catch (PaymentDeclinedException e) {
                // Compensate: release inventory + cancel order
                inventoryService.release(orderId, cmd.getItems());
                orderService.cancelOrder(orderId, "Payment declined");
                saga.fail("PAYMENT_FAILED", e.getMessage());
                return;
            }

            // Step 4: Confirm order
            orderService.confirmOrder(orderId);
            saga.complete("ORDER_CONFIRMED");

        } catch (Exception e) {
            saga.fail("UNEXPECTED_ERROR", e.getMessage());
            throw e;
        }
    }
}`,
        },
        { type: "subheading", value: "Choreography vs Orchestration" },
        {
          type: "table",
          headers: ["Aspect", "Choreography", "Orchestration"],
          rows: [
            ["Coupling", "Loose — services chỉ biết events", "Tighter — orchestrator biết tất cả services"],
            ["Visibility", "Khó theo dõi toàn bộ flow", "Dễ visualize, trace, debug"],
            ["Complexity", "Phân tán — khó hiểu flow tổng thể", "Tập trung — orchestrator phức tạp"],
            ["Testing", "Khó test end-to-end", "Dễ unit test orchestrator"],
            ["Fault tolerance", "Không có single point of failure", "Orchestrator là SPOF nếu không HA"],
            ["Best for", "Simple flows, high autonomy", "Complex flows, cần visibility"],
          ],
        },
      ],
    },

    // ─── SECTION 11 ──────────────────────────────────────────────────────────
    {
      id: "microservices_patterns",
      title: "Microservices Design Patterns",
      badge: "Architecture",
      content: [
        {
          type: "text",
          value:
            "Các patterns thiết yếu cho kiến trúc microservices — từ migration, resilience đến service communication và infrastructure.",
        },
        { type: "subheading", value: "API Gateway — Entry Point" },
        {
          type: "code",
          lang: "java",
          value: `// API Gateway: single entry point, route + aggregate + auth + rate limit
// Spring Cloud Gateway config
// application.yml:
// spring.cloud.gateway.routes:
//   - id: order-service
//     uri: lb://order-service
//     predicates: [Path=/api/orders/**]
//     filters: [StripPrefix=1, AddRequestHeader=X-Gateway-Source,gateway]
//   - id: user-service
//     uri: lb://user-service
//     predicates: [Path=/api/users/**]

// Custom Gateway Filter — auth + logging
@Component
class AuthGatewayFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (token == null || !jwtValidator.validate(token))
            return unauthorized(exchange);
        // Add user info to downstream header
        ServerWebExchange mutated = exchange.mutate()
            .request(r -> r.header("X-User-Id", extractUserId(token)))
            .build();
        return chain.filter(mutated);
    }
}`,
        },
        { type: "subheading", value: "Service Discovery — Eureka / Consul" },
        {
          type: "code",
          lang: "java",
          value: `// Eureka Server
@SpringBootApplication @EnableEurekaServer
public class ServiceRegistryApp { public static void main(String[] a) { SpringApplication.run(ServiceRegistryApp.class, a); } }

// Eureka Client — register on startup
// application.yml: eureka.client.serviceUrl.defaultZone=http://localhost:8761/eureka

// Client-side load balancing với Spring Cloud LoadBalancer
@Bean
@LoadBalanced  // intercepts RestTemplate calls, resolves service name to IP
RestTemplate restTemplate() { return new RestTemplate(); }

@Service
class OrderClient {
    private final RestTemplate restTemplate;
    public Order getOrder(UUID id) {
        // "order-service" resolved via Eureka → actual IP:PORT
        return restTemplate.getForObject("http://order-service/api/orders/" + id, Order.class);
    }
}`,
        },
        { type: "subheading", value: "Circuit Breaker — Resilience4j" },
        {
          type: "code",
          lang: "java",
          value: `@Configuration
class CircuitBreakerConfig {
    @Bean
    CircuitBreakerRegistry circuitBreakerRegistry() {
        io.github.resilience4j.circuitbreaker.CircuitBreakerConfig config =
            io.github.resilience4j.circuitbreaker.CircuitBreakerConfig.custom()
                .failureRateThreshold(50)           // open if >50% fail
                .slowCallRateThreshold(100)          // slow = > 2s
                .slowCallDurationThreshold(Duration.ofSeconds(2))
                .waitDurationInOpenState(Duration.ofSeconds(30)) // wait before half-open
                .slidingWindowType(SlidingWindowType.COUNT_BASED)
                .slidingWindowSize(10)               // last 10 calls
                .minimumNumberOfCalls(5)             // need 5 calls before evaluating
                .permittedNumberOfCallsInHalfOpenState(3)
                .build();
        return CircuitBreakerRegistry.of(config);
    }
}

@Service
class InventoryClient {
    private final CircuitBreaker cb;
    private final Retry retry;

    public Optional<Integer> getStock(String productId) {
        return Try.ofSupplier(
            CircuitBreaker.decorateSupplier(cb,
                Retry.decorateSupplier(retry,
                    () -> inventoryApi.getStock(productId)
                )
            )
        ).recover(CallNotPermittedException.class, e -> {
            log.warn("Circuit open for inventory service, returning cached data");
            return cachedStockLevel(productId); // fallback
        }).get();
    }
}`,
        },
        { type: "subheading", value: "Strangler Fig — Incremental Migration" },
        {
          type: "code",
          lang: "java",
          value: `// Facade trước monolith, route traffic dần dần sang microservices
@RestController
class StranglerFacade {
    private final NewOrderService newService;
    private final LegacyOrderClient legacyClient;
    private final FeatureFlags flags;

    @PostMapping("/api/orders")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest req) {
        return flags.isEnabled("new-order-service")
            ? ResponseEntity.ok(newService.create(req))
            : ResponseEntity.ok(legacyClient.createOrder(req));
    }
}`,
        },
        { type: "subheading", value: "Patterns Summary — Resilience Stack" },
        {
          type: "table",
          headers: ["Pattern", "Mục đích", "Dùng khi", "Library"],
          rows: [
            ["Circuit Breaker", "Stop calling failed service (fail-fast)", "Downstream service không ổn định", "Resilience4j"],
            ["Retry + Backoff", "Retry transient failures", "Network blip, timeout ngắn hạn", "Resilience4j Retry"],
            ["Bulkhead", "Isolate thread pool per dependency", "Một service chậm không ảnh hưởng service khác", "Resilience4j Bulkhead"],
            ["Rate Limiter", "Limit calls per time window", "Bảo vệ downstream, API quota", "Resilience4j RateLimiter"],
            ["Timeout", "Fail fast after duration", "Upstream response unpredictable", "Resilience4j TimeLimiter"],
            ["Fallback", "Return default khi call fail", "Graceful degradation", "Resilience4j + custom"],
          ],
        },
      ],
    },

    // ─── SECTION 12 ──────────────────────────────────────────────────────────
    {
      id: "refactoring",
      title: "Refactoring Techniques",
      badge: "Reference",
      content: [
        {
          type: "text",
          value:
            "Refactoring là cải thiện cấu trúc code mà không thay đổi behavior. Martin Fowler: 'Make it work, make it right, make it fast.'",
        },
        { type: "subheading", value: "Extract Method" },
        {
          type: "code",
          lang: "java",
          value: `// ❌ Before: method quá dài, làm quá nhiều
public void processOrder(Order order) {
    // Validate
    if (order.getCustomerId() == null) throw new ValidationException("Customer required");
    if (order.getItems().isEmpty()) throw new ValidationException("Items required");
    if (order.getItems().stream().anyMatch(i -> i.getQuantity() <= 0))
        throw new ValidationException("Invalid quantity");
    // Calculate
    BigDecimal subtotal = order.getItems().stream()
        .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
        .reduce(BigDecimal.ZERO, BigDecimal::add);
    BigDecimal discount = subtotal.compareTo(new BigDecimal("100")) > 0
        ? subtotal.multiply(new BigDecimal("0.1")) : BigDecimal.ZERO;
    BigDecimal total = subtotal.subtract(discount);
    order.setTotal(total);
    // Save
    orderRepository.save(order);
    emailService.sendConfirmation(order);
}

// ✅ After: Extract Method — each method has single purpose
public void processOrder(Order order) {
    validateOrder(order);
    calculateTotal(order);
    orderRepository.save(order);
    emailService.sendConfirmation(order);
}
private void validateOrder(Order order) {
    if (order.getCustomerId() == null) throw new ValidationException("Customer required");
    if (order.getItems().isEmpty()) throw new ValidationException("Items required");
    order.getItems().forEach(i -> { if (i.getQuantity() <= 0) throw new ValidationException("Invalid quantity"); });
}
private void calculateTotal(Order order) {
    BigDecimal subtotal = calculateSubtotal(order.getItems());
    BigDecimal discount = calculateDiscount(subtotal);
    order.setTotal(subtotal.subtract(discount));
}
private BigDecimal calculateSubtotal(List<OrderItem> items) {
    return items.stream().map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
}
private BigDecimal calculateDiscount(BigDecimal subtotal) {
    return subtotal.compareTo(new BigDecimal("100")) > 0
           ? subtotal.multiply(new BigDecimal("0.1")) : BigDecimal.ZERO;
}`,
        },
        { type: "subheading", value: "Replace Conditional with Polymorphism" },
        {
          type: "code",
          lang: "java",
          value: `// ❌ Before: switch-case grows with each new type
class ShippingCalculator {
    public BigDecimal calculate(Order order) {
        return switch (order.getShippingType()) {
            case "STANDARD"  -> new BigDecimal("5.00");
            case "EXPRESS"   -> new BigDecimal("15.00");
            case "OVERNIGHT" -> new BigDecimal("25.00");
            case "FREE"      -> BigDecimal.ZERO;
            default -> throw new IllegalArgumentException("Unknown type");
        };
    }
}

// ✅ After: Replace with Polymorphism — OCP compliant
interface ShippingCalculator {
    BigDecimal calculate(Order order);
    String type();
}
record StandardShipping() implements ShippingCalculator {
    public BigDecimal calculate(Order order) { return new BigDecimal("5.00"); }
    public String type() { return "STANDARD"; }
}
record ExpressShipping() implements ShippingCalculator {
    public BigDecimal calculate(Order order) { return new BigDecimal("15.00"); }
    public String type() { return "EXPRESS"; }
}
// Adding new type: just add new class — no modification needed`,
        },
        { type: "subheading", value: "Introduce Parameter Object" },
        {
          type: "code",
          lang: "java",
          value: `// ❌ Before: too many parameters
public List<Order> searchOrders(String customerId, String status,
                                LocalDate fromDate, LocalDate toDate,
                                String productCategory, int page, int size) { ... }

// ✅ After: Parameter Object
public record OrderSearchCriteria(
    String customerId, String status,
    LocalDate fromDate, LocalDate toDate,
    String productCategory, int page, int size
) {
    // Can add validation, defaults in compact constructor
    public OrderSearchCriteria {
        if (page < 0) throw new IllegalArgumentException("Page must be >= 0");
        if (size <= 0 || size > 100) throw new IllegalArgumentException("Size must be 1-100");
    }
}
public List<Order> searchOrders(OrderSearchCriteria criteria) { ... }`,
        },
        { type: "subheading", value: "Replace Magic Numbers with Constants/Enums" },
        {
          type: "code",
          lang: "java",
          value: `// ❌ Magic numbers — ý nghĩa không rõ
if (order.getTotal().compareTo(new BigDecimal("10000")) > 0) {
    discount = order.getTotal().multiply(new BigDecimal("0.15"));
}
if (user.getAge() >= 65) grantSeniorDiscount();
Thread.sleep(30000);

// ✅ Named constants + enums
private static final BigDecimal BULK_ORDER_THRESHOLD = new BigDecimal("10000");
private static final BigDecimal BULK_DISCOUNT_RATE   = new BigDecimal("0.15");
private static final int SENIOR_AGE_THRESHOLD        = 65;
private static final Duration CACHE_TTL              = Duration.ofSeconds(30);

if (order.getTotal().compareTo(BULK_ORDER_THRESHOLD) > 0) {
    discount = order.getTotal().multiply(BULK_DISCOUNT_RATE);
}
if (user.getAge() >= SENIOR_AGE_THRESHOLD) grantSeniorDiscount();
Thread.sleep(CACHE_TTL.toMillis());`,
        },
        { type: "subheading", value: "Common Refactoring Catalog" },
        {
          type: "table",
          headers: ["Refactoring", "Khi nào dùng", "Kết quả"],
          rows: [
            ["Extract Method", "Method quá dài (> 20 lines), một đoạn code có comment", "Readable, reusable methods"],
            ["Extract Class", "Class quá nhiều fields/methods không liên quan", "Smaller, focused classes (SRP)"],
            ["Move Method", "Method dùng data của class khác nhiều hơn class của nó", "Better encapsulation"],
            ["Replace Temp with Query", "Biến temp giữ kết quả tính toán", "Extract thành method, tái sử dụng được"],
            ["Introduce Parameter Object", "Nhiều params hay xuất hiện cùng nhau", "Cleaner API, validation ở 1 chỗ"],
            ["Replace Conditional with Polymorphism", "Switch/if-else lớn theo type", "OCP compliant, extensible"],
            ["Remove Dead Code", "Code không bao giờ chạy, commented-out code", "Cleaner, less confusion"],
            ["Rename (method/var/class)", "Tên không phản ánh đúng ý nghĩa", "Self-documenting code"],
            ["Inline Method", "Method body rõ ràng hơn tên của nó", "Remove indirection"],
            ["Decompose Conditional", "Điều kiện phức tạp khó hiểu", "Extract condition + branches thành methods"],
          ],
        },
      ],
    },

    // ─── SECTION 13 ──────────────────────────────────────────────────────────
    {
      id: "anti_patterns",
      title: "Anti-Patterns & Code Smells",
      badge: "Reference",
      content: [
        {
          type: "text",
          value:
            "Senior phải nhận ra anti-patterns và code smells — không chỉ biết patterns đúng mà còn biết patterns sai.",
        },
        { type: "subheading", value: "Code Smells — Dấu hiệu cần refactor" },
        {
          type: "table",
          headers: ["Code Smell", "Dấu hiệu", "Refactoring"],
          rows: [
            ["Long Method", "> 20-30 lines, nhiều comment giải thích", "Extract Method"],
            ["Large Class (God Class)", "Quá nhiều fields/methods, làm mọi thứ", "Extract Class, SRP"],
            ["Long Parameter List", "> 3-4 params trong method signature", "Introduce Parameter Object"],
            ["Duplicate Code", "Same code xuất hiện ở nhiều nơi", "Extract Method/Class, DRY"],
            ["Divergent Change", "1 class thay đổi vì nhiều lý do khác nhau", "Extract Class (SRP)"],
            ["Shotgun Surgery", "1 thay đổi nhỏ → sửa nhiều files/classes", "Move Method, Inline Class"],
            ["Feature Envy", "Method quan tâm đến data của class khác hơn class của nó", "Move Method"],
            ["Data Clumps", "Nhóm data luôn xuất hiện cùng nhau", "Extract Class (Value Object)"],
            ["Primitive Obsession", "Dùng String cho email/phone, int cho money", "Replace Primitive with Value Object"],
            ["Switch Statements", "Switch/if-else lớn theo type", "Replace with Polymorphism"],
            ["Comments Explaining Code", "Comment cần thiết để hiểu code", "Rename, Extract Method — code tự giải thích"],
            ["Dead Code", "Unreachable code, unused variables/methods", "Delete it"],
          ],
        },
        { type: "subheading", value: "Architectural Anti-Patterns" },
        {
          type: "table",
          headers: ["Anti-Pattern", "Mô tả", "Hậu quả", "Fix"],
          rows: [
            ["Anemic Domain Model", "Domain objects chỉ là getters/setters, logic trong Services", "Business rules phân tán, khó tìm, khó test", "Đưa behavior vào domain objects (DDD)"],
            ["God Class", "Class biết và làm mọi thứ", "Không thể maintain, test, extend", "SRP — tách trách nhiệm"],
            ["Big Ball of Mud", "Không có cấu trúc rõ ràng, mọi thứ gọi mọi thứ", "Không thể refactor an toàn", "Identify bounded contexts, introduce layers"],
            ["Distributed Monolith", "Microservices nhưng deploy cùng, phụ thuộc chặt", "Worst of both worlds", "Real loose coupling, async communication"],
            ["Shared Database", "Nhiều microservices dùng chung 1 DB schema", "Schema thay đổi phá vỡ tất cả services", "Database-per-service, sync via events"],
            ["Spaghetti Code", "Logic rối rắm, không có cấu trúc, flow không theo dõi được", "Không thể debug, không thể extend", "Refactor, apply patterns"],
            ["Golden Hammer", "Dùng 1 solution/pattern cho mọi vấn đề", "Over-engineered hoặc under-engineered", "Evaluate context, choose appropriate tool"],
            ["Premature Optimization", "Tối ưu code trước khi có evidence cần thiết", "Complex code, wasted effort", "Profile first, then optimize"],
            ["Not Invented Here (NIH)", "Tự viết mọi thứ thay vì dùng library", "Waste time, reinvent bugs", "Use well-tested libraries"],
            ["Cargo Cult Programming", "Copy patterns/solutions mà không hiểu tại sao", "Patterns không phù hợp với context", "Understand before applying"],
          ],
        },
        { type: "subheading", value: "Microservices-specific Anti-Patterns" },
        {
          type: "table",
          headers: ["Anti-Pattern", "Mô tả", "Fix"],
          rows: [
            ["Nanoservices", "Service quá nhỏ, 1 function = 1 service", "Hợp nhất theo Bounded Context"],
            ["Chatty Services", "Quá nhiều synchronous calls giữa services", "Aggregate calls, dùng events, BFF"],
            ["Synchronous Chain", "A → B → C → D ... đồng bộ", "Async messaging, saga pattern"],
            ["Shared Kernel (overused)", "Chia sẻ quá nhiều code giữa services", "Duplicate nếu cần, tránh coupling"],
          ],
        },
      ],
    },

    // ─── SECTION 14 ──────────────────────────────────────────────────────────
    {
      id: "interview",
      title: "Senior Interview Q&A",
      badge: "Reference",
      content: [
        {
          type: "text",
          value:
            "20 câu hỏi phỏng vấn Senior Java về Design Patterns, DDD, Architecture và Microservices.",
        },
        {
          type: "table",
          headers: ["#", "Câu hỏi", "Điểm chính cần trả lời", "Level"],
          rows: [
            ["1", "Strategy vs State pattern — khi nào dùng mỗi cái?", "Strategy: stateless algorithm swap (no transition). State: stateful lifecycle với transitions. State biết về states khác, Strategy không.", "Mid"],
            ["2", "Anemic Domain Model là gì và DDD fix như thế nào?", "Anemic: domain objects là data bags, logic trong Services. DDD: behavior thuộc Entity/Aggregate. order.place() không phải orderService.placeOrder(order).", "Senior"],
            ["3", "Spring @Transactional hoạt động như thế nào?", "Proxy Pattern (CGLIB/JDK Proxy). Intercepts method call, begin/commit/rollback transaction. Self-invocation bypass proxy — this.method() không có @Transactional.", "Senior"],
            ["4", "CQRS là gì và khi nào KHÔNG nên dùng?", "Tách read/write model để scale độc lập. Không cần cho simple CRUD — thêm complexity (2 models, eventual consistency). Over-engineering cho small apps.", "Senior"],
            ["5", "Outbox Pattern giải quyết vấn đề gì?", "Dual-write problem: DB save + event publish không atomic. Outbox: ghi event vào outbox table trong cùng transaction. Debezium/poller publish sau. Either both succeed or neither.", "Senior"],
            ["6", "Bounded Context là gì? Xác định như thế nào?", "Ranh giới rõ ràng nơi model áp dụng. Xác định: cùng term nghĩa khác nhau, team khác nhau owns, natural seams in business. Order trong Sales ≠ Order trong Warehouse.", "Senior"],
            ["7", "Tại sao Aggregate nên nhỏ?", "Ít conflicts khi concurrent updates, transaction nhỏ, ít locking. Aggregate lớn = nhiều contention. Reference Aggregate khác bằng ID, không phải direct object.", "Senior"],
            ["8", "Strangler Fig vs Big Bang rewrite?", "Strangler: incremental, lower risk, rollback possible, validated by prod traffic. Big Bang: nhanh nếu codebase nhỏ, rất rủi ro cho large systems. Luôn chọn Strangler.", "Senior"],
            ["9", "Visitor Pattern hoạt động và khi nào dùng?", "Double dispatch: element.accept(visitor) gọi visitor.visit(this). Dùng khi: fixed object hierarchy, cần thêm nhiều operations. Nhược: thêm element type → sửa tất cả Visitor.", "Mid"],
            ["10", "Hexagonal Architecture (Ports & Adapters) là gì?", "Domain ở trung tâm, không phụ thuộc framework. Inbound ports (use case interfaces), outbound ports (repository interfaces). Adapters implement ports. Core testable không cần DB/HTTP.", "Senior"],
            ["11", "Bulkhead vs Circuit Breaker — khác gì nhau?", "Bulkhead: isolate resource pools (thread pool per dependency), slow service không starve others. Circuit Breaker: stop calling failed service entirely (fail-fast). Dùng cả hai cùng nhau: Bulkhead + CircuitBreaker + Retry.", "Senior"],
            ["12", "Domain Event vs Application Event khác gì?", "Domain Event: immutable fact trong domain language (OrderPlaced), captured bởi Aggregate, có business significance. Application Event: technical coordination. Domain events thường trở thành Application Events khi publish.", "Senior"],
            ["13", "Decorator vs Proxy — sự khác biệt?", "Cả hai đều wrap object. Decorator: thêm behavior (BufferedReader thêm buffering). Proxy: kiểm soát access (Spring AOP proxy kiểm soát transaction). Decorator transparent với client, Proxy thì không (remote, virtual proxy).", "Mid"],
            ["14", "Event Sourcing khi nào dùng và không dùng?", "Dùng khi: cần audit trail đầy đủ, temporal queries ('state lúc 3pm hôm qua'), rebuild read models. Không dùng: simple CRUD, team nhỏ, không cần history. Complexity cao.", "Senior"],
            ["15", "Saga Choreography vs Orchestration?", "Choreography: loose coupling, event-based, khó trace flow. Orchestration: tập trung, dễ visualize/debug, orchestrator có thể là SPOF. Complex flows → Orchestration. Simple/autonomous → Choreography.", "Senior"],
            ["16", "Clean Architecture Dependency Rule là gì?", "Dependency arrow chỉ từ ngoài vào trong. Entity không import Spring. Use Case không biết HTTP. Infrastructure layer phụ thuộc vào tất cả layers bên trong, ngược lại thì không.", "Senior"],
            ["17", "Factory Method vs Abstract Factory?", "Factory Method: subclass quyết định class nào được tạo (1 product). Abstract Factory: tạo family of related objects (có thể swap toàn bộ family). Factory Method dùng inheritance, Abstract Factory dùng composition.", "Mid"],
            ["18", "Tại sao Value Object nên immutable?", "Thread-safe tự nhiên, không cần defensive copy, safe to share, equals/hashCode consistent. Money(10, USD).add(Money(5, USD)) trả về Money mới, không mutate. Phù hợp làm Map key.", "Mid"],
            ["19", "Singleton trong Spring vs Singleton Pattern?", "Spring Singleton: 1 instance per ApplicationContext (có thể có nhiều contexts). Singleton Pattern: 1 instance per ClassLoader (JVM). Spring dùng IoC container quản lý, không cần static getInstance().", "Mid"],
            ["20", "Khi nào nên refactor từ choreography sang orchestration saga?", "Khi flow trở nên phức tạp, khó debug, cần visibility. Khi có nhiều bước phụ thuộc thứ tự. Khi cần centralized error handling và retry logic. Khi team cần hiểu toàn bộ business flow rõ ràng.", "Senior"],
          ],
        },
      ],
    },
  ],
};
