import { Head } from "expo-router";

export default function AppHead() {
  return (
    <Head>
      <meta name="theme-color" content="#588C79" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icon-square.png" />
    </Head>
  );
}
