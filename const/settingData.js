export const settingsData = [
    {
        title: "友達一覧",
        icon: "people-circle-outline",
        action: handleFrienfList,
    },
    {
        title: "フォロー申請一覧",
        icon: "add-outline",
        action: handleFollowRequest,
    },
    {
        title: "名前検索",
        icon: "search-outline",
        // action: handleSearchName,
        action: () => navigation.navigate("NameSearch"),
    },
    {
        title: "５秒でわかる使い方",
        icon: "help-outline",
        action: () => navigation.navigate("Usage", { action: action }),
    },
    {
        title: "報告",
        icon: "information-outline",
        action: handleDelete,
    },
    {
        title: "アカウント削除",
        icon: "trash",
        action: handleDelete,
    },
];