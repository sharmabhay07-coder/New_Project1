export const navLinks = [
  {
    id: 1,
    label: "Home",
    path: "#home",
    megaMenu: null,
  },
  {
    id: 2,
    label: "How It Works",
    path: "#process",
    megaMenu: null,
  },
  {
    id: 3,
    label: "Features",
    path: "#features",
    megaMenu: {
      columns: [
        {
          heading: "Earning Methods",
          links: [
            { label: "Watch Videos", path: "/dashboard/videos" },
            { label: "Complete Surveys", path: "#" },
            { label: "Install Apps", path: "#" },
            { label: "Daily Tasks", path: "#" },
          ],
        },
        {
          heading: "Payouts",
          links: [
            { label: "UPI", path: "#" },
            { label: "PayPal", path: "#" },
            { label: "Bank Transfer", path: "#" },
            { label: "Crypto", path: "#" },
          ],
        },
        {
          heading: "Community",
          links: [
            { label: "Referral Program", path: "/dashboard/referrals" },
            { label: "Leaderboard", path: "#" },
            { label: "Success Stories", path: "#" },
          ],
        },
      ],
    },
  },
  {
    id: 5,
    label: "FAQ",
    path: "#faq",
    megaMenu: null,
  },
];