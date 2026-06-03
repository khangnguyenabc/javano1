export const networkingData = {
  slug: "networking",
  module: "XI.",
  title: "Networking & Computer Networks",
  description:
    "Từ Host, IP, ARP đến Routing protocols, VPN, QoS và troubleshooting thực chiến. Mỗi khái niệm được minh hoạ bằng sơ đồ, lệnh thực tế và ví dụ đời thường.",
  tags: ["CCNA", "OSI Model", "TCP/IP", "TCP/UDP", "DNS", "Routing"],
  stats: [
    { num: "19", label: "Chương mục" },
    { num: "7", label: "OSI Layers" },
    { num: "60+", label: "Lệnh thực hành" },
  ],
  sections: [
    // ─── SECTION 1 ───────────────────────────────────────────────────────────
    {
      id: "host",
      title: "Host, Client & Server",
      badge: "Core concept",
      content: [
        {
          type: "text",
          value:
            "Host là bất kỳ thiết bị nào có khả năng gửi hoặc nhận dữ liệu trên mạng — PC, laptop, smartphone, máy in, smart TV, IoT, server vật lý hay máy ảo trên cloud.",
        },
        { type: "subheading", value: "Vai trò Client & Server" },
        {
          type: "grid",
          items: [
            {
              title: "Client (Máy khách)",
              body: "Khởi tạo yêu cầu. Ví dụ: trình duyệt mở google.com, ứng dụng Zalo gọi server tin nhắn.",
            },
            {
              title: "Server (Máy chủ)",
              body: "Lắng nghe, phản hồi yêu cầu. Web server, DB server, file server. Thường chạy 24/7 và có IP tĩnh.",
            },
          ],
        },
        {
          type: "tip",
          value:
            "Vai trò có thể đổi chỗ: một web server gọi xuống database server — lúc đó nó đóng vai client. P2P (BitTorrent) thì mỗi máy vừa là client vừa là server.",
        },
        { type: "subheading", value: "Các mô hình giao tiếp" },
        {
          type: "grid",
          items: [
            {
              title: "Client–Server",
              body: "Tập trung, dễ quản lý. Phổ biến nhất.",
            },
            {
              title: "Peer-to-Peer (P2P)",
              body: "Phân tán, mỗi node bình đẳng. Torrent, blockchain.",
            },
            {
              title: "Pub/Sub",
              body: "Publisher–Subscriber. MQTT, Kafka, dùng cho IoT và event-driven systems.",
            },
          ],
        },
      ],
    },

    // ─── SECTION 2 ───────────────────────────────────────────────────────────
    {
      id: "ip",
      title: "Địa chỉ IP, IPv4 vs IPv6 & Subnet",
      badge: "Core concept",
      content: [
        {
          type: "text",
          value:
            "IP (Internet Protocol address) là định danh duy nhất của host trên mạng — như số nhà của một căn hộ. Có hai phiên bản đang dùng song song: IPv4 và IPv6.",
        },
        { type: "subheading", value: "IPv4 — 32 bit, 4.3 tỷ địa chỉ" },
        {
          type: "code",
          lang: "bash",
          value: `# IPv4: 4 octet × 8 bit = 32 bit, viết dạng thập phân chấm
192.168.1.10        # mạng nhà
10.0.0.5/8          # private class A
172.16.0.1/12       # private class B
8.8.8.8             # Google Public DNS
255.255.255.0       # subnet mask /24`,
        },
        { type: "subheading", value: "IPv6 — 128 bit, ~3.4 × 10³⁸ địa chỉ" },
        {
          type: "code",
          lang: "bash",
          value: `# IPv6: 8 nhóm × 16 bit, viết hex, ngăn cách bằng dấu :
2001:0db8:85a3:0000:0000:8a2e:0370:7334
2001:db8:85a3::8a2e:370:7334    # rút gọn (bỏ leading 0 + ::)
::1                              # loopback IPv6 (giống 127.0.0.1)
fe80::/10                        # link-local (tự động)`,
        },
        {
          type: "tip",
          value:
            "Tại sao cần IPv6? IPv4 đã cạn từ 2011. IPv6 cung cấp đủ địa chỉ cho mọi nguyên tử trên Trái Đất, hỗ trợ SLAAC (tự cấu hình), IPsec tích hợp sẵn, header gọn hơn.",
        },
        { type: "subheading", value: "Subnet Mask, CIDR & Phép tính nhanh" },
        {
          type: "code",
          lang: "bash",
          value: `# CIDR /n nghĩa là n bit đầu tiên là Network ID
192.168.1.0/24   ⇒ mask 255.255.255.0   ⇒ 256 - 2 = 254 host
10.0.0.0/16      ⇒ mask 255.255.0.0     ⇒ 65 534 host
172.16.5.0/28    ⇒ mask 255.255.255.240 ⇒ 16 - 2 = 14 host
# Công thức: số host khả dụng = 2^(32-n) - 2
# (-2 vì trừ Network ID và Broadcast)`,
        },
        { type: "subheading", value: "Public vs Private IP (RFC 1918)" },
        {
          type: "table",
          headers: ["Class", "Dải Private", "Số địa chỉ", "Dùng cho"],
          rows: [
            ["A", "10.0.0.0/8", "16 777 214", "Tập đoàn lớn"],
            ["B", "172.16.0.0/12", "1 048 574", "Doanh nghiệp vừa"],
            ["C", "192.168.0.0/16", "65 534", "Nhà, văn phòng nhỏ"],
            ["Loopback", "127.0.0.0/8", "—", "Localhost"],
            ["APIPA", "169.254.0.0/16", "—", "Khi DHCP fail"],
          ],
        },
        {
          type: "tip",
          value:
            "Lệnh kiểm tra IP: Windows: ipconfig /all · Linux/macOS: ip addr hoặc ifconfig · Cisco IOS: show ip interface brief",
        },
      ],
    },

    // ─── SECTION 3 ───────────────────────────────────────────────────────────
    {
      id: "nat",
      title: "NAT & PAT — Cứu cánh của IPv4",
      badge: "Core concept",
      content: [
        {
          type: "text",
          value:
            "NAT (Network Address Translation) dịch địa chỉ — cho phép nhiều thiết bị trong mạng nội bộ chia sẻ một địa chỉ public duy nhất. Đây là lý do cả khu chung cư chỉ cần 1 IP công cộng vẫn online được.",
        },
        { type: "subheading", value: "3 loại NAT" },
        {
          type: "grid",
          items: [
            {
              title: "Static NAT",
              body: "1 private ↔ 1 public cố định. Dùng cho server cần truy cập từ ngoài.",
            },
            {
              title: "Dynamic NAT",
              body: "Pool nhiều public IP, cấp tạm thời theo lần lượt.",
            },
            {
              title: "PAT (NAT Overload)",
              body: "Nhiều private → 1 public, phân biệt bằng port. 99% router gia đình dùng cái này.",
            },
          ],
        },
        { type: "subheading", value: "Cơ chế PAT hoạt động" },
        {
          type: "code",
          lang: "text",
          value: `# PC A (192.168.1.10:51234) → Google (142.250.1.1:443)

Router NAT Table:
┌──────────────────────┬─────────────────────────┐
│ Inside Local         │ Inside Global           │
├──────────────────────┼─────────────────────────┤
│ 192.168.1.10:51234   │ 203.0.113.5:51234       │
│ 192.168.1.11:62110   │ 203.0.113.5:62111       │ ← port cấp mới nếu trùng
└──────────────────────┴─────────────────────────┘
# Khi Google trả về 203.0.113.5:51234
# Router tra bảng → forward về 192.168.1.10`,
        },
        {
          type: "warning",
          value:
            "NAT phá vỡ end-to-end: NAT khiến giao thức cần kết nối trực tiếp (VoIP, P2P, FTP active) bị khó. Giải pháp: STUN/TURN, UPnP, hoặc port forwarding thủ công.",
        },
      ],
    },

    // ─── SECTION 4 ───────────────────────────────────────────────────────────
    {
      id: "network",
      title: "Mạng, Internet & Topology",
      badge: "Core concept",
      content: [
        {
          type: "text",
          value:
            "Một mạng là tập hợp các host có nhu cầu giao tiếp tương tự. Internet = inter + network — mạng của các mạng, được kết nối qua hàng triệu router toàn cầu.",
        },
        { type: "subheading", value: "Phân loại theo quy mô" },
        {
          type: "table",
          headers: ["Loại", "Phạm vi", "Ví dụ"],
          rows: [
            ["PAN", "~ 10 m", "Bluetooth tai nghe, điện thoại"],
            ["LAN", "Toà nhà", "Wi-Fi nhà, văn phòng"],
            ["MAN", "Thành phố", "Mạng cáp quang Viettel TP.HCM"],
            ["WAN", "Quốc gia / toàn cầu", "Internet, mạng riêng đa quốc gia"],
            ["SD-WAN", "Phần mềm điều khiển", "Chi nhánh nối qua VPN tối ưu tự động"],
          ],
        },
        { type: "subheading", value: "Network Topology" },
        {
          type: "grid",
          items: [
            {
              title: "Star",
              body: "Tất cả host nối về switch trung tâm. Phổ biến nhất trong LAN hiện đại.",
            },
            {
              title: "Ring",
              body: "Vòng tròn, dùng trong Token Ring, FDDI (cổ).",
            },
            {
              title: "Mesh",
              body: "Mọi node nối nhau. Đắt nhưng cực kỳ tin cậy. Internet backbone, Wi-Fi mesh.",
            },
            {
              title: "Bus",
              body: "Một dây chung. Lỗi thời nhưng nguyên lý vẫn dùng trong Ethernet.",
            },
            {
              title: "Tree / Hierarchical",
              body: "Core – Distribution – Access. Chuẩn thiết kế Cisco.",
            },
            {
              title: "Hybrid",
              body: "Kết hợp nhiều topology. Đa số doanh nghiệp dùng.",
            },
          ],
        },
      ],
    },

    // ─── SECTION 5 ───────────────────────────────────────────────────────────
    {
      id: "hardware",
      title: "Hub, Switch, Router, AP, Firewall",
      badge: "Core concept",
      content: [
        {
          type: "text",
          value:
            "Các thiết bị mạng phân chia theo tầng OSI mà chúng làm việc — càng tầng cao, càng thông minh và đắt hơn.",
        },
        {
          type: "grid",
          items: [
            {
              title: "Hub (L1)",
              body: "Khuếch đại tín hiệu, gửi đến tất cả cổng (flood). Tạo collision domain lớn. Đã lỗi thời.",
            },
            {
              title: "Switch (L2)",
              body: "Học MAC, chuyển frame đúng cổng. Mỗi cổng là 1 collision domain. Hỗ trợ VLAN.",
            },
            {
              title: "Router (L3)",
              body: "Định tuyến IP giữa các mạng. Là Default Gateway, hỗ trợ NAT, ACL.",
            },
            {
              title: "Access Point (L2)",
              body: "Cầu nối Wi-Fi ↔ Ethernet. Thường tích hợp trong router gia đình.",
            },
            {
              title: "Firewall (L3–L7)",
              body: "Lọc traffic theo rule. NGFW kiểm tra cả nội dung gói (DPI).",
            },
            {
              title: "Load Balancer (L4–L7)",
              body: "Phân tải request giữa nhiều server. F5, HAProxy, Nginx, AWS ELB.",
            },
          ],
        },
        {
          type: "table",
          headers: ["Thiết bị", "Tầng OSI", "Quyết định dựa trên", "Domain"],
          rows: [
            ["Hub", "L1", "Không có (mù)", "1 collision, 1 broadcast"],
            [
              "Switch",
              "L2",
              "MAC address",
              "Mỗi port = 1 collision; toàn switch = 1 broadcast (mỗi VLAN)",
            ],
            [
              "Router",
              "L3",
              "IP address",
              "Mỗi interface = 1 broadcast domain",
            ],
            ["Firewall", "L3–L7", "IP, Port, App signature", "Tuỳ rule"],
          ],
        },
        {
          type: "tip",
          value:
            "Switch nối các thiết bị trong cùng mạng — Router nối các mạng khác nhau — Firewall kiểm soát ai được nói chuyện với ai.",
        },
      ],
    },

    // ─── SECTION 6 ───────────────────────────────────────────────────────────
    {
      id: "osi",
      title: "Mô hình OSI 7 tầng & TCP/IP",
      badge: "Core concept",
      content: [
        {
          type: "text",
          value:
            "OSI (Open Systems Interconnection) là mô hình tham chiếu lý thuyết, chia giao tiếp mạng thành 7 tầng độc lập. TCP/IP là mô hình thực dụng đang chạy trên internet, gộp còn 4 tầng.",
        },
        { type: "subheading", value: "OSI 7 tầng" },
        {
          type: "table",
          headers: ["Tầng", "Tên", "Chức năng", "Ví dụ thực tế"],
          rows: [
            ["L7", "Application", "Giao diện người dùng / API", "HTTP · DNS · SSH · SMTP"],
            ["L6", "Presentation", "Mã hoá, nén, đổi định dạng", "TLS · JPEG · ASCII · UTF-8"],
            ["L5", "Session", "Thiết lập/duy trì phiên làm việc", "NetBIOS · RPC · SQL sessions"],
            ["L4", "Transport", "Service-to-service delivery, port", "TCP · UDP · QUIC"],
            ["L3", "Network", "End-to-end routing, địa chỉ IP", "IP · ICMP · OSPF · BGP"],
            ["L2", "Data Link", "Hop-to-hop, MAC address, frame", "Ethernet · ARP · PPP · 802.11"],
            ["L1", "Physical", "Bit 0/1 qua điện/sóng/ánh sáng", "Cáp · RJ45 · Wi-Fi · Quang"],
          ],
        },
        { type: "subheading", value: "OSI vs TCP/IP" },
        {
          type: "table",
          headers: ["OSI (7 tầng)", "TCP/IP (4 tầng)", "Ví dụ thực tế"],
          rows: [
            [
              "L7 Application + L6 Presentation + L5 Session",
              "Application",
              "HTTP, HTTPS, DNS, SMTP, FTP",
            ],
            ["L4 Transport", "Transport", "TCP, UDP, QUIC"],
            ["L3 Network", "Internet", "IP, ICMP, ARP"],
            ["L2 Data Link + L1 Physical", "Network Access", "Ethernet, Wi-Fi, cáp quang"],
          ],
        },
        {
          type: "tip",
          value:
            "Mẹo nhớ OSI (L7→L1): 'All People Seem To Need Data Processing'. Tiếng Việt: 'Anh Phải Sống Tận Người Đẹp Phương' — Application, Presentation, Session, Transport, Network, Data Link, Physical.",
        },
      ],
    },

    // ─── SECTION 7 ───────────────────────────────────────────────────────────
    {
      id: "encap",
      title: "Encapsulation — Đóng gói dữ liệu",
      badge: "Core concept",
      content: [
        {
          type: "text",
          value:
            "Mỗi tầng đóng gói dữ liệu của tầng trên rồi thêm header của riêng nó — như búp bê Nga. Đến đích, quá trình diễn ra ngược lại (de-encapsulation).",
        },
        { type: "subheading", value: "Lộ trình từ trên xuống" },
        {
          type: "code",
          lang: "text",
          value: `📝 Dữ liệu (Application Layer)
   ↓ (L4) thêm TCP/UDP header → src port, dst port, seq, flags
🧩 Segment  [ TCP/UDP | Data ]
   ↓ (L3) thêm IP header → src IP, dst IP, TTL, protocol
📦 Packet   [ IP | TCP/UDP | Data ]
   ↓ (L2) thêm Ethernet header + trailer FCS
🖼️ Frame    [ Eth header | IP | TCP/UDP | Data | FCS ]
   ↓ (L1) chuyển thành dòng bit → cáp/sóng
⚡ Bits     010110101...

PDU theo tầng: Bits → Frame → Packet → Segment → Data`,
        },
        { type: "subheading", value: "Ai quan tâm cái gì?" },
        {
          type: "grid",
          items: [
            {
              title: "Switch chỉ thấy Frame (L2)",
              body: "Đọc MAC header, bỏ qua IP và TCP. Không cần biết bên trong là gì.",
            },
            {
              title: "Router thấy Packet (L3)",
              body: "Gỡ Frame cũ → đọc IP header → đóng Frame mới với MAC next-hop. IP không đổi end-to-end, MAC đổi mỗi hop.",
            },
          ],
        },
        {
          type: "tip",
          value:
            "Mở Wireshark để thấy chính xác cấu trúc Frame → Packet → Segment → Application data. Là cách học OSI nhanh và hiệu quả nhất.",
        },
      ],
    },

    // ─── SECTION 8 ───────────────────────────────────────────────────────────
    {
      id: "arp",
      title: "ARP & Giao tiếp cùng mạng (LAN)",
      badge: "Core concept",
      content: [
        {
          type: "text",
          value:
            "ARP (Address Resolution Protocol) là cầu nối giữa IP (L3) và MAC (L2). Trong cùng LAN, host muốn gửi frame phải biết MAC đích — và ARP làm điều đó.",
        },
        {
          type: "subheading",
          value: "Kịch bản: Host A (10.1.1.2) ping Host B (10.1.1.5)",
        },
        {
          type: "code",
          lang: "text",
          value: `1. A so sánh IP B với subnet mask → cùng mạng /24 ✓
2. A tra ARP cache → chưa có entry cho 10.1.1.5
3. A phát ARP Request (Broadcast)
   ┌─────────────────────────────────────────┐
   │ Src MAC: aa:aa:aa:aa:aa:aa  (A)         │
   │ Dst MAC: ff:ff:ff:ff:ff:ff  (broadcast) │
   │ Hỏi: "Ai có IP 10.1.1.5?"              │
   └─────────────────────────────────────────┘
4. Switch flood broadcast ra tất cả port (trừ port nhận)
5. Host B trả ARP Reply (Unicast):
   "Tôi là 10.1.1.5, MAC: bb:bb:bb:bb:bb:bb"
6. A lưu vào ARP cache → gửi gói ICMP Echo Request
7. Lần sau: hit cache, không cần ARP nữa (live ~2 phút)`,
        },
        { type: "subheading", value: "Lệnh thực hành" },
        {
          type: "code",
          lang: "bash",
          value: `# Xem ARP cache
arp -a                      # Windows / macOS
ip neigh                    # Linux hiện đại

# Xoá cache
arp -d *                    # Windows (admin)
sudo ip neigh flush all     # Linux`,
        },
        {
          type: "warning",
          value:
            "ARP Spoofing / Poisoning: Kẻ tấn công gửi ARP Reply giả, đánh lừa nạn nhân rằng MAC của Gateway là MAC của mình → traffic đi qua máy kẻ tấn công (MITM). Phòng chống: Dynamic ARP Inspection (DAI) trên switch. IPv6 dùng NDP + SEND thay ARP.",
        },
      ],
    },

    // ─── SECTION 9 ───────────────────────────────────────────────────────────
    {
      id: "transport",
      title: "Tầng Transport · TCP, UDP, QUIC",
      badge: "Core concept",
      content: [
        {
          type: "text",
          value:
            "Tầng 4 chịu trách nhiệm service-to-service delivery — phân biệt luồng dữ liệu của trình duyệt, Zalo, Spotify chạy trên cùng một máy. Service được nhận diện qua port.",
        },
        { type: "subheading", value: "Port — Cánh cửa của ứng dụng" },
        {
          type: "code",
          lang: "text",
          value: `# Phạm vi port (16 bit, 0–65535)
0     – 1023    Well-known    # HTTP 80, HTTPS 443, SSH 22, DNS 53
1024  – 49151   Registered    # MySQL 3306, PostgreSQL 5432, Redis 6379
49152 – 65535   Ephemeral     # Client tự cấp khi mở kết nối

# 1 kết nối nhận diện bởi 5-tuple:
# (src IP, src Port, dst IP, dst Port, protocol)`,
        },
        { type: "subheading", value: "TCP vs UDP" },
        {
          type: "table",
          headers: ["Tính chất", "TCP (Reliable)", "UDP (Fast)"],
          rows: [
            ["Kết nối", "Có (3-way handshake)", "Không (fire & forget)"],
            [
              "Đảm bảo",
              "Đúng thứ tự, không mất gói",
              "Có thể mất, có thể đảo thứ tự",
            ],
            ["Header size", "20–60 byte", "8 byte"],
            ["Flow control", "Có (sliding window)", "Không"],
            ["Congestion control", "Có (CUBIC, BBR, Reno)", "Không"],
            [
              "Dùng cho",
              "Web, email, SSH, file transfer",
              "DNS, VoIP, game, livestream",
            ],
          ],
        },
        { type: "subheading", value: "TCP 3-way Handshake" },
        {
          type: "code",
          lang: "text",
          value: `Client                              Server
  │                                   │
  │ ──── SYN     seq=1000 ──────────▶ │  "Tôi muốn nói chuyện"
  │ ◀─── SYN+ACK seq=5000, ack=1001 ─ │  "OK, sẵn sàng"
  │ ──── ACK     ack=5001 ──────────▶ │  "Bắt đầu nào"
  │                                   │
  │ ══════════ Data flow ═════════════ │`,
        },
        { type: "subheading", value: "TCP 4-way Termination" },
        {
          type: "code",
          lang: "text",
          value: `Client ──── FIN ────▶ Server    # Tôi gửi xong
Client ◀─── ACK ──── Server
Client ◀─── FIN ──── Server    # Tôi cũng xong
Client ──── ACK ────▶ Server    # Tạm biệt`,
        },
        { type: "subheading", value: "QUIC — Thế hệ tiếp theo (HTTP/3)" },
        {
          type: "tip",
          value:
            "QUIC = UDP nhưng có tin cậy. Google phát triển trên nền UDP, tích hợp TLS 1.3 → 1-RTT handshake (TCP+TLS truyền thống mất 3 RTT). Không bị head-of-line blocking. Là nền tảng của HTTP/3, dùng bởi YouTube, Cloudflare, Google Search.",
        },
      ],
    },

    // ─── SECTION 10 ──────────────────────────────────────────────────────────
    {
      id: "routing",
      title: "Routing & Default Gateway",
      badge: "Core concept",
      content: [
        {
          type: "text",
          value:
            "Khi đích đến ở mạng khác, host không thể ARP trực tiếp — phải gửi gói tới Default Gateway (thường là router). Router tra Routing Table để quyết định gửi đi đâu tiếp.",
        },
        { type: "subheading", value: "Routing Table mẫu" },
        {
          type: "code",
          lang: "text",
          value: `Router# show ip route
┌──────────────────────┬───────────────────┬──────────────┬────────┐
│ Destination          │ Next-Hop          │ Interface    │ Metric │
├──────────────────────┼───────────────────┼──────────────┼────────┤
│ 192.168.1.0/24       │ Connected         │ GigaEth 0/0  │   0    │
│ 10.0.0.0/8           │ 192.168.2.254     │ GigaEth 0/1  │   1    │ ← Static
│ 172.16.0.0/16        │ 192.168.2.254     │ GigaEth 0/1  │ 110    │ ← OSPF
│ 0.0.0.0/0  (default) │ 203.0.113.1       │ Serial 0/0   │   1    │ ← Internet
└──────────────────────┴───────────────────┴──────────────┴────────┘`,
        },
        {
          type: "subheading",
          value: "Longest Prefix Match — Luật bất biến",
        },
        {
          type: "text",
          value:
            "Khi nhiều route match cùng một đích, router chọn route có prefix dài nhất (cụ thể nhất). Ví dụ: đích 10.1.1.5 match cả 10.0.0.0/8 và 10.1.0.0/16 → router chọn /16.",
        },
        { type: "subheading", value: "3 cách Router học route" },
        {
          type: "grid",
          items: [
            {
              title: "Directly Connected",
              body: "Tự động thêm khi cấu hình IP cho interface. AD = 0 — luôn ưu tiên cao nhất.",
            },
            {
              title: "Static Route",
              body: "Quản trị viên cấu hình thủ công. Đơn giản, không tốn CPU, nhưng không tự thích nghi.",
            },
            {
              title: "Dynamic Routing",
              body: "Router trao đổi thông tin qua giao thức (OSPF, EIGRP, BGP). Tự động, mở rộng tốt.",
            },
          ],
        },
        { type: "subheading", value: "Administrative Distance (AD)" },
        {
          type: "table",
          headers: ["Nguồn route", "AD", "Ghi chú"],
          rows: [
            ["Connected", "0", "Tin cậy tuyệt đối"],
            ["Static", "1", "Admin cấu hình thủ công"],
            ["EIGRP (internal)", "90", "Cisco proprietary"],
            ["OSPF", "110", "Link-state, open standard"],
            ["RIP", "120", "Cổ, hop-count max 15"],
            ["BGP (external)", "20 / 200", "Giao thức của Internet"],
          ],
        },
      ],
    },

    // ─── SECTION 11 ──────────────────────────────────────────────────────────
    {
      id: "protocols",
      title: "Routing Protocols · OSPF, BGP, EIGRP",
      badge: "Advanced",
      content: [
        {
          type: "text",
          value:
            "Trong mạng lớn, dynamic routing protocols giúp các router tự nói chuyện để xây dựng bản đồ mạng — không cần cấu hình static cho hàng nghìn route.",
        },
        { type: "subheading", value: "Phân loại IGP vs EGP" },
        {
          type: "grid",
          items: [
            {
              title: "IGP — Interior Gateway Protocol",
              body: "Trong cùng một AS (Autonomous System). Bao gồm: OSPF · EIGRP · RIP · IS-IS.",
            },
            {
              title: "EGP — Exterior Gateway Protocol",
              body: "Giữa các AS khác nhau (giữa các ISP). Chỉ còn BGP được dùng.",
            },
          ],
        },
        { type: "subheading", value: "OSPF — Open Shortest Path First" },
        {
          type: "list",
          items: [
            "Link-state — mỗi router xây bản đồ đầy đủ về topology, tự tính Dijkstra.",
            "Chia Area: backbone Area 0, các area khác phải nối với Area 0.",
            "Metric: Cost = 10⁸ / Bandwidth (Gigabit Ethernet = cost 1).",
            "Hội tụ nhanh, scale tốt, dùng phổ biến trong doanh nghiệp.",
            "Open standard — không phụ thuộc vendor.",
          ],
        },
        { type: "subheading", value: "BGP — Border Gateway Protocol" },
        {
          type: "list",
          items: [
            "Giao thức giữ Internet vận hành. Mỗi ISP có ASN, peer với ISP khác.",
            "Path-vector: quyết định dựa trên AS-path, không phải metric đơn giản.",
            "Sự cố BGP có thể làm sập internet một phần (Facebook outage 10/2021 — nhân viên xoá nhầm BGP route).",
          ],
        },
        { type: "subheading", value: "EIGRP — Enhanced Interior Gateway" },
        {
          type: "list",
          items: [
            "Cisco proprietary (đã open). Advanced distance-vector.",
            "Dùng DUAL algorithm — hội tụ cực nhanh.",
            "Metric: bandwidth + delay + load + reliability.",
          ],
        },
        {
          type: "tip",
          value:
            "So sánh nhanh: OSPF cho enterprise (open standard, link-state). BGP giữa các AS, là đường cao tốc của Internet. EIGRP trong môi trường Cisco. RIP chỉ dùng để học, không dùng production.",
        },
      ],
    },

    // ─── SECTION 12 ──────────────────────────────────────────────────────────
    {
      id: "switch",
      title: "Switch chuyên sâu · MAC Table, VLAN, STP",
      badge: "Advanced",
      content: [
        {
          type: "text",
          value:
            "Switch L2 học, lọc, và chuyển tiếp dựa vào địa chỉ MAC trong header Ethernet — không 'ngu' như Hub.",
        },
        { type: "subheading", value: "3 hành vi cốt lõi" },
        {
          type: "grid",
          items: [
            {
              title: "Learning",
              body: "Khi frame vào, ghi nhận MAC nguồn + port vào MAC table (CAM table).",
            },
            {
              title: "Flooding",
              body: "Nếu MAC đích chưa có trong bảng → gửi ra tất cả port trừ port nhận. Broadcast/multicast cũng flood.",
            },
            {
              title: "Forwarding",
              body: "MAC đích đã biết → gửi chính xác ra port đó. Bảo mật và hiệu suất cao.",
            },
          ],
        },
        { type: "subheading", value: "MAC Address Table" },
        {
          type: "code",
          lang: "text",
          value: `Switch# show mac address-table
┌──────────────────┬──────┬──────────┐
│ MAC Address      │ VLAN │ Port     │
├──────────────────┼──────┼──────────┤
│ aa:bb:cc:11:22:33│  10  │ Fa0/1    │
│ aa:bb:cc:44:55:66│  10  │ Fa0/2    │
│ aa:bb:cc:77:88:99│  20  │ Fa0/5    │
└──────────────────┴──────┴──────────┘`,
        },
        { type: "subheading", value: "VLAN — Mạng ảo trên cùng switch" },
        {
          type: "text",
          value:
            "VLAN chia switch vật lý thành nhiều switch logic. Mỗi VLAN là một broadcast domain riêng. Giao tiếp giữa VLAN phải qua router hoặc switch L3.",
        },
        {
          type: "code",
          lang: "cisco",
          value: `! Cấu hình VLAN trên Cisco
Switch(config)# vlan 10
Switch(config-vlan)# name SALES
Switch(config)# interface Fa0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10

! Trunk port - mang nhiều VLAN qua tag 802.1Q
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30`,
        },
        {
          type: "subheading",
          value: "Spanning Tree Protocol (STP) — Chống loop",
        },
        {
          type: "text",
          value:
            "Trong mạng có nhiều switch nối vòng để dự phòng, broadcast sẽ quay vòng vô tận → tắc mạng. STP (IEEE 802.1D) phát hiện loop và block port dự phòng.",
        },
        {
          type: "list",
          items: [
            "Bầu chọn Root Bridge — switch có Bridge ID thấp nhất.",
            "Mỗi switch tính path ngắn nhất về Root Bridge.",
            "Port bị block trở thành standby — chỉ active khi link chính chết.",
            "Biến thể: RSTP (802.1w, hội tụ nhanh), MSTP (cho nhiều VLAN).",
          ],
        },
        {
          type: "warning",
          value:
            "Broadcast Storm: nếu tắt STP và có loop, mỗi broadcast nhân lên cấp số mũ → CPU switch quá tải, mạng đứng hình trong vài giây. Đây là sự cố cổ điển của sinh viên IT.",
        },
      ],
    },

    // ─── SECTION 13 ──────────────────────────────────────────────────────────
    {
      id: "wireless",
      title: "Wireless · Wi-Fi 6, 7 & Bảo mật",
      badge: "Reference",
      content: [
        {
          type: "text",
          value:
            "Wi-Fi truyền dữ liệu qua sóng vô tuyến theo chuẩn IEEE 802.11. Sóng radio không đẹp như cáp: nhiễu, suy hao, đụng độ.",
        },
        { type: "subheading", value: "Các thế hệ Wi-Fi" },
        {
          type: "table",
          headers: ["Thế hệ", "Chuẩn", "Năm", "Tốc độ tối đa", "Băng tần"],
          rows: [
            ["Wi-Fi 4", "802.11n", "2009", "600 Mbps", "2.4 / 5 GHz"],
            ["Wi-Fi 5", "802.11ac", "2014", "3.5 Gbps", "5 GHz"],
            ["Wi-Fi 6", "802.11ax", "2019", "9.6 Gbps", "2.4 / 5 GHz"],
            ["Wi-Fi 6E", "802.11ax", "2021", "9.6 Gbps", "+ 6 GHz band"],
            ["Wi-Fi 7", "802.11be", "2024", "46 Gbps", "2.4 / 5 / 6 GHz, MLO"],
          ],
        },
        { type: "subheading", value: "Băng tần — Đánh đổi tốc độ vs phạm vi" },
        {
          type: "grid",
          items: [
            {
              title: "2.4 GHz",
              body: "Xa, xuyên tường tốt, nhưng đông đúc (lò vi sóng, Bluetooth cùng tần số).",
            },
            {
              title: "5 GHz",
              body: "Nhanh, ít nhiễu, nhưng dễ bị tường chặn, phạm vi ngắn hơn.",
            },
            {
              title: "6 GHz",
              body: "Wi-Fi 6E/7. Mới, ít người dùng → cực nhanh, ít nhiễu, nhưng cần thiết bị mới.",
            },
          ],
        },
        { type: "subheading", value: "Bảo mật Wi-Fi" },
        {
          type: "table",
          headers: ["Chuẩn", "Năm", "Mã hoá", "Đánh giá"],
          rows: [
            ["WEP", "1997", "RC4", "❌ Phá được trong vài phút. Tuyệt đối không dùng."],
            ["WPA", "2003", "TKIP", "❌ Đã bị bẻ khoá."],
            ["WPA2", "2004", "AES-CCMP", "⚠️ An toàn (KRACK 2017 có vá). Vẫn dùng được."],
            ["WPA3", "2018", "AES-GCMP, SAE", "✅ Khuyến nghị — dùng nếu có thể."],
          ],
        },
        {
          type: "tip",
          value:
            "Best practice Wi-Fi gia đình: Dùng WPA3 (hoặc WPA2-AES nếu thiết bị cũ) · password ≥ 16 ký tự · tắt WPS · cập nhật firmware router định kỳ · ẩn SSID không thực sự giúp (security through obscurity).",
        },
      ],
    },

    // ─── SECTION 14 ──────────────────────────────────────────────────────────
    {
      id: "dns_dhcp",
      title: "DNS, DHCP & 4 thông số sống còn",
      badge: "Core concept",
      content: [
        {
          type: "tip",
          value:
            "4 thông số sống còn để online: (1) IP Address — định danh. (2) Subnet Mask — xác định mạng nội bộ. (3) Default Gateway — cửa ra Internet. (4) DNS Server — dịch tên miền thành IP.",
        },
        { type: "subheading", value: "DHCP — Cấp IP tự động (4 bước DORA)" },
        {
          type: "code",
          lang: "text",
          value: `Client (chưa có IP)
  1. DISCOVER  → broadcast "Có ai cấp IP cho tôi không?"
  2. OFFER     ← "Tôi đề nghị IP 192.168.1.50, lease 24h, kèm GW + DNS"
  3. REQUEST   → "Tôi nhận đề nghị của bạn"
  4. ACK       ← "OK, 192.168.1.50 là của bạn trong 24 giờ"`,
        },
        { type: "subheading", value: "DNS — Danh bạ của Internet" },
        {
          type: "code",
          lang: "text",
          value: `# Quá trình resolve google.com
1. Trình duyệt → cache nội bộ → cache OS → /etc/hosts
2. → DNS resolver (ISP hoặc 8.8.8.8 / 1.1.1.1)
3. Cache miss → resolver hỏi:
   Root server (.)     → "hỏi .com server"
   TLD server (.com)   → "hỏi google.com authoritative"
   Authoritative       → "google.com = 142.250.185.46"
4. Resolver cache lại (theo TTL), trả về client`,
        },
        { type: "subheading", value: "Các loại DNS Record" },
        {
          type: "table",
          headers: ["Record", "Ý nghĩa", "Ví dụ"],
          rows: [
            ["A", "Tên → IPv4", "example.com → 93.184.216.34"],
            ["AAAA", "Tên → IPv6", "example.com → 2606:2800::"],
            ["CNAME", "Alias trỏ về tên khác", "www → example.com"],
            ["MX", "Mail server", "10 mail.example.com"],
            ["TXT", "Văn bản (SPF, DKIM, xác minh)", "v=spf1 include:_spf.google.com ~all"],
            ["NS", "Authoritative name server", "ns1.example.com"],
            ["PTR", "Reverse — IP → tên", "34.216.184.93.in-addr.arpa"],
          ],
        },
        {
          type: "tip",
          value:
            "Lệnh DNS hữu ích: nslookup google.com · dig google.com +short · dig @1.1.1.1 example.com MX · dig +trace google.com · host google.com",
        },
      ],
    },

    // ─── SECTION 15 ──────────────────────────────────────────────────────────
    {
      id: "security",
      title: "Firewall, VPN, TLS & Bảo mật mạng",
      badge: "Production",
      content: [
        {
          type: "text",
          value:
            "Mạng không bảo mật là mạng đang chờ bị hack. Firewall lọc traffic, VPN tạo đường hầm an toàn, TLS mã hoá ứng dụng.",
        },
        { type: "subheading", value: "Firewall — Các thế hệ" },
        {
          type: "grid",
          items: [
            {
              title: "Packet Filter (L3/L4)",
              body: "Chặn theo IP/port. Cổ điển, nhanh, không hiểu context.",
            },
            {
              title: "Stateful Firewall",
              body: "Nhớ state của connection (TCP session). Cho phép return traffic của session đã mở.",
            },
            {
              title: "NGFW — Next-Gen (L7)",
              body: "Deep Packet Inspection. Nhận biết được app (Zalo vs YouTube), phát hiện virus, intrusion.",
            },
          ],
        },
        { type: "subheading", value: "ACL — Access Control List (Cisco)" },
        {
          type: "code",
          lang: "cisco",
          value: `! Cho phép LAN ra Internet, chặn 1 IP cụ thể
Router(config)# access-list 101 deny ip host 192.168.1.50 any
Router(config)# access-list 101 permit ip 192.168.1.0 0.0.0.255 any
Router(config)# interface Gi0/0
Router(config-if)# ip access-group 101 in
! Lưu ý: implicit "deny all" ở cuối mọi ACL`,
        },
        { type: "subheading", value: "VPN — Đường hầm mã hoá qua Internet" },
        {
          type: "grid",
          items: [
            {
              title: "Remote Access VPN",
              body: "Cá nhân kết nối về công ty. Client: OpenVPN, WireGuard, Cisco AnyConnect.",
            },
            {
              title: "Site-to-Site VPN",
              body: "2 mạng văn phòng nối nhau qua Internet như nội bộ. Thường dùng IPsec.",
            },
          ],
        },
        { type: "subheading", value: "TLS Handshake (HTTPS)" },
        {
          type: "code",
          lang: "text",
          value: `Client                                Server
  │                                     │
  │ ──── ClientHello ─────────────────▶ │  "Tôi support TLS 1.3, cipher X"
  │ ◀─── ServerHello + Certificate ──── │  "OK, đây chứng chỉ của tôi"
  │  (Client xác minh cert qua CA)       │
  │ ──── Key Exchange (ECDHE) ─────────▶ │  "Cùng tạo session key"
  │ ══════════ Encrypted Data ══════════ │
  # TLS 1.3: 1-RTT. TLS 1.2: 2-RTT.`,
        },
        {
          type: "warning",
          value:
            "Các tấn công phổ biến: DDoS — flood traffic làm tê liệt server. MITM — chen vào giữa (ARP spoof, evil twin Wi-Fi). DNS Spoofing — giả mạo phản hồi DNS. Port Scanning — quét cổng mở (nmap). Phishing — vector chính dù không phải kỹ thuật mạng thuần tuý.",
        },
      ],
    },

    // ─── SECTION 16 ──────────────────────────────────────────────────────────
    {
      id: "qos",
      title: "QoS — Ưu tiên gói tin",
      badge: "Advanced",
      content: [
        {
          type: "text",
          value:
            "Khi đường truyền tắc nghẽn, không phải gói nào cũng quan trọng như nhau. QoS đảm bảo gói voice/video được ưu tiên hơn download file.",
        },
        { type: "subheading", value: "3 yếu tố QoS quan tâm" },
        {
          type: "grid",
          items: [
            {
              title: "Latency (Độ trễ)",
              body: "Thời gian gói đi từ A → B. VoIP yêu cầu < 150 ms để không bị delay cảm nhận được.",
            },
            {
              title: "Jitter",
              body: "Biến động latency giữa các gói. Video call jitter cao → giật, lag, mất tiếng.",
            },
            {
              title: "Packet Loss",
              body: "% gói bị mất. Web chịu được (TCP retransmit), voice/video thì không.",
            },
          ],
        },
        {
          type: "subheading",
          value: "Pipeline QoS: Classify → Mark → Queue → Police",
        },
        {
          type: "list",
          items: [
            "Classification: nhận diện loại traffic theo port, DPI, hoặc NBAR.",
            "Marking: đánh dấu trong IP header — DSCP (6 bit, 64 mức ưu tiên).",
            "Queueing: xếp hàng theo mức ưu tiên (PQ, WFQ, CBWFQ, LLQ).",
            "Policing / Shaping: giới hạn hoặc làm trơn băng thông từng loại traffic.",
          ],
        },
        {
          type: "tip",
          value:
            "DSCP phổ biến: EF (Expedited Forwarding) cho VoIP · AF41 cho video conference · CS6 cho routing protocol · BE (Best Effort) — mặc định, không ưu tiên.",
        },
      ],
    },

    // ─── SECTION 17 ──────────────────────────────────────────────────────────
    {
      id: "troubleshoot",
      title: "Troubleshooting — Toolbox thực chiến",
      badge: "Reference",
      content: [
        {
          type: "text",
          value:
            "Khi mạng có vấn đề, phải khoanh vùng: lớp nào hỏng — cáp, IP, DNS, hay ứng dụng?",
        },
        { type: "subheading", value: "Phương pháp tiếp cận" },
        {
          type: "grid",
          items: [
            {
              title: "Top-Down",
              body: "Đi từ Application xuống Physical. Phù hợp khi user thấy app không chạy.",
            },
            {
              title: "Bottom-Up",
              body: "Đi từ cáp lên ứng dụng. Phù hợp với lỗi hạ tầng, mất kết nối hoàn toàn.",
            },
          ],
        },
        { type: "subheading", value: "ping — Kiểm tra liên thông L3 (ICMP)" },
        {
          type: "code",
          lang: "bash",
          value: `ping 8.8.8.8                   # IP thuần — loại trừ DNS
ping google.com                # tên miền — bao gồm DNS resolution
ping -c 4 -i 0.2 1.1.1.1       # Linux: 4 gói, cách nhau 0.2s
ping -t 8.8.8.8                # Windows: ping liên tục
# Đọc kết quả: time=RTT, packet loss %, TTL gợi ý số hop`,
        },
        { type: "subheading", value: "traceroute — Theo dõi đường đi" },
        {
          type: "code",
          lang: "bash",
          value: `traceroute google.com          # Linux/macOS (UDP)
tracert google.com             # Windows (ICMP)
mtr google.com                 # Linux: combo ping + traceroute, liên tục
# Mỗi dòng = 1 router; * * * = hop chặn ICMP (không hẳn là lỗi)`,
        },
        { type: "subheading", value: "dig / nslookup — Kiểm tra DNS" },
        {
          type: "code",
          lang: "bash",
          value: `nslookup google.com            # cross-platform
nslookup google.com 1.1.1.1    # dùng resolver chỉ định
dig google.com +short          # Linux: ngắn gọn
dig google.com MX              # lookup loại record cụ thể
dig +trace google.com          # theo dõi từ root → authoritative`,
        },
        { type: "subheading", value: "ss / netstat — Xem port & connection" },
        {
          type: "code",
          lang: "bash",
          value: `netstat -an                    # cross-platform
ss -tulpn                      # Linux: TCP/UDP đang listen + process
lsof -i :8080                  # Linux/macOS: process nào dùng port 8080`,
        },
        { type: "subheading", value: "tcpdump — Bắt gói tin" },
        {
          type: "code",
          lang: "bash",
          value: `sudo tcpdump -i eth0                        # bắt tất cả trên eth0
sudo tcpdump -i any port 80                 # lọc theo port
sudo tcpdump -i eth0 host 8.8.8.8 -nn       # lọc theo IP
sudo tcpdump -w capture.pcap port 443       # ghi file → mở bằng Wireshark`,
        },
        {
          type: "subheading",
          value: "Checklist nhanh khi không vào được Internet",
        },
        {
          type: "list",
          items: [
            "ipconfig / ip addr — có IP chưa? Có phải APIPA (169.254.x.x)?",
            "ping 127.0.0.1 — stack TCP/IP có lành không?",
            "ping <default-gateway> — tới được router chưa?",
            "ping 8.8.8.8 — ra được Internet (L3) chưa?",
            "nslookup google.com — DNS có hoạt động?",
            "curl -v https://google.com — app layer & TLS có ổn?",
          ],
        },
      ],
    },

    // ─── SECTION 18 ──────────────────────────────────────────────────────────
    {
      id: "case",
      title: "Case Study · Gõ google.com xảy ra gì?",
      badge: "Reference",
      content: [
        {
          type: "text",
          value:
            "Câu hỏi kinh điển trong phỏng vấn Senior. Dưới đây là 14 bước chi tiết từ phím Enter đến trang web hiển thị.",
        },
        {
          type: "code",
          lang: "text",
          value: `1.  Trình duyệt phân tích URL → tách scheme (https), host (google.com), path (/).
2.  Kiểm tra HSTS preload list → ép HTTPS nếu trong danh sách.
3.  DNS resolution:
      cache trình duyệt → cache OS → /etc/hosts → resolver (router)
      → resolver ISP → root → TLD (.com) → authoritative (google.com)
      ⇒ trả về A record: 142.250.185.46
4.  Host so subnet mask: IP đích khác mạng → dùng Default Gateway.
5.  Host phát ARP Request hỏi MAC của Gateway (nếu chưa cache).
6.  Đóng gói: src IP = host, dst IP = Google; src MAC = host, dst MAC = router.
7.  Frame ra switch → switch tra MAC table → forward đúng port router.
8.  Router gỡ frame, tra routing table (longest prefix match),
      tìm next-hop, ARP next-hop, đóng frame mới, gửi tiếp.
9.  Lặp lại bước 8 qua ~15-20 hop (xem bằng traceroute).
      → Mỗi hop: MAC thay đổi, IP không đổi, TTL giảm 1.
10. Gói tới Google Front-end → load balancer phân về data center gần nhất.
11. TCP 3-way handshake với port 443.
12. TLS 1.3 handshake (1-RTT) — trao đổi key, xác minh chứng chỉ CA.
13. Gửi HTTP request: GET / HTTP/2 Host: google.com
14. Server trả HTML → trình duyệt parse → tải CSS, JS, ảnh → render.`,
        },
        {
          type: "tip",
          value:
            "Điểm cốt lõi: Suốt 20 hop, IP src/dst KHÔNG ĐỔI — end-to-end addressing của L3. MAC src/dst THAY ĐỔI mỗi hop — hop-to-hop addressing của L2. TTL giảm dần — nếu về 0 trước khi đến đích, gói bị drop và router gửi ICMP Time Exceeded về nguồn (đó là cách traceroute hoạt động!).",
        },
      ],
    },

    // ─── SECTION 19 ──────────────────────────────────────────────────────────
    {
      id: "faq",
      title: "FAQ, Lỗi hay gặp & Tổng kết",
      badge: "Reference",
      content: [
        { type: "subheading", value: "Câu hỏi thường gặp" },
        {
          type: "tip",
          value:
            "Switch có làm việc với IP không? Switch L2 không — chỉ thấy MAC. Switch L3 (multilayer switch) thì có — nhưng thực chất là switch + router trong một thân máy.",
        },
        {
          type: "tip",
          value:
            "Tại sao cần Subnet Mask? Để host biết IP đích cùng mạng hay khác mạng — quyết định ARP trực tiếp hay gửi tới Default Gateway.",
        },
        {
          type: "warning",
          value:
            "ARP có an toàn không? Không — dễ bị ARP Spoofing. Môi trường doanh nghiệp dùng Dynamic ARP Inspection (DAI) + DHCP Snooping. IPv6 thay bằng NDP.",
        },
        {
          type: "tip",
          value:
            "Tại sao IPv6 chưa thay thế hoàn toàn IPv4? Vì NAT đã kéo dài tuổi thọ IPv4, chi phí chuyển đổi lớn, nhiều thiết bị cũ chưa hỗ trợ. Hiện chạy song song dual-stack.",
        },
        {
          type: "tip",
          value:
            "Có thể có 2 thiết bị cùng IP không? Trong cùng broadcast domain: không — sẽ gây IP conflict. Khác mạng (sau NAT): hoàn toàn được, vì IP đã được dịch.",
        },
        { type: "subheading", value: "Top 10 lỗi tân binh hay mắc" },
        {
          type: "list",
          items: [
            "Quên cấu hình Default Gateway → ping được LAN nhưng không ra Internet.",
            "Subnet mask sai → 2 máy cùng mạng vật lý vẫn không thấy nhau.",
            "DNS sai → ping 8.8.8.8 OK nhưng google.com fail.",
            "Nhầm vai trò Hub vs Switch.",
            "Quên rằng router có ARP và mỗi interface có MAC riêng.",
            "Tắt firewall để test rồi quên bật lại.",
            "Mật khẩu Wi-Fi yếu (WEP, WPA, hoặc dictionary word).",
            "Cắm 2 đầu cáp vào cùng switch không có STP → broadcast storm.",
            "Static IP trùng với pool DHCP → IP conflict ngẫu nhiên.",
            "Đặt server quan trọng vào VLAN bị block ACL → mất kết nối khó debug.",
          ],
        },
        { type: "subheading", value: "Tổng kết — Bạn đã học được" },
        {
          type: "list",
          items: [
            "✔ Host (client/server) — IP định danh, MAC hop-to-hop",
            "✔ IPv4 + IPv6 + NAT — tính subnet, hiểu CIDR",
            "✔ OSI 7 tầng + TCP/IP 4 tầng — Switch(L2), Router(L3), Firewall(L3-7)",
            "✔ ARP — IP→MAC, nguy cơ ARP Spoofing",
            "✔ TCP/UDP/QUIC — handshake, port, đặc tính từng loại",
            "✔ Routing — Static, OSPF, BGP, longest prefix match, AD",
            "✔ VLAN, STP, Wi-Fi 6/7, WPA3",
            "✔ DNS, DHCP, TLS, VPN, QoS",
            "✔ Troubleshooting — ping, traceroute, dig, tcpdump, Wireshark",
          ],
        },
        {
          type: "tip",
          value:
            "Tiếp theo: thực hành trên Cisco Packet Tracer hoặc GNS3, bắt gói với Wireshark, học lab CCNA chính thức.",
        },
      ],
    },
  ],
};
