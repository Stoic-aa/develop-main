// 文章数据数组 - 单一数据源
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
        url: "articles/article-template.html?slug=example",
        contentFile: "content/example.html",
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
        coverImage: "http://opinion.people.com.cn/NMediaFile/2024/0313/MAIN1710292606512BWZWGLKSNI.png",
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
        title: "UI 设计中的'无感'哲学：通过色彩层级营造深度",
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
    },

    {
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
        contentFile: "content/serverless-practice.html",
        categoryPage: "auto.html",
        tags: ["自动驾驶", "人工智能", "车载计算", "算法"],
        lastUpdated: "2024年5月25日"
    },

    {
        id: 8,
        title: "测试文章新增1",
        summary: "探讨端到端大模型如何重塑自动驾驶架构，以及车载计算平台在向全自动驾驶迈进过程中面临的功耗与算力挑战。",
        category: "深度解析",
        date: "2024年6月4日",
        readTime: "阅读时间 15 分钟",
        author: "Tech Editorial Team",
        authorAvatar: "",
        coverImage: "https://img.shetu66.com/2023/07/20/1689844191148923.png",
        url: "articles/article-template.html?slug=l3-to-l5-autonomous-driving",
        contentFile: "content/test-1.html",
        categoryPage: "auto.html",
        tags: ["自动驾驶", "人工智能", "车载计算", "算法"],
        lastUpdated: "2024年6月4日"
    },

    {
        id: 9,
        title: "测试文章新增2",
        summary: "探讨端到端大模型如何重塑自动驾驶架构，以及车载计算平台在向全自动驾驶迈进过程中面临的功耗与算力挑战。",
        category: "深度解析",
        date: "2024年6月6日",
        readTime: "阅读时间 15 分钟",
        author: "Tech Editorial Team",
        authorAvatar: "",
        coverImage: "https://img.shetu66.com/2023/07/20/1689844191148923.png",
        url: "articles/article-template.html?slug=l3-to-l5-autonomous-driving",
        contentFile: "content/test-2.html",
        categoryPage: "auto.html",
        tags: ["自动驾驶", "人工智能", "车载计算", "算法"],
        lastUpdated: "2024年6月6日"
    },

    {
        id: 10,
        title: "测试文章新增3",
        summary: "探讨端到端大模型如何重塑自动驾驶架构，以及车载计算平台在向全自动驾驶迈进过程中面临的功耗与算力挑战。",
        category: "深度解析",
        date: "2024年6月7日",
        readTime: "阅读时间 15 分钟",
        author: "Tech Editorial Team",
        authorAvatar: "",
        coverImage: "https://img.shetu66.com/2023/07/20/1689844191148923.png",
        url: "articles/article-template.html?slug=l3-to-l5-autonomous-driving",
        contentFile: "content/test-2.html",
        categoryPage: "auto.html",
        tags: ["自动驾驶", "人工智能", "车载计算", "算法"],
        lastUpdated: "2024年6月7日"
    },

    {
        id: 11,
        title: "测试文章新增4",
        summary: "探讨端到端大模型如何重塑自动驾驶架构，以及车载计算平台在向全自动驾驶迈进过程中面临的功耗与算力挑战。",
        category: "深度解析",
        date: "2024年6月8日",
        readTime: "阅读时间 15 分钟",
        author: "Tech Editorial Team",
        authorAvatar: "",
        coverImage: "https://img.shetu66.com/2023/07/20/1689844191148923.png",
        url: "articles/article-template.html?slug=l3-to-l5-autonomous-driving",
        contentFile: "content/test-2.html",
        categoryPage: "auto.html",
        tags: ["自动驾驶", "人工智能", "车载计算", "算法"],
        lastUpdated: "2024年6月8日"
    },

    {
        id: 12,
        title: "测试文章新增5",
        summary: "探讨端到端大模型如何重塑自动驾驶架构，以及车载计算平台在向全自动驾驶迈进过程中面临的功耗与算力挑战。",
        category: "深度解析",
        date: "2024年6月9日",
        readTime: "阅读时间 15 分钟",
        author: "Tech Editorial Team",
        authorAvatar: "",
        coverImage: "https://img.shetu66.com/2023/07/20/1689844191148923.png",
        url: "articles/article-template.html?slug=l3-to-l5-autonomous-driving",
        contentFile: "content/test-2.html",
        categoryPage: "auto.html",
        tags: ["自动驾驶", "人工智能", "车载计算", "算法"],
        lastUpdated: "2024年6月9日"
    },

    {
        id: 13,
        title: "测试文章新增6",
        summary: "探讨端到端大模型如何重塑自动驾驶架构，以及车载计算平台在向全自动驾驶迈进过程中面临的功耗与算力挑战。",
        category: "深度解析",
        date: "2024年6月10日",
        readTime: "阅读时间 15 分钟",
        author: "Tech Editorial Team",
        authorAvatar: "",
        coverImage: "https://img.shetu66.com/2023/07/20/1689844191148923.png",
        url: "articles/article-template.html?slug=test-md",
        contentFile: "content/test-md.html",
        categoryPage: "auto.html",
        tags: ["自动驾驶", "人工智能", "车载计算", "算法"],
        lastUpdated: "2024年6月10日"
    },

];

// 获取最新的N篇文章的工具函数
function getLatestArticles(count) {
    // 按ID降序排列，获取最新的count篇文章
    const sortedArticles = [...articlesData].sort((a, b) => b.id - a.id);
    return sortedArticles.slice(0, count);
}

// 首页推荐文章数据数组 - 自动获取最新的4篇文章
const homepageArticlesData = getLatestArticles(4);

// 获取最新的文章作为特色文章
const getLatestFeaturedArticle = () => {
    const sortedArticles = [...articlesData].sort((a, b) => b.id - a.id);
    return sortedArticles[0]; // 返回ID最大的（最新）文章
};

// 特色文章配置 - 指定首页展示的文章配置
const featuredArticleConfig = {
    articleId: getLatestFeaturedArticle().id,
    categoryLabel: getLatestFeaturedArticle().category,
    isFeatured: true
};

// 特色文章数据 - 从主数据中获取最新的文章
const featuredArticleData = getLatestFeaturedArticle();

// Emed页面相关函数
function renderEmedArticles() {
    // 检查是否在 emed.html 页面
    if (!window.location.pathname.includes('emed.html')) {
        return;
    }

    // 获取 emed 类别的文章（categoryPage 为 'emed.html' 的文章）
    const emedArticles = articlesData.filter(article =>
        article.categoryPage === 'emed.html'
    );

    // 按ID降序排列（最新的在前）
    const sortedArticles = emedArticles.sort((a, b) => b.id - a.id);

    // 获取文章列表容器
    const blogListContainer = document.querySelector('.space-y-12.sm\\:space-y-16');

    if (!blogListContainer) {
        console.error('未找到文章列表容器');
        return;
    }

    // 生成文章HTML
    const articlesHTML = sortedArticles.map(article => createArticleCard(article)).join('');

    // 如果没有找到文章，显示提示
    if (!articlesHTML) {
        blogListContainer.innerHTML = '<p class="text-center text-gray-500 py-12">暂无相关文章</p>';
        return;
    }

    blogListContainer.innerHTML = articlesHTML;
}

function createArticleCard(article) {
    return `
        <article class="group relative bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/20 hover:border-primary/30 transition-all duration-300">
            <a href="${article.url}" class="block">
                <div class="aspect-video overflow-hidden">
                    <img src="${article.coverImage}" alt="${article.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                </div>
                <div class="p-6 sm:p-8 space-y-4">
                    <div class="flex items-center gap-4 text-sm">
                        <span class="px-3 py-1 bg-primary text-on-primary rounded-full font-label font-bold text-xs tracking-wide">${article.category}</span>
                        <time datetime="${article.date}" class="text-on-surface-variant font-label">${article.date}</time>
                        <span class="text-on-surface-variant font-label">${article.readTime}</span>
                    </div>
                    <h2 class="text-2xl sm:text-3xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors duration-300">
                        <span class="article-title-hover">${article.title}</span>
                    </h2>
                    <p class="text-lg text-on-surface-variant font-body leading-relaxed">${article.summary}</p>
                    <div class="flex items-center justify-between pt-4">
                        <div class="flex items-center gap-3">
                            <img src="${article.authorAvatar}" alt="${article.author}" class="w-10 h-10 rounded-full">
                            <span class="font-label font-bold text-on-surface">${article.author}</span>
                        </div>
                        <div class="tags-section flex gap-2">
                            ${article.tags.map(tag =>
        `<span class="px-3 py-1 bg-surface-container-highest text-slate-600 rounded-full text-xs font-label font-bold tag-item">#${tag}</span>`
    ).join('')}
                        </div>
                    </div>
                </div>
            </a>
        </article>
    `;
}

// 页面加载完成后自动执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderEmedArticles);
} else {
    renderEmedArticles();
}