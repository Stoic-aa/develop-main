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
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKMypWjifb2rCLhTcYoblv9M4Nzt3n7VxrjKVXBf3O1D4_2aWlEBLzKXPr7EXKyHyoYzn7BV8HLPqQvI-PEOqHQdcm9h09DZVyZ-bBHK3W-o0lPJvapVfuJeN6xyi4aDHWJHTohRe0nHF6zLQcvDtQHcdXBMoBir7UcsgfsdbINBNmEl3rztbIqVowKtbjzir8pvh4XqeCSCW8fuRr9mzmv2piqpO9uiQUuZTVK1nJmOUMpW538cIfYW7uZp7dDvGcwN3TpGdibqs2",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4lia_ItABEPaIHJLU_XLtHbHMvjXj3KIZrvA3oMM-qMPFnvMeAOzwo-lkM8XPh2SxZFqXcMi4zVHrTl6_uVAxMNAqAPuCr6m6xGcLCsmnLRMtayPXlF5DFKUyVj0F8FOB2x5HN3HaqUJpDA8hA-VikCQK0uHyWH3BT6ATLfsNNwIVfH2D8Ay1ARCIYSmMbHC6iFJ-eHWhGvACwMV_OiN9Ni17j8qC0WNGB18-fwRPK_9KML0Z6w-TFJGgIxkruhrRuzuDkSaGFyLd",
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
        authorAvatar: "https://example.com/avatar4.jpg",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJAUZLKMCBkMucCNSE3nVKTxatTs54ABVdX7i7hL2O2v34ruTv68e8V-RT1ihvJ_a3bAftl8YoSs1W0R87fliHOaYFeeDw62C7KXvpK4xzm_7P1mJDvXncOY8HsgjsDT-jvq-rN8IJXdYOl1wt1IuxWAs7GkOFFw7anp48x6V5df0GB2nCk-HLkG5cumzTjrk4qc__SoYxpiO0N_BhTSxLYgXoPUr-a4uvyYp6xEtGUpAGSd1605wQIe4T43bRbKlCKvo8gztYINHH",
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
        authorAvatar: "https://example.com/avatar5.jpg",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxjb5TCwb_5SpX2NUCdD4Ko8pq3nOI1PWtR0r9L3jnsnSnh4SOYyfiDzJ2T1y3wXkJ9WRenhFPo41BFDoVUBQ0Q2uLlDZhePjKyVyn86EKQzQgnE_e4wUmyL20Ff5zHQXlxtT-zrcrM11JaiHaGl3QI09Nbj4oywTkS0rjud1JCUZSgI7Wz_lcA_-rBFx_u-BRdGS108aHE1RXYPadDOJTpZx5SoW1QOHndNOVygSrwidn2FQTybl1_Qz_xWh_WTS5s8jfBcMLCtMw",
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
        authorAvatar: "https://example.com/avatar6.jpg",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNIzffedsv-yVqaa3bNM2yDE2toDi57VhjgRSf6lszMLbryuT_bqE0JrfU6DKsosLi3e7BhOo2Wb_RzWviO0WvGYwaQuMvOjenQ5kK4dvPt7DgcxuvFuweqY2CD00oYo3n3OuXV0Yjt6xocoSD0OPOo_4nXU0jbzCzdbFYcsORq_gRrF8JSht1s7xiTqFw98jz5s8CBLMyNLLxTQkYKXE9y9jgN9dfGyy15bFjK4VRbTW0ch-yI9i2KmwdL6vCMXmMP1f3kKE7Fapn",
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
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd4rrSHioaUJt_ccGLke7uKoFhs8lSCMik77Eg9_YfEMlg4kzF8qXFPMuLtqa1uDIbKVrmzBfURDNSXSEhqw3COESqbS1wkDT8Jqg4MXUVazxfIAFFwEfji6YTn5J6uvQqbRGSy9uEEZKSTc44Lyf9RfuYXNgES5ee0ftJfjNfu4YafoVVFz1uqFbctD09fNRqpw5foC6A1aQUbuhYQE3kEMWMu0_FlhWczSLCC89PH-WPzS3WeX4ofTn5ltPlRiqtTd-LncIYNA7K",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCF9jYyaPMKuyxfDG0_f671SykyN4SY7Vq6pC3_5PMFtUl80fSEpF9l2TgocNCm9FrGMtjlpXscrxSP-WI_WlIGZHB1tVE98oUEU_h2__CJytcgAsL6QByuuQsMo_QIK-QCLFDBDuyrBtrU1Hgc4xAwAjZBbf5f2eZFT2DF1YkgFtY0uPad5G4Xom3GViBe_t1AuJnVSr5_QlGfbU0t4UzMR6yKux4_lM1p1r20gFuVC7M2kj8obQFispD_KPaLv0rADiptQnvXGphu",
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
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ0-ip_3kEI2vCMNlWxfaZ-lyunG9NFLOfUcOP1R8ciVnQOqMIws8ZwstmbP4Gob3DBVjmaomuM3Mc4IkUVFgOS58LaawIFWJAEp9KjFchIQTxe2l-gGnQL3J6i4KznoLfRhLPEjuVQIN21M75BBEnW0miKxsiVpa8mj_bm3NdiN9DVtP2jTMUkVMlPjbIycYnWbS8xa_4wnFGH2ZHCx_T5MDxbeOG6tk4IDo1Y6QS_Qs39REFf7Xx7OxT0gKy5I9az-RqaYF2aljp",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi7hB5hQEV6-PV1tSdHFkLzliiclyWGlIsMyNt6QFlxZ1-yx9xQm8YWhrSi_EQ46KQAt1WJaYGHegu8xkA50SZfCiOtyio4Da6WpbPfhUf7H4hFe_zFzacm1sw3_5Q9jJgSVW-X8WDt2czJ1DEvKeSug1EesdEpM_E4lVYnKZwgniR02KR0PE5D02oVM-ywJfvjUqe4hpC5ZdLoZswA6Barw9Q5nZSMXXkez2pGfmVv7b3FM4ZHAUFJG9Mza8TvguPFsfchAnyKmcl",
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
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKMypWjifb2rCLhTcYoblv9M4Nzt3n7VxrjKVXBf3O1D4_2aWlEBLzKXPr7EXKyHyoYzn7BV8HLPqQvI-PEOqHQdcm9h09DZVyZ-bBHK3W-o0lPJvapVfuJeN6xyi4aDHWJHTohRe0nHF6zLQcvDtQHcdXBMoBir7UcsgfsdbINBNmEl3rztbIqVowKtbjzir8pvh4XqeCSCW8fuRr9mzmv2piqpO9uiQUuZTVK1nJmOUMpW538cIfYW7uZp7dDvGcwN3TpGdibqs2",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4lia_ItABEPaIHJLU_XLtHbHMvjXj3KIZrvA3oMM-qMPFnvMeAOzwo-lkM8XPh2SxZFqXcMi4zVHrTl6_uVAxMNAqAPuCr6m6xGcLCsmnLRMtayPXlF5DFKUyVj0F8FOB2x5HN3HaqUJpDA8hA-VikCQK0uHyWH3BT6ATLfsNNwIVfH2D8Ay1ARCIYSmMbHC6iFJ-eHWhGvACwMV_OiN9Ni17j8qC0WNGB18-fwRPK_9KML0Z6w-TFJGgIxkruhrRuzuDkSaGFyLd",
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
        authorAvatar: "https://example.com/avatar4.jpg",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJAUZLKMCBkMucCNSE3nVKTxatTs54ABVdX7i7hL2O2v34ruTv68e8V-RT1ihvJ_a3bAftl8YoSs1W0R87fliHOaYFeeDw62C7KXvpK4xzm_7P1mJDvXncOY8HsgjsDT-jvq-rN8IJXdYOl1wt1IuxWAs7GkOFFw7anp48x6V5df0GB2nCk-HLkG5cumzTjrk4qc__SoYxpiO0N_BhTSxLYgXoPUr-a4uvyYp6xEtGUpAGSd1605wQIe4T43bRbKlCKvo8gztYINHH",
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
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd4rrSHioaUJt_ccGLke7uKoFhs8lSCMik77Eg9_YfEMlg4kzF8qXFPMuLtqa1uDIbKVrmzBfURDNSXSEhqw3COESqbS1wkDT8Jqg4MXUVazxfIAFFwEfji6YTn5J6uvQqbRGSy9uEEZKSTc44Lyf9RfuYXNgES5ee0ftJfjNfu4YafoVVFz1uqFbctD09fNRqpw5foC6A1aQUbuhYQE3kEMWMu0_FlhWczSLCC89PH-WPzS3WeX4ofTn5ltPlRiqtTd-LncIYNA7K",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCF9jYyaPMKuyxfDG0_f671SykyN4SY7Vq6pC3_5PMFtUl80fSEpF9l2TgocNCm9FrGMtjlpXscrxSP-WI_WlIGZHB1tVE98oUEU_h2__CJytcgAsL6QByuuQsMo_QIK-QCLFDBDuyrBtrU1Hgc4xAwAjZBbf5f2eZFT2DF1YkgFtY0uPad5G4Xom3GViBe_t1AuJnVSr5_QlGfbU0t4UzMR6yKux4_lM1p1r20gFuVC7M2kj8obQFispD_KPaLv0rADiptQnvXGphu",
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
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ0-ip_3kEI2vCMNlWxfaZ-lyunG9NFLOfUcOP1R8ciVnQOqMIws8ZwstmbP4Gob3DBVjmaomuM3Mc4IkUVFgOS58LaawIFWJAEp9KjFchIQTxe2l-gGnQL3J6i4KznoLfRhLPEjuVQIN21M75BBEnW0miKxsiVpa8mj_bm3NdiN9DVtP2jTMUkVMlPjbIycYnWbS8xa_4wnFGH2ZHCx_T5MDxbeOG6tk4IDo1Y6QS_Qs39REFf7Xx7OxT0gKy5I9az-RqaYF2aljp",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi7hB5hQEV6-PV1tSdHFkLzliiclyWGlIsMyNt6QFlxZ1-yx9xQm8YWhrSi_EQ46KQAt1WJaYGHegu8xkA50SZfCiOtyio4Da6WpbPfhUf7H4hFe_zFzacm1sw3_5Q9jJgSVW-X8WDt2czJ1DEvKeSug1EesdEpM_E4lVYnKZwgniR02KR0PE5D02oVM-ywJfvjUqe4hpC5ZdLoZswA6Barw9Q5nZSMXXkez2pGfmVv7b3FM4ZHAUFJG9Mza8TvguPFsfchAnyKmcl",
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
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRlnbbl4FpeU86E_aexwYtabGFlBZ8EfX5Wv6gS2_MwX_7x4cST_sSpxdQDpL83tAyKkEgKg4ZB8XS0l2QXSTfL8Rj6GRXEBnszkgFcN1PtIRDlaMd85nJ0G9IlPcqH2OjRuDbjkgZc-pv7PwrAKX809yicf9Xt5VrmQ5DWLdguINtFg5GUoISPaSldIBYvSxR1uBmI2VtkcfYAT9OxVdcmQCDcWRYm81NimJ9sKeBOon1nP4_vRv2yUgGT9g5qAyl7pIl3GnN1aN3",
    url: "articles/article-template.html?slug=l3-to-l5-autonomous-driving",
    contentFile: "content/l3-to-l5-autonomous-driving.html",
    categoryPage: "auto.html",
    tags: ["自动驾驶", "人工智能", "车载计算", "算法"],
    lastUpdated: "2024年5月25日"
};