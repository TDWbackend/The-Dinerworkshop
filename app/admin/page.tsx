import { Scripts } from "@/components/Scripts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The desk · The Dinerworkshop",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Inter+Tight:wght@300;400&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/pages/admin.css?v=1" precedence="dw" />

      <div id="app"></div>
      <dialog id="dlg"></dialog>
      <Scripts
        srcs={[
          "/assets/db.js?v=4",
          "/assets/admin.js?v=6",
        ]}
      />
    </>
  );
}
