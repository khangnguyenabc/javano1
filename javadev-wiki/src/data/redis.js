export const redisData = {
  slug: 'caching-redis',
  module: 'VIII.',
  title: 'Caching — Redis Advanced',
  description:
    'Từ kiến trúc single-threaded huyền thoại đến 9 cấu trúc dữ liệu, persistence, replication, cluster, streams và 50+ pattern thực chiến.',
  tags: ['Redis 7.2+', 'Cache', 'In-Memory', 'Pub/Sub', 'Cluster'],
  stats: [
    { num: '27', label: 'Chương mục' },
    { num: '9', label: 'Data structures' },
    { num: '50+', label: 'Patterns' },
  ],
  sections: [

    /* ── 1 ─────────────────────────────────────────────────────── */
    {
      id: 'singlethread',
      title: 'Single-Threaded Architecture',
      badge: 'Core concept',
      content: [
        {
          type: 'text',
          value:
            'Redis xử lý tất cả command trên một thread duy nhất theo mô hình event loop. Đây là lựa chọn thiết kế có chủ đích — không phải hạn chế.',
        },
        { type: 'subheading', value: 'Vì sao single-threaded mà vẫn nhanh?' },
        {
          type: 'list',
          items: [
            'Không lock, không context switch — Mọi command atomic theo bản chất. Không có overhead synchronization.',
            'RAM không phải CPU — Bottleneck là network + memory bandwidth. 1 thread đủ no băng thông 10 Gbps.',
            'Codebase đơn giản — Antirez viết bằng C ~50K LoC, không cần debug race condition.',
            'Predictable latency — Không có jitter từ thread scheduling, p99 ổn định.',
          ],
        },
        {
          type: 'warning',
          value:
            'Một command O(N) chậm sẽ block toàn bộ server. KEYS * trên 1 triệu key có thể block 200+ ms.',
        },
        { type: 'subheading', value: 'Commands CẤM dùng trong production' },
        {
          type: 'code',
          lang: 'redis',
          value: `# ❌ Cấm      →  ✅ Thay bằng
KEYS *        →  SCAN 0 MATCH user:* COUNT 100
HGETALL big   →  HSCAN big 0
SMEMBERS big  →  SSCAN big 0
DEL big_key   →  UNLINK big_key
FLUSHALL      →  FLUSHALL ASYNC`,
        },
        { type: 'subheading', value: 'Redis 6+ I/O Threads' },
        {
          type: 'text',
          value:
            'Redis 6 thêm io-threads để xử lý read/write socket song song, nhưng execution logic vẫn single-threaded. Config: io-threads 4, io-threads-do-reads yes. Thực tế chỉ cần khi NIC > 10 Gbps.',
        },
      ],
    },

    /* ── 2 ─────────────────────────────────────────────────────── */
    {
      id: 'datastructures',
      title: '9 cấu trúc dữ liệu cốt lõi',
      badge: 'Core concept',
      content: [
        {
          type: 'text',
          value:
            'Redis là data structure server, không chỉ là key-value store. Mỗi cấu trúc có encoding nội bộ, tối ưu theo kích thước.',
        },
        {
          type: 'table',
          headers: ['Type', 'Encoding nội bộ', 'Commands chính'],
          rows: [
            ['String',      'int / embstr / raw (max 512 MB)',        'SET GET INCR APPEND'],
            ['Hash',        'listpack / hashtable',                   'HSET HGET HGETALL HINCRBY'],
            ['List',        'quicklist (listpacks)',                   'LPUSH RPOP LRANGE LLEN'],
            ['Set',         'intset / listpack / hashtable',          'SADD SINTER SDIFF SUNION'],
            ['Sorted Set',  'listpack / skiplist+hashtable',          'ZADD ZRANGE ZRANK ZSCORE'],
            ['Bitmap',      'String dạng bit array (max 512 MB)',     'SETBIT GETBIT BITCOUNT BITOP'],
            ['HyperLogLog', 'HLL dense/sparse (12 KB cố định)',       'PFADD PFCOUNT PFMERGE'],
            ['Stream',      'listpack + radix tree',                  'XADD XREAD XREADGROUP XACK'],
            ['Geospatial',  'Sorted Set + geohash 52-bit score',      'GEOADD GEODIST GEOSEARCH'],
          ],
        },
        { type: 'subheading', value: 'Encoding tự động nâng cấp khi vượt ngưỡng' },
        {
          type: 'code',
          lang: 'properties',
          value: `hash-max-listpack-entries 128
hash-max-listpack-value 64
zset-max-listpack-entries 128
list-max-listpack-size -2`,
        },
      ],
    },

    /* ── 3 ─────────────────────────────────────────────────────── */
    {
      id: 'complexity',
      title: 'Big-O Complexity Cheatsheet',
      badge: 'Reference',
      content: [
        {
          type: 'text',
          value:
            'Hiểu Big-O của từng command là kỹ năng sống còn. Redis single-threaded nghĩa là 1 command O(N) lớn = cả server đứng.',
        },
        {
          type: 'table',
          headers: ['Command', 'Complexity', 'Ghi chú'],
          rows: [
            ['GET / SET / DEL',    'O(1)',        '✅ An toàn'],
            ['INCR / INCRBY',      'O(1)',        '✅ Atomic counter'],
            ['HGET / HSET',        'O(1)',        '✅ Một field'],
            ['HGETALL',            'O(N)',        '⚠️ N = số field'],
            ['LPUSH / RPOP',       'O(1)',        '✅ Đầu/cuối list'],
            ['LRANGE',             'O(S+N)',      'S=offset, N=elements'],
            ['SADD / SISMEMBER',   'O(1)',        '✅'],
            ['SINTER / SUNION',    'O(N×M)',      'N=set nhỏ nhất, M=số set'],
            ['ZADD / ZRANK',       'O(log N)',    '✅ Skiplist'],
            ['ZRANGE',             'O(log N + M)','M=elements trả về'],
            ['KEYS pattern',       'O(N)',        '❌ CẤM production'],
            ['SCAN cursor',        'O(1) per call','✅ Thay thế KEYS'],
            ['UNLINK key',         'O(1) + async free','✅ Thay DEL cho key lớn'],
            ['PFADD / PFCOUNT',    'O(1)',        '✅ HyperLogLog'],
            ['GEOSEARCH',          'O(log N + M)',''],
          ],
        },
        {
          type: 'warning',
          value:
            'Dùng SLOWLOG GET 10 để phát hiện command chậm. Threshold khuyến nghị: slowlog-log-slower-than 10000 (10ms).',
        },
      ],
    },

    /* ── 4 ─────────────────────────────────────────────────────── */
    {
      id: 'expiration',
      title: 'TTL, Expiration & Eviction',
      badge: 'Core concept',
      content: [
        {
          type: 'text',
          value:
            'Redis có 2 cơ chế hết hạn key và nhiều eviction policy khi đầy memory.',
        },
        { type: 'subheading', value: '2 cơ chế hết hạn key' },
        {
          type: 'list',
          items: [
            'Lazy expiration — Khi key bị truy cập, Redis kiểm tra TTL. Nếu hết hạn → xoá ngay, trả null. Tiết kiệm CPU nhưng key không truy cập vẫn chiếm RAM.',
            'Active expiration — Background job chạy 10 lần/giây: sample 20 keys có TTL, xoá expired. Nếu > 25% expired → lặp ngay.',
          ],
        },
        {
          type: 'code',
          lang: 'redis',
          value: `SET key value EX 3600          # TTL 1 giờ
SET key value PX 60000         # TTL milliseconds
SET key value EXAT 1735699200  # expire tại Unix timestamp
SET key value NX EX 30         # chỉ set nếu chưa tồn tại
EXPIRE key 3600
TTL key      # -1=no TTL, -2=không tồn tại
PERSIST key  # xoá TTL`,
        },
        { type: 'subheading', value: 'Eviction policies khi maxmemory đầy' },
        {
          type: 'table',
          headers: ['Policy', 'Hành vi', 'Dùng khi'],
          rows: [
            ['noeviction',     'Trả lỗi OOM khi ghi mới',               'Không dùng Redis như cache thuần'],
            ['allkeys-lru',    'Xoá key ít dùng nhất (toàn bộ)',         'Cache thuần — phổ biến'],
            ['volatile-lru',   'Xoá key có TTL ít dùng nhất',            'Mix cache + persistent'],
            ['allkeys-lfu',    'Xoá key ít access nhất (tần suất)',       'Redis 4+, chính xác hơn LRU'],
            ['volatile-ttl',   'Xoá key có TTL ngắn nhất trước',         'Ưu tiên giữ data sống lâu'],
            ['allkeys-random', 'Xoá ngẫu nhiên',                         'Access pattern đồng đều'],
          ],
        },
        {
          type: 'tip',
          value:
            'Production: dùng allkeys-lfu (Redis 4+) cho cache thuần. volatile-lru nếu mix persistent + cache.',
        },
      ],
    },

    /* ── 5 ─────────────────────────────────────────────────────── */
    {
      id: 'persistence',
      title: 'Persistence · RDB vs AOF',
      badge: 'Production',
      content: [
        {
          type: 'text',
          value:
            'Redis có 2 cơ chế lưu trữ: RDB (snapshot) và AOF (append-only log). Production nên dùng hybrid cả hai.',
        },
        { type: 'subheading', value: 'RDB — Snapshot' },
        {
          type: 'code',
          lang: 'properties',
          value: `save 3600 1
save 300 100
save 60 10000
dbfilename dump.rdb
dir /var/lib/redis`,
        },
        {
          type: 'code',
          lang: 'redis',
          value: `BGSAVE    # fork child, không block
LASTSAVE  # Unix timestamp snapshot cuối`,
        },
        { type: 'subheading', value: 'AOF — Append-Only File' },
        {
          type: 'code',
          lang: 'properties',
          value: `appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb`,
        },
        { type: 'subheading', value: 'Hybrid persistence (Redis 4+ — khuyến nghị)' },
        {
          type: 'code',
          lang: 'properties',
          value: `aof-use-rdb-preamble yes`,
        },
        {
          type: 'table',
          headers: ['', 'RDB', 'AOF everysec', 'Hybrid'],
          rows: [
            ['Restart speed',       '✅ Nhanh',              '⚠️ Chậm',              '✅ Nhanh'],
            ['Dữ liệu mất tối đa', 'Từ snapshot cuối',       '≤ 1 giây',             '≤ 1 giây'],
            ['File size',           '✅ Nhỏ',                '⚠️ Lớn',               'Medium'],
            ['Production',          '⚠️ Không nên dùng mình','⚠️ Không nên dùng mình','✅ Khuyến nghị'],
          ],
        },
      ],
    },

    /* ── 6 ─────────────────────────────────────────────────────── */
    {
      id: 'replication',
      title: 'Replication, Sentinel & High Availability',
      badge: 'Production',
      content: [
        {
          type: 'text',
          value:
            'Replication tạo bản sao read replica. Sentinel tự động failover khi master chết.',
        },
        {
          type: 'code',
          lang: 'redis',
          value: `REPLICAOF master-host 6379
INFO replication
# Kiểm tra: master_repl_offset == slave_repl_offset`,
        },
        { type: 'subheading', value: 'Redis Sentinel — Auto Failover' },
        {
          type: 'code',
          lang: 'properties',
          value: `sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
sentinel parallel-syncs mymaster 1`,
        },
        { type: 'subheading', value: 'Quy trình failover' },
        {
          type: 'list',
          items: [
            'Sentinel phát hiện master không respond sau down-after-milliseconds.',
            'Quorum (2/3) đồng ý → bầu replica có lag nhỏ nhất làm master mới.',
            'Sentinel reconfigure tất cả replica và notify client.',
            'Client dùng Sentinel-aware connection (Jedis SentinelPool, Lettuce) tự động reconnect.',
          ],
        },
        {
          type: 'warning',
          value:
            'Sentinel KHÔNG sharding — toàn bộ data vẫn trên 1 node. Dùng Sentinel cho HA, dùng Cluster khi cần scale dữ liệu.',
        },
      ],
    },

    /* ── 7 ─────────────────────────────────────────────────────── */
    {
      id: 'cluster',
      title: 'Redis Cluster · Sharding ngang',
      badge: 'Production',
      content: [
        {
          type: 'text',
          value:
            'Redis Cluster sharding qua 16384 hash slot. Tối thiểu 3 master + 3 replica.',
        },
        {
          type: 'code',
          lang: 'redis',
          value: `# slot = CRC16(key) mod 16384
# 3-master cluster:
Node 1: slots 0-5460
Node 2: slots 5461-10922
Node 3: slots 10923-16383`,
        },
        { type: 'subheading', value: 'Hash Tag — bắt key vào cùng slot' },
        {
          type: 'code',
          lang: 'redis',
          value: `# {user:123} là hash tag → cùng slot
MSET {user:123}:name "Alice" {user:123}:email "a@x.com"`,
        },
        {
          type: 'code',
          lang: 'bash',
          value: `redis-cli --cluster create \\
  127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 \\
  127.0.0.1:7004 127.0.0.1:7005 127.0.0.1:7006 \\
  --cluster-replicas 1
redis-cli --cluster check 127.0.0.1:7001`,
        },
        {
          type: 'warning',
          value:
            'Cluster không hỗ trợ multi-key commands (MGET, MSET, Lua, MULTI/EXEC) trừ khi tất cả keys cùng slot. Dùng hash tag để fix.',
        },
      ],
    },

    /* ── 8 ─────────────────────────────────────────────────────── */
    {
      id: 'pipeline',
      title: 'Pipelining vs Transactions vs Lua',
      badge: 'Core concept',
      content: [
        { type: 'subheading', value: '1. Pipelining — Giảm RTT' },
        {
          type: 'text',
          value:
            'Client gửi N command liên tục không chờ reply từng cái. Giảm từ N round-trips xuống 1.',
        },
        {
          type: 'code',
          lang: 'python',
          value: `pipe = r.pipeline()
for i in range(1000):
    pipe.incr(f'counter:{i}')
results = pipe.execute()  # 1 round-trip thay vì 1000`,
        },
        { type: 'subheading', value: '2. MULTI / EXEC — Transaction' },
        {
          type: 'text',
          value:
            'Queue command, execute atomically. Không có rollback — EXEC chạy hết kể cả lỗi command giữa chừng.',
        },
        {
          type: 'code',
          lang: 'redis',
          value: `MULTI
INCR balance:alice
DECR balance:bob
EXEC      # hoặc DISCARD để huỷ`,
        },
        { type: 'subheading', value: '3. Lua Script — Atomic + Logic phức tạp' },
        {
          type: 'code',
          lang: 'lua',
          value: `EVAL "
  local val = tonumber(redis.call('GET', KEYS[1]))
  if val and val >= tonumber(ARGV[1]) then
    redis.call('DECRBY', KEYS[1], ARGV[1])
    return 1
  end
  return 0
" 1 balance:user:123 50`,
        },
        { type: 'subheading', value: 'Redis Functions (Redis 7+)' },
        {
          type: 'code',
          lang: 'redis',
          value: `FUNCTION LOAD "#!lua name=mylib\\nredis.register_function('myfunc', function(keys, args) return args[1] end)"
FCALL myfunc 0 hello`,
        },
      ],
    },

    /* ── 9 ─────────────────────────────────────────────────────── */
    {
      id: 'session',
      title: 'Session Store',
      badge: 'Pattern',
      content: [
        {
          type: 'text',
          value:
            'Cache session là use case kinh điển. Token dài, payload nhỏ, TTL ngắn — phù hợp hoàn hảo với Redis.',
        },
        {
          type: 'code',
          lang: 'redis',
          value: `# Tạo session
HSET session:<token> userId 123 role admin loginAt 1735699200 ip 1.2.3.4
EXPIRE session:<token> 1800

# Lấy session
HGETALL session:<token>

# Sliding session — refresh TTL khi còn hoạt động
EXPIRE session:<token> 1800

# Logout
DEL session:<token>

# Logout all devices
SADD user:123:sessions <token>
# khi logout all:
# for each token in SMEMBERS user:123:sessions → DEL session:<token>
DEL user:123:sessions`,
        },
        {
          type: 'tip',
          value:
            'Dùng HSET thay SET+JSON để update từng field riêng lẻ mà không cần đọc-sửa-ghi toàn bộ payload.',
        },
      ],
    },

    /* ── 10 ────────────────────────────────────────────────────── */
    {
      id: 'leaderboard',
      title: 'Leaderboard chi tiết',
      badge: 'Pattern',
      content: [
        {
          type: 'text',
          value:
            'Sorted Set là vũ khí tuyệt đối — sắp xếp tự động theo score, query top-K O(log N).',
        },
        {
          type: 'code',
          lang: 'redis',
          value: `# Update score (GT = chỉ cập nhật nếu điểm mới cao hơn)
ZADD lb:weekly GT 1500 user:456

# Top 10
ZREVRANGE lb:weekly 0 9 WITHSCORES

# Hạng của user
ZREVRANK lb:weekly user:456

# Người chơi xung quanh (neighbourhood ±5)
# local rank = ZREVRANK lb:weekly user:456
ZREVRANGE lb:weekly rank-5 rank+5 WITHSCORES

# Tổng hợp nhiều tuần
ZUNIONSTORE lb:alltime 4 lb:week1 lb:week2 lb:week3 lb:week4`,
        },
        { type: 'subheading', value: 'Tie-breaking khi cùng điểm' },
        {
          type: 'text',
          value:
            'Redis sort bằng score, nếu bằng nhau thì sort theo key lexicographic. Để tie-break bằng thời gian: encode timestamp vào phần thập phân của score.',
        },
        {
          type: 'code',
          lang: 'python',
          value: `# score = points + (1 - timestamp/MAX_TS) → điểm cao + đạt sớm hơn ưu tiên
score = 1500 + (1 - 1735699200 / 9999999999)
r.zadd("lb:weekly", {f"user:456": score})`,
        },
      ],
    },

    /* ── 11 ────────────────────────────────────────────────────── */
    {
      id: 'counters',
      title: 'Counter & Analytics',
      badge: 'Pattern',
      content: [
        {
          type: 'text',
          value:
            'Redis là nhà vô địch đếm tần suất nhờ INCR atomic, HyperLogLog xấp xỉ và Bitmap siêu nhỏ.',
        },
        { type: 'subheading', value: 'Exact Counter' },
        {
          type: 'code',
          lang: 'redis',
          value: `INCR pv:article:42
INCR pv:article:42:2026-05
INCRBY pv:article:42 10
INCRBYFLOAT revenue 12.99
INCR rate:user:123
EXPIRE rate:user:123 60 NX`,
        },
        { type: 'subheading', value: 'HyperLogLog — Unique visitors (sai số 0.81%)' },
        {
          type: 'code',
          lang: 'redis',
          value: `PFADD dau:2026-05-13 user:1 user:2 user:42
PFCOUNT dau:2026-05-13
PFMERGE mau:2026-05 dau:2026-05-01 dau:2026-05-02
# Memory: 12 KB cố định dù 1 tỷ unique users`,
        },
        { type: 'subheading', value: 'Bitmap — Compact boolean array' },
        {
          type: 'code',
          lang: 'redis',
          value: `SETBIT read:article:42:2026-05-13 <userId> 1
GETBIT read:article:42:2026-05-13 <userId>
BITCOUNT read:article:42:2026-05-13
# Daily Active Users — 1 bit/user, 128 MB cho 1 tỷ users
BITOP AND active:week active:mon active:tue active:wed`,
        },
      ],
    },

    /* ── 12 ────────────────────────────────────────────────────── */
    {
      id: 'ratelimit',
      title: 'Rate Limiting — 4 algorithms',
      badge: 'Pattern',
      content: [
        {
          type: 'text',
          value:
            'Redis là backend phổ biến nhất cho rate limiting nhờ INCR atomic và Lua script không race condition.',
        },
        { type: 'subheading', value: '1. Fixed Window' },
        {
          type: 'code',
          lang: 'redis',
          value: `INCR rl:user:123:<hour>
EXPIRE rl:user:123:<hour> 3600 NX
# Nếu > 100 → 429 Too Many Requests`,
        },
        {
          type: 'warning',
          value:
            'Burst tại ranh giới window: user có thể gửi 100 req cuối window + 100 req đầu window tiếp = 200 req trong 2 giây.',
        },
        { type: 'subheading', value: '2. Sliding Window Log' },
        {
          type: 'code',
          lang: 'redis',
          value: `ZADD rl:user:123 <now_ms> <uuid>
ZREMRANGEBYSCORE rl:user:123 0 <now_ms - window_ms>
# count = ZCARD rl:user:123 → nếu > limit → reject
EXPIRE rl:user:123 <window_seconds>`,
        },
        { type: 'subheading', value: '3. Token Bucket (Lua — atomic)' },
        {
          type: 'code',
          lang: 'lua',
          value: `local tokens = tonumber(redis.call('GET', KEYS[1])) or tonumber(ARGV[1])
local now    = tonumber(ARGV[2])
local last   = tonumber(redis.call('GET', KEYS[2])) or now
local rate   = tonumber(ARGV[3])
tokens = math.min(tonumber(ARGV[1]), tokens + (now - last) * rate / 1000)
redis.call('SET', KEYS[2], now)
if tokens >= 1 then
    redis.call('SET', KEYS[1], tokens - 1)
    return 1
end
return 0`,
        },
        { type: 'subheading', value: '4. Sliding Window Counter' },
        {
          type: 'text',
          value:
            'Kết hợp Fixed Window current + previous theo tỉ lệ thời gian đã trôi qua: prev_count × (1 - elapsed/window) + curr_count ≤ limit. Cân bằng giữa chính xác và hiệu năng.',
        },
        {
          type: 'tip',
          value:
            'Production: dùng Token Bucket qua Lua script. Hoặc dùng Redis module redis-cell — implement Token Bucket sẵn với 1 command duy nhất.',
        },
      ],
    },

    /* ── 13 ────────────────────────────────────────────────────── */
    {
      id: 'delayqueue',
      title: 'Delayed Job Queue',
      badge: 'Pattern',
      content: [
        {
          type: 'text',
          value:
            'Lên lịch job chạy sau N phút/giờ — không cần Cron, không cần Beanstalkd.',
        },
        {
          type: 'code',
          lang: 'redis',
          value: `# Producer — score = Unix timestamp due
ZADD jobs:delayed 1735780000 "job:send_reminder:order:99"
SET job:payload:send_reminder:order:99 '{"to":"user@x.com","orderId":99}' EX 604800

# Worker — poll mỗi giây
# jobs = ZRANGEBYSCORE jobs:delayed -inf <now> LIMIT 0 10
# for each job:
#   if ZREM jobs:delayed job == 1:  (atomic claim)
#     payload = GET job:payload:<id>
#     process(payload)
#     DEL job:payload:<id>`,
        },
        {
          type: 'tip',
          value:
            'Dùng ZRANGEBYSCORE + ZREM trong Lua script để đảm bảo atomic — tránh race condition giữa nhiều worker.',
        },
        {
          type: 'warning',
          value:
            'Worker phải xử lý idempotent — job có thể chạy 2 lần nếu worker crash sau ZREM nhưng trước khi hoàn thành.',
        },
      ],
    },

    /* ── 14 ────────────────────────────────────────────────────── */
    {
      id: 'lock',
      title: 'Distributed Lock & Redlock',
      badge: 'Production',
      content: [
        {
          type: 'text',
          value:
            'Distributed lock ngăn nhiều instance chạy cùng một tác vụ (cron job, tính toán nặng, inventory check).',
        },
        { type: 'subheading', value: 'Single Redis Lock' },
        {
          type: 'code',
          lang: 'redis',
          value: `# Acquire
SET lock:resource:42 <uuid> NX PX 30000
# OK → giữ lock 30s  /  nil → ai đó đang giữ`,
        },
        {
          type: 'code',
          lang: 'lua',
          value: `-- Release — atomic check-and-delete
if redis.call('get', KEYS[1]) == ARGV[1] then
    return redis.call('del', KEYS[1])
else
    return 0
end`,
        },
        { type: 'subheading', value: 'Redlock — N Redis masters' },
        {
          type: 'list',
          items: [
            'Acquire lock trên N/2+1 masters trong thời gian < TTL/2.',
            'Nếu không đủ quorum → release tất cả, retry với exponential backoff + jitter.',
            'Lock valid nếu elapsed < TTL - clock drift.',
            'Dùng khi Redis instance có thể chết và cần safety cao hơn.',
          ],
        },
        {
          type: 'warning',
          value:
            'Redlock không safe với clock drift lớn và GC pause (Martin Kleppmann). Nếu cần strong guarantee, dùng ZooKeeper/etcd. Redlock đủ tốt cho hầu hết use case thực tế.',
        },
      ],
    },

    /* ── 15 ────────────────────────────────────────────────────── */
    {
      id: 'streams',
      title: 'Redis Streams — Event log',
      badge: 'Redis 5+',
      content: [
        {
          type: 'text',
          value:
            'Streams là append-only log bất biến với consumer groups — như Kafka thu nhỏ trong Redis.',
        },
        { type: 'subheading', value: 'Producer' },
        {
          type: 'code',
          lang: 'redis',
          value: `XADD orders:stream * orderId 123 amount 99.5 userId 42
XADD orders:stream MAXLEN ~ 10000 * orderId 124 amount 49.0
XLEN orders:stream
XRANGE orders:stream - + COUNT 10`,
        },
        { type: 'subheading', value: 'Consumer Group — Chia tải nhiều worker' },
        {
          type: 'code',
          lang: 'redis',
          value: `XGROUP CREATE orders:stream payment-workers $ MKSTREAM
XREADGROUP GROUP payment-workers worker-1 COUNT 10 BLOCK 5000 STREAMS orders:stream >
XACK orders:stream payment-workers <message-id>
XPENDING orders:stream payment-workers - + 10
XCLAIM orders:stream payment-workers worker-2 60000 <stale-id>`,
        },
        {
          type: 'tip',
          value:
            'Streams + Consumer Group phù hợp khi cần: ordered events, at-least-once delivery, nhiều consumer type xử lý cùng event.',
        },
      ],
    },

    /* ── 16 ────────────────────────────────────────────────────── */
    {
      id: 'pubsub',
      title: 'Pub/Sub & Keyspace Notifications',
      badge: 'Pattern',
      content: [
        {
          type: 'text',
          value:
            'Pub/Sub cho real-time messaging fire-and-forget. Keyspace notifications để react khi key thay đổi.',
        },
        {
          type: 'code',
          lang: 'redis',
          value: `SUBSCRIBE news:tech news:business
PSUBSCRIBE news:*
PUBLISH news:tech "Redis 8 released!"`,
        },
        {
          type: 'warning',
          value:
            'Pub/Sub KHÔNG persist — subscriber offline sẽ mất message. Cần durability → dùng Streams.',
        },
        { type: 'subheading', value: 'Keyspace Notifications' },
        {
          type: 'code',
          lang: 'properties',
          value: `notify-keyspace-events "KEA"`,
        },
        {
          type: 'code',
          lang: 'redis',
          value: `SUBSCRIBE __keyevent@0__:expired`,
        },
        {
          type: 'tip',
          value:
            'Keyspace notification hay dùng để trigger action khi session hết hạn: logout user, gửi email nhắc nhở.',
        },
      ],
    },

    /* ── 17 ────────────────────────────────────────────────────── */
    {
      id: 'cachepatterns',
      title: 'Cache Patterns & Cache Problems',
      badge: 'Core concept',
      content: [
        { type: 'subheading', value: '4 Caching Patterns' },
        {
          type: 'table',
          headers: ['Pattern', 'Cơ chế', 'Ưu điểm', 'Nhược điểm'],
          rows: [
            ['Cache-Aside (Lazy)', 'App check cache → miss → query DB → SET cache', 'Cache chỉ chứa data thực sự dùng', 'Cache miss đầu tiên luôn hit DB'],
            ['Read-Through',      'Cache tự load DB khi miss',                      'Logic đơn giản cho app',           'Cold start chậm'],
            ['Write-Through',     'Ghi đồng thời cache VÀ DB',                      'Luôn consistent',                  'Write latency cao hơn'],
            ['Write-Behind',      'Ghi cache ngay, ghi DB async',                   'Write throughput cực cao',         'Risk mất data nếu Redis crash'],
          ],
        },
        { type: 'subheading', value: 'Cache Penetration — Query key không tồn tại' },
        {
          type: 'code',
          lang: 'java',
          value: `// Fix 1: Cache null value
String value = cache.get(key);
if (value == null) {
    value = db.query(key);
    cache.set(key, value != null ? value : "NULL_SENTINEL", Duration.ofMinutes(5));
}
// Fix 2: Bloom Filter check trước
if (!bloomFilter.mightContain(key)) return null;`,
        },
        { type: 'subheading', value: 'Cache Stampede — Nhiều request miss cùng lúc' },
        {
          type: 'code',
          lang: 'java',
          value: `String value = cache.get(key);
if (value == null) {
    if (lock.tryLock(key)) {
        try {
            value = db.query(key);
            cache.set(key, value);
        } finally { lock.unlock(key); }
    } else {
        Thread.sleep(50);
        value = cache.get(key);
    }
}`,
        },
        { type: 'subheading', value: 'Cache Avalanche — Nhiều key expire cùng lúc' },
        {
          type: 'code',
          lang: 'java',
          value: `long ttl = baseTtl + ThreadLocalRandom.current().nextLong(0, jitterSeconds);
cache.set(key, value, Duration.ofSeconds(ttl));`,
        },
      ],
    },

    /* ── 18 ────────────────────────────────────────────────────── */
    {
      id: 'modules',
      title: 'Redis Modules — RediSearch, JSON, TimeSeries',
      badge: 'Redis Stack',
      content: [
        {
          type: 'table',
          headers: ['Module', 'Lệnh chính', 'Use case'],
          rows: [
            ['RediSearch',      'FT.CREATE · FT.SEARCH · FT.AGGREGATE', 'Full-text search, secondary index, vector search'],
            ['RedisJSON',       'JSON.SET · JSON.GET · JSON.ARRAPPEND',  'Document store, nested JSON query'],
            ['RedisTimeSeries', 'TS.ADD · TS.RANGE · TS.MRANGE',        'IoT metrics, monitoring, financial data'],
            ['RedisBloom',      'BF.ADD · BF.EXISTS · CF.ADD',           'Bloom Filter, Cuckoo Filter, Count-Min Sketch'],
          ],
        },
        { type: 'subheading', value: 'Vector Search (AI use case)' },
        {
          type: 'code',
          lang: 'redis',
          value: `FT.CREATE idx:products ON HASH PREFIX 1 product:
  SCHEMA name TEXT embedding VECTOR HNSW 6 TYPE FLOAT32 DIM 1536 DISTANCE_METRIC COSINE
FT.SEARCH idx:products "*=>[KNN 10 @embedding $vec AS score]"
  PARAMS 2 vec <query_vector_bytes> RETURN 2 name score`,
        },
        {
          type: 'tip',
          value:
            'Redis Stack = Redis + tất cả modules trong 1 package. Docker: redis/redis-stack',
        },
      ],
    },

    /* ── 19 ────────────────────────────────────────────────────── */
    {
      id: 'memory',
      title: 'Memory Management & Big Keys',
      badge: 'Production',
      content: [
        {
          type: 'text',
          value:
            'Memory là tài nguyên quan trọng nhất. Big key gây block, memory spike và slow replication.',
        },
        {
          type: 'code',
          lang: 'redis',
          value: `INFO memory
MEMORY USAGE key
MEMORY STATS
MEMORY DOCTOR
# CLI tools:
# redis-cli --bigkeys
# redis-cli --memkeys`,
        },
        {
          type: 'table',
          headers: ['Approach lưu 10M users', 'Memory', 'Ghi chú'],
          rows: [
            ['SET user:ID (JSON string)',    '~2 GB',   'Baseline'],
            ['HSET user:ID field value',     '~1 GB',   'Tiết kiệm 50% nhờ listpack'],
            ['HSET + hash-max-listpack=64',  '~500 MB', 'Shard user ID vào sub-hash'],
            ['Compressed msgpack',           '~300 MB', 'Nhỏ nhất nhưng mất query field'],
          ],
        },
        {
          type: 'warning',
          value:
            'Xoá big key bằng DEL sẽ block Redis. Luôn dùng UNLINK (async) cho collection > 1000 elements.',
        },
        {
          type: 'code',
          lang: 'redis',
          value: `UNLINK big:hash:key
HSCAN big:hash 0 COUNT 100`,
        },
      ],
    },

    /* ── 20 ────────────────────────────────────────────────────── */
    {
      id: 'geo',
      title: 'Geo Commands sâu',
      badge: 'Pattern',
      content: [
        {
          type: 'text',
          value:
            'Redis Geo dùng Sorted Set với geohash 52-bit làm score. O(log N) tìm kiếm lân cận.',
        },
        {
          type: 'code',
          lang: 'redis',
          value: `GEOADD locations 106.695 10.776 "HCM"
GEOADD locations 105.834 21.028 "Hanoi"
GEODIST locations "HCM" "Hanoi" km
GEOPOS locations "HCM"
GEOHASH locations "HCM"
GEOSEARCH locations FROMLONLAT 106.695 10.776 BYRADIUS 5 km ASC COUNT 10 WITHCOORD WITHDIST
GEOSEARCH locations FROMLONLAT 106.695 10.776 BYBOX 20 20 km ASC`,
        },
        {
          type: 'tip',
          value:
            'Dùng GEOSEARCH (Redis 6.2+) thay GEORADIUS (deprecated). Độ chính xác geohash 52-bit: ~0.6mm.',
        },
      ],
    },

    /* ── 21 ────────────────────────────────────────────────────── */
    {
      id: 'security',
      title: 'Security · ACL, TLS, Best practices',
      badge: 'Production',
      content: [
        {
          type: 'warning',
          value:
            'Redis mặc định KHÔNG có auth, listen trên 0.0.0.0:6379. Nhiều Redis bị hack vì quên cấu hình bảo mật.',
        },
        {
          type: 'code',
          lang: 'properties',
          value: `bind 127.0.0.1 -::1
protected-mode yes
requirepass <strong-password>
rename-command FLUSHALL ""
rename-command CONFIG "CONFIG_HIDDEN_XYZ"`,
        },
        { type: 'subheading', value: 'ACL (Redis 6+)' },
        {
          type: 'code',
          lang: 'redis',
          value: `ACL SETUSER readonly on >password ~* &* +@read -@write
ACL SETUSER cacheuser on >pass ~cache:* +GET +MGET +EXISTS
ACL LIST
ACL WHOAMI`,
        },
        { type: 'subheading', value: 'TLS (Redis 6+)' },
        {
          type: 'code',
          lang: 'properties',
          value: `tls-port 6380
tls-cert-file /path/to/redis.crt
tls-key-file /path/to/redis.key
tls-ca-cert-file /path/to/ca.crt
tls-auth-clients yes`,
        },
      ],
    },

    /* ── 22 ────────────────────────────────────────────────────── */
    {
      id: 'monitoring',
      title: 'Monitoring, Slowlog & Latency',
      badge: 'Production',
      content: [
        {
          type: 'code',
          lang: 'redis',
          value: `INFO server
INFO clients
INFO memory
INFO stats
INFO replication
INFO keyspace`,
        },
        { type: 'subheading', value: 'Slow Log' },
        {
          type: 'code',
          lang: 'redis',
          value: `CONFIG SET slowlog-log-slower-than 10000
CONFIG SET slowlog-max-len 128
SLOWLOG GET 10
SLOWLOG RESET`,
        },
        { type: 'subheading', value: 'Key metrics cần alert' },
        {
          type: 'table',
          headers: ['Metric', 'Threshold cảnh báo', 'Ý nghĩa'],
          rows: [
            ['keyspace_hit_ratio',      '< 80%',          'Cache miss quá nhiều'],
            ['mem_fragmentation_ratio', '> 1.5',           'Memory fragmented'],
            ['blocked_clients',         '> 0',             'Client chờ BLPOP/BRPOP'],
            ['connected_clients',       'Gần maxclients',  'Sắp hết connection slot'],
            ['rdb_last_bgsave_status',  'err',             'Snapshot thất bại'],
            ['replication lag',         '> 1 MB',          'Replica chậm quá'],
          ],
        },
      ],
    },

    /* ── 23 ────────────────────────────────────────────────────── */
    {
      id: 'transactions',
      title: 'Transactions — WATCH/MULTI/EXEC',
      badge: 'Core concept',
      content: [
        {
          type: 'text',
          value:
            'Redis không có row lock — dùng WATCH để implement optimistic concurrency (check-and-set).',
        },
        {
          type: 'code',
          lang: 'redis',
          value: `WATCH balance:alice balance:bob
# local alice = GET balance:alice
# local bob = GET balance:bob
# if alice >= 100:
MULTI
DECRBY balance:alice 100
INCRBY balance:bob 100
EXEC
# nil    → key bị thay đổi giữa WATCH và EXEC → retry
# [OK, OK] → thành công`,
        },
        {
          type: 'warning',
          value:
            'EXEC trả về nil (không phải lỗi) nếu watched key bị thay đổi. Code phải check và retry. Không dùng WATCH cross-slot trong cluster.',
        },
      ],
    },

    /* ── 24 ────────────────────────────────────────────────────── */
    {
      id: 'clientcache',
      title: 'Client-Side Caching · Tracking',
      badge: 'Redis 6+',
      content: [
        {
          type: 'text',
          value:
            'Redis 6+ hỗ trợ invalidation protocol để client cache local, server notify khi data thay đổi — giảm network round-trips.',
        },
        {
          type: 'code',
          lang: 'redis',
          value: `CLIENT TRACKING ON
GET user:123
# server ghi nhớ connection này track user:123
# khi user:123 thay đổi → server gửi invalidation message
SET user:123 "new value"
# client nhận: invalidate [user:123]`,
        },
        {
          type: 'tip',
          value:
            'Lettuce (Java client) có built-in client-side caching. Phù hợp cho data ít thay đổi: user profile, config, feature flags.',
        },
      ],
    },

    /* ── 25 ────────────────────────────────────────────────────── */
    {
      id: 'redis7',
      title: 'Redis 7.x · Những điểm mới đáng chú ý',
      badge: 'Redis 7+',
      content: [
        { type: 'subheading', value: 'Redis Functions (7.0)' },
        {
          type: 'code',
          lang: 'redis',
          value: `FUNCTION LOAD "#!lua name=mylib\\nredis.register_function('greet', function(k,a) return 'Hello '..a[1] end)"
FCALL greet 0 World
FUNCTION LIST`,
        },
        { type: 'subheading', value: 'Sharded Pub/Sub (7.0)' },
        {
          type: 'text',
          value:
            'Pub/Sub cũ broadcast toàn cluster. Sharded Pub/Sub chỉ route đến node chứa channel → tiết kiệm bandwidth.',
        },
        {
          type: 'code',
          lang: 'redis',
          value: `SSUBSCRIBE channel:orders
SPUBLISH channel:orders "new-order"`,
        },
        { type: 'subheading', value: 'EXPIRE options mới (7.0)' },
        {
          type: 'code',
          lang: 'redis',
          value: `EXPIRE key 3600 NX   # chỉ set nếu chưa có TTL
EXPIRE key 3600 XX   # chỉ set nếu đã có TTL
EXPIRE key 3600 GT   # chỉ set nếu TTL mới > hiện tại
EXPIRE key 3600 LT   # chỉ set nếu TTL mới < hiện tại`,
        },
        { type: 'subheading', value: 'ACL v2 — Key permissions chi tiết' },
        {
          type: 'list',
          items: [
            '%R~key:* — read-only key permission',
            '%W~key:* — write-only key permission',
            '&channel:* — Pub/Sub channel permission',
            'Selectors: gắn nhiều permission set vào 1 user',
          ],
        },
      ],
    },

    /* ── 26 ────────────────────────────────────────────────────── */
    {
      id: 'patterns',
      title: '50+ Patterns thực tế',
      badge: 'Pattern',
      content: [
        {
          type: 'text',
          value:
            'Danh sách các pattern phổ biến nhất — data structure phù hợp và key naming convention.',
        },
        {
          type: 'table',
          headers: ['Pattern', 'Data Structure', 'Key design'],
          rows: [
            ['Shopping cart',        'Hash',                        'cart:{userId}'],
            ['OTP verification',     'String + EXPIRE',             'otp:{phone}'],
            ['Idempotency key',      'String NX + EXPIRE',          'idempotent:{requestId}'],
            ['Distributed counter',  'String INCR',                 'counter:{name}:{date}'],
            ['News feed timeline',   'Sorted Set',                  'feed:{userId} — score=timestamp'],
            ['Daily Active Users',   'HyperLogLog',                 'dau:{date}'],
            ['Online status',        'String + EXPIRE',             'online:{userId}'],
            ['Chat room',            'Stream',                      'chat:{roomId}'],
            ['URL Shortener',        'Hash',                        'url:{shortCode}'],
            ['Autocomplete',         'Sorted Set',                  'autocomplete:{prefix}'],
            ['Nearby places',        'Geo',                         'locations:{category}'],
            ['API rate limiting',    'String INCR / Sorted Set',    'rl:{userId}:{window}'],
            ['Background job queue', 'List LPUSH/BRPOP',            'jobs:{priority}'],
            ['Product tags',         'Set',                         'tags:{productId}'],
            ['Mutual friends',       'Set SINTER',                  'friends:{userId}'],
            ['Recent visitors',      'Sorted Set + ZREMRANGEBYRANK','visitors:{pageId}'],
            ['Rating system',        'Sorted Set',                  'ratings:{itemId}'],
            ['Multi-device sessions','Set + Hash',                  'sessions:{userId}'],
            ['Seat/ticket booking',  'String SETNX / Lua',          'lock:seat:{seatId}'],
            ['Inventory decrement',  'String DECRBY / Lua',         'inventory:{productId}'],
            ['Game leaderboard',     'Sorted Set',                  'lb:{game}:{period}'],
            ['A/B testing',          'String SET NX',               'ab:{experimentId}:{userId}'],
            ['Feature flags',        'Hash',                        'flags:{service}'],
            ['Password reset token', 'String NX + EXPIRE',          'reset:{token}'],
            ['Trending topics',      'Sorted Set + ZINCRBY',        'trending:{date}'],
            ['Single-use coupon',    'String SET NX',               'coupon:{code}'],
            ['Cron job lock',        'String SET NX PX',            'cronlock:{jobName}'],
            ['Search history',       'List LPUSH + LTRIM',          'searchhist:{userId}'],
            ['Upload progress',      'String SET',                  'upload:{jobId}:progress'],
            ['Payment idempotency',  'String SET NX + Hash',        'payment:{idempotencyKey}'],
          ],
        },
      ],
    },

    /* ── 27 ────────────────────────────────────────────────────── */
    {
      id: 'tips',
      title: 'FAQ & Best Practices',
      badge: 'Reference',
      content: [
        { type: 'subheading', value: 'Redis có ACID không?' },
        {
          type: 'table',
          headers: ['ACID', 'Redis', 'Chi tiết'],
          rows: [
            ['Atomicity',   '✅',  'MULTI/EXEC, Lua atomic. Cluster = eventual consistency'],
            ['Consistency', '✅',  'Single-thread đảm bảo'],
            ['Isolation',   '✅',  'Single-thread, không cần MVCC'],
            ['Durability',  '⚠️', 'AOF everysec = mất ≤ 1s. RDB = mất nhiều hơn'],
          ],
        },
        { type: 'subheading', value: 'Key naming convention' },
        {
          type: 'code',
          lang: 'text',
          value: `# object:id:field
user:123:profile
order:456:items
cache:product:789
lock:checkout:session:abc
rate:api:user:123:2026-05-13`,
        },
        { type: 'subheading', value: 'Production checklist' },
        {
          type: 'list',
          items: [
            '✅ Đặt maxmemory + eviction policy (allkeys-lfu cho cache)',
            '✅ Bật AOF + RDB hybrid persistence',
            '✅ Cấu hình bind + requirepass + TLS',
            '✅ Disable KEYS, FLUSHALL qua rename-command hoặc ACL',
            '✅ Set slowlog-log-slower-than 10000',
            '✅ Monitor hit_rate, fragmentation, replication lag',
            '✅ Dùng UNLINK thay DEL cho collection lớn',
            '✅ TTL jitter để tránh cache avalanche',
            '✅ Connection pooling — không tạo connection mỗi request',
            '✅ Pipelining khi gửi nhiều command liên tiếp',
          ],
        },
      ],
    },

  ],
}
