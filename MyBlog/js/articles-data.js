// 文章数据数组
const articlesData = [
    {
        id: 1,
        title: "基于 Rust 的嵌入式物联网微内核架构探讨",
        summary: "嵌入式系统的内存安全不再是一种奢侈品。在本篇社论中，我们将探讨 Rust 的所有权模型如何转化为裸机硬件操作，以及为什么它是构建弹性物联网基础设施的未来。",
        category: "工程实践",
        date: "2024年5月24日",
        readTime: "阅读时间 12 分钟",
        author: "Alex Rivera",
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKMypWjifb2rCLhTcYoblv9M4Nzt3n7VxrjKVXBf3O1D4_2aWlEBLzKXPr7EXKyHyoYzn7BV8HLPqQvI-PEOqHQdcm9h09DZVyZ-bBHK3W-o0lPJvapVfuJeN6xyi4aDHWJHTohRe0nHF6zLQcvDtQHcdXBMoBir7UcsgfsdbINBNmEl3rztbIqVowKtbjzir8pvh4XqeCSCW8fuRr9mzmv2piqpO9uiQUuZTVK1nJmOUMpW538cIfYW7uZp7dDvGcwN3TpGdibqs2",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4lia_ItABEPaIHJLU_XLtHbHMvjXj3KIZrvA3oMM-qMPFnvMeAOzwo-lkM8XPh2SxZFqXcMi4zVHrTl6_uVAxMNAqAPuCr6m6xGcLCsmnLRMtayPXlF5DFKUyVj0F8FOB2x5HN3HaqUJpDA8hA-VikCQK0uHyWH3BT6ATLfsNNwIVfH2D8Ay1ARCIYSmMbHC6iFJ-eHWhGvACwMV_OiN9Ni17j8qC0WNGB18-fwRPK_9KML0Z6w-TFJGgIxkruhrRuzuDkSaGFyLd",
        url: "articles/rust-embedded-iot.html"
    },
    {
        id: 2,
        title: "UI 设计中的 \"无感\" 哲学：通过色彩层级营造深度",
        summary: "为什么现代 UI 正在摒弃 1px 边框，转而利用背景色块切换和负空间。这是一份为技术内容打造高端社论级体验的视觉指南。",
        category: "设计系统",
        date: "2024年5月18日",
        readTime: "阅读时间 8 分钟",
        author: "Sarah Chen",
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd4rrSHioaUJt_ccGLke7uKoFhs8lSCMik77Eg9_YfEMlg4kzF8qXFPMuLtqa1uDIbKVrmzBfURDNSXSEhqw3COESqbS1wkDT8Jqg4MXUVazxfIAFFwEfji6YTn5J6uvQqbRGSy9uEEZKSTc44Lyf9RfuYXNgES5ee0ftJfjNfu4YafoVVFz1uqFbctD09fNRqpw5foC6A1aQUbuhYQE3kEMWMu0_FlhWczSLCC89PH-WPzS3WeX4ofTn5ltPlRiqtTd-LncIYNA7K",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCF9jYyaPMKuyxfDG0_f671SykyN4SY7Vq6pC3_5PMFtUl80fSEpF9l2TgocNCm9FrGMtjlpXscrxSP-WI_WlIGZHB1tVE98oUEU_h2__CJytcgAsL6QByuuQsMo_QIK-QCLFDBDuyrBtrU1Hgc4xAwAjZBbf5f2eZFT2DF1YkgFtY0uPad5G4Xom3GViBe_t1AuJnVSr5_QlGfbU0t4UzMR6yKux4_lM1p1r20gFuVC7M2kj8obQFispD_KPaLv0rADiptQnvXGphu",
        url: "articles/ui-design-philosophy.html"
    },
    {
        id: 3,
        title: "Serverless 大规模应用实践：应对月均千万级请求",
        summary: "深入了解冷启动优化、状态管理以及当你的基础设施完全是瞬态时的可观测性实战策略。",
        category: "DevOps",
        date: "2024年5月12日",
        readTime: "阅读时间 15 分钟",
        author: "Marco K.",
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ0-ip_3kEI2vCMNlWxfaZ-lyunG9NFLOfUcOP1R8ciVnQOqMIws8ZwstmbP4Gob3DBVjmaomuM3Mc4IkUVFgOS58LaawIFWJAEp9KjFchIQTxe2l-gGnQL3J6i4KznoLfRhLPEjuVQIN21M75BBEnW0miKxsiVpa8mj_bm3NdiN9DVtP2jTMUkVMlPjbIycYnWbS8xa_4wnFGH2ZHCx_T5MDxbeOG6tk4IDo1Y6QS_Qs39REFf7Xx7OxT0gKy5I9az-RqaYF2aljp",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi7hB5hQEV6-PV1tSdHFkLzliiclyWGlIsMyNt6QFlxZ1-yx9xQm8YWhrSi_EQ46KQAt1WJaYGHegu8xkA50SZfCiOtyio4Da6WpbPfhUf7H4hFe_zFzacm1sw3_5Q9jJgSVW-X8WDt2czJ1DEvKeSug1EesdEpM_E4lVYnKZwgniR02KR0PE5D02oVM-ywJfvjUqe4hpC5ZdLoZswA6Barw9Q5nZSMXXkez2pGfmVv7b3FM4ZHAUFJG9Mza8TvguPFsfchAnyKmcl",
        url: "articles/serverless-practice.html"
    }
];