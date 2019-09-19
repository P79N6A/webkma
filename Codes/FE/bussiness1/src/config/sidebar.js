let menusConfig = [
    {
        key: "dashbord",
        title: "营销概览",
        image: require("../assets/images/marketing.png"),
        href: "/dashbord",
        children: [

        ]
    },
    {
        key: "marketing-plan",
        title: "发布任务",
        image: require("../assets/images/publishing-tasks.png"),
        href: "/marketing-plan",
        children: [

        ]
    },
    {
        key: "my-task",
        title: "我的任务",
        image: require("../assets/images/my-tasks.png"),
        href: "/my-task",
        children: [

        ],
        include:["connection-data","my-promotion-plug"]
    },
    {
        key: "marketing-incentive",
        title: "营销激励",
        image: require("../assets/images/excitation.png"),
        href: "/red-packet",
        children: [
            {
                key: "red-packet",
                title: "红包裂变",
                href: "/red-packet",
                image: "",
                include:["red-add","red-details"]
            },
            {
                key: "wechat-push",
                title: "微信推送",
                href: "/wechat-push",
                image: "",
                include:["wechatPushAdd","wechatPushDetails"]
            }
        ]
    },
    {
        key: "customer-management",
        title: "我的客户",
        image: require("../assets/images/my-customer.png"),
        href: "/customer-management",
        children: [

        ]
    },
    {
        key: "employee-management",
        title: "我的员工",
        image: require("../assets/images/my-staff.png"),
        href: "/employee-management",
        children: [

        ],
        include:["add-employee"]
    },
    {
        key: "bussiness-wallet",
        title: "商家钱包", 
        image: require("../assets/images/business-wallet.png"),
        href: "/bussiness-wallet",
        children: [

        ],
        include:["cash-recharge"]
    }, {
        key: "extension",
        title: "推广渠道",
        image: require("../assets/images/extension.png"),
        href: "/moments-adv",
        children: [
            {
                key: "moments-adv",
                title: "朋友圈广告",
                href: "/moments-adv",
                image: "",
                include:["add-moments-adv"]
            }
        ]
    },
];

// {
//     key: "dashbord",
//     title: "营销概览",
//     image: require("../assets/images/marketing.png"),
//     href: "/dashbord",
//     children: [

//     ]
// },
// {
//     key: "",
//     title: "推广渠道",
//     image: "",
//     href: "",
//     children: [
//         {
//             key: "moments-adv",
//             title: "朋友圈广告",
//             href: "/moments-adv",
//             image: ""
//         }
//     ]
// },
// {
//     key: "",
//     title: "人脉关系图谱",
//     image: "",
//     href: "",
//     children: [
//         {
//             key: "activity-list",
//             title: "活动人脉图谱",
//             href: "/activity-list",
//             image: ""
//         },
//         {
//             key: "card-map",
//             title: "名片人脉图谱",
//             href: "/card-map",
//             image: ""
//         }
//     ]
// },
// {
//     key: "customer-management",
//     title: "客户管理",
//     image: "",
//     href: "/customer-management",
//     children: [

//     ]
// },
// {
//     key: "",
//     title: "员工管理",
//     image: "",
//     href: "",
//     children: [
//         {
//             key: "employee-management",
//             title: "员工信息",
//             href: "/employee-management",
//             image: ""
//         },
//         {
//             key: "employee-achievements",
//             title: "员工绩效",
//             href: "/employee-achievements",
//             image: ""
//         }
//     ]
// },

// {
//     key: "",
//     title: "商家管理",
//     image: "",
//     href: "",
//     children: [
//         {
//             key: "bussiness-info",
//             title: "商家信息",
//             href: "/bussiness-info",
//             image: ""
//         },
//         {
//             key: "cash-management",
//             title: "商家资金管理",
//             href: "/cash-management",
//             image: ""
//         }
//     ]
// }

export default menusConfig