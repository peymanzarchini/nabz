import localfont from "next/font/local";
export const iransans = localfont({
  src: [
    {
      path: "../../public/fonts/IRANSansWeb_UltraLight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansWeb_Light.woff",
      weight: "300",
      style: "normal",
    },

    {
      path: "../../public/fonts/IRANSansWeb.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansWeb_Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansWeb_Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-iransans",
});
