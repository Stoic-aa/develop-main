// 文章数据数组
const articlesData = [
    {
        id: 1,
        title: "基于 Rust 的嵌入式物联网微内核架构探讨",
        summary: "嵌入式系统的内存安全不再是一种奢侈品。在本篇社论中，我们将探讨 Rust 的所有权模型如何转化为裸机硬件操作，以及为什么它是构建弹性物联网基础设施的未来。",
        category: "物联网",
        date: "2024年5月24日",
        readTime: "阅读时间 12 分钟",
        author: "Alex Rivera",
        authorAvatar: "https://bpic.588ku.com/element_origin_min_pic/25/08/01/8afb633d2d9a300d88254c6f71a0912b.jpg",
        coverImage: "https://www.techphant.cn/wp-content/uploads/2023/03/10355465.jpg",
        url: "articles/article-template.html?slug=rust-embedded-iot",
        contentFile: "content/rust-embedded-iot.html",
        categoryPage: "emed.html",
        tags: ["Rust", "物联网", "嵌入式系统", "微内核"],
        lastUpdated: "2024年5月24日"
    },

    {
        id: 2,
        title: "RISC-V 在嵌入式 AI 领域的崛起：高性能指令集的机遇",
        summary: "分析 RISC-V 架构如何通过可扩展指令集为边缘计算设备提供差异化竞争优势...",
        category: "RISC-V",
        date: "2024年5月20日",
        readTime: "阅读时间 10 分钟",
        author: "David Park",
        authorAvatar: "https://bpic.588ku.com/element_origin_min_pic/25/08/01/8afb633d2d9a300d88254c6f71a0912b.jpg",
        coverImage: "https://pic4.zhimg.com/v2-b8dce38a8a8bff1e2f77d7d46c6b3dab_180x120.jpg",
        url: "articles/article-template.html?slug=riscv-embedded-ai",
        contentFile: "content/riscv-embedded-ai.html",
        categoryPage: "emed.html",
        tags: ["RISC-V", "嵌入式AI", "边缘计算", "指令集架构"],
        lastUpdated: "2024年5月20日"
    },

    {
        id: 3,
        title: "AUTOSAR 架构下的软件定义汽车：应对复杂度挑战",
        summary: "面对日益复杂的车载软件，传统的开发模式正向 Adaptive AUTOSAR 快速演进...",
        category: "汽车电子",
        date: "2024年5月15日",
        readTime: "阅读时间 14 分钟",
        author: "Michael Brown",
        authorAvatar: "https://bpic.588ku.com/element_origin_min_pic/25/08/01/8afb633d2d9a300d88254c6f71a0912b.jpg",
        coverImage: "https://img2.auto-testing.net/202102/08/211527251.jpg",
        url: "articles/article-template.html?slug=autosar-software-defined-cars",
        contentFile: "content/autosar-software-defined-cars.html",
        categoryPage: "emed.html",
        tags: ["AUTOSAR", "软件定义汽车", "汽车电子", "车载软件"],
        lastUpdated: "2024年5月15日"
    },

    {
        id: 4,
        title: "从硬件根信任 (RoT) 出发：构建坚不可摧的物联网安全底座",
        summary: "在碎片化的 IoT 环境中，硬件级安全加密芯片为何成为大规模部署的先决条件...",
        category: "安全防御",
        date: "2024年5月10日",
        readTime: "阅读时间 11 分钟",
        author: "Emily Wilson",
        authorAvatar: "https://bpic.588ku.com/element_origin_min_pic/25/08/01/8afb633d2d9a300d88254c6f71a0912b.jpg",
        coverImage: "https://pic.pngsucai.com/00/53/14/fecaef5df5624bfc.webp",
        url: "articles/article-template.html?slug=hardware-root-of-trust-iot-security",
        contentFile: "content/hardware-root-of-trust-iot-security.html",
        categoryPage: "emed.html",
        tags: ["IoT安全", "硬件根信任", "安全芯片", "可信计算"],
        lastUpdated: "2024年5月10日"
    },

    {
        id: 5,
        title: "UI 设计中的“无感”哲学：通过色彩层级营造深度",
        summary: "为什么现代 UI 正在摒弃 1px 边框，转而利用背景色块切换和负空间。这是一份为技术内容打造高端社论级体验的视觉指南。",
        category: "设计系统",
        date: "2024年5月18日",
        readTime: "阅读时间 8 分钟",
        author: "Sarah Chen",
        authorAvatar: "https://bpic.588ku.com/element_origin_min_pic/25/08/01/8afb633d2d9a300d88254c6f71a0912b.jpg",
        coverImage: "http://www.lanlanwork.com/blog/content/uploadfile/202409/d6491727073785.jpg",
        url: "articles/article-template.html?slug=ui-design-philosophy",
        contentFile: "content/ui-design-philosophy.html",
        categoryPage: "emed.html",
        tags: ["UI设计", "设计系统", "视觉层级", "用户体验"],
        lastUpdated: "2024年5月18日"
    },

    {
        id: 6,
        title: "Serverless 大规模应用实践：应对月均千万级请求",
        summary: "深入了解冷启动优化、状态管理以及当你的基础设施完全是瞬态时的可观测性实战策略。",
        category: "DevOps",
        date: "2024年5月12日",
        readTime: "阅读时间 15 分钟",
        author: "Marco K.",
        authorAvatar: "https://bpic.588ku.com/element_origin_min_pic/25/08/01/8afb633d2d9a300d88254c6f71a0912b.jpg",
        coverImage: "https://www.uux.cn/attachments/2022/12/1_202212081152461611A.jpg",
        url: "articles/article-template.html?slug=serverless-practice",
        contentFile: "content/serverless-practice.html",
        categoryPage: "emed.html",
        tags: ["Serverless", "DevOps", "云原生", "高并发"],
        lastUpdated: "2024年5月12日"
    }
];

// 首页推荐文章数据数组
const homepageArticlesData = [
    {
        id: 1,
        title: "基于 Rust 的嵌入式物联网微内核架构探讨",
        summary: "嵌入式系统的内存安全不再是一种奢侈品。在本篇社论中，我们将探讨 Rust 的所有权模型如何转化为裸机硬件操作，以及为什么它是构建弹性物联网基础设施的未来。",
        category: "物联网",
        date: "2024年5月24日",
        readTime: "阅读时间 12 分钟",
        author: "Alex Rivera",
        authorAvatar: "https://bpic.588ku.com/element_origin_min_pic/25/08/01/8afb633d2d9a300d88254c6f71a0912b.jpg",
        coverImage: "https://www.techphant.cn/wp-content/uploads/2023/03/10355465.jpg",
        url: "articles/article-template.html?slug=rust-embedded-iot",
        contentFile: "content/rust-embedded-iot.html",
        categoryPage: "emed.html",
        tags: ["Rust", "物联网", "嵌入式系统", "微内核"],
        lastUpdated: "2024年5月24日"
    },
    {
        id: 2,
        title: "RISC-V 在嵌入式 AI 领域的崛起：高性能指令集的机遇",
        summary: "分析 RISC-V 架构如何通过可扩展指令集为边缘计算设备提供差异化竞争优势...",
        category: "RISC-V",
        date: "2024年5月20日",
        readTime: "阅读时间 10 分钟",
        author: "David Park",
        authorAvatar: "https://bpic.588ku.com/element_origin_min_pic/25/08/01/8afb633d2d9a300d88254c6f71a0912b.jpg",
        coverImage: "https://pic4.zhimg.com/v2-b8dce38a8a8bff1e2f77d7d46c6b3dab_180x120.jpg",
        url: "articles/article-template.html?slug=riscv-embedded-ai",
        contentFile: "content/riscv-embedded-ai.html",
        categoryPage: "emed.html",
        tags: ["RISC-V", "嵌入式AI", "边缘计算", "指令集架构"],
        lastUpdated: "2024年5月20日"
    },
    {
        id: 5,
        title: "UI 设计中的无感哲学：通过色彩层级营造深度",
        summary: "为什么现代 UI 正在摒弃 1px 边框，转而利用背景色块切换和负空间。这是一份为技术内容打造高端社论级体验的视觉指南。",
        category: "设计系统",
        date: "2024年5月18日",
        readTime: "阅读时间 8 分钟",
        author: "Sarah Chen",
        authorAvatar: "https://bpic.588ku.com/element_origin_min_pic/25/08/01/8afb633d2d9a300d88254c6f71a0912b.jpg",
        coverImage: "http://www.lanlanwork.com/blog/content/uploadfile/202409/d6491727073785.jpg",
        url: "articles/article-template.html?slug=ui-design-philosophy",
        contentFile: "content/ui-design-philosophy.html",
        categoryPage: "emed.html",
        tags: ["UI设计", "设计系统", "视觉层级", "用户体验"],
        lastUpdated: "2024年5月18日"
    },
    {
        id: 6,
        title: "Serverless 大规模应用实践：应对月均千万级请求",
        summary: "深入了解冷启动优化、状态管理以及当你的基础设施完全是瞬态时的可观测性实战策略。",
        category: "DevOps",
        date: "2024年5月12日",
        readTime: "阅读时间 15 分钟",
        author: "Marco K.",
        authorAvatar: "https://bpic.588ku.com/element_origin_min_pic/25/08/01/8afb633d2d9a300d88254c6f71a0912b.jpg",
        coverImage: "https://www.uux.cn/attachments/2022/12/1_202212081152461611A.jpg",
        url: "articles/article-template.html?slug=serverless-practice",
        contentFile: "content/serverless-practice.html",
        categoryPage: "emed.html",
        tags: ["Serverless", "DevOps", "云原生", "高并发"],
        lastUpdated: "2024年5月12日"
    }
];

// 特色文章配置 - 指定首页展示的文章ID
const featuredArticleConfig = {
    articleId: 7, // 新增一个特色文章的 id
    categoryLabel: "深度解析", // 首页展示的分类标签
    isFeatured: true
};

// 添加特色文章数据
const featuredArticleData = {
    id: 7,
    title: "从 L3 到 L5 的跨越：自动驾驶系统的算法演进与硬件瓶颈",
    summary: "探讨端到端大模型如何重塑自动驾驶架构，以及车载计算平台在向全自动驾驶迈进过程中面临的功耗与算力挑战。",
    category: "深度解析",
    date: "2024年5月25日",
    readTime: "阅读时间 15 分钟",
    author: "Tech Editorial Team",
    authorAvatar: "",
    coverImage: "https://img.shetu66.com/2023/07/20/1689844191148923.png",
    url: "articles/article-template.html?slug=l3-to-l5-autonomous-driving",
    contentFile: "content/l3-to-l5-autonomous-driving.html",
    categoryPage: "auto.html",
    tags: ["自动驾驶", "人工智能", "车载计算", "算法"],
    lastUpdated: "2024年5月25日"
};